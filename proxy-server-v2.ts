/**
 * Elghali AI - Enhanced Proxy API with VLM Image Processing
 * Accepts uploaded racecard images and extracts data using Vision AI
 */

import express from 'express'
import cors from 'cors'
import multer from 'multer'
import ZAI from 'z-ai-web-dev-sdk'
import { RACECOURSES } from './src/lib/race-database'
import fs from 'fs'

const app = express()
const PORT = 3001

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
})

// Enable CORS for all origins
app.use(cors())
app.use(express.json({ limit: '50mb' }))

// Initialize Z-AI
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create()
  }
  return zaiInstance
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Elghali AI Proxy v2.0',
    features: ['predictions', 'image-upload', 'vlm-extraction']
  })
})

// Get racecourses
app.get('/racecourses', (req, res) => {
  const result: Record<string, { name: string; city: string }[]> = {}
  for (const [country, courses] of Object.entries(RACECOURSES)) {
    result[country] = courses.map(c => ({ name: c.name, city: c.city }))
  }
  res.json({ success: true, racecourses: result })
})

// Extract race data from image using VLM
async function extractRaceDataFromImage(imageBuffer: Buffer, mimeType: string): Promise<any> {
  const zai = await getZAI()
  const base64Image = imageBuffer.toString('base64')
  const imageUrl = `data:${mimeType};base64,${base64Image}`

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `You are a horse racing data extraction expert. Extract ALL races and ALL horses from this racecard image.

CRITICAL INSTRUCTIONS:
1. Extract EVERY race visible (typically 6-8 races per meeting)
2. Extract EVERY horse in each race
3. Horse NUMBER (cloth number) and DRAW (gate/stall number) are DIFFERENT:
   - The number on the horse's cloth/saddlecloth is the HORSE NUMBER
   - The draw/gate/stall number is usually shown in parentheses or separate column
   - Format examples: "1 (5)" = Horse #1, Draw 5
   - Or "5. Horse Name (3)" = Horse #5, Draw 3
4. Include jockey and trainer names
5. Include distance and surface type

Return ONLY this JSON structure (no markdown, no explanation):
{
  "racecourse": "track name",
  "date": "YYYY-MM-DD",
  "races": [
    {
      "number": 1,
      "name": "race name",
      "time": "HH:MM",
      "distance": 1600,
      "surface": "Dirt/Turf/All-Weather",
      "going": "",
      "horses": [
        {"number": 1, "name": "Horse Name", "jockey": "Jockey Name", "trainer": "Trainer Name", "draw": 1, "rating": 0, "form": ""}
      ]
    }
  ],
  "foundData": true
}

Extract ALL data accurately. If you can't see a field, use null or empty string.`
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl }
          }
        ]
      }
    ],
    thinking: { type: 'disabled' }
  })

  const content = response.choices[0]?.message?.content || ''

  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0])
  }

  return { foundData: false, races: [] }
}

