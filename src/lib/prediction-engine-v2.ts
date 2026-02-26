/**
 * Elghali AI - Advanced Prediction Engine v3.0
 * With Withdrawals, Surprises, and Non-Competitor Handling
 */

import type { HorseEntry, RaceEntry } from './race-database'

// ==================== TYPES ====================

export interface PredictionFactors {
  speedScore: number
  formScore: number
  classScore: number
  jockeyScore: number
  trainerScore: number
  distanceScore: number
  surfaceScore: number
  goingScore: number
  drawScore: number
  weightScore: number
  paceScore: number
  pedigreeScore: number
  courseScore: number
  daysSinceRunScore: number
  equipmentScore: number
  trendScore: number
  marketScore: number
}

export interface HorsePrediction {
  number: number           // رقم الحصان
  name: string
  jockey: string
  trainer: string
  rating: number
  powerScore: number
  winProbability: number
  placeProbability: number
  draw: number
  weight: number
  form: string
  analysis: string
  strengths: string[]
  concerns: string[]
  valueRating: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  factors: PredictionFactors
  isWithdrawn?: boolean    // منسحب
  isNonRunner?: boolean    // لم يشارك
  hasNoCompetitor?: boolean // بدون منافس
  isSurprise?: boolean     // مفاجأة محتملة
  isFavorite?: boolean     // المفضل
}

export interface RacePrediction {
  raceNumber: number
  raceName: string
  raceTime: string
  distance: number
  surface: string
  going: string
  predictions: HorsePrediction[]
  raceAnalysis: string
  withdrawals: string[]       // قائمة المنسحبين
  nonRunners: string[]        // قائمة غير المشاركين
  noCompetitorHorse?: string  // حصان بدون منافس
  surpriseHorses: string[]    // الخيول المفاجأة
}

// ==================== JOCKEY DATABASE ====================

const JOCKEY_RATINGS: Record<string, { rating: number; winRate: number; specialty: string }> = {
  // UAE Top Jockeys
  "Tadhg O'Shea": { rating: 98, winRate: 28, specialty: 'all-rounder' },
  "William Buick": { rating: 97, winRate: 26, specialty: 'turf' },
  "James Doyle": { rating: 95, winRate: 23, specialty: 'middle-distance' },
  "Silvestre De Sousa": { rating: 94, winRate: 22, specialty: 'dirt' },
  "Bernardo Pinheiro": { rating: 92, winRate: 19, specialty: 'sand' },
  "Ray Dawson": { rating: 90, winRate: 17, specialty: 'handicap' },
  "Sandro Paiva": { rating: 88, winRate: 15, specialty: 'sprint' },
  "Marcelino Rodrigues": { rating: 86, winRate: 13, specialty: 'arabian' },
  "Qais Busaidi": { rating: 84, winRate: 11, specialty: 'local' },
  "Hamed Busaidi": { rating: 82, winRate: 9, specialty: 'local' },
  "Jesus Rosales": { rating: 85, winRate: 12, specialty: 'arabian' },
  "Abdul Al Balushi": { rating: 80, winRate: 8, specialty: 'local' },
  "Richard Mullen": { rating: 87, winRate: 14, specialty: 'arabian' },
  "Carlos Henrique": { rating: 83, winRate: 10, specialty: 'arabian' },
  "Jules Mobian": { rating: 81, winRate: 8, specialty: 'arabian' },
  "Mohamed Salym": { rating: 78, winRate: 6, specialty: 'local' },
  "Allaia Tiar": { rating: 77, winRate: 5, specialty: 'arabian' },
}

// ==================== TRAINER DATABASE ====================

