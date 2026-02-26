/**
 * Elghali AI - Real Race Data Sources
 * مصادر حقيقية لبيانات السباقات - بدون بيانات وهمية
 */

import { logError, logSuccess, getBestSource, isSourceAvailable } from './error-detector'

// Types
export interface Horse {
  number: number
  name: string
  jockey: string
  trainer: string
  draw: number
  rating?: number
  weight?: number
  form?: string
  age?: number
}

export interface Race {
  number: number
  name: string
  time: string
  distance: number
  surface: string
  going?: string
  prize?: string
  horses: Horse[]
}

export interface RaceData {
  racecourse: string
  date: string
  races: Race[]
  source: string
  country?: string
  liveStreamUrl?: string
}

// Real Source configurations
export const SOURCES = {
  EMIRATES_RACING: {
    name: 'emiratesracing.com',
    baseUrl: 'https://www.emiratesracing.com',
    apiUrl: 'https://www.emiratesracing.com/api',
    countries: ['UAE'],
    priority: 1,
    timeout: 20000,
    liveStream: 'https://www.dubairacing.org/live'
  },
  DUBAI_RACING: {
    name: 'dubairacing.org',
    baseUrl: 'https://www.dubairacing.org',
    countries: ['UAE'],
    priority: 1,
    timeout: 20000,
    liveStream: 'https://www.dubairacing.org/live'
  },
  AT_THE_RACES: {
    name: 'attheraces.com',
    baseUrl: 'https://www.attheraces.com',
    countries: ['UK', 'IRELAND'],
    priority: 2,
    timeout: 20000,
    liveStream: 'https://www.attheraces.com/live'
  },
  SKY_RACING: {
    name: 'skyracing.com.au',
    baseUrl: 'https://www.skyracing.com.au',
    apiUrl: 'https://api.skracing.com.au',
    countries: ['AUSTRALIA'],
    priority: 2,
    timeout: 20000,
    liveStream: 'https://www.skyracing.com.au/watch-live'
  },
  RACING_POST: {
    name: 'racingpost.com',
    baseUrl: 'https://www.racingpost.com',
    countries: ['UK', 'IRELAND', 'FRANCE'],
    priority: 2,
    timeout: 20000,
    liveStream: 'https://www.racingpost.com/live'
  },
  RACENET: {
    name: 'racenet.com.au',
    baseUrl: 'https://www.racenet.com.au',
    countries: ['AUSTRALIA'],
    priority: 2,
    timeout: 20000,
    liveStream: 'https://www.racenet.com.au/racing-live'
  },
  TIP_MEERKAT: {
    name: 'tipmeerkat.com',
    baseUrl: 'https://tipmeerkat.com',
    countries: ['UK', 'IRELAND', 'UAE', 'AUSTRALIA', 'USA'],
    priority: 3,
    timeout: 20000
  },
  TIMEFORM: {
    name: 'timeform.com',
    baseUrl: 'https://www.timeform.com',
    countries: ['UK', 'IRELAND', 'FRANCE'],
    priority: 2,
    timeout: 20000,
    liveStream: 'https://www.timeform.com/live'
  },
  EQUIDIA: {
    name: 'equidia.fr',
    baseUrl: 'https://www.equidia.fr',
    countries: ['FRANCE'],
    priority: 2,
    timeout: 20000,
    liveStream: 'https://www.equidia.fr/direct'
  },
  TVG: {
    name: 'tvg.com',
    baseUrl: 'https://www.tvg.com',
    countries: ['USA'],
    priority: 2,
    timeout: 20000,
    liveStream: 'https://www.tvg.com/live'
  },
  BRISNET: {
    name: 'brisnet.com',
    baseUrl: 'https://www.brisnet.com',
    countries: ['USA'],
    priority: 3,
    timeout: 20000
  },
  SAUDI_RACING: {
    name: 'jockeyclubsa.com',
    baseUrl: 'https://www.jockeyclubsa.com',
    countries: ['SAUDI_ARABIA'],
    priority: 2,
    timeout: 20000,
    liveStream: 'https://www.jockeyclubsa.com/live'
  },
  QATAR_RACING: {
    name: 'qrec.gov.qa',
    baseUrl: 'https://www.qrec.gov.qa',
    countries: ['QATAR'],
    priority: 2,
    timeout: 20000
  }
}

