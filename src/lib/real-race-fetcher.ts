/**
 * Elghali AI - Real Race Data Fetcher v8.0
 * Uses Hybrid Search instead of z-ai-web-dev-sdk
 */

import { hybridSearch } from './search'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyD6RjJWkdeledpnjl9Q0A4vBv9PB4lJhZs'
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

export interface RealHorseData {
  number: number
  name: string
  jockey: string
  trainer: string
  draw: number
  weight: number
  rating: number
  form: string
  age: number
  sex: string
}

export interface RealRaceData {
  number: number
  name: string
  time: string
  distance: number
  surface: 'Dirt' | 'Turf' | 'All-Weather' | 'Sand'
  going: string
  prize: number
  horses: RealHorseData[]
  source: string
}

export interface RealRaceDay {
  date: string
  racecourse: string
  city: string
  country: string
  races: RealRaceData[]
  sources: string[]
  lastUpdated: string
}

// Call Gemini for AI extraction
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

/**
 * Fetch REAL race data using Hybrid Search
 */
export async function fetchRealRaceData(racecourse: string, date: string): Promise<RealRaceDay | null> {
  console.log(`[Fetcher v8.0] Fetching: ${racecourse} on ${date}`)

  try {
    // Use Hybrid Search
    const searchResult = await hybridSearch(racecourse, date, {
      maxSearchResults: 15,
      enableScraping: true
    })

    if (!searchResult.success || !searchResult.context) {
      console.log(`[Fetcher] No results found`)
      return null
    }

    console.log(`[Fetcher] Found content from ${searchResult.sources.length} sources`)

    // Extract using Gemini
    const prompt = `You are a horse racing data extraction expert. Extract ALL races and ALL horses.

CRITICAL INSTRUCTIONS:
1. Extract ALL races mentioned (typically 6-10 races per meeting)
2. Extract ALL horses in each race (typically 6-14 horses)
3. DO NOT skip any races or horses
4. Horse NUMBER and DRAW are DIFFERENT

Content:
${searchResult.context.substring(0, 20000)}

Output ONLY this JSON structure:
{
  "racecourse": "name",
  "country": "UAE",
  "date": "YYYY-MM-DD",
  "races": [
    {
      "number": 1,
      "name": "full race name",
      "time": "HH:MM",
      "distance": 1600,
      "surface": "Dirt",
      "going": "",
      "horses": [
        {"number": 1, "name": "Horse Name", "jockey": "Jockey", "trainer": "Trainer", "draw": 1, "rating": 80, "form": "1-2-3", "age": 5, "sex": "Horse", "weight": 57}
      ]
    }
  ],
  "foundData": true
}`

    const responseText = await callGemini(prompt)

    if (!responseText) {
      console.log(`[Fetcher] No AI response`)
      return null
    }

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.log(`[Fetcher] No JSON found`)
      return null
    }

    const data = JSON.parse(jsonMatch[0])

    if (!data.foundData || !data.races || data.races.length === 0) {
      console.log(`[Fetcher] No valid data`)
      return null
    }

    // Process races
    const cleanRaces: RealRaceData[] = data.races
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
            weight: parseFloat(h.weight) || 57,
            rating: parseInt(h.rating) || 0,
            form: h.form || '',
            age: parseInt(h.age) || 0,
            sex: h.sex || 'Horse'
          })),
        source: searchResult.sources[0] || ''
      }))
      .filter((race: RealRaceData) => race.horses.length > 0)

    const totalHorses = cleanRaces.reduce((sum, r) => sum + r.horses.length, 0)
    console.log(`[Fetcher] SUCCESS: ${cleanRaces.length} races, ${totalHorses} horses`)

    return {
      date: data.date || date,
      racecourse: data.racecourse || racecourse,
      city: detectCity(racecourse),
      country: data.country || 'UAE',
      races: cleanRaces,
      sources: searchResult.sources,
      lastUpdated: new Date().toISOString()
    }

  } catch (error) {
    console.error('[Fetcher] Error:', error)
    return null
  }
}