const TRAINER_RATINGS: Record<string, { rating: number; winRate: number; specialty: string }> = {
  "Doug Watson": { rating: 97, winRate: 22, specialty: 'all-rounder' },
  "Charlie Appleby": { rating: 96, winRate: 21, specialty: 'international' },
  "Ernst Oertel": { rating: 95, winRate: 20, specialty: 'arabian' },
  "Musabbeh Al Mheiri": { rating: 93, winRate: 17, specialty: 'thoroughbred' },
  "Bhupat Seemar": { rating: 92, winRate: 16, specialty: 'handicap' },
  "Satish Seemar": { rating: 90, winRate: 14, specialty: 'all-rounder' },
  "Khalid Al Neyadi": { rating: 88, winRate: 12, specialty: 'arabian' },
  "K Al Neyadi": { rating: 88, winRate: 12, specialty: 'arabian' },
  "K Neyadi": { rating: 88, winRate: 12, specialty: 'arabian' },
  "Ibrahim Al Hadhrami": { rating: 87, winRate: 11, specialty: 'arabian' },
  "Helal Alalawi": { rating: 86, winRate: 10, specialty: 'arabian' },
  "Sultan Hajri": { rating: 85, winRate: 9, specialty: 'arabian' },
  "Eric Lemartinel": { rating: 84, winRate: 8, specialty: 'arabian' },
  "Majed Al Jahoori": { rating: 83, winRate: 8, specialty: 'arabian' },
  "A Mehairbi": { rating: 80, winRate: 6, specialty: 'arabian' },
  "Malik Al Reef": { rating: 79, winRate: 5, specialty: 'arabian' },
  "J Bittar": { rating: 81, winRate: 6, specialty: 'arabian' },
  "M Shamsi": { rating: 82, winRate: 7, specialty: 'arabian' },
  "S Shamsi": { rating: 82, winRate: 7, specialty: 'arabian' },
  "S Almarar": { rating: 78, winRate: 5, specialty: 'arabian' },
  "A Hammadi": { rating: 84, winRate: 8, specialty: 'distance' },
  "Hamza Hamida": { rating: 76, winRate: 4, specialty: 'arabian' },
  "Q Aboud": { rating: 77, winRate: 5, specialty: 'arabian' },
  "I Aseel": { rating: 75, winRate: 4, specialty: 'arabian' },
  "Faisal Mutawa": { rating: 74, winRate: 4, specialty: 'arabian' },
  "M Al Mheiri": { rating: 79, winRate: 5, specialty: 'arabian' },
  "A Al Mheiri": { rating: 78, winRate: 5, specialty: 'arabian' },
  "AF Sanadek": { rating: 73, winRate: 3, specialty: 'arabian' },
  "John Gosden": { rating: 95, winRate: 18, specialty: 'turf' },
}

// ==================== SIRE/PEDIGREE DATABASE ====================

const SIRE_PREFERENCES: Record<string, { distance: string; surface: string; aptitude: string }> = {
  "Munjiz": { distance: 'middle', surface: 'dirt', aptitude: 'stamina' },
  "Dubawi": { distance: 'middle', surface: 'turf', aptitude: 'class' },
  "Frankel": { distance: 'middle', surface: 'turf', aptitude: 'class' },
  "Sea The Stars": { distance: 'middle', surface: 'turf', aptitude: 'stamina' },
  "AF Alrashid": { distance: 'middle', surface: 'dirt', aptitude: 'speed' },
  "Djendel": { distance: 'long', surface: 'dirt', aptitude: 'stamina' },
  "Al Khalediah": { distance: 'middle', surface: 'dirt', aptitude: 'class' },
  "Tapit": { distance: 'middle', surface: 'dirt', aptitude: 'class' },
  "Street Cry": { distance: 'middle', surface: 'dirt', aptitude: 'all-rounder' },
  "Medaglia d'Oro": { distance: 'middle', surface: 'dirt', aptitude: 'class' },
  "Curlin": { distance: 'long', surface: 'dirt', aptitude: 'stamina' },
  "Quality Road": { distance: 'middle', surface: 'dirt', aptitude: 'speed' },
  "Nyquist": { distance: 'middle', surface: 'dirt', aptitude: 'speed' },
  "American Pharoah": { distance: 'middle', surface: 'dirt', aptitude: 'stamina' },
  "Into Mischief": { distance: 'sprint', surface: 'dirt', aptitude: 'speed' },
  "Munnings": { distance: 'sprint', surface: 'dirt', aptitude: 'speed' },
  "Arrogate": { distance: 'long', surface: 'dirt', aptitude: 'stamina' },
  "Shamardal": { distance: 'middle', surface: 'turf', aptitude: 'class' },
  "Kitten's Joy": { distance: 'long', surface: 'turf', aptitude: 'stamina' },
}

