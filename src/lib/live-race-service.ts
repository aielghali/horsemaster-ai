/**
 * Elghali AI - Live Race Data Service v2.0
 * Uses Hybrid Search instead of z-ai-web-dev-sdk
 */

import { hybridSearch, quickSearch } from './search'

// Official Racing Sources
export const RACING_SOURCES = {
  UAE: {
    official: 'https://www.emiratesracing.com',
    racecards: 'https://www.emiratesracing.com/racing/racecards',
    results: 'https://www.emiratesracing.com/racing/results',
    live: 'https://www.emiratesracing.com/live-streams',
    name: 'Emirates Racing Authority'
  },
  UK: {
    official: 'https://www.britishhorseracing.com',
    racecards: 'https://www.sportinglife.com/racecards',
    results: 'https://www.sportinglife.com/racing/results',
    racingPost: 'https://www.racingpost.com/racecards',
    timeform: 'https://www.timeform.com/horse-racing/racecards',
    atTheRaces: 'https://www.attheraces.com/racecards',
    name: 'British Horseracing Authority'
  },
  IRELAND: {
    official: 'https://www.hri.ie',
    racecards: 'https://www.hri.ie/racing/racecards',
    name: 'Horse Racing Ireland'
  },
  USA: {
    official: 'https://www.equibase.com',
    racecards: 'https://www.equibase.com/calendar/cal-monthly.cfm',
    name: 'Equibase'
  },
  AUSTRALIA: {
    official: 'https://www.racing.com',
    racecards: 'https://www.racing.com/racecards',
    name: 'Racing Australia'
  }
}

export interface LiveHorseData {
  number: number
  name: string
  jockey: string
  trainer: string
  rating?: number
  weight?: number
  draw?: number
  age?: number
  sex?: string
  form?: string
  odds?: string
  isFavorite?: boolean
  isWithdrawn?: boolean
  isNonRunner?: boolean
}

export interface LiveRaceData {
  number: number
  name: string
  time: string
  distance: number
  surface: 'Dirt' | 'Turf' | 'All-Weather' | 'Sand'
  going: string
  raceType: string
  prize: number
  horses: LiveHorseData[]
  status: 'scheduled' | 'live' | 'completed'
  source: string
}

export interface LiveRaceDay {
  date: string
  racecourse: string
  city: string
  country: string
  races: LiveRaceData[]
  sources: string[]
  lastUpdated: string
}

/**
 * Search for race data using Hybrid Search
 */
export async function searchRaceData(racecourse: string, date: string): Promise<LiveRaceDay | null> {
  console.log(`[LiveRace] Searching for: ${racecourse} on ${date}`)

  try {
    const result = await hybridSearch(racecourse, date, {
      maxSearchResults: 10,
      enableScraping: true
    })

    if (!result.success) {
      console.log(`[LiveRace] No results found`)
      return null
    }

    const country = detectCountry(racecourse)

    return {
      date,
      racecourse,
      city: detectCity(racecourse),
      country,
      races: [], // Will be filled by AI extraction
      sources: result.sources,
      lastUpdated: new Date().toISOString()
    }

  } catch (error) {
    console.error('[LiveRace] Search error:', error)
    return null
  }
}

/**
 * Get detailed race entries
 */
export async function getRaceEntries(racecourse: string, date: string): Promise<LiveRaceDay | null> {
  console.log(`[LiveRace] Getting entries for: ${racecourse} on ${date}`)
  return searchRaceData(racecourse, date)
}

/**
 * Detect country from racecourse name
 */
function detectCountry(racecourse: string): string {
  const normalized = racecourse.toLowerCase()

  if (['meydan', 'jebel ali', 'abu dhabi', 'sharjah', 'al ain'].some(r => normalized.includes(r))) {
    return 'UAE'
  }

  if (['king abdulaziz', 'janadriyah', 'taif', 'jeddah', 'riyadh'].some(r => normalized.includes(r))) {
    return 'SAUDI_ARABIA'
  }

  if (['al rayyan', 'qatar', 'doha'].some(r => normalized.includes(r))) {
    return 'QATAR'
  }

  if (['sakhir', 'bahrain'].some(r => normalized.includes(r))) {
    return 'BAHRAIN'
  }

  if (['ascot', 'newmarket', 'york', 'epsom', 'wolverhampton', 'kempton', 'lingfield', 'southwell',
       'newcastle', 'doncaster', 'leicester', 'catterick', 'chelmsford'].some(r => normalized.includes(r))) {
    return 'UK'
  }

  if (['leopardstown', 'curragh', 'fairyhouse', 'punchestown', 'galway', 'cork', 'limerick',
       'dundalk', 'down royal'].some(r => normalized.includes(r))) {
    return 'IRELAND'
  }

  if (['churchill downs', 'pimlico', 'belmont', 'saratoga', 'santa anita', 'del mar',
       'gulfstream', 'keeneland', 'oaklawn'].some(r => normalized.includes(r))) {
    return 'USA'
  }

  if (['flemington', 'caulfield', 'moonee valley', 'randwick', 'rosehill', 'eagle farm',
       'doomben', 'gold coast'].some(r => normalized.includes(r))) {
    return 'AUSTRALIA'
  }

  return 'UNKNOWN'
}

/**
 * Detect city from racecourse name
 */
function detectCity(racecourse: string): string {
  const cityMap: Record<string, string> = {
    'meydan': 'Dubai',
    'jebel ali': 'Dubai',
    'abu dhabi': 'Abu Dhabi',
    'sharjah': 'Sharjah',
    'al ain': 'Al Ain',
    'newcastle': 'Newcastle',
    'wolverhampton': 'Wolverhampton',
    'kempton': 'Kempton',
    'lingfield': 'Lingfield',
    'southwell': 'Southwell',
    'leicester': 'Leicester',
    'catterick': 'Catterick',
    'ascot': 'Ascot',
    'york': 'York'
  }

  const normalized = racecourse.toLowerCase()
  for (const [key, city] of Object.entries(cityMap)) {
    if (normalized.includes(key)) {
      return city
    }
  }

  return racecourse
}

/**
 * Check if there are races today at a specific racecourse
 */
export async function checkTodayRaces(racecourse: string): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0]
  const data = await searchRaceData(racecourse, today)
  return data !== null && data.sources.length > 0
}