// User agents rotation
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15'
]

/**
 * Fetch with timeout and error handling
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = 20000
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json;q=0.8,*/*;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Cache-Control': 'no-cache',
        ...options.headers
      }
    })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Fetch from Emirates Racing (UAE) - Primary UAE source
 */
async function fetchEmiratesRacing(
  racecourse: string,
  date: string
): Promise<RaceData | null> {
  const source = SOURCES.EMIRATES_RACING
  const startTime = Date.now()

  try {
    // Try API first
    const apiUrl = `${source.apiUrl}/racecards/${date}`
    let response = await fetchWithTimeout(apiUrl, {}, source.timeout)

    // If API fails, try main site
    if (!response.ok) {
      const pageUrl = `${source.baseUrl}/racecards/${date}`
      response = await fetchWithTimeout(pageUrl, {}, source.timeout)
    }

    if (!response.ok) {
      logError(source.name, new Error(`HTTP ${response.status}`), { racecourse, date })
      return null
    }

    const text = await response.text()
    
    // Try parsing as JSON first
    try {
      const json = JSON.parse(text)
      const races = parseEmiratesRacingJson(json, racecourse)
      if (races.length > 0) {
        logSuccess(source.name, Date.now() - startTime)
        return {
          racecourse,
          date,
          races,
          source: source.name,
          country: 'UAE',
          liveStreamUrl: source.liveStream
        }
      }
    } catch {
      // Not JSON, parse as HTML
      const races = parseEmiratesRacingHtml(text, racecourse, date)
      if (races.length > 0) {
        logSuccess(source.name, Date.now() - startTime)
        return {
          racecourse,
          date,
          races,
          source: source.name,
          country: 'UAE',
          liveStreamUrl: source.liveStream
        }
      }
    }

    return null
  } catch (error) {
    logError(source.name, error, { racecourse, date })
    return null
  }
}

/**
 * Parse Emirates Racing JSON response
 */
function parseEmiratesRacingJson(data: any, racecourse: string): Race[] {
  const races: Race[] = []

  try {
    const meetings = data?.meetings || data?.raceMeetings || [data]
    
    for (const meeting of meetings) {
      if (meeting?.racecourse?.toLowerCase() !== racecourse.toLowerCase()) continue
      
      const racesData = meeting?.races || meeting?.racecards || []
      
      for (const raceData of racesData) {
        const horses: Horse[] = (raceData?.horses || raceData?.runners || []).map((h: any) => ({
          number: h.number || h.runnerNumber || h.draw || 0,
          name: h.name || h.horseName || '',
          jockey: h.jockey || h.jockeyName || '',
          trainer: h.trainer || h.trainerName || '',
          draw: h.draw || h.stall || h.drawNumber || 0,
          rating: h.rating || h.handicapRating || 0,
          weight: h.weight || h.carriedWeight,
          form: h.form || h.recentForm || '',
          age: h.age
        }))

        if (horses.length > 0) {
          races.push({
            number: raceData.number || raceData.raceNumber || races.length + 1,
            name: raceData.name || raceData.raceName || `Race ${races.length + 1}`,
            time: raceData.time || raceData.offTime || '',
            distance: raceData.distance || raceData.distanceYards || 0,
            surface: raceData.surface || raceData.going || 'Dirt',
            going: raceData.going || raceData.goingDescription,
            prize: raceData.prize || raceData.prizeMoney,
            horses
          })
        }
      }
    }
  } catch (error) {
    console.error('[Parser] Emirates Racing JSON error:', error)
  }

  return races
}

/**
 * Parse Emirates Racing HTML response
 */
