/**
 * Analyze URL API - Fetch and analyze race page
 */

import { NextRequest, NextResponse } from 'next/server'
import { hybridSearch } from '@/lib/search'

export const maxDuration = 120

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyD6RjJWkdeledpnjl9Q0A4vBv9PB4lJhZs'
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

async function callGemini(prompt: string): Promise<string | null> {
  try {
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 16384 }
      })
    })

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null
  } catch (error) {
    console.error('Gemini error:', error)
    return null
  }
}

// Fetch page content with better bypass
async function fetchPageContent(url: string): Promise<string> {
  const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest=',
  ]

  const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  ]

  // Try direct fetch first
  for (const ua of USER_AGENTS) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': ua,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        signal: AbortSignal.timeout(15000)
      })
      if (response.ok) {
        const text = await response.text()
        if (text && text.length > 500) {
          console.log('[Fetch] Direct fetch succeeded')
          return text
        }
      }
    } catch {}
  }

  // Try with CORS proxies
  for (const proxy of CORS_PROXIES) {
    for (const ua of USER_AGENTS.slice(0, 2)) {
      try {
        const proxyUrl = `${proxy}${encodeURIComponent(url)}`
        const response = await fetch(proxyUrl, {
          headers: { 'User-Agent': ua },
          signal: AbortSignal.timeout(20000)
        })
        if (response.ok) {
          const text = await response.text()
          if (text && text.length > 500) {
            console.log(`[Fetch] Proxy ${proxy} succeeded`)
            return text
          }
        }
      } catch {}
    }
  }

  return ''
}

// Extract text from HTML
function extractTextFromHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 30000)
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({
        success: false,
        message: 'الرابط مطلوب'
      }, { status: 400 })
    }

    console.log(`[Analyze URL] Fetching: ${url}`)

    // Fetch page content
    const html = await fetchPageContent(url)

    if (!html || html.length < 100) {
      return NextResponse.json({
        success: false,
        message: 'فشل في جلب محتوى الصفحة'
      })
    }

    const text = extractTextFromHtml(html)
    console.log(`[Analyze URL] Extracted ${text.length} chars`)

    // Extract race data using Gemini
    const extractPrompt = `You are an expert horse racing data extractor. Extract race data from this web page content.

URL: ${url}

Content:
${text}

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
        {"number": 1, "name": "Horse", "jockey": "Jockey", "trainer": "Trainer", "draw": 1, "weight": 57, "rating": 75}
      ]
    }
  ]
}

If no data found: {"found": false}

Return ONLY JSON.`

    const extractResult = await callGemini(extractPrompt)

    if (!extractResult) {
      return NextResponse.json({
        success: false,
        message: 'فشل في تحليل المحتوى'
      })
    }

    const jsonMatch = extractResult.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({
        success: false,
        message: 'لم يتم العثور على بيانات سباق'
      })
    }

    const raceData = JSON.parse(jsonMatch[0])

    if (!raceData.found || !raceData.races?.length) {
      return NextResponse.json({
        success: false,
        message: 'لم يتم العثور على بيانات سباق في الصفحة'
      })
    }

    // Generate predictions for each race
    const isUAE = raceData.country === 'UAE'
    const predictedRaces = []

    for (const race of raceData.races) {
      if (race.horses && race.horses.length >= 2) {
        const horsesJson = JSON.stringify(race.horses, null, 2)
        const predictPrompt = `Analyze this race and predict finishing order:

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
  "analysis": "Arabic analysis"
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
      message: `تم تحليل ${predictedRaces.length} سباق من الرابط`,
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
      sources: [url],
      dataSource: 'URL_ANALYSIS',
      processingTime: Date.now() - startTime
    })

  } catch (error: any) {
    console.error('[Analyze URL] Error:', error)
    return NextResponse.json({
      success: false,
      message: `خطأ: ${error.message}`
    }, { status: 500 })
  }
}
