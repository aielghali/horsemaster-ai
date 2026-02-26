/**
 * Elghali AI - Unified Race Data API v3
 * Simplified version - Uses predictions API for real data
 */

import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

// Redirect to main predictions API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, racecourse, email, sendEmail } = body
    
    // Forward to predictions API
    const response = await fetch(new URL('/api/predictions', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, racecourse, email, sendEmail })
    })
    
    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: `خطأ: ${error.message}`,
      races: []
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Use /api/predictions for race data',
    redirect: '/api/predictions'
  })
}
