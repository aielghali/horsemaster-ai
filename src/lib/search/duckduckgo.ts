/**
 * DuckDuckGo Search - Free API
 * No API key required, works on any environment
 */

export interface SearchResult {
  url: string
  title: string
  snippet: string
  hostname: string
}

/**
 * Search using DuckDuckGo Instant Answer API
 * Free and no authentication required
 */
export async function duckDuckGoSearch(query: string, maxResults: number = 10): Promise<SearchResult[]> {
  console.log(`[DuckDuckGo] Searching: ${query}`)

  try {
    // DuckDuckGo Instant Answer API
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: AbortSignal.timeout(15000)
    })

    if (!response.ok) {
      console.log(`[DuckDuckGo] HTTP error: ${response.status}`)
      return []
    }

    const data = await response.json()
    const results: SearchResult[] = []

    // Extract from RelatedTopics
    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      for (const topic of data.RelatedTopics.slice(0, maxResults)) {
        if (topic.FirstURL && topic.Text) {
          try {
            const urlObj = new URL(topic.FirstURL)
            results.push({
              url: topic.FirstURL,
              title: topic.Text.substring(0, 100),
              snippet: topic.Text,
              hostname: urlObj.hostname
            })
          } catch {
            // Skip invalid URLs
          }
        }
        // Handle nested topics
        if (topic.Topics && Array.isArray(topic.Topics)) {
          for (const subTopic of topic.Topics.slice(0, 5)) {
            if (subTopic.FirstURL && subTopic.Text) {
              try {
                const urlObj = new URL(subTopic.FirstURL)
                results.push({
                  url: subTopic.FirstURL,
                  title: subTopic.Text.substring(0, 100),
                  snippet: subTopic.Text,
                  hostname: urlObj.hostname
                })
              } catch {
                // Skip invalid URLs
              }
            }
          }
        }
      }
    }

    // Extract from Abstract (if available)
    if (data.Abstract && data.AbstractURL) {
      try {
        const urlObj = new URL(data.AbstractURL)
        results.unshift({
          url: data.AbstractURL,
          title: data.Heading || 'Abstract',
          snippet: data.Abstract,
          hostname: urlObj.hostname
        })
      } catch {
        // Skip invalid URLs
      }
    }

    // Extract from Results (if available)
    if (data.Results && Array.isArray(data.Results)) {
      for (const result of data.Results.slice(0, 5)) {
        if (result.FirstURL && result.Text) {
          try {
            const urlObj = new URL(result.FirstURL)
            results.push({
              url: result.FirstURL,
              title: result.Text,
              snippet: result.Text,
              hostname: urlObj.hostname
            })
          } catch {
            // Skip invalid URLs
          }
        }
      }
    }

    console.log(`[DuckDuckGo] Found ${results.length} results`)
    return results.slice(0, maxResults)

  } catch (error: any) {
    console.error(`[DuckDuckGo] Error:`, error.message)
    return []
  }
}

/**
 * Alternative: Use DuckDuckGo HTML search for more results
 * This scrapes the HTML search page for better results
 */
export async function duckDuckGoHtmlSearch(query: string, maxResults: number = 10): Promise<SearchResult[]> {
  console.log(`[DuckDuckGo HTML] Searching: ${query}`)

  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      signal: AbortSignal.timeout(20000)
    })

    if (!response.ok) {
      console.log(`[DuckDuckGo HTML] HTTP error: ${response.status}`)
      return []
    }

    const html = await response.text()
    const results: SearchResult[] = []

    // Parse HTML to extract results
    // Pattern for result links
    const linkPattern = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g
    const snippetPattern = /<a[^>]*class="result__snippet"[^>]*>([^<]*)<\/a>/g

    let match
    const urls = new Set<string>()

    while ((match = linkPattern.exec(html)) !== null && results.length < maxResults) {
      const resultUrl = match[1]
      const title = match[2].trim()

      // Skip ads and duplicates
      if (resultUrl.includes('duckduckgo.com') || urls.has(resultUrl)) continue
      urls.add(resultUrl)

      try {
        const urlObj = new URL(resultUrl)
        results.push({
          url: resultUrl,
          title: title,
          snippet: title, // Will be enriched if snippet found
          hostname: urlObj.hostname
        })
      } catch {
        // Skip invalid URLs
      }
    }

    console.log(`[DuckDuckGo HTML] Found ${results.length} results`)
    return results

  } catch (error: any) {
    console.error(`[DuckDuckGo HTML] Error:`, error.message)
    return []
  }
}

/**
 * Combined DuckDuckGo search (tries both methods)
 */
export async function searchWithDuckDuckGo(query: string, maxResults: number = 10): Promise<SearchResult[]> {
  // Try Instant Answer API first (faster)
  let results = await duckDuckGoSearch(query, maxResults)

  // If not enough results, try HTML search
  if (results.length < 3) {
    const htmlResults = await duckDuckGoHtmlSearch(query, maxResults)
    results = [...results, ...htmlResults]
  }

  // Deduplicate by URL
  const uniqueResults: SearchResult[] = []
  const seenUrls = new Set<string>()

  for (const result of results) {
    if (!seenUrls.has(result.url)) {
      seenUrls.add(result.url)
      uniqueResults.push(result)
    }
  }

  return uniqueResults.slice(0, maxResults)
}
