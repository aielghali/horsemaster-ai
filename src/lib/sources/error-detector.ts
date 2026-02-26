/**
 * Elghali AI - Error Detection & Logging System
 * نظام اكتشاف الأخطاء التلقائي
 */

export interface ErrorLog {
  timestamp: string
  source: string
  errorType: 'NETWORK' | 'PARSING' | 'VALIDATION' | 'TIMEOUT' | 'RATE_LIMIT' | 'UNKNOWN'
  message: string
  details?: any
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  suggestedFix?: string
}

export interface SourceHealth {
  name: string
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN'
  lastCheck: string
  responseTime: number
  successRate: number
  totalRequests: number
  failedRequests: number
  lastError?: ErrorLog
}

// In-memory storage for error logs and health status
const errorLogs: ErrorLog[] = []
const sourceHealthMap = new Map<string, SourceHealth>()

// Maximum logs to keep
const MAX_LOGS = 500

/**
 * Log an error with automatic classification
 */
export function logError(
  source: string,
  error: any,
  context?: any
): ErrorLog {
  const errorLog: ErrorLog = {
    timestamp: new Date().toISOString(),
    source,
    errorType: classifyError(error),
    message: extractMessage(error),
    details: context,
    severity: determineSeverity(error),
    suggestedFix: suggestFix(error, source)
  }

  // Add to logs
  errorLogs.unshift(errorLog)
  if (errorLogs.length > MAX_LOGS) {
    errorLogs.pop()
  }

  // Update source health
  updateSourceHealth(source, false, errorLog)

  console.error(`[ErrorDetector] ${errorLog.severity} - ${source}: ${errorLog.message}`)

  return errorLog
}

/**
 * Log successful request
 */
export function logSuccess(source: string, responseTime: number): void {
  updateSourceHealth(source, true, undefined, responseTime)
}

/**
 * Classify error type
 */
function classifyError(error: any): ErrorLog['errorType'] {
  const message = extractMessage(error).toLowerCase()

  if (message.includes('timeout') || message.includes('etimedout')) {
    return 'TIMEOUT'
  }
  if (message.includes('rate limit') || message.includes('429') || message.includes('too many')) {
    return 'RATE_LIMIT'
  }
  if (message.includes('network') || message.includes('econnrefused') || message.includes('enotfound')) {
    return 'NETWORK'
  }
  if (message.includes('json') || message.includes('parse') || message.includes('syntax')) {
    return 'PARSING'
  }
  if (message.includes('invalid') || message.includes('missing') || message.includes('required')) {
    return 'VALIDATION'
  }

  return 'UNKNOWN'
}

/**
 * Extract error message
 */
function extractMessage(error: any): string {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.error?.message) return error.error.message
  if (error?.statusText) return error.statusText
  return 'Unknown error occurred'
}

/**
 * Determine error severity
 */
function determineSeverity(error: any): ErrorLog['severity'] {
  const message = extractMessage(error).toLowerCase()
  const status = error?.status || error?.response?.status

  // Critical: Service completely down
  if (status === 503 || message.includes('service unavailable')) {
    return 'CRITICAL'
  }

  // High: Major functionality affected
  if (status === 500 || status === 502 || status === 504) {
    return 'HIGH'
  }

  // Medium: Partial functionality
  if (status === 429 || message.includes('rate limit')) {
    return 'MEDIUM'
  }

  // Low: Minor issues
  return 'LOW'
}

/**
 * Suggest fix based on error type and source
 */
function suggestFix(error: any, source: string): string {
  const errorType = classifyError(error)

  switch (errorType) {
    case 'TIMEOUT':
      return `Increase timeout for ${source} or try alternative source`
    case 'RATE_LIMIT':
      return `Wait before retrying ${source} or use cached data`
    case 'NETWORK':
      return `Check ${source} availability or use fallback source`
    case 'PARSING':
      return `${source} may have changed their HTML structure. Update parser.`
    case 'VALIDATION':
      return `Verify request parameters for ${source}`
    default:
      return `Try alternative data source`
  }
}

/**
 * Update source health status
 */
function updateSourceHealth(
  source: string,
  success: boolean,
  error?: ErrorLog,
  responseTime?: number
): void {
  let health = sourceHealthMap.get(source)

  if (!health) {
    health = {
      name: source,
      status: 'HEALTHY',
      lastCheck: new Date().toISOString(),
      responseTime: 0,
      successRate: 100,
      totalRequests: 0,
      failedRequests: 0
    }
  }

  health.totalRequests++
  health.lastCheck = new Date().toISOString()

  if (!success) {
    health.failedRequests++
    health.lastError = error
  }

  if (responseTime) {
    health.responseTime = responseTime
  }

  // Calculate success rate
  health.successRate = ((health.totalRequests - health.failedRequests) / health.totalRequests) * 100

  // Determine status
  if (health.successRate >= 90) {
    health.status = 'HEALTHY'
  } else if (health.successRate >= 50) {
    health.status = 'DEGRADED'
  } else {
    health.status = 'DOWN'
  }

  sourceHealthMap.set(source, health)
}

/**
 * Get health status for all sources
 */
export function getSourcesHealth(): SourceHealth[] {
  return Array.from(sourceHealthMap.values())
}

/**
 * Get recent error logs
 */
export function getRecentErrors(limit: number = 50): ErrorLog[] {
  return errorLogs.slice(0, limit)
}

/**
 * Get errors for specific source
 */
export function getSourceErrors(source: string, limit: number = 20): ErrorLog[] {
  return errorLogs.filter(log => log.source === source).slice(0, limit)
}

/**
 * Check if source is available
 */
export function isSourceAvailable(source: string): boolean {
  const health = sourceHealthMap.get(source)
  if (!health) return true // New source, assume healthy
  return health.status !== 'DOWN'
}

/**
 * Get best available source from list
 */
export function getBestSource(sources: string[]): string | null {
  const availableSources = sources.filter(s => isSourceAvailable(s))

  if (availableSources.length === 0) {
    return null
  }

  // Sort by success rate and response time
  availableSources.sort((a, b) => {
    const healthA = sourceHealthMap.get(a)
    const healthB = sourceHealthMap.get(b)

    if (!healthA) return -1 // New source gets priority
    if (!healthB) return 1

    // First by success rate
    if (healthA.successRate !== healthB.successRate) {
      return healthB.successRate - healthA.successRate
    }

    // Then by response time
    return healthA.responseTime - healthB.responseTime
  })

  return availableSources[0]
}

/**
 * Generate diagnostic report
 */
export function generateDiagnosticReport(): {
  summary: {
    totalSources: number
    healthySources: number
    degradedSources: number
    downSources: number
    totalErrors: number
    criticalErrors: number
  }
  sources: SourceHealth[]
  recentErrors: ErrorLog[]
} {
  const sources = getSourcesHealth()
  const recentErrors = getRecentErrors(20)

  return {
    summary: {
      totalSources: sources.length,
      healthySources: sources.filter(s => s.status === 'HEALTHY').length,
      degradedSources: sources.filter(s => s.status === 'DEGRADED').length,
      downSources: sources.filter(s => s.status === 'DOWN').length,
      totalErrors: errorLogs.length,
      criticalErrors: errorLogs.filter(e => e.severity === 'CRITICAL').length
    },
    sources,
    recentErrors
  }
}