// ==================== TRACK PROFILES ====================

const TRACK_PROFILES: Record<string, {
  surface: string
  drawAdvantage: { low: number; middle: number; high: number }
  paceBias: 'front' | 'hold' | 'neutral'
}> = {
  "Meydan": { surface: 'dirt', drawAdvantage: { low: 0.08, middle: 0.02, high: -0.05 }, paceBias: 'neutral' },
  "Jebel Ali": { surface: 'sand', drawAdvantage: { low: 0.05, middle: 0.0, high: 0.03 }, paceBias: 'front' },
  "Al Ain": { surface: 'dirt', drawAdvantage: { low: 0.07, middle: 0.04, high: -0.02 }, paceBias: 'neutral' },
  "Abu Dhabi": { surface: 'turf', drawAdvantage: { low: 0.06, middle: 0.03, high: -0.02 }, paceBias: 'hold' },
  "Sharjah": { surface: 'dirt', drawAdvantage: { low: 0.10, middle: 0.05, high: -0.05 }, paceBias: 'front' }
}

// ==================== PREDICTION ENGINE ====================

export class PredictionEngine {
  private weights = {
    speedScore: 0.10, formScore: 0.12, classScore: 0.08, jockeyScore: 0.12, trainerScore: 0.10,
    distanceScore: 0.08, surfaceScore: 0.08, goingScore: 0.05, drawScore: 0.06, weightScore: 0.04,
    paceScore: 0.04, pedigreeScore: 0.05, courseScore: 0.04, daysSinceRunScore: 0.02,
    equipmentScore: 0.02, trendScore: 0.03, marketScore: 0.07
  }

  predictRace(race: RaceEntry, racecourse: string): RacePrediction {
    // Filter active horses (not withdrawn, not non-runner)
    const activeHorses = race.horses.filter(h => !h.isWithdrawn && !h.isNonRunner)
    
    // Check for non-competitor situation
    const hasNoCompetitor = activeHorses.length === 1
    
    // Get withdrawals and non-runners
    const withdrawals = race.horses.filter(h => h.isWithdrawn).map(h => `${h.number}. ${h.name}`)
    const nonRunners = race.horses.filter(h => h.isNonRunner).map(h => `${h.number}. ${h.name}`)
    
    // Get surprise horses
    const surpriseHorses = race.horses.filter(h => h.isSurprise && !h.isWithdrawn && !h.isNonRunner)
    
    let predictions: HorsePrediction[]
    
    if (hasNoCompetitor && activeHorses.length === 1) {
      // Single horse - automatic winner
      const horse = activeHorses[0]
      predictions = [{
        number: horse.number,
        name: horse.name,
        jockey: horse.jockey,
        trainer: horse.trainer,
        rating: horse.rating,
        powerScore: 100,
        winProbability: 100,
        placeProbability: 100,
        draw: horse.draw,
        weight: horse.weight,
        form: horse.form,
        analysis: `🏆 بدون منافس - مرشح تلقائي للمركز الأول`,
        strengths: ['الوحيد في السباق', 'لا يوجد منافسة'],
        concerns: [],
        valueRating: 'Fair',
        factors: this.getDefaultFactors(),
        hasNoCompetitor: true,
        isFavorite: horse.isFavorite
      }]
    } else {
      predictions = activeHorses.map(horse => this.analyzeHorse(horse, race, racecourse))
      predictions.sort((a, b) => b.powerScore - a.powerScore)
      
      // Calculate probabilities
      predictions.forEach((pred, index) => {
        pred.winProbability = this.calculateWinProbability(pred.powerScore, predictions.length, index)
        pred.placeProbability = this.calculatePlaceProbability(pred.powerScore, predictions.length, index)
      })
    }

    return {
      raceNumber: race.number,
      raceName: race.name,
      raceTime: race.time,
      distance: race.distance,
      surface: race.surface,
      going: race.going,
      predictions,
      raceAnalysis: this.generateRaceAnalysis(race, predictions, withdrawals, nonRunners),
      withdrawals,
      nonRunners,
      noCompetitorHorse: hasNoCompetitor ? activeHorses[0]?.name : undefined,
      surpriseHorses: surpriseHorses.map(h => `${h.number}. ${h.name}`)
    }
  }