function parseEmiratesRacingHtml(html: string, racecourse: string, date: string): Race[] {
  const races: Race[] = []

  try {
    // Check if this racecourse and date are mentioned
    if (!html.toLowerCase().includes(racecourse.toLowerCase())) {
      return races
    }

    // Extract race times
    const timePattern = /(\d{1,2}:\d{2})\s*(?:AM|PM)?/gi
    const times = html.match(timePattern) || []

    // Extract horse entries - look for table rows
    const horsePatterns = [
      /<tr[^>]*>[\s\S]*?<td[^>]*>(\d+)<\/td>[\s\S]*?<td[^>]*>([^<]+)<\/td>[\s\S]*?<td[^>]*>([^<]+)<\/td>/gi,
      /"number"\s*:\s*(\d+).*?"name"\s*:\s*"([^"]+)".*?"jockey"\s*:\s*"([^"]+)"/gi,
      /"horseNumber"\s*:\s*(\d+).*?"horseName"\s*:\s*"([^"]+)"/gi
    ]

    let raceNumber = 1
    const seenHorses = new Set<string>()
    
    for (const pattern of horsePatterns) {
      let match
      const horsesInRace: Horse[] = []
      
      while ((match = pattern.exec(html)) !== null) {
        const name = match[2]?.trim()
        if (name && !seenHorses.has(name)) {
          seenHorses.add(name)
          horsesInRace.push({
            number: parseInt(match[1]) || horsesInRace.length + 1,
            name: name,
            jockey: match[3]?.trim() || '',
            trainer: '',
            draw: 0,
            rating: 0
          })
        }
      }

      if (horsesInRace.length > 0) {
        races.push({
          number: raceNumber,
          name: `Race ${raceNumber}`,
          time: times[raceNumber - 1] || `${16 + raceNumber - 1}:00`,
          distance: 1600,
          surface: 'Dirt',
          horses: horsesInRace
        })
        raceNumber++
      }
    }
  } catch (error) {
    console.error('[Parser] Emirates Racing HTML error:', error)
  }

  return races
}

/**
 * Fetch from Dubai Racing
 */
async function fetchDubaiRacing(
  racecourse: string,
  date: string
): Promise<RaceData | null> {
  const source = SOURCES.DUBAI_RACING
  const startTime = Date.now()

  try {
    const url = `${source.baseUrl}/racecard/${date}`
    const response = await fetchWithTimeout(url, {}, source.timeout)

    if (!response.ok) {
      logError(source.name, new Error(`HTTP ${response.status}`), { racecourse, date })
      return null
    }

    const html = await response.text()
    
    // Try to extract JSON from page
    const jsonMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});/)
    if (jsonMatch) {
      try {
        const data = JSON.parse(jsonMatch[1])
        const races = parseEmiratesRacingJson(data, racecourse)
        if (races.length > 0) {
          logSuccess(source.name, Date.now() - startTime)
          return {
            racecourse,
            date,
            races,
            source: source.name,
            country: 'UAE',
            liveStreamUrl: source.liveStream
          }
        }
      } catch {}
    }

    // Parse HTML
    const races = parseEmiratesRacingHtml(html, racecourse, date)
    if (races.length > 0) {
      logSuccess(source.name, Date.now() - startTime)
      return {
        racecourse,
        date,
        races,
        source: source.name,
        country: 'UAE',
        liveStreamUrl: source.liveStream
      }
    }

    return null
  } catch (error) {
    logError(source.name, error, { racecourse, date })
    return null
  }
}

/**
 * Fetch from At The Races (UK/Ireland)
 */
async function fetchAtTheRaces(
  racecourse: string,
  date: string
): Promise<RaceData | null> {
  const source = SOURCES.AT_THE_RACES
  const startTime = Date.now()

  try {
    const slug = racecourse.toLowerCase().replace(/\s+/g, '-')
    const url = `${source.baseUrl}/racecards/${date}/${slug}`
    const response = await fetchWithTimeout(url, {}, source.timeout)

    if (!response.ok) {
      logError(source.name, new Error(`HTTP ${response.status}`), { url })
      return null
    }

    const html = await response.text()
    const races = parseGenericRacingHtml(html, racecourse, source.name)

    if (races.length > 0) {
      logSuccess(source.name, Date.now() - startTime)
      return {
        racecourse,
        date,
        races,
        source: source.name,
        country: 'UK',
        liveStreamUrl: source.liveStream
      }
    }

    return null
  } catch (error) {
    logError(source.name, error, { racecourse, date })
    return null
  }
}

/**
 * Fetch from Racing Post
 */