// Generate predictions from extracted data
async function generatePredictions(raceDay: any): Promise<any> {
  const zai = await getZAI()

  if (!raceDay.races || raceDay.races.length === 0) {
    return { races: [], napOfTheDay: null, nextBest: null, valuePick: null }
  }

  const context = raceDay.races.map((r: any) => ({
    number: r.number,
    name: r.name,
    time: r.time,
    distance: r.distance,
    surface: r.surface,
    horses: r.horses.map((h: any) => ({
      number: h.number,
      name: h.name,
      jockey: h.jockey,
      trainer: h.trainer,
      draw: h.draw,
      rating: h.rating
    }))
  }))

  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are a professional horse racing analyst. Analyze each horse and provide:

For each horse calculate:
- powerScore (0-100): Overall strength rating
- winProbability (0-100): Chance of winning
- placeProbability (0-100): Chance of placing (top 3)
- valueRating: "Excellent" | "Good" | "Fair" | "Poor"

Rank horses by their chances and provide analysis.

Return JSON:
{
  "races": [{
    "number": 1,
    "name": "race name",
    "time": "time",
    "distance": 0,
    "surface": "Dirt",
    "predictions": [{
      "position": 1,
      "number": 1,
      "name": "horse name",
      "jockey": "jockey",
      "trainer": "trainer",
      "draw": 1,
      "rating": 80,
      "powerScore": 75,
      "winProbability": 30,
      "placeProbability": 60,
      "valueRating": "Good",
      "form": "",
      "weight": 0,
      "strengths": ["strength"],
      "concerns": ["concern"],
      "analysis": "brief analysis"
    }],
    "raceAnalysis": "overall race analysis"
  }],
  "napOfTheDay": {"horseName": "#. Name", "raceName": "race", "reason": "why", "confidence": 85},
  "nextBest": {"horseName": "#. Name", "raceName": "race", "reason": "why"},
  "valuePick": {"horseName": "#. Name", "raceName": "race", "reason": "why"}
}`
      },
      {
        role: 'user',
        content: `Analyze ${raceDay.races.length} races from ${raceDay.racecourse || 'Unknown Track'}:\n\n${JSON.stringify(context, null, 2)}`
      }
    ],
    temperature: 0.3,
    max_tokens: 16000
  })

  const text = completion.choices[0]?.message?.content || ''
  const match = text.match(/\{[\s\S]*\}/)
  if (match) {
    return JSON.parse(match[0])
  }

  // Fallback: basic predictions
  return generateBasicPredictions(raceDay)
}

function generateBasicPredictions(raceDay: any): any {
  const races = raceDay.races.map((r: any) => ({
    number: r.number,
    name: r.name,
    time: r.time,
    distance: r.distance,
    surface: r.surface,
    going: '',
    predictions: r.horses.map((h: any, i: number) => ({
      position: i + 1,
      number: h.number,
      name: h.name,
      jockey: h.jockey,
      trainer: h.trainer,
      draw: h.draw,
      rating: h.rating || 0,
      powerScore: Math.max(30, 90 - i * 8),
      winProbability: Math.max(5, 35 - i * 4),
      placeProbability: Math.max(15, 55 - i * 6),
      valueRating: i < 2 ? 'Good' : 'Fair',
      form: h.form || '',
      weight: 0,
      strengths: [],
      concerns: [],
      analysis: ''
    })),
    raceAnalysis: ''
  }))

  const topHorse = races[0]?.predictions[0]
  return {
    races,
    napOfTheDay: topHorse ? {
      horseName: `#${topHorse.number} ${topHorse.name}`,
      raceName: races[0].name,
      reason: 'Top rated selection',
      confidence: 70
    } : null,
    nextBest: null,
    valuePick: null
  }
}

// Upload image and extract race data
app.post('/upload-racecard', upload.single('image'), async (req, res) => {
  const startTime = Date.now()

  try {
    if (!req.file) {
      return res.json({
        success: false,
        message: 'لم يتم رفع صورة',
        races: []
      })
    }

    console.log(`[Proxy v2.0] Processing uploaded image: ${req.file.originalname}, size: ${req.file.size}`)

    const mimeType = req.file.mimetype
    const imageBuffer = req.file.buffer

    // Extract race data using VLM
    const extractedData = await extractRaceDataFromImage(imageBuffer, mimeType)

    if (!extractedData.foundData || !extractedData.races || extractedData.races.length === 0) {
      return res.json({
        success: false,
        message: 'لم يتم العثور على بيانات سباقات في الصورة',
        races: []
      })
    }

    // Process and clean the data
    const cleanRaces = extractedData.races
      .filter((race: any) => race.horses && race.horses.length > 0)
      .map((race: any) => ({
        number: parseInt(race.number) || 1,
        name: race.name || `Race ${race.number}`,
        time: race.time || '',
        distance: parseInt(race.distance) || 0,
        surface: race.surface || 'Dirt',
        going: race.going || '',
        prize: 0,
        horses: race.horses
          .filter((h: any) => h.name && h.name.trim().length > 0)
          .map((h: any) => ({
            number: parseInt(h.number) || 0,
            name: (h.name || '').trim(),
            jockey: h.jockey || 'Unknown',
            trainer: h.trainer || 'Unknown',
            draw: parseInt(h.draw) || parseInt(h.number) || 0,
            weight: parseFloat(h.weight) || 0,
            rating: parseInt(h.rating) || 0,
            form: h.form || '',
            age: parseInt(h.age) || 0,
            sex: h.sex || 'Horse'
          })),
        source: 'Uploaded Image'
      }))
      .filter((race: any) => race.horses.length > 0)

    const totalHorses = cleanRaces.reduce((sum: number, r: any) => sum + r.horses.length, 0)
    console.log(`[Proxy v2.0] Extracted ${cleanRaces.length} races, ${totalHorses} horses`)

    // Generate predictions
    const predictions = await generatePredictions({
      racecourse: extractedData.racecourse,
      date: extractedData.date,
      races: cleanRaces
    })

    const elapsed = Date.now() - startTime
    console.log(`[Proxy v2.0] Completed in ${elapsed}ms`)

    return res.json({
      success: true,
      message: `تم تحليل ${cleanRaces.length} سباق بنجاح`,
      racecourse: extractedData.racecourse || 'Unknown Track',
      country: 'UAE',
      date: extractedData.date || new Date().toISOString().split('T')[0],
      totalRaces: cleanRaces.length,
      races: predictions.races,
      napOfTheDay: predictions.napOfTheDay,
      nextBest: predictions.nextBest,
      valuePick: predictions.valuePick,
      sources: ['Uploaded Image'],
      processingTime: elapsed
    })

  } catch (error: any) {
    console.error('[Proxy v2.0] Error:', error)
    return res.json({
      success: false,
      message: `خطأ: ${error.message}`,
      races: []
    })
  }
})

