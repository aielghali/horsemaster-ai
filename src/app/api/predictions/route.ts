/**
 * Elghali AI - Predictions API v25.0
 * Hybrid Search: DuckDuckGo + Direct Scraping
 * NO z-ai-web-dev-sdk dependency
 * Works on Vercel without any config files
 */

import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { hybridSearch } from '@/lib/search'

export const maxDuration = 120

const EMAIL_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  auth: { user: 'ai.elghali.ali@gmail.com', pass: 'uboj rlmd jnmn dgfw' }
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyD6RjJWkdeledpnjl9Q0A4vBv9PB4lJhZs'
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

const LIVE_STREAMS: Record<string, string> = {
  'Meydan': 'https://www.emiratesracing.com/live-streams/dubai-racing-1',
  'Jebel Ali': 'https://www.emiratesracing.com/live-streams/dubai-racing-2',
  'Newcastle': 'https://www.attheraces.com/newcastle',
  'Wolverhampton': 'https://www.attheraces.com/wolverhampton',
  'Kempton': 'https://www.attheraces.com/kempton',
  'Lingfield': 'https://www.attheraces.com/lingfield',
  'Southwell': 'https://www.attheraces.com/southwell',
  'Al Ain': 'https://www.emiratesracing.com/live-streams/al-ain',
  'Abu Dhabi': 'https://www.emiratesracing.com/live-streams/abu-dhabi',
  'Leicester': 'https://www.attheraces.com/leicester',
  'Catterick': 'https://www.attheraces.com/catterick',
}

// Call Gemini for analysis
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

// Extract race data from web content using Gemini
async function extractRaceDataFromContent(content: string, racecourse: string, date: string): Promise<any[]> {
  const prompt = `You are an expert horse racing data extractor. Extract REAL race data from this web content.

Racecourse: ${racecourse}
Date: ${date}

Web Content:
${content.substring(0, 15000)}

IMPORTANT:
- ONLY extract data that is ACTUALLY in the content
- DO NOT make up or generate any data
- If data is not found, return empty array

Return JSON in this exact format:
{
  "found": true/false,
  "races": [
    {
      "number": 1,
      "name": "Actual race name from content",
      "time": "HH:MM",
      "distance": 1600,
      "surface": "Dirt/Turf/All-Weather",
      "going": "Standard/Good/Soft/etc",
      "horses": [
        {
          "number": 1,
          "name": "Actual horse name from content",
          "jockey": "Actual jockey name",
          "trainer": "Actual trainer if available",
          "draw": 1,
          "weight": 57,
          "rating": 75,
          "form": "1-2-3"
        }
      ]
    }
  ],
  "source": "where data came from"
}

If NO real data found, return: {"found": false, "races": [], "reason": "No race data found in content"}

Return ONLY valid JSON. No explanations.`

  const result = await callGemini(prompt)
  if (!result) return []

  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0])
      if (data.found && data.races && data.races.length > 0) {
        return data.races
      }
    }
  } catch (e) {
    console.error('JSON parse error:', e)
  }

  return []
}

// Generate predictions using Gemini based on REAL horse data
async function generatePredictionsForRace(race: any, isUAE: boolean): Promise<any[]> {
  const horsesJson = JSON.stringify(race.horses, null, 2)

  const prompt = `You are an expert horse racing analyst. Analyze this race and predict the finishing order based on the horse data.

Race: ${race.name}
Distance: ${race.distance}m
Surface: ${race.surface}
Going: ${race.going || 'Standard'}

Horses (REAL DATA):
${horsesJson}

Based on:
- Horse rating and form
- Jockey skill
- Draw advantage (lower is better for sprints)
- Distance suitability
- Weight carried

Predict the finishing order. Return JSON array with ${isUAE ? '5' : '3'} predictions:
[
  {
    "position": 1,
    "number": 1,
    "name": "Horse Name",
    "jockey": "Jockey Name",
    "draw": 1,
    "rating": 80,
    "speedRating": 85.5,
    "estimatedTime": "1:36",
    "winProbability": 30,
    "placeProbability": 65,
    "valueRating": "Excellent/Good/Fair",
    "strengths": ["reason 1", "reason 2"],
    "concerns": ["concern if any"],
    "analysis": "Arabic analysis"
  }
]

IMPORTANT:
- Use REAL horse names and numbers from the data above
- DO NOT make up horse names
- Calculate realistic probabilities
- Provide analysis in Arabic

Return ONLY the JSON array.`

  const result = await callGemini(prompt)
  if (!result) return []

  try {
    const jsonMatch = result.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('Prediction parse error:', e)
  }

  return []
}