  private analyzeHorse(horse: HorseEntry, race: RaceEntry, racecourse: string): HorsePrediction {
    const factors: PredictionFactors = {
      speedScore: this.calculateSpeedScore(horse),
      formScore: this.calculateFormScore(horse),
      classScore: this.calculateClassScore(horse, race),
      jockeyScore: this.calculateJockeyScore(horse.jockey),
      trainerScore: this.calculateTrainerScore(horse.trainer),
      distanceScore: this.calculateDistanceScore(horse, race.distance),
      surfaceScore: this.calculateSurfaceScore(horse, race.surface, racecourse),
      goingScore: this.calculateGoingScore(horse, race.going),
      drawScore: this.calculateDrawScore(horse, race, racecourse),
      weightScore: this.calculateWeightScore(horse),
      paceScore: this.calculatePaceScore(horse, race, racecourse),
      pedigreeScore: this.calculatePedigreeScore(horse, race),
      courseScore: this.calculateCourseScore(horse, racecourse),
      daysSinceRunScore: this.calculateDaysSinceRunScore(horse),
      equipmentScore: 50,
      trendScore: this.calculateTrendScore(horse),
      marketScore: this.calculateMarketScore(horse)
    }

    const powerScore = this.calculatePowerScore(factors)
    const { strengths, concerns } = this.generateInsights(horse, factors)
    const analysis = this.generateAnalysis(horse, factors, powerScore)
    const valueRating = this.determineValueRating(horse, powerScore)

    return {
      number: horse.number,
      name: horse.name,
      jockey: horse.jockey,
      trainer: horse.trainer,
      rating: horse.rating,
      powerScore: Math.round(powerScore * 10) / 10,
      winProbability: 0,
      placeProbability: 0,
      draw: horse.draw,
      weight: horse.weight,
      form: horse.form,
      analysis,
      strengths,
      concerns,
      valueRating,
      factors,
      isSurprise: horse.isSurprise,
      isFavorite: horse.isFavorite,
      isWithdrawn: horse.isWithdrawn,
      isNonRunner: horse.isNonRunner
    }
  }

  private getDefaultFactors(): PredictionFactors {
    return {
      speedScore: 50, formScore: 50, classScore: 50, jockeyScore: 50, trainerScore: 50,
      distanceScore: 50, surfaceScore: 50, goingScore: 50, drawScore: 50, weightScore: 50,
      paceScore: 50, pedigreeScore: 50, courseScore: 50, daysSinceRunScore: 50,
      equipmentScore: 50, trendScore: 50, marketScore: 50
    }
  }

  private calculatePowerScore(factors: PredictionFactors): number {
    let total = 0
    for (const [key, weight] of Object.entries(this.weights)) {
      total += factors[key as keyof PredictionFactors] * weight
    }
    return Math.min(100, Math.max(0, total))
  }

  private calculateSpeedScore(horse: HorseEntry): number {
    let score = horse.rating ? Math.min(100, horse.rating) : 50
    if (horse.isFavorite) score += 5
    return Math.min(100, score)
  }