// Also support base64 image upload
app.post('/upload-racecard-base64', async (req, res) => {
  const startTime = Date.now()

  try {
    const { image, mimeType } = req.body

    if (!image) {
      return res.json({
        success: false,
        message: 'لم يتم توفير صورة',
        races: []
      })
    }

    // Convert base64 to buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
    const imageBuffer = Buffer.from(base64Data, 'base64')
    const actualMimeType = mimeType || 'image/png'

    console.log(`[Proxy v2.0] Processing base64 image, size: ${imageBuffer.length}`)

    // Extract race data using VLM
    const extractedData = await extractRaceDataFromImage(imageBuffer, actualMimeType)

    if (!extractedData.foundData || !extractedData.races || extractedData.races.length === 0) {
      return res.json({
        success: false,
        message: 'لم يتم العثور على بيانات سباقات في الصورة',
        races: []
      })
    }

    // Process and clean the data
    const cleanRaces = extractedData.races
      .filter((race: any) => race.horses && race.horses.length > 0)
      .map((race: any) => ({
        number: parseInt(race.number) || 1,
        name: race.name || `Race ${race.number}`,
        time: race.time || '',
        distance: parseInt(race.distance) || 0,
        surface: race.surface || 'Dirt',
        going: race.going || '',
        prize: 0,
        horses: race.horses
          .filter((h: any) => h.name && h.name.trim().length > 0)
          .map((h: any) => ({
            number: parseInt(h.number) || 0,
            name: (h.name || '').trim(),
            jockey: h.jockey || 'Unknown',
            trainer: h.trainer || 'Unknown',
            draw: parseInt(h.draw) || parseInt(h.number) || 0,
            weight: parseFloat(h.weight) || 0,
            rating: parseInt(h.rating) || 0,
            form: h.form || '',
            age: parseInt(h.age) || 0,
            sex: h.sex || 'Horse'
          })),
        source: 'Uploaded Image'
      }))
      .filter((race: any) => race.horses.length > 0)

    const totalHorses = cleanRaces.reduce((sum: number, r: any) => sum + r.horses.length, 0)
    console.log(`[Proxy v2.0] Extracted ${cleanRaces.length} races, ${totalHorses} horses`)

    // Generate predictions
    const predictions = await generatePredictions({
      racecourse: extractedData.racecourse,
      date: extractedData.date,
      races: cleanRaces
    })

    const elapsed = Date.now() - startTime
    console.log(`[Proxy v2.0] Completed in ${elapsed}ms`)

    return res.json({
      success: true,
      message: `تم تحليل ${cleanRaces.length} سباق بنجاح`,
      racecourse: extractedData.racecourse || 'Unknown Track',
      country: 'UAE',
      date: extractedData.date || new Date().toISOString().split('T')[0],
      totalRaces: cleanRaces.length,
      races: predictions.races,
      napOfTheDay: predictions.napOfTheDay,
      nextBest: predictions.nextBest,
      valuePick: predictions.valuePick,
      sources: ['Uploaded Image'],
      processingTime: elapsed
    })

  } catch (error: any) {
    console.error('[Proxy v2.0] Error:', error)
    return res.json({
      success: false,
      message: `خطأ: ${error.message}`,
      races: []
    })
  }
})