// Main API Handler
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const body = await request.json()
  const { date, racecourse, email, sendEmail } = body

  console.log(`[API v25.0] ${racecourse} ${date} - HYBRID SEARCH`)

  if (!date || !racecourse) {
    return NextResponse.json({
      success: false,
      message: 'التاريخ والمضمار مطلوبان',
      racecourse: '',
      date: '',
      totalRaces: 0,
      races: [],
      napOfTheDay: {},
      sources: [],
      availableRacecourses: getAvailableRacecourses()
    })
  }

  try {
    // Determine if UAE race
    const isUAE = ['meydan', 'jebel ali', 'al ain', 'abu dhabi', 'sharjah'].some(c =>
      racecourse.toLowerCase().includes(c)
    )

    console.log(`[Region] ${isUAE ? 'UAE' : 'International'}`)

    // Step 1: Hybrid Search (DuckDuckGo + Scraping)
    console.log('[Step 1] Running hybrid search...')
    const searchResult = await hybridSearch(racecourse, date, {
      maxSearchResults: 10,
      enableScraping: true
    })

    if (!searchResult.success || !searchResult.context) {
      return NextResponse.json({
        success: false,
        message: `⚠️ لم يتم العثور على بيانات سباقات لـ "${racecourse}" بتاريخ ${date}.\n\n💡 اقتراحات:\n• تأكد من أن هناك سباقات في هذا التاريخ\n• جرب رفع صورة بطاقة السباق\n• تحقق من جدول السباقات الرسمي`,
        racecourse,
        date,
        totalRaces: 0,
        races: [],
        napOfTheDay: {},
        sources: searchResult.sources,
        availableRacecourses: getAvailableRacecourses()
      })
    }

    console.log(`[Step 1] Found content from ${searchResult.sources.length} sources`)

    // Step 2: Extract race data using Gemini
    console.log('[Step 2] Extracting race data with Gemini...')
    const races = await extractRaceDataFromContent(searchResult.context, racecourse, date)

    if (!races || races.length === 0) {
      return NextResponse.json({
        success: false,
        message: `⚠️ تم العثور على محتوى لكن لم يتم استخراج بيانات سباقات.\n\nقد يكون السبب:\n• لا توجد سباقات في هذا التاريخ\n• المحتوى غير واضح\n\n💡 جرب رفع صورة بطاقة السباق`,
        racecourse,
        date,
        totalRaces: 0,
        races: [],
        napOfTheDay: {},
        sources: searchResult.sources,
        availableRacecourses: getAvailableRacecourses()
      })
    }

    console.log(`[Step 2] Extracted ${races.length} races`)

    // Step 3: Generate predictions for each race
    console.log('[Step 3] Generating predictions...')
    const predictedRaces = []

    for (const race of races) {
      if (race.horses && race.horses.length >= 2) {
        const predictions = await generatePredictionsForRace(race, isUAE)
        if (predictions.length > 0) {
          predictedRaces.push({
            ...race,
            predictions,
            raceNumber: race.number,
            raceName: race.name,
            raceTime: race.time,
            surface: race.surface || 'Dirt',
            distance: race.distance || 1600,
            going: race.going || 'Standard'
          })
        }
      }
    }

    if (predictedRaces.length === 0) {
      return NextResponse.json({
        success: false,
        message: `⚠️ تم العثور على سباقات لكن لا توجد خيول كافية للتحليل.\n\n💡 جرب رفع صورة بطاقة السباق`,
        racecourse,
        date,
        totalRaces: races.length,
        races: [],
        napOfTheDay: {},
        sources: searchResult.sources,
        availableRacecourses: getAvailableRacecourses()
      })
    }

    console.log(`[Step 3] Generated predictions for ${predictedRaces.length} races`)

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

    // Email
    let emailSent = false
    if (sendEmail && email) {
      try {
        const emailHtml = generateFullEmailHtml({
          racecourse,
          date,
          races: predictedRaces
        }, {
          races: predictedRaces,
          napOfTheDay: bestHorse ? {
            horseName: `${bestHorse.number}. ${bestHorse.name}`,
            raceName: bestRace.raceName,
            speedRating: bestHorse.speedRating,
            confidence: bestHorse.winProbability + 30
          } : {}
        }, isUAE)

        const transporter = nodemailer.createTransport({
          host: EMAIL_CONFIG.host,
          port: EMAIL_CONFIG.port,
          auth: EMAIL_CONFIG.auth
        })

        await transporter.sendMail({
          from: { name: 'Elghali AI', address: EMAIL_CONFIG.auth.user },
          to: email,
          subject: `🏇 Elghali AI - ${racecourse} - ${date} - ${predictedRaces.length} سباقات`,
          html: emailHtml
        })
        emailSent = true
        console.log(`[Email] Sent successfully`)
      } catch (e) {
        console.error('[Email Error]', e)
      }
    }

    const liveStreamUrl = Object.entries(LIVE_STREAMS).find(([name]) =>
      racecourse.toLowerCase().includes(name.toLowerCase())
    )?.[1] || null

    console.log(`[Complete] ${predictedRaces.length} races in ${Date.now() - startTime}ms`)

    return NextResponse.json({
      success: true,
      message: `✅ تم تحليل ${predictedRaces.length} سباق - Hybrid Search`,
      racecourse,
      country: isUAE ? 'UAE' : 'International',
      date,
      totalRaces: predictedRaces.length,
      races: predictedRaces,
      napOfTheDay: bestHorse ? {
        horseName: `${bestHorse.number}. ${bestHorse.name}`,
        raceName: bestRace.raceName,
        speedRating: bestHorse.speedRating,
        estimatedTime: bestHorse.estimatedTime,
        reason: bestHorse.analysis || `أعلى تقييم سرعة (${bestHorse.speedRating})`,
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
      sources: searchResult.sources,
      emailSent,
      liveStreamUrl,
      availableRacecourses: getAvailableRacecourses(),
      dataSource: 'HYBRID_SEARCH',
      searchMethod: 'DuckDuckGo + Direct Scraping',
      predictionType: isUAE ? 'UAE (Top 5)' : 'International (Top 3)',
      processingTime: Date.now() - startTime
    })

  } catch (error: any) {
    console.error('[Error]', error)
    return NextResponse.json({
      success: false,
      message: `خطأ: ${error.message}`,
      racecourse,
      date,
      totalRaces: 0,
      races: [],
      napOfTheDay: {},
      sources: [],
      availableRacecourses: getAvailableRacecourses()
    })
  }
}