  private calculateFormScore(horse: HorseEntry): number {
    if (!horse.form) return 50
    const formDigits = horse.form.replace(/[^0-9]/g, '').split('').map(Number)
    if (formDigits.length === 0) return 50

    let score = 0
    const weights = [1.0, 0.85, 0.7, 0.55, 0.4]
    formDigits.slice(0, 5).forEach((pos, i) => {
      const weight = weights[i] || 0.3
      if (pos === 1) score += 25 * weight
      else if (pos === 2) score += 18 * weight
      else if (pos === 3) score += 12 * weight
      else if (pos <= 5) score += 6 * weight
      else score += 1 * weight
    })
    return Math.min(100, score)
  }

  private calculateClassScore(horse: HorseEntry, race: RaceEntry): number {
    let score = horse.rating ? 40 + (horse.rating - 60) * 1.5 : 50
    if (race.raceType === 'Handicap' && horse.rating && horse.rating > 80) score += 5
    return Math.min(100, Math.max(0, score))
  }

  private calculateJockeyScore(jockey: string): number {
    return JOCKEY_RATINGS[jockey]?.rating || 70
  }

  private calculateTrainerScore(trainer: string): number {
    return TRAINER_RATINGS[trainer]?.rating || 70
  }

  private calculateDistanceScore(horse: HorseEntry, distance: number): number {
    let score = 50
    if (horse.form) {
      const wins = (horse.form.match(/1/g) || []).length
      const places = (horse.form.match(/[23]/g) || []).length
      if (wins > 0) score += wins * 5
      if (places > 0) score += places * 3
    }
    if (horse.sire && SIRE_PREFERENCES[horse.sire]) {
      const sirePref = SIRE_PREFERENCES[horse.sire]
      const distType = this.getDistanceCategory(distance)
      if (sirePref.distance === distType || sirePref.distance === 'middle') score += 8
    }
    return Math.min(100, score)
  }

  private calculateSurfaceScore(horse: HorseEntry, surface: string, racecourse: string): number {
    let score = 50
    if (horse.sire && SIRE_PREFERENCES[horse.sire]) {
      const sirePref = SIRE_PREFERENCES[horse.sire]
      const trackProfile = TRACK_PROFILES[racecourse]
      if (trackProfile && sirePref.surface === trackProfile.surface.toLowerCase()) score += 15
      if (surface.toLowerCase().includes(sirePref.surface)) score += 10
    }
    if (horse.form) {
      const wins = (horse.form.match(/1/g) || []).length
      if (wins > 0) score += 5
    }
    return Math.min(100, score)
  }

  private calculateGoingScore(horse: HorseEntry, going: string): number {
    let score = 50
    if (going.toLowerCase().includes('fast') || going.toLowerCase().includes('good')) score += 5
    if (horse.form) {
      const wins = (horse.form.match(/1/g) || []).length
      if (wins > 0) score += 5
    }
    return Math.min(100, score)
  }

  private calculateDrawScore(horse: HorseEntry, race: RaceEntry, racecourse: string): number {
    const profile = TRACK_PROFILES[racecourse]
    if (!profile || !horse.draw) return 50

    const fieldSize = race.horses.filter(h => !h.isWithdrawn && !h.isNonRunner).length
    const third = Math.ceil(fieldSize / 3)
    
    let advantage = 0
    if (horse.draw <= third) advantage = profile.drawAdvantage.low
    else if (horse.draw <= third * 2) advantage = profile.drawAdvantage.middle
    else advantage = profile.drawAdvantage.high
    
    if (race.distance <= 1200) advantage *= 1.3
    return Math.min(100, Math.max(0, 50 + advantage * 100))
  }

  private calculateWeightScore(horse: HorseEntry): number {
    if (!horse.weight) return 50
    const diff = horse.weight - 58
    return Math.min(100, Math.max(0, 50 - diff * 1.5))
  }

