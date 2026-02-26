/**
 * Unified Search Module - Hybrid Search v1.0
 * Combines DuckDuckGo + Direct Scraping
 * No external dependencies, works on any environment
 */

import { searchWithDuckDuckGo, SearchResult } from './duckduckgo'
import { scrapeRaceData, ScrapedContent } from './scraper'
import { mergeResults, buildContextForAI, prioritizeSources } from './merger'

export interface HybridSearchResult {
  success: boolean
  sources: string[]
  urls: string[]
  context: string
  searchResults: SearchResult[]
  scrapedContent: ScrapedContent[]
}

/**
 * Perform hybrid search for horse racing data
 * 1. Search with DuckDuckGo
 * 2. Scrape relevant sources directly
 * 3. Merge and prioritize results
 */
export async function hybridSearch(
  racecourse: string,
  date: string,
  options: {
    maxSearchResults?: number
    enableScraping?: boolean
  } = {}
): Promise<HybridSearchResult> {
  const { maxSearchResults = 10, enableScraping = true } = options

  console.log(`[HybridSearch] Starting search for ${racecourse} on ${date}`)

  // Step 1: DuckDuckGo Search
  const searchQueries = [
    `${racecourse} horse racing racecard ${date} runners jockeys`,
    `${racecourse} race meeting ${date} entries declarations`,
    `site:emiratesracing.com ${racecourse} ${date}`,
    `site:racingpost.com ${racecourse} ${date}`,
  ]

  let allSearchResults: SearchResult[] = []

  // Run searches in parallel
  const searchPromises = searchQueries.slice(0, 2).map(query =>
    searchWithDuckDuckGo(query, maxSearchResults)
  )

  const searchResultsArray = await Promise.all(searchPromises)

  for (const results of searchResultsArray) {
    allSearchResults.push(...results)
  }

  // Deduplicate by URL
  const seenUrls = new Set<string>()
  allSearchResults = allSearchResults.filter(result => {
    if (seenUrls.has(result.url)) return false
    seenUrls.add(result.url)
    return true
  })

  // Prioritize results
  allSearchResults = prioritizeSources(allSearchResults, racecourse)
  allSearchResults = allSearchResults.slice(0, maxSearchResults)

  console.log(`[HybridSearch] Found ${allSearchResults.length} search results`)

  // Step 2: Direct Scraping
  let scrapedContent: ScrapedContent[] = []

  if (enableScraping) {
    try {
      scrapedContent = await scrapeRaceData(racecourse, date)
      console.log(`[HybridSearch] Scraped ${scrapedContent.length} sources`)
    } catch (error) {
      console.error(`[HybridSearch] Scraping error:`, error)
    }
  }

  // Step 3: Merge Results
  const merged = mergeResults(allSearchResults, scrapedContent)
  const context = buildContextForAI(merged)

  const success = allSearchResults.length > 0 || scrapedContent.some(s => s.success)

  console.log(`[HybridSearch] Complete: ${success ? 'SUCCESS' : 'NO RESULTS'}`)
  console.log(`[HybridSearch] Sources: ${merged.sources.join(', ')}`)

  return {
    success,
    sources: merged.sources,
    urls: merged.urls,
    context,
    searchResults: allSearchResults,
    scrapedContent
  }
}

/**
 * Quick search - DuckDuckGo only (faster)
 */
export async function quickSearch(query: string, maxResults: number = 10): Promise<SearchResult[]> {
  return searchWithDuckDuckGo(query, maxResults)
}

// Export types and functions
export type { SearchResult, ScrapedContent }
export { searchWithDuckDuckGo, scrapeRaceData, mergeResults }
