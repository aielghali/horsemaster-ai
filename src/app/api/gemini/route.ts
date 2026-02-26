/**
 * Elghali AI - Gemini API Route for Vercel
 * Direct Gemini integration - No local server needed
 */

import { NextRequest, NextResponse } from 'next/server'
import { RACECOURSES } from '@/lib/race-database'

export const maxDuration = 60

// Gemini API Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

// In-memory cache
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

// Call Gemini API
async function callGemini(prompt: string, imageData?: string): Promise<string | null> {
  if (!GEMINI_API_KEY) {
    console.error('[Gemini] No API key configured')
    return null
  }

  try {
    const body: any = {
      contents: [{
        parts: imageData ? [
          { text: prompt },
          { inlineData: { mimeType: 'image/png', data: imageData } }
        ] : [{ text: prompt }]
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

    if (!response.ok) {
      console.error(`[Gemini] API error: ${response.status}`)
      return null
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null

  } catch (error) {
    console.error('[Gemini] Error:', error)
    return null
  }
}

// Generate predictions for a race
async function generatePredictions(race: any): Promise<any[]> {
  const horsesJson = JSON.stringify(race.horses, null, 2)

  const prompt = `You are an expert horse racing analyst for UAE horse racing. Analyze this race and predict finishing order.

Race: ${race.name}
Distance: ${race.distance}m
Surface: ${race.surface}
Going: ${race.going || 'Standard'}

Horses:
${horsesJson}

Analyze each horse considering:
- Current form and recent performances
- Jockey and trainer statistics
- Draw advantage for this distance
- Rating and class
- Distance suitability
- Surface preference

Return a JSON array sorted by predicted finishing position (best first):
[
  {
    "position": 1,
    "number": 1,
    "name": "Horse Name",
    "powerScore": 85,
    "winProbability": 30,
    "placeProbability": 60,
    "valueRating": "Good",
    "strengths": ["Strong form", "Good draw"],
    "concerns": ["Distance question"],
    "analysis": "Brief analysis"
  }
]

Return ONLY the JSON array, no other text.`

  const response = await callGemini(prompt)

  if (response) {
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0])
      } catch (e) {
        console.error('[Gemini] Failed to parse predictions')
      }
    }
  }

  // Fallback predictions
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

// Fetch race data from Gemini
async function fetchRaceDataFromGemini(racecourse: string, date: string): Promise<any> {
  const prompt = `You are a horse racing database expert. I need racecard information for ${racecourse} racecourse in UAE for ${date}.

If there are races on this date, provide the data in this JSON format:
{
  "racecourse": "${racecourse}",
  "date": "${date}",
  "hasData": true,
  "races": [
    {
      "number": 1,
      "name": "Race Name",
      "time": "16:00",
      "distance": 1600,
      "surface": "Dirt",
      "going": "Fast",
      "horses": [
        {"number": 1, "name": "Horse Name", "jockey": "Jockey Name", "trainer": "Trainer Name", "draw": 1, "rating": 80, "form": "1-2-3"}
      ]
    }
  ]
}

If there are NO races on this date, return:
{"hasData": false, "reason": "No races scheduled"}

Important:
- Use real horse names if you know them
- Include realistic ratings (60-120)
- Draw numbers should be 1-14
- Times should be realistic UAE racing times (afternoon/evening)

Return ONLY valid JSON, no other text.`

  const response = await callGemini(prompt)

  if (response) {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const data = JSON.parse(jsonMatch[0])
        if (data.hasData && data.races) {
          return { ...data, source: 'gemini-ai' }
        }
      } catch (e) {
        console.error('[Gemini] Failed to parse race data')
      }
    }
  }

  return null
}

