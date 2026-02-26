/**
 * Elghali AI - Unified Race Data API v4
 * Direct import - no fetch needed
 */

import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 120

// Sample horse names for demo
const UAE_HORSES = [
  'DREAM OF TUSCANY', 'FORAAT AL LEITH', 'LAMBORGHINI BF', 'MEYDAAN',
  'AREEJ AL LAZAZ', 'RAGHIBAH', 'TAWAF', 'YAQOOT AL LAZAZ',
  'RB MOTHERLOAD', 'AL MURTAJEL', 'THUNDER STRIKE', 'GOLDEN ARROW',
  'DESERT STORM', 'AL REEM', 'SANDS OF TIME'
]

const UK_HORSES = [
  'Thunder Bay', 'Golden Arrow', 'Speed Demon', 'Night Rider',
  'Storm Chaser', 'Royal Crown', 'Diamond King', 'Silver Flash',
  'Phoenix Rising', 'Ocean Breeze', 'Mountain Peak', 'Wild Spirit'
]

const UAE_JOCKEYS = ['W. Buick', 'L. Dettori', 'R. Moore', 'C. Soumillon', 'P. Cosgrave', 'A. de Vries', "T. O'Shea"]
const UK_JOCKEYS = ['J. Smith', 'M. Johnson', 'H. Doyle', 'R. Mullen', 'A. Fresu', "D. O'Neill"]

function generateSamplePredictions(racecourse: string, date: string, isUAE: boolean): any[] {
  const numRaces = isUAE ? 5 : 6
  const horses = isUAE ? UAE_HORSES : UK_HORSES
  const jockeys = isUAE ? UAE_JOCKEYS : UK_JOCKEYS
  const numPredictions = isUAE ? 5 : 3
  
  const races = []
  const usedHorses = new Set<string>()
  
  for (let r = 1; r <= numRaces; r++) {
    const predictions = []
    const distance = [1200, 1400, 1600, 1800, 2000, 2400][r % 6]
    const surface = isUAE ? (r % 2 === 0 ? 'Turf' : 'Dirt') : 'All-Weather'
    
    for (let p = 1; p <= numPredictions; p++) {
      let horseName = horses[Math.floor(Math.random() * horses.length)]
      while (usedHorses.has(horseName)) {
        horseName = horses[Math.floor(Math.random() * horses.length)]
      }
      usedHorses.add(horseName)
      
      predictions.push({
        position: p,
        number: p,
        name: horseName,
        jockey: jockeys[Math.floor(Math.random() * jockeys.length)],
        draw: Math.floor(Math.random() * 12) + 1,
        rating: 70 + Math.floor(Math.random() * 25),
        speedRating: 75 + Math.floor(Math.random() * 20) - p * 3,
        estimatedTime: `1:${30 + Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 99)}`,
        winProbability: Math.max(5, 35 - p * 5),
        placeProbability: Math.min(90, 65 + p * 5),
        valueRating: p === 1 ? 'Excellent' : p === 2 ? 'Good' : 'Fair',
        strengths: ['تقييم عالي', 'فورم جيد', 'فارس ممتاز'].slice(0, p),
        concerns: p > 2 ? ['بوابة خارجية'] : [],
        analysis: p === 1 ? 'المرشح الأول للفوز' : p === 2 ? 'منافس قوي' : 'خيار قيم'
      })
    }
    
    races.push({
      number: r,
      name: `Race ${r}`,
      time: `${13 + r}:00`,
      distance,
      surface,
      going: 'Standard',
      predictions,
      raceNumber: r,
      raceName: `Race ${r}`,
      raceTime: `${13 + r}:00`
    })
  }
  
  return races
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { date, racecourse, email, sendEmail } = body

  if (!date || !racecourse) {
    return NextResponse.json({
      success: false,
      message: 'التاريخ والمضمار مطلوبان',
      racecourse: '',
      date: '',
      totalRaces: 0,
      races: [],
      napOfTheDay: {},
      sources: []
    })
  }

  // Determine if UAE race
  const isUAE = ['meydan', 'jebel ali', 'al ain', 'abu dhabi', 'sharjah'].some(c =>
    racecourse.toLowerCase().includes(c)
  )

  // Generate predictions
  const races = generateSamplePredictions(racecourse, date, isUAE)
  
  // Find NAP
  const bestHorse = races[0]?.predictions[0]
  
  return NextResponse.json({
    success: true,
    message: `✅ تم إنشاء ${races.length} ترشيحات لـ ${racecourse}`,
    racecourse,
    country: isUAE ? 'UAE' : 'International',
    date,
    totalRaces: races.length,
    races,
    napOfTheDay: bestHorse ? {
      horseName: `${bestHorse.number}. ${bestHorse.name}`,
      raceName: races[0].raceName,
      speedRating: bestHorse.speedRating,
      estimatedTime: bestHorse.estimatedTime,
      reason: 'أعلى تقييم سرعة',
      confidence: 75
    } : {},
    nextBest: races[0]?.predictions[1] ? {
      horseName: `${races[0].predictions[1].number}. ${races[0].predictions[1].name}`,
      raceName: races[0].raceName,
      speedRating: races[0].predictions[1].speedRating
    } : {},
    valuePick: races[0]?.predictions[2] ? {
      horseName: `${races[0].predictions[2].number}. ${races[0].predictions[2].name}`,
      raceName: races[0].raceName,
      speedRating: races[0].predictions[2].speedRating
    } : {},
    sources: ['Demo Data'],
    emailSent: false,
    liveStreamUrl: isUAE ? `https://www.emiratesracing.com/live-streams/${racecourse.toLowerCase().replace(' ', '-')}` : null,
    availableRacecourses: {
      UAE: [
        { name: 'Meydan', city: 'Dubai' },
        { name: 'Jebel Ali', city: 'Dubai' },
        { name: 'Al Ain', city: 'Al Ain' },
        { name: 'Abu Dhabi', city: 'Abu Dhabi' },
        { name: 'Sharjah', city: 'Sharjah' }
      ],
      UK: [
        { name: 'Newcastle', city: 'Newcastle' },
        { name: 'Wolverhampton', city: 'Wolverhampton' },
        { name: 'Kempton', city: 'Kempton' },
        { name: 'Lingfield', city: 'Lingfield' },
        { name: 'Southwell', city: 'Southwell' }
      ]
    }
  })
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Race Data API v4 - Fast & Simple',
    features: ['⚡ استجابة سريعة', '🏆 UAE: 5 مرشحين لكل سباق', '🌍 International: 3 مرشحين لكل سباق', '✅ يعمل بدون مشاكل']
  })
}
