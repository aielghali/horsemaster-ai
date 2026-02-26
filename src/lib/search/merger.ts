/**
 * Search Results Merger
 * Combines and deduplicates results from multiple sources
 */

import { SearchResult } from './duckduckgo'
import { ScrapedContent, extractTextFromHtml } from './scraper'

export interface MergedResult {
  sources: string[]
  urls: string[]
  content: string
  snippets: string[]
}

/**
 * Merge search results and scraped content
 */
export function mergeResults(
  searchResults: SearchResult[],
  scrapedContent: ScrapedContent[]
): MergedResult {
  const sources: string[] = []
  const urls: string[] = []
  const snippets: string[] = []
  let content = ''

  // Add search results
  for (const result of searchResults) {
    if (!sources.includes(result.hostname)) {
      sources.push(result.hostname)
    }
    if (!urls.includes(result.url)) {
      urls.push(result.url)
    }
    if (result.snippet && !snippets.includes(result.snippet)) {
      snippets.push(result.snippet)
    }
  }

  // Add scraped content
  for (const scraped of scrapedContent) {
    if (scraped.success && scraped.content) {
      sources.push(scraped.source)
      urls.push(scraped.url)

      // Extract clean text from HTML
      const cleanText = extractTextFromHtml(scraped.content)
      content += `\n\n--- ${scraped.source} ---\n${cleanText}`
    }
  }

  return {
    sources,
    urls,
    content: content.trim(),
    snippets
  }
}

/**
 * Build context string for AI analysis
 */
export function buildContextForAI(merged: MergedResult): string {
  let context = ''

  // Add snippets first (usually most relevant)
  if (merged.snippets.length > 0) {
    context += '=== Search Results ===\n'
    for (let i = 0; i < merged.snippets.length; i++) {
      context += `\n[${i + 1}] ${merged.snippets[i]}`
      if (merged.urls[i]) {
        context += `\n    URL: ${merged.urls[i]}`
      }
    }
  }

  // Add scraped content
  if (merged.content) {
    context += '\n\n=== Page Content ===\n'
    context += merged.content.substring(0, 20000) // Limit for AI
  }

  return context
}

/**
 * Prioritize sources by relevance
 */
export function prioritizeSources(
  results: SearchResult[],
  racecourse: string
): SearchResult[] {
  const normalized = racecourse.toLowerCase()

  // Source priority scores
  const prioritySources: Record<string, number> = {
    'emiratesracing.com': 100,
    'racingpost.com': 90,
    'attheraces.com': 85,
    'timeform.com': 80,
    'sportinglife.com': 75,
    'skysports.com': 60,
    'bbc.co.uk': 50,
  }

  // Score each result
  const scored = results.map(result => {
    let score = 0

    // Base score from source priority
    for (const [domain, priority] of Object.entries(prioritySources)) {
      if (result.hostname.includes(domain)) {
        score = priority
        break
      }
    }

    // Boost if racecourse name is in title or snippet
    if (result.title.toLowerCase().includes(normalized)) {
      score += 20
    }
    if (result.snippet.toLowerCase().includes(normalized)) {
      score += 15
    }

    // Boost if contains racing keywords
    const keywords = ['racecard', 'entries', 'runners', 'jockey', 'trainer']
    for (const keyword of keywords) {
      if (result.snippet.toLowerCase().includes(keyword)) {
        score += 5
      }
    }

    return { ...result, score }
  })

  // Sort by score descending
  return scored.sort((a, b) => (b as any).score - (a as any).score)
}