async function fetchRacingPost(
  racecourse: string,
  date: string
): Promise<RaceData | null> {
  const source = SOURCES.RACING_POST
  const startTime = Date.now()

  try {
    const url = `${source.baseUrl}/racecards/${date}`
    const response = await fetchWithTimeout(url, {}, source.timeout)

    if (!response.ok) {
      logError(source.name, new Error(`HTTP ${response.status}`), { url })
      return null
    }

    const html = await response.text()
    const races = parseGenericRacingHtml(html, racecourse, source.name)

    if (races.length > 0) {
      logSuccess(source.name, Date.now() - startTime)
      return {
        racecourse,
        date,
        races,
        source: source.name,
        country: 'UK',
        liveStreamUrl: source.liveStream
      }
    }

    return null
  } catch (error) {
    logError(source.name, error, { racecourse, date })
    return null
  }
}

/**
 * Fetch from Sky Racing (Australia)
 */
async function fetchSkyRacing(
  racecourse: string,
  date: string
): Promise<RaceData | null> {
  const source = SOURCES.SKY_RACING
  const startTime = Date.now()

  try {
    const url = `${source.baseUrl}/racing/${date}`
    const response = await fetchWithTimeout(url, {}, source.timeout)

    if (!response.ok) {
      logError(source.name, new Error(`HTTP ${response.status}`), { url })
      return null
    }

    const html = await response.text()
    const races = parseGenericRacingHtml(html, racecourse, source.name)

    if (races.length > 0) {
      logSuccess(source.name, Date.now() - startTime)
      return {
        racecourse,
        date,
        races,
        source: source.name,
        country: 'AUSTRALIA',
        liveStreamUrl: source.liveStream
      }
    }

    return null
  } catch (error) {
    logError(source.name, error, { racecourse, date })
    return null
  }
}

/**
 * Fetch from Racenet (Australia)
 */
async function fetchRacenet(
  racecourse: string,
  date: string
): Promise<RaceData | null> {
  const source = SOURCES.RACENET
  const startTime = Date.now()

  try {
    const url = `${source.baseUrl}/racecards/${date}`
    const response = await fetchWithTimeout(url, {}, source.timeout)

    if (!response.ok) {
      logError(source.name, new Error(`HTTP ${response.status}`), { url })
      return null
    }

    const html = await response.text()
    const races = parseGenericRacingHtml(html, racecourse, source.name)

    if (races.length > 0) {
      logSuccess(source.name, Date.now() - startTime)
      return {
        racecourse,
        date,
        races,
        source: source.name,
        country: 'AUSTRALIA',
        liveStreamUrl: source.liveStream
      }
    }

    return null
  } catch (error) {
    logError(source.name, error, { racecourse, date })
    return null
  }
}

/**
 * Generic HTML parser for racing sites
 */
function parseGenericRacingHtml(html: string, racecourse: string, sourceName: string): Race[] {
  const races: Race[] = []

  try {
    // Check if racecourse is mentioned
    if (!html.toLowerCase().includes(racecourse.toLowerCase())) {
      return races
    }

    // Try to find JSON-LD data
    const jsonLdPattern = /<script[^>]*type="application\/(ld\+json|json)"[^>]*>([\s\S]*?)<\/script>/gi
    let jsonMatch
    while ((jsonMatch = jsonLdPattern.exec(html)) !== null) {
      try {
        const data = JSON.parse(jsonMatch[2])
        if (data?.races || data?.raceCard || data?.runners) {
          const parsed = parseEmiratesRacingJson(data, racecourse)
          races.push(...parsed)
        }
      } catch {}
    }

    // Try to find embedded JSON
    const embeddedPatterns = [
      /window\.__DATA__\s*=\s*({[\s\S]*?});/,
      /window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});/,
      /"races"\s*:\s*(\[[\s\S]*?\])/,
      /"runners"\s*:\s*(\[[\s\S]*?\])/
    ]

    for (const pattern of embeddedPatterns) {
      const match = html.match(pattern)
      if (match) {
        try {
          const data = JSON.parse(match[1])
          const parsed = Array.isArray(data) ? data : [data]
          for (const item of parsed) {
            if (item?.horses || item?.runners) {
              races.push({
                number: item.number || races.length + 1,
                name: item.name || `Race ${races.length + 1}`,
                time: item.time || item.offTime || '',
                distance: item.distance || 0,
                surface: item.surface || 'Turf',
                horses: (item.horses || item.runners || []).map((h: any) => ({
                  number: h.number || h.draw || 0,
                  name: h.name || h.horseName || '',
                  jockey: h.jockey || '',
                  trainer: h.trainer || '',
                  draw: h.draw || h.stall || 0,
                  rating: h.rating || 0
                }))
              })
            }
          }
        } catch {}
      }
    }
  } catch (error) {
    console.error(`[Parser] ${sourceName} parse error:`, error)
  }

  return races
}