  private calculatePaceScore(horse: HorseEntry, race: RaceEntry, racecourse: string): number {
    const profile = TRACK_PROFILES[racecourse]
    if (!profile) return 50
    let score = 50
    if (profile.paceBias === 'front' && horse.form && horse.form.startsWith('1')) score += 10
    else if (profile.paceBias === 'hold' && horse.form && /[567]/.test(horse.form)) score += 5
    return Math.min(100, score)
  }

  private calculatePedigreeScore(horse: HorseEntry, race: RaceEntry): number {
    let score = 50
    if (horse.age) {
      if (horse.age >= 4 && horse.age <= 6) score += 10
      else if (horse.age >= 3 && horse.age <= 8) score += 5
      else if (horse.age > 10) score -= 8
    }
    if (horse.sire && SIRE_PREFERENCES[horse.sire]) {
      const sirePref = SIRE_PREFERENCES[horse.sire]
      const distType = this.getDistanceCategory(race.distance)
      if (sirePref.distance === distType) score += 8
      else if (sirePref.distance === 'middle') score += 4
      if (race.surface.toLowerCase().includes(sirePref.surface)) score += 8
      if (sirePref.aptitude === 'class') score += 5
    }
    return Math.min(100, score)
  }

  private calculateCourseScore(horse: HorseEntry, _racecourse: string): number {
    let score = 50
    if (horse.form) {
      const wins = (horse.form.match(/1/g) || []).length
      const places = (horse.form.match(/[23]/g) || []).length
      score += wins * 8 + places * 3
    }
    return Math.min(100, score)
  }

  private calculateDaysSinceRunScore(horse: HorseEntry): number {
    let score = 50
    if (horse.form && horse.form.length >= 3) score += 5
    return Math.min(100, score)
  }

  private calculateTrendScore(horse: HorseEntry): number {
    if (!horse.form) return 50
    const digits = horse.form.replace(/[^0-9]/g, '').split('').map(Number).slice(0, 4)
    if (digits.length < 2) return 50
    let trend = 0
    for (let i = 0; i < digits.length - 1; i++) trend += digits[i + 1] - digits[i]
    return Math.min(100, Math.max(0, 50 + trend * 5))
  }

  private calculateMarketScore(horse: HorseEntry): number {
    let score = 50
    if (horse.isFavorite) score += 20
    if (horse.odds) {
      const oddsValue = this.parseOdds(horse.odds)
      if (oddsValue <= 2) score += 15
      else if (oddsValue <= 4) score += 10
      else if (oddsValue <= 6) score += 5
      else if (oddsValue > 15) score -= 10
    }
    return Math.min(100, score)
  }

  private getDistanceCategory(distance: number): 'sprint' | 'middle' | 'long' {
    if (distance <= 1400) return 'sprint'
    if (distance <= 2200) return 'middle'
    return 'long'
  }

  private parseOdds(odds: string): number {
    try {
      if (odds.includes('/')) {
        const [num, den] = odds.split('/').map(Number)
        return num / den
      }
      return parseFloat(odds)
    } catch { return 10 }
  }

  private calculateWinProbability(powerScore: number, fieldSize: number, rank: number): number {
    let prob = powerScore / 100
    prob = prob / (1 + (fieldSize - 5) * 0.05)
    const rankPenalty = rank * 3
    prob = prob * (100 - rankPenalty) / 100
    if (rank === 0) return Math.min(45, Math.max(20, prob * 35))
    if (rank === 1) return Math.min(25, Math.max(10, prob * 25))
    if (rank === 2) return Math.min(18, Math.max(8, prob * 20))
    return Math.min(12, Math.max(5, prob * 15))
  }

  private calculatePlaceProbability(powerScore: number, fieldSize: number, rank: number): number {
    let prob = powerScore / 100
    prob *= 1.8
    prob = prob / (1 + (fieldSize - 8) * 0.03)
    const rankPenalty = rank * 2
    prob = prob * (100 - rankPenalty) / 100
    return Math.min(75, Math.max(15, prob * 50))
  }