function generateFullEmailHtml(raceData: any, predictions: any, isUAE: boolean): string {
  let racesHtml = ''
  const numWinners = isUAE ? 5 : 3

  for (const race of predictions.races) {
    let table = ''
    for (let i = 0; i < Math.min(numWinners, race.predictions.length); i++) {
      const p = race.predictions[i]
      table += `
        <tr style="${p.position === 1 ? 'background: #FFF8DC;' : p.position === 2 ? 'background: #F0FFF0;' : p.position === 3 ? 'background: #FFF0F5;' : ''}">
          <td style="padding: 8px; text-align: center; border: 1px solid #ddd;"><strong>${p.position}</strong></td>
          <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${p.number}</td>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>${p.name}</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${p.jockey}</td>
          <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${p.draw}</td>
          <td style="padding: 8px; text-align: center; border: 1px solid #ddd;"><strong>${p.speedRating}</strong></td>
          <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${p.winProbability}%</td>
          <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${p.estimatedTime}</td>
        </tr>`
    }

    racesHtml += `
      <div style="margin-bottom: 20px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #8B0000, #A52A2A); color: white; padding: 12px;">
          <strong>🏇 الشوط ${race.raceNumber}:</strong> ${race.raceName}
          <span style="float: left; background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 4px;">${race.raceTime}</span>
        </div>
        <div style="background: #f8f9fa; padding: 8px; font-size: 12px;">
          📏 ${race.distance}م | 🏔️ ${race.surface} | 🌤️ ${race.going}
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background: #f5f5f5;">
            <th style="padding: 6px; border: 1px solid #ddd;">المركز</th>
            <th style="padding: 6px; border: 1px solid #ddd;">رقم</th>
            <th style="padding: 6px; border: 1px solid #ddd;">الحصان</th>
            <th style="padding: 6px; border: 1px solid #ddd;">الفارس</th>
            <th style="padding: 6px; border: 1px solid #ddd;">البوابة</th>
            <th style="padding: 6px; border: 1px solid #ddd;">السرعة</th>
            <th style="padding: 6px; border: 1px solid #ddd;">الفوز</th>
            <th style="padding: 6px; border: 1px solid #ddd;">الزمن</th>
          </tr>
          ${table}
        </table>
      </div>`
  }

  return `
    <!DOCTYPE html>
    <html dir="rtl">
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
      <div style="max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #8B0000, #A52A2A); padding: 25px; text-align: center;">
          <h1 style="color: #D4AF37; margin: 0; font-size: 32px;">🐴 Elghali AI</h1>
          <p style="color: white; margin: 10px 0 0 0;">Hybrid Search - DuckDuckGo + Direct Scraping</p>
        </div>
        <div style="padding: 25px;">
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
            <h2 style="margin: 0 0 10px 0; color: #8B0000;">${raceData.racecourse}</h2>
            <p style="margin: 0; color: #666; font-size: 18px;">📅 ${raceData.date}</p>
            <p style="margin: 5px 0 0 0; color: #28a745; font-size: 16px;"><strong>${predictions.races.length} أشواط | ${isUAE ? '5 مرشحين' : '3 مرشحين'} لكل شوط</strong></p>
          </div>

          <div style="background: linear-gradient(135deg, #FFF8DC, #FFFACD); padding: 20px; border-radius: 12px; margin: 20px 0; border: 2px solid #D4AF37; text-align: center;">
            <h3 style="margin: 0 0 10px 0; color: #8B0000; font-size: 20px;">🌟 NAP of the Day</h3>
            <p style="font-size: 28px; color: #8B0000; font-weight: bold; margin: 10px 0;">${predictions.napOfTheDay?.horseName || 'N/A'}</p>
            <p style="color: #666; margin: 5px 0;">تقييم السرعة: ${predictions.napOfTheDay?.speedRating || 0} | الزمن المتوقع: ${predictions.napOfTheDay?.estimatedTime || 'N/A'}</p>
            <p style="background: #28a745; color: white; display: inline-block; padding: 8px 20px; border-radius: 25px; font-size: 18px;">${predictions.napOfTheDay?.confidence || 0}% ثقة</p>
          </div>

          ${racesHtml}

          <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; font-size: 13px; color: #155724;">✅ Hybrid Search: DuckDuckGo + Direct Scraping - لا يعتمد على أي SDK</p>
          </div>
        </div>
      </div>
    </body>
    </html>`
}