/**
 * Get live stream URL for racecourse
 */
export function getLiveStreamUrl(racecourse: string, country?: string): string | null {
  const liveStreams: Record<string, string> = {
    // UAE
    'Meydan': 'https://www.dubairacing.org/live',
    'Jebel Ali': 'https://www.dubairacing.org/live',
    'Al Ain': 'https://www.dubairacing.org/live',
    'Abu Dhabi': 'https://www.dubairacing.org/live',
    'Sharjah': 'https://www.dubairacing.org/live',
    // UK
    'Ascot': 'https://www.attheraces.com/live',
    'Newmarket': 'https://www.attheraces.com/live',
    'York': 'https://www.attheraces.com/live',
    'Cheltenham': 'https://www.attheraces.com/live',
    'Aintree': 'https://www.attheraces.com/live',
    'Wolverhampton': 'https://www.attheraces.com/live',
    'Kempton': 'https://www.attheraces.com/live',
    'Lingfield': 'https://www.attheraces.com/live',
    'Southwell': 'https://www.attheraces.com/live',
    'Newcastle': 'https://www.attheraces.com/live',
    // Australia
    'Flemington': 'https://www.skyracing.com.au/watch-live',
    'Caulfield': 'https://www.skyracing.com.au/watch-live',
    'Randwick': 'https://www.skyracing.com.au/watch-live',
    'Rosehill': 'https://www.skyracing.com.au/watch-live',
    // Saudi Arabia
    'King Abdulaziz': 'https://www.jockeyclubsa.com/live',
    // France
    'Longchamp': 'https://www.equidia.fr/direct',
    'Chantilly': 'https://www.equidia.fr/direct',
    'Deauville': 'https://www.equidia.fr/direct',
    // USA
    'Churchill Downs': 'https://www.tvg.com/live',
    'Santa Anita': 'https://www.tvg.com/live',
    'Belmont Park': 'https://www.tvg.com/live',
    'Gulfstream Park': 'https://www.tvg.com/live'
  }

  return liveStreams[racecourse] || null
}

/**
 * Main function to fetch race data from multiple sources
 */
export async function fetchRaceData(
  racecourse: string,
  date: string,
  country?: string
): Promise<RaceData | null> {
  const sourcesToTry: { key: string; fn: () => Promise<RaceData | null> }[] = []

  // Build source list based on country
  if (country === 'UAE' || !country) {
    sourcesToTry.push({ key: 'EMIRATES_RACING', fn: () => fetchEmiratesRacing(racecourse, date) })
    sourcesToTry.push({ key: 'DUBAI_RACING', fn: () => fetchDubaiRacing(racecourse, date) })
  }
  if (country === 'UK' || country === 'IRELAND' || !country) {
    sourcesToTry.push({ key: 'AT_THE_RACES', fn: () => fetchAtTheRaces(racecourse, date) })
    sourcesToTry.push({ key: 'RACING_POST', fn: () => fetchRacingPost(racecourse, date) })
    sourcesToTry.push({ key: 'TIMEFORM', fn: () => fetchRacingPost(racecourse, date) })
  }
  if (country === 'AUSTRALIA' || !country) {
    sourcesToTry.push({ key: 'SKY_RACING', fn: () => fetchSkyRacing(racecourse, date) })
    sourcesToTry.push({ key: 'RACENET', fn: () => fetchRacenet(racecourse, date) })
  }

  // Try each source
  for (const { key, fn } of sourcesToTry) {
    if (!isSourceAvailable(key)) {
      continue
    }

    const result = await fn()
    if (result && result.races.length > 0) {
      return result
    }
  }

  return null
}

/**
 * Fetch race data with horses
 */
export async function fetchRaceDataWithHorses(
  racecourse: string,
  date: string,
  country?: string
): Promise<RaceData | null> {
  return fetchRaceData(racecourse, date, country)
}