// Original predictions endpoint (for backward compatibility)
app.post('/predictions', async (req, res) => {
  const startTime = Date.now()

  try {
    const { date, racecourse } = req.body

    console.log(`[Proxy v2.0] Predictions request: date=${date}, racecourse=${racecourse}`)

    if (!date || !racecourse) {
      return res.json({
        success: false,
        message: 'التاريخ واسم المضمار مطلوبان',
        races: []
      })
    }

    // Use web search to find race data
    const zai = await getZAI()

    const queries = [
      `site:emiratesracing.com "${racecourse}" ${date} racecard`,
      `"${racecourse}" racecard ${date} horses jockeys trainers draw`,
      `site:attheraces.com "${racecourse}" ${date} racecard`
    ]

    const allSnippets: string[] = []
    const sources: string[] = []

    for (const query of queries) {
      try {
        const results = await zai.functions.invoke('web_search', {
          query,
          num: 5
        })

        if (results && Array.isArray(results)) {
          for (const r of results) {
            if (r.snippet) {
              allSnippets.push(`[${r.url}]\n${r.snippet}`)
              sources.push(r.url)
            }
          }
        }
      } catch (e) {
        console.log(`[Proxy v2.0] Query failed: ${query}`)
      }
    }

    if (allSnippets.length === 0) {
      return res.json({
        success: false,
        message: `لا توجد بيانات متاحة لـ ${racecourse} في ${date}`,
        races: []
      })
    }

    // Extract race data using AI
    const fullContext = allSnippets.join('\n\n').substring(0, 20000)

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Extract ALL races and horses from this data. Horse NUMBER and DRAW are different.
Return JSON: {"racecourse": "name", "date": "YYYY-MM-DD", "races": [{"number": 1, "name": "race", "horses": [{"number": 1, "name": "horse", "jockey": "jockey", "trainer": "trainer", "draw": 1}]}], "foundData": true}`
        },
        {
          role: 'user',
          content: `Extract races for ${racecourse} on ${date}:\n\n${fullContext}`
        }
      ],
      temperature: 0.1,
      max_tokens: 10000
    })

    const responseText = completion.choices[0]?.message?.content || ''
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      return res.json({
        success: false,
        message: 'فشل في استخراج البيانات',
        races: []
      })
    }

    const data = JSON.parse(jsonMatch[0])

    if (!data.foundData || !data.races || data.races.length === 0) {
      return res.json({
        success: false,
        message: `لا توجد سباقات متاحة`,
        races: []
      })
    }

    // Process races
    const cleanRaces = data.races
      .filter((race: any) => race.horses && race.horses.length > 0)
      .map((race: any) => ({
        number: parseInt(race.number) || 1,
        name: race.name || `Race ${race.number}`,
        time: race.time || '',
        distance: parseInt(race.distance) || 0,
        surface: race.surface || 'Dirt',
        going: race.going || '',
        prize: 0,
        horses: (race.horses || [])
          .filter((h: any) => h.name && h.name.trim().length > 0)
          .map((h: any) => ({
            number: parseInt(h.number) || 0,
            name: (h.name || '').trim(),
            jockey: h.jockey || 'Unknown',
            trainer: h.trainer || 'Unknown',
            draw: parseInt(h.draw) || parseInt(h.number) || 0,
            weight: parseFloat(h.weight) || 0,
            rating: parseInt(h.rating) || 0,
            form: h.form || '',
            age: parseInt(h.age) || 0,
            sex: h.sex || 'Horse'
          })),
        source: sources[0] || ''
      }))
      .filter((race: any) => race.horses.length > 0)

    // Generate predictions
    const predictions = await generatePredictions({
      racecourse: data.racecourse || racecourse,
      date: data.date || date,
      races: cleanRaces
    })

    const elapsed = Date.now() - startTime
    console.log(`[Proxy v2.0] Completed in ${elapsed}ms`)

    return res.json({
      success: true,
      message: `تم تحليل ${cleanRaces.length} سباق بنجاح`,
      racecourse: data.racecourse || racecourse,
      country: 'UAE',
      date: data.date || date,
      totalRaces: cleanRaces.length,
      races: predictions.races,
      napOfTheDay: predictions.napOfTheDay,
      nextBest: predictions.nextBest,
      valuePick: predictions.valuePick,
      sources: [...new Set(sources)].slice(0, 5),
      processingTime: elapsed
    })

  } catch (error: any) {
    console.error('[Proxy v2.0] Error:', error)
    return res.json({
      success: false,
      message: `خطأ: ${error.message}`,
      races: []
    })
  }
})

app.listen(PORT, () => {
  console.log(`\n🚀 Elghali AI Proxy v2.0 running on port ${PORT}`)
  console.log(`📡 Features:`)
  console.log(`   - POST /predictions - Get predictions by date/track`)
  console.log(`   - POST /upload-racecard - Upload image for extraction`)
  console.log(`   - POST /upload-racecard-base64 - Upload base64 image`)
  console.log(`   - GET /health - Health check`)
  console.log(`   - GET /racecourses - List all racecourses`)
})
