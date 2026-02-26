/**
 * Elghali AI - Proxy API for Vercel
 * This creates a public endpoint that Vercel can call
 * Run this on the local server where Z-AI is available
 */

import express from 'express'
import cors from 'cors'
import { fetchRealRaceData, generatePredictionsFromRealData } from './src/lib/real-race-fetcher'
import { RACECOURSES } from './src/lib/race-database'

const app = express()
const PORT = 3001

// Enable CORS for all origins
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Elghali AI Proxy'
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

// Get predictions - main endpoint
app.post('/predictions', async (req, res) => {
  const startTime = Date.now()
  
  try {
    const { date, racecourse } = req.body

    console.log(`[Proxy API] Request: date=${date}, racecourse=${racecourse}`)

    if (!date || !racecourse) {
      return res.json({
        success: false,
        message: 'التاريخ واسم المضمار مطلوبان',
        races: []
      })
    }

    // Fetch REAL race data
    const raceDay = await fetchRealRaceData(racecourse, date)
    
    if (!raceDay || raceDay.races.length === 0) {
      return res.json({
        success: false,
        message: `لا توجد سباقات متاحة في ${racecourse} بتاريخ ${date}`,
        races: []
      })
    }

    // Generate predictions
    const predictions = await generatePredictionsFromRealData(raceDay)

    const elapsed = Date.now() - startTime
    console.log(`[Proxy API] Completed in ${elapsed}ms`)

    return res.json({
      success: true,
      message: `تم تحليل ${raceDay.races.length} سباق بنجاح`,
      racecourse: raceDay.racecourse,
      country: raceDay.country,
      date: raceDay.date,
      totalRaces: raceDay.races.length,
      races: predictions.races,
      napOfTheDay: predictions.napOfTheDay,
      nextBest: predictions.nextBest,
      valuePick: predictions.valuePick,
      sources: raceDay.sources,
      processingTime: elapsed
    })

  } catch (error: any) {
    console.error('[Proxy API] Error:', error)
    return res.json({
      success: false,
      message: `خطأ: ${error.message}`,
      races: []
    })
  }
})

app.listen(PORT, () => {
  console.log(`\n🚀 Elghali AI Proxy API running on port ${PORT}`)
  console.log(`📡 Use this URL for Vercel: http://localhost:${PORT}`)
  console.log(`\nEndpoints:`)
  console.log(`  GET  /health       - Health check`)
  console.log(`  GET  /racecourses  - List all racecourses`)
  console.log(`  POST /predictions  - Get predictions`)
})