function detectCity(racecourse: string): string {
  const cities: Record<string, string> = {
    'meydan': 'Dubai', 'jebel ali': 'Dubai', 'abu dhabi': 'Abu Dhabi',
    'sharjah': 'Sharjah', 'al ain': 'Al Ain',
    'newcastle': 'Newcastle', 'wolverhampton': 'Wolverhampton', 'kempton': 'Kempton',
    'lingfield': 'Lingfield', 'southwell': 'Southwell', 'leicester': 'Leicester',
    'catterick': 'Catterick', 'ascot': 'Ascot', 'york': 'York'
  }
  const n = racecourse.toLowerCase()
  for (const [k, v] of Object.entries(cities)) {
    if (n.includes(k)) return v
  }
  return racecourse
}

/**
 * Generate predictions
 */
export async function generatePredictionsFromRealData(raceDay: RealRaceDay): Promise<{
  races: any[]
  napOfTheDay: any
  nextBest: any
  valuePick: any
}> {
  console.log(`[Predictions] Analyzing ${raceDay.races.length} races`)

  try {
    const context = raceDay.races.map(r => ({
      number: r.number,
      name: r.name,
      time: r.time,
      distance: r.distance,
      surface: r.surface,
      horses: r.horses.map(h => ({
        number: h.number,
        name: h.name,
        jockey: h.jockey,
        trainer: h.trainer,
        draw: h.draw,
        rating: h.rating
      }))
    }))

    const prompt = `You are a horse racing analyst. For each horse calculate:
- powerScore (0-100)
- winProbability (0-100)
- placeProbability (0-100)
- valueRating: "Excellent"|"Good"|"Fair"|"Poor"

Return JSON:
{
  "races": [{
    "number": 1,
    "name": "race",
    "time": "time",
    "distance": 0,
    "surface": "Dirt",
    "predictions": [{
      "position": 1,
      "number": 1,
      "name": "horse",
      "jockey": "jockey",
      "trainer": "trainer",
      "draw": 1,
      "rating": 80,
      "powerScore": 75,
      "winProbability": 30,
      "placeProbability": 60,
      "valueRating": "Good",
      "form": "1-2-3",
      "weight": 58,
      "strengths": ["point"],
      "concerns": ["point"],
      "analysis": "analysis in Arabic"
    }],
    "raceAnalysis": "analysis"
  }],
  "napOfTheDay": {"horseName": "#. Name", "raceName": "race", "reason": "why", "confidence": 85},
  "nextBest": {"horseName": "#. Name", "raceName": "race", "reason": "why"},
  "valuePick": {"horseName": "#. Name", "raceName": "race", "reason": "why"}
}

Races to analyze:
${JSON.stringify(context, null, 2)}`

    const text = await callGemini(prompt)
    if (text) {
      const match = text.match(/\{[\s\S]*\}/)
      if (match) return JSON.parse(match[0])
    }

    return basicPredictions(raceDay)
  } catch (e) {
    return basicPredictions(raceDay)
  }
}

function basicPredictions(raceDay: RealRaceDay): any {
  const races = raceDay.races.map(r => ({
    number: r.number,
    name: r.name,
    time: r.time,
    distance: r.distance,
    surface: r.surface,
    going: '',
    predictions: r.horses.map((h, i) => ({
      position: i + 1,
      number: h.number,
      name: h.name,
      jockey: h.jockey,
      trainer: h.trainer,
      draw: h.draw,
      rating: h.rating,
      powerScore: Math.max(30, 90 - i * 8),
      winProbability: Math.max(5, 35 - i * 4),
      placeProbability: Math.max(15, 55 - i * 6),
      valueRating: i < 2 ? 'Good' : 'Fair',
      form: h.form,
      weight: h.weight,
      strengths: [],
      concerns: [],
      analysis: ''
    })),
    raceAnalysis: ''
  }))

  const h = races[0]?.predictions[0]
  return {
    races,
    napOfTheDay: h ? {horseName: `#${h.number} ${h.name}`, raceName: races[0].name, reason: 'Top selection', confidence: 70} : {horseName: '', raceName: '', reason: '', confidence: 0},
    nextBest: {horseName: '', raceName: '', reason: ''},
    valuePick: {horseName: '', raceName: '', reason: ''}
  }
}
