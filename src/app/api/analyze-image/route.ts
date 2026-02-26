/**
 * Elghali AI - Image Analysis API using Gemini
 * Analyze racecard images and extract data
 */

import { NextRequest, NextResponse } from 'next/server'
import { RACECOURSES } from '@/lib/race-database'

export const maxDuration = 60

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

// Call Gemini API with image
async function callGeminiWithImage(prompt: string, imageData: string): Promise<string | null> {
  if (!GEMINI_API_KEY) {
    return null
  }

  try {
    // Remove data URL prefix if present
    const base64 = imageData.replace(/^data:image\/\w+;base64,/, '')

    const body = {
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/png', data: base64 } }
        ]
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192
      }
    }

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null

  } catch (error) {
    console.error('[Gemini Image] Error:', error)
    return null
  }
}

// Generate predictions for extracted horses
async function generatePredictions(race: any): Promise<any[]> {
  const horsesJson = JSON.stringify(race.horses, null, 2)

  const prompt = `You are an expert horse racing analyst. Analyze this race and predict finishing order.

Race: ${race.name || 'Race ' + race.number}
Distance: ${race.distance || 1600}m
Surface: ${race.surface || 'Dirt'}

Horses:
${horsesJson}

Return a JSON array sorted by predicted finishing position:
[
  {
    "position": 1,
    "number": 1,
    "name": "Horse Name",
    "powerScore": 85,
    "winProbability": 30,
    "placeProbability": 60,
    "valueRating": "Good",
    "strengths": ["Strong form"],
    "concerns": ["Distance question"],
    "analysis": "Brief analysis"
  }
]

Return ONLY the JSON array.`

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY

  try {
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 4096 }
      })
    })

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('[Predictions] Error:', e)
  }

  // Fallback
  return race.horses.map((h: any, i: number) => ({
    position: i + 1,
    number: h.number,
    name: h.name,
    jockey: h.jockey,
    trainer: h.trainer,
    draw: h.draw,
    rating: h.rating,
    powerScore: Math.max(30, 95 - i * 7),
    winProbability: Math.max(5, 40 - i * 5),
    placeProbability: Math.max(15, 60 - i * 6),
    valueRating: i < 2 ? 'Good' : 'Fair',
    strengths: [],
    concerns: [],
    analysis: ''
  }))
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body = await request.json()
    const { image } = body

    if (!image) {
      return NextResponse.json({
        success: false,
        message: 'لم يتم توفير صورة'
      }, { status: 400 })
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({
        success: false,
        message: '⚠️ Gemini API key not configured'
      }, { status: 500 })
    }

    // Extract race data from image
    const extractPrompt = `You are an expert at reading horse racing racecards. Extract all race data from this image.

Return the data in this JSON format:
{
  "racecourse": "Name of racecourse",
  "date": "YYYY-MM-DD",
  "hasData": true,
  "races": [
    {
      "number": 1,
      "name": "Race Name",
      "time": "16:00",
      "distance": 1600,
      "surface": "Dirt",
      "horses": [
        {"number": 1, "name": "Horse Name", "jockey": "Jockey", "trainer": "Trainer", "draw": 1, "rating": 80}
      ]
    }
  ]
}

Important:
- Extract ALL horses from the image
- Keep horse numbers exactly as shown
- Extract draw/stall numbers
- Include jockey and trainer names
- Estimate distance if not clearly shown

If you cannot read the image, return: {"hasData": false, "reason": "Could not read image"}

Return ONLY valid JSON.`

    const extractedText = await callGeminiWithImage(extractPrompt, image)

    if (!extractedText) {
      return NextResponse.json({
        success: false,
        message: 'فشل في تحليل الصورة'
      })
    }

    // Parse extracted data
    const jsonMatch = extractedText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({
        success: false,
        message: 'لم يتم العثور على بيانات سباق في الصورة'
      })
    }

    const raceData = JSON.parse(jsonMatch[0])

    if (!raceData.hasData || !raceData.races?.length) {
      return NextResponse.json({
        success: false,
        message: raceData.reason || 'لا توجد سباقات في الصورة'
      })
    }

    // Generate predictions for each race
    const racesWithPredictions = await Promise.all(
      raceData.races.map(async (race: any) => {
        const predictions = await generatePredictions(race)
        return {
          ...race,
          predictions,
          raceNumber: race.number,
          raceName: race.name || `السباق ${race.number}`,
          raceTime: race.time || '',
          surface: race.surface || 'Dirt',
          distance: race.distance || 1600,
          going: race.going || 'Standard'
        }
      })
    )

    // Find NAP
    const allPreds = racesWithPredictions.flatMap(r =>
      r.predictions.map((p: any) => ({ ...p, raceName: r.raceName }))
    )
    const sortedPreds = allPreds.sort((a: any, b: any) => b.powerScore - a.powerScore)

    const nap = sortedPreds[0]
    const nextBest = sortedPreds[1]
    const valuePick = sortedPreds[2]

    const result = {
      success: true,
      message: `تم استخراج ${racesWithPredictions.length} سباقات من الصورة`,
      racecourse: raceData.racecourse || 'Unknown',
      country: 'UAE',
      date: raceData.date || new Date().toISOString().split('T')[0],
      totalRaces: racesWithPredictions.length,
      races: racesWithPredictions,
      napOfTheDay: nap ? {
        horseName: `#${nap.number} ${nap.name}`,
        raceName: nap.raceName,
        reason: nap.analysis || 'أفضل ترشيح',
        confidence: nap.winProbability
      } : null,
      nextBest: nextBest ? {
        horseName: `#${nextBest.number} ${nextBest.name}`,
        raceName: nextBest.raceName,
        reason: nextBest.analysis || 'ترشيح ثاني'
      } : null,
      valuePick: valuePick ? {
        horseName: `#${valuePick.number} ${valuePick.name}`,
        raceName: valuePick.raceName,
        reason: valuePick.analysis || 'ترشيح بقيمة'
      } : null,
      sources: ['Uploaded Image'],
      liveStreamUrl: null,
      pdfPath: null,
      pdfGenerated: false,
      emailSent: false,
      availableRacecourses: getRacecoursesByCountry(),
      processingTime: Date.now() - startTime
    }

    console.log(`[Image API] Completed in ${Date.now() - startTime}ms`)

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('[Image API] Error:', error)
    return NextResponse.json({
      success: false,
      message: `⚠️ ${error.message || 'خطأ في تحليل الصورة'}`
    }, { status: 500 })
  }
}

function getRacecoursesByCountry(): Record<string, { name: string; city: string }[]> {
  const result: Record<string, { name: string; city: string }[]> = {}
  for (const [country, courses] of Object.entries(RACECOURSES)) {
    result[country] = courses.map(c => ({ name: c.name, city: c.city }))
  }
  return result
}