  private generateInsights(horse: HorseEntry, factors: PredictionFactors): { strengths: string[]; concerns: string[] } {
    const strengths: string[] = []
    const concerns: string[] = []
    
    if (factors.formScore > 70) strengths.push('شكل ممتاز في السباقات الأخيرة')
    if (factors.jockeyScore > 90) strengths.push('فارس من الطراز الأول')
    if (factors.trainerScore > 90) strengths.push('مدرب ذو خبرة وسجل ممتاز')
    if (factors.speedScore > 75) strengths.push('سرعة عالية وتقييم ممتاز')
    if (factors.distanceScore > 70) strengths.push('مناسب للمسافة')
    if (factors.surfaceScore > 70) strengths.push('يتألق على هذا السطح')
    if (factors.drawScore > 60) strengths.push('بوابة مميزة')
    if (factors.pedigreeScore > 70) strengths.push('نسل ممتاز')
    if (factors.marketScore > 70) strengths.push('دعم سوقي قوي')
    if (horse.isFavorite) strengths.push('المفضل في السباق')
    if (horse.isSurprise) strengths.push('⚠️ مفاجأة محتملة')
    
    if (factors.formScore < 40) concerns.push('شكل ضعيف مؤخراً')
    if (factors.distanceScore < 40) concerns.push('المسافة قد لا تناسبه')
    if (factors.surfaceScore < 40) concerns.push('السطح غير مفضل')
    if (factors.drawScore < 40) concerns.push('بوابة صعبة')
    if (factors.jockeyScore < 70) concerns.push('فارس مبتدئ نسبياً')
    if (horse.weight && horse.weight > 62) concerns.push('حمل ثقيل')
    if (horse.age && horse.age > 10) concerns.push('عمر متقدم')
    
    return { strengths, concerns }
  }

  private generateAnalysis(horse: HorseEntry, factors: PredictionFactors, score: number): string {
    const parts: string[] = []
    parts.push(`${horse.number}. ${horse.name}: تقييم القوة ${score.toFixed(1)}/100`)
    if (horse.isFavorite) parts.push('المفضل')
    if (horse.isSurprise) parts.push('⚠️ مفاجأة محتملة')
    return parts.join(' | ')
  }

  private determineValueRating(horse: HorseEntry, powerScore: number): 'Excellent' | 'Good' | 'Fair' | 'Poor' {
    if (!horse.odds) return 'Fair'
    const oddsValue = this.parseOdds(horse.odds)
    if (powerScore > 75 && oddsValue > 4) return 'Excellent'
    if (powerScore > 70 && oddsValue > 5) return 'Excellent'
    if (powerScore > 65 && oddsValue > 6) return 'Good'
    if (powerScore > 55 && oddsValue > 8) return 'Good'
    if (powerScore < 50 && oddsValue < 3) return 'Poor'
    return 'Fair'
  }

  private generateRaceAnalysis(race: RaceEntry, predictions: HorsePrediction[], withdrawals: string[], nonRunners: string[]): string {
    const top = predictions[0]
    const surface = race.surface === 'Dirt' ? 'تراب' : race.surface === 'Turf' ? 'عشب' : race.surface
    
    let analysis = `سباق ${race.number} - ${race.name}\n`
    analysis += `المسافة: ${race.distance}م | السطح: ${surface} | عدد المتسابقين: ${predictions.length}\n`
    analysis += `الترشيح الرئيسي: ${top.number}. ${top.name} (Power Score: ${top.powerScore})\n`
    analysis += `الفارس: ${top.jockey} | المدرب: ${top.trainer}`
    
    if (withdrawals.length > 0) {
      analysis += `\n🚫 المنسحبون: ${withdrawals.join(', ')}`
    }
    if (nonRunners.length > 0) {
      analysis += `\n❌ غير المشاركين: ${nonRunners.join(', ')}`
    }
    
    return analysis
  }
}

export const predictionEngine = new PredictionEngine()