// Main POST handler
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body = await request.json()
    const { date, racecourse } = body

    console.log(`[Gemini API] Request: date=${date}, racecourse=${racecourse}`)

    if (!date || !racecourse) {
      return NextResponse.json({
        success: false,
        message: 'التاريخ واسم المضمار مطلوبان',
        races: [],
        availableRacecourses: getRacecoursesByCountry()
      }, { status: 400 })
    }

    // Check cache
    const cacheKey = `${racecourse}-${date}`
    const cached = cache.get(cacheKey)
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      console.log(`[Gemini API] Returning cached data`)
      return NextResponse.json({
        ...cached.data,
        cached: true
      })
    }

    // Check if Gemini API key is available
    if (!GEMINI_API_KEY) {
      return NextResponse.json({
        success: false,
        message: '⚠️ Gemini API key not configured. Please add GEMINI_API_KEY to environment variables.',
        races: [],
        availableRacecourses: getRacecoursesByCountry()
      }, { status: 500 })
    }

    // Fetch race data from Gemini
    const raceData = await fetchRaceDataFromGemini(racecourse, date)

    if (!raceData || !raceData.races?.length) {
      return NextResponse.json({
        success: false,
        message: `لا توجد سباقات في ${racecourse} بتاريخ ${date}`,
        racecourse,
        date,
        races: [],
        availableRacecourses: getRacecoursesByCountry(),
        elapsed: Date.now() - startTime
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
          raceName: race.name,
          raceTime: race.time || `${16 + race.number}:00`,
          surface: race.surface || 'Dirt',
          distance: race.distance || 1600,
          going: race.going || 'Standard'
        }
      })
    )

    // Find NAP (best prediction)
    const allPreds = racesWithPredictions.flatMap(r =>
      r.predictions.map((p: any) => ({ ...p, raceName: r.raceName }))
    )
    const sortedPreds = allPreds.sort((a: any, b: any) => b.powerScore - a.powerScore)

    const nap = sortedPreds[0]
    const nextBest = sortedPreds[1]
    const valuePick = sortedPreds.find((p: any) => p.valueRating === 'Good' && p.winProbability < 25) || sortedPreds[2]

    const result = {
      success: true,
      message: `تم تحليل ${racesWithPredictions.length} سباقات`,
      racecourse,
      country: 'UAE',
      date,
      totalRaces: racesWithPredictions.length,
      races: racesWithPredictions,
      napOfTheDay: nap ? {
        horseName: `#${nap.number} ${nap.name}`,
        raceName: nap.raceName,
        reason: nap.analysis || 'أفضل ترشيح بناءً على التحليل',
        confidence: nap.winProbability
      } : null,
      nextBest: nextBest ? {
        horseName: `#${nextBest.number} ${nextBest.name}`,
        raceName: nextBest.raceName,
        reason: nextBest.analysis || 'ترشيح ثاني قوي'
      } : null,
      valuePick: valuePick ? {
        horseName: `#${valuePick.number} ${valuePick.name}`,
        raceName: valuePick.raceName,
        reason: valuePick.analysis || 'ترشيح بقيمة جيدة'
      } : null,
      sources: [raceData.source],
      liveStreamUrl: null,
      pdfPath: null,
      pdfGenerated: false,
      emailSent: false,
      availableRacecourses: getRacecoursesByCountry(),
      processingTime: Date.now() - startTime
    }

    // Cache the result
    cache.set(cacheKey, { data: result, timestamp: Date.now() })

    console.log(`[Gemini API] Completed in ${Date.now() - startTime}ms`)

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('[Gemini API] Error:', error)
    return NextResponse.json({
      success: false,
      message: `⚠️ ${error.message || 'خطأ في معالجة الطلب'}`,
      races: [],
      availableRacecourses: getRacecoursesByCountry()
    }, { status: 500 })
  }
}

// GET handler for racecourses list
export async function GET() {
  return NextResponse.json({
    success: true,
    racecourses: getRacecoursesByCountry(),
    message: 'المضامير المتاحة',
    version: 'gemini-direct-v1',
    hasApiKey: !!GEMINI_API_KEY
  })
}

function getRacecoursesByCountry(): Record<string, { name: string; city: string }[]> {
  const result: Record<string, { name: string; city: string }[]> = {}
  for (const [country, courses] of Object.entries(RACECOURSES)) {
    result[country] = courses.map(c => ({ name: c.name, city: c.city }))
  }
  return result
}
