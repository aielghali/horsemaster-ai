/**
 * Analyze PDF API - Extract and analyze racecard PDF
 */

import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 120

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyD6RjJWkdeledpnjl9Q0A4vBv9PB4lJhZs'
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

async function callGemini(prompt: string, imageData?: string): Promise<string | null> {
  try {
    const body: any = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 16384 }
    }

    // If image data provided, use Gemini's vision capability
    if (imageData) {
      const base64 = imageData.replace(/^data:[^;]+;base64,/, '')
      body.contents[0].parts = [
        { text: prompt },
        { inlineData: { mimeType: 'application/pdf', data: base64 } }
      ]
    }

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null
  } catch (error) {
    console.error('Gemini error:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body = await request.json()
    const { pdf, filename } = body

    if (!pdf) {
      return NextResponse.json({
        success: false,
        message: 'ملف PDF مطلوب'
      }, { status: 400 })
    }

    console.log(`[Analyze PDF] Processing: ${filename || 'unknown'}`)

    // Extract race data using Gemini (PDF as base64)
    const extractPrompt = `You are an expert horse racing data extractor. Extract ALL race data from this PDF racecard.

Return JSON:
{
  "found": true/false,
  "racecourse": "name",
  "date": "YYYY-MM-DD",
  "country": "UAE/UK/etc",
  "races": [
    {
      "number": 1,
      "name": "race name",
      "time": "HH:MM",
      "distance": 1600,
      "surface": "Dirt/Turf",
      "going": "Standard",
      "horses": [
        {"number": 1, "name": "Horse", "jockey": "Jockey", "trainer": "Trainer", "draw": 1, "weight": 57, "rating": 75, "form": "1-2-3"}
      ]
    }
  ]
}

IMPORTANT:
- Extract ALL races from the PDF
- Extract ALL horses in each race
- Horse NUMBER and DRAW are different
- Keep horse names exactly as shown

If no data found: {"found": false}

Return ONLY JSON.`

    const extractResult = await callGemini(extractPrompt, pdf)

    if (!extractResult) {
      return NextResponse.json({
        success: false,
        message: 'فشل في تحليل ملف PDF'
      })
    }

    const jsonMatch = extractResult.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({
        success: false,
        message: 'لم يتم العثور على بيانات سباق في الملف'
      })
    }

    const raceData = JSON.parse(jsonMatch[0])

    if (!raceData.found || !raceData.races?.length) {
      return NextResponse.json({
        success: false,
        message: 'لم يتم العثور على بيانات سباق في الملف'
      })
    }

    console.log(`[Analyze PDF] Found ${raceData.races.length} races`)

    // Generate predictions for each race
    const isUAE = raceData.country === 'UAE'
    const predictedRaces = []

    for (const race of raceData.races) {
      if (race.horses && race.horses.length >= 2) {
        const horsesJson = JSON.stringify(race.horses, null, 2)
        const predictPrompt = `You are a horse racing analyst. Predict finishing order:

Race: ${race.name}
Distance: ${race.distance}m
Surface: ${race.surface}

Horses:
${horsesJson}

Return JSON array with ${isUAE ? 5 : 3} predictions:
[{
  "position": 1,
  "number": 1,
  "name": "Horse",
  "jockey": "Jockey",
  "draw": 1,
  "rating": 80,
  "speedRating": 85,
  "estimatedTime": "1:36",
  "winProbability": 30,
  "placeProbability": 65,
  "valueRating": "Good",
  "strengths": ["point"],
  "concerns": [],
  "analysis": "تحليل بالعربية"
}]

Return ONLY JSON array.`

        const predictResult = await callGemini(predictPrompt)
        if (predictResult) {
          const predictMatch = predictResult.match(/\[[\s\S]*\]/)
          if (predictMatch) {
            const predictions = JSON.parse(predictMatch[0])
            predictedRaces.push({
              ...race,
              predictions,
              raceNumber: race.number,
              raceName: race.name,
              raceTime: race.time,
              surface: race.surface,
              distance: race.distance,
              going: race.going || 'Standard'
            })
          }
        }
      }
    }

    // Find NAP
    let bestHorse: any = null
    let bestRace: any = null
    let bestScore = 0

    for (const race of predictedRaces) {
      if (race.predictions[0]?.speedRating > bestScore) {
        bestScore = race.predictions[0].speedRating
        bestHorse = race.predictions[0]
        bestRace = race
      }
    }

    return NextResponse.json({
      success: true,
      message: `تم تحليل ${predictedRaces.length} سباق من الملف`,
      racecourse: raceData.racecourse || 'Unknown',
      country: raceData.country || 'Unknown',
      date: raceData.date || new Date().toISOString().split('T')[0],
      totalRaces: predictedRaces.length,
      races: predictedRaces,
      napOfTheDay: bestHorse ? {
        horseName: `${bestHorse.number}. ${bestHorse.name}`,
        raceName: bestRace.raceName,
        speedRating: bestHorse.speedRating,
        estimatedTime: bestHorse.estimatedTime,
        reason: bestHorse.analysis || 'أفضل ترشيح',
        confidence: bestHorse.winProbability + 30
      } : {},
      nextBest: predictedRaces[0]?.predictions[1] ? {
        horseName: `${predictedRaces[0].predictions[1].number}. ${predictedRaces[0].predictions[1].name}`,
        raceName: predictedRaces[0].raceName,
        speedRating: predictedRaces[0].predictions[1].speedRating,
        reason: predictedRaces[0].predictions[1].analysis
      } : {},
      valuePick: predictedRaces[0]?.predictions[2] ? {
        horseName: `${predictedRaces[0].predictions[2].number}. ${predictedRaces[0].predictions[2].name}`,
        raceName: predictedRaces[0].raceName,
        speedRating: predictedRaces[0].predictions[2].speedRating,
        reason: predictedRaces[0].predictions[2].analysis
      } : {},
      sources: [filename || 'PDF File'],
      dataSource: 'PDF_ANALYSIS',
      processingTime: Date.now() - startTime
    })

  } catch (error: any) {
    console.error('[Analyze PDF] Error:', error)
    return NextResponse.json({
      success: false,
      message: `خطأ: ${error.message}`
    }, { status: 500 })
  }
}