export async function GET() {
  return NextResponse.json({
    success: true,
    racecourses: getAvailableRacecourses(),
    message: 'Elghali AI v25.0 - Hybrid Search (DuckDuckGo + Scraping)',
    features: [
      '🔍 DuckDuckGo Search (Free, No API Key)',
      '🌐 Direct Scraping from Racing Sites',
      '🤖 Gemini AI for Analysis',
      '🚫 NO z-ai-web-dev-sdk dependency',
      '🏆 UAE: Top 5 predictions',
      '🌍 International: Top 3 predictions',
      '✅ Works on Vercel without config files'
    ],
    timestamp: new Date().toISOString()
  })
}

function getAvailableRacecourses() {
  return {
    UAE: [
      { name: 'Meydan', city: 'Dubai' },
      { name: 'Jebel Ali', city: 'Dubai' },
      { name: 'Al Ain', city: 'Al Ain' },
      { name: 'Abu Dhabi', city: 'Abu Dhabi' },
      { name: 'Sharjah', city: 'Sharjah' }
    ],
    UK: [
      { name: 'Newcastle', city: 'Newcastle' },
      { name: 'Wolverhampton', city: 'Wolverhampton' },
      { name: 'Kempton', city: 'Kempton' },
      { name: 'Lingfield', city: 'Lingfield' },
      { name: 'Southwell', city: 'Southwell' },
      { name: 'Leicester', city: 'Leicester' },
      { name: 'Catterick', city: 'Catterick' },
      { name: 'Ascot', city: 'Ascot' },
      { name: 'York', city: 'York' }
    ]
  }
}
