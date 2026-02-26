/**
 * Direct Web Scraper for Racing Sites
 * Fetches race data directly from official sources
 */

export interface ScrapedContent {
  url: string
  content: string
  source: string
  success: boolean
  error?: string
}

// Free CORS proxies for bypassing blocks
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
]

// Racing sources with their URL patterns
const RACING_SOURCES = {
  // UAE
  emiratesracing: {
    baseUrl: 'https://www.emiratesracing.com',
    racecardUrl: (date: string) => `https://www.emiratesracing.com/racing/racecards?date=${date}`,
    resultsUrl: (date: string) => `https://www.emiratesracing.com/racing/results?date=${date}`,
    name: 'Emirates Racing Authority'
  },
  // UK
  racingpost: {
    baseUrl: 'https://www.racingpost.com',
    racecardUrl: (course: string, date: string) => `https://www.racingpost.com/racecards/${course}/${date}`,
    name: 'Racing Post'
  },
  attheraces: {
    baseUrl: 'https://www.attheraces.com',
    racecardUrl: (course: string) => `https://www.attheraces.com/racecards/${course}`,
    name: 'At The Races'
  },
  sportinglife: {
    baseUrl: 'https://www.sportinglife.com',
    racecardUrl: (date: string, course: string) => `https://www.sportinglife.com/racing/racecards/${date}/${course}`,
    name: 'Sporting Life'
  },
  timeform: {
    baseUrl: 'https://www.timeform.com',
    racecardUrl: (course: string, date: string) => `https://www.timeform.com/horse-racing/racecards/${course}/${date}`,
    name: 'Timeform'
  }
}

// User agents for rotation
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
]

/**
 * Fetch URL with retries and CORS proxy fallback
 */
async function fetchWithRetry(url: string, retries: number = 2): Promise<string | null> {
  const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]

  // Try direct fetch first
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(15000)
      })

      if (response.ok) {
        return await response.text()
      }
    } catch (error) {
      // Direct fetch failed, will try CORS proxy
    }
  }

  // Try with CORS proxies
  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = `${proxy}${encodeURIComponent(url)}`
      const response = await fetch(proxyUrl, {
        signal: AbortSignal.timeout(20000)
      })

      if (response.ok) {
        return await response.text()
      }
    } catch (error) {
      continue
    }
  }

  return null
}

/**
 * Scrape Emirates Racing (UAE)
 */
export async function scrapeEmiratesRacing(date: string): Promise<ScrapedContent> {
  const url = RACING_SOURCES.emiratesracing.racecardUrl(date)
  console.log(`[Scraper] Emirates Racing: ${url}`)

  try {
    const content = await fetchWithRetry(url)

    if (content) {
      return {
        url,
        content: content.substring(0, 50000), // Limit content size
        source: 'Emirates Racing Authority',
        success: true
      }
    }

    return {
      url,
      content: '',
      source: 'Emirates Racing Authority',
      success: false,
      error: 'Failed to fetch content'
    }
  } catch (error: any) {
    return {
      url,
      content: '',
      source: 'Emirates Racing Authority',
      success: false,
      error: error.message
    }
  }
}

/**
 * Scrape Racing Post (UK/International)
 */
export async function scrapeRacingPost(course: string, date: string): Promise<ScrapedContent> {
  const url = RACING_SOURCES.racingpost.racecardUrl(course.toLowerCase().replace(/\s+/g, '-'), date)
  console.log(`[Scraper] Racing Post: ${url}`)

  try {
    const content = await fetchWithRetry(url)

    if (content) {
      return {
        url,
        content: content.substring(0, 50000),
        source: 'Racing Post',
        success: true
      }
    }

    return {
      url,
      content: '',
      source: 'Racing Post',
      success: false,
      error: 'Failed to fetch content'
    }
  } catch (error: any) {
    return {
      url,
      content: '',
      source: 'Racing Post',
      success: false,
      error: error.message
    }
  }
}

/**
 * Scrape At The Races
 */
export async function scrapeAtTheRaces(course: string): Promise<ScrapedContent> {
  const url = RACING_SOURCES.attheraces.racecardUrl(course.toLowerCase().replace(/\s+/g, '-'))
  console.log(`[Scraper] At The Races: ${url}`)

  try {
    const content = await fetchWithRetry(url)

    if (content) {
      return {
        url,
        content: content.substring(0, 50000),
        source: 'At The Races',
        success: true
      }
    }

    return {
      url,
      content: '',
      source: 'At The Races',
      success: false,
      error: 'Failed to fetch content'
    }
  } catch (error: any) {
    return {
      url,
      content: '',
      source: 'At The Races',
      success: false,
      error: error.message
    }
  }
}

/**
 * Scrape Sporting Life
 */
export async function scrapeSportingLife(date: string, course: string): Promise<ScrapedContent> {
  const url = RACING_SOURCES.sportinglife.racecardUrl(date, course.toLowerCase().replace(/\s+/g, '-'))
  console.log(`[Scraper] Sporting Life: ${url}`)

  try {
    const content = await fetchWithRetry(url)

    if (content) {
      return {
        url,
        content: content.substring(0, 50000),
        source: 'Sporting Life',
        success: true
      }
    }

    return {
      url,
      content: '',
      source: 'Sporting Life',
      success: false,
      error: 'Failed to fetch content'
    }
  } catch (error: any) {
    return {
      url,
      content: '',
      source: 'Sporting Life',
      success: false,
      error: error.message
    }
  }
}

/**
 * Determine best source based on racecourse
 */
function getSourceForRacecourse(racecourse: string): 'uae' | 'uk' {
  const uaeCourses = ['meydan', 'jebel ali', 'al ain', 'abu dhabi', 'sharjah']
  const normalized = racecourse.toLowerCase()

  if (uaeCourses.some(c => normalized.includes(c))) {
    return 'uae'
  }
  return 'uk'
}

/**
 * Scrape from best sources for a racecourse
 */
export async function scrapeRaceData(racecourse: string, date: string): Promise<ScrapedContent[]> {
  console.log(`[Scraper] Scraping ${racecourse} for ${date}`)

  const source = getSourceForRacecourse(racecourse)
  const results: ScrapedContent[] = []

  if (source === 'uae') {
    // Try Emirates Racing first
    const emiratesResult = await scrapeEmiratesRacing(date)
    if (emiratesResult.success) {
      results.push(emiratesResult)
    }
  } else {
    // Try UK sources in parallel
    const [racingPostResult, attheracesResult, sportingLifeResult] = await Promise.all([
      scrapeRacingPost(racecourse, date),
      scrapeAtTheRaces(racecourse),
      scrapeSportingLife(date, racecourse)
    ])

    if (racingPostResult.success) results.push(racingPostResult)
    if (attheracesResult.success) results.push(attheracesResult)
    if (sportingLifeResult.success) results.push(sportingLifeResult)
  }

  console.log(`[Scraper] Scraped ${results.length} sources successfully`)
  return results
}

/**
 * Extract text content from HTML for AI processing
 */
export function extractTextFromHtml(html: string): string {
  // Remove scripts and styles
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')

  // Replace common HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')

  // Remove remaining HTML tags
  text = text.replace(/<[^>]*>/g, ' ')

  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim()

  return text
}
