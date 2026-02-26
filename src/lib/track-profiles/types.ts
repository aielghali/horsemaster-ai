/**
 * Track Profile Types
 * أنواع ملفات تعريف المضامير
 */

export interface TrackInfo {
  circumference: number; // meters
  width?: number; // meters
  homeStraight: number; // meters
  surface: 'dirt' | 'turf' | 'synthetic';
  surfaceDescription?: {
    en: string;
    ar: string;
  };
  banking?: {
    turns?: number; // percentage
    straight?: number; // percentage
  };
  shape?: 'oval' | 'horseshoe' | 'straight';
}

export interface ChuteInfo {
  distance: number; // meters
  description: {
    en: string;
    ar: string;
  };
}

export interface ElevationInfo {
  uphill: boolean;
  uphillDescription?: {
    en: string;
    ar: string;
  };
  uphillSection?: {
    start: number; // meters from finish
    gradient: number; // percentage
    description: {
      en: string;
      ar: string;
    };
  };
  uphillGradient?: 'steep' | 'moderate' | 'slight';
}

export interface CurveInfo {
  type: 'sharp' | 'moderate' | 'wide';
  tightness: 'high' | 'moderate' | 'low';
  description: {
    en: string;
    ar: string;
  };
  toobukCurve?: {
    name: {
      en: string;
      ar: string;
    };
    description: {
      en: string;
      ar: string;
    };
    impact: {
      en: string;
      ar: string;
    };
  };
}

export interface HomeStraightInfo {
  length: number; // meters
  description: {
    en: string;
    ar: string;
  };
}

export interface KickbackInfo {
  level: 'high' | 'moderate' | 'low';
  description: {
    en: string;
    ar: string;
  };
}

export interface SurfaceConsistencyInfo {
  level: 'consistent' | 'variable' | 'high';
  description: {
    en: string;
    ar: string;
  };
}

export interface TrackCharacteristics {
  shape: 'oval' | 'horseshoe' | 'straight';
  width: 'narrow' | 'standard' | 'wide';
  elevation: ElevationInfo;
  curves: CurveInfo;
  homeStraight: HomeStraightInfo;
  kickback: KickbackInfo;
  surfaceConsistency: SurfaceConsistencyInfo;
}

export interface DistanceSuitability {
  rating: number; // 1-10
  description: {
    en: string;
    ar: string;
  };
}

export interface DrawAdvantage {
  rating: number; // 1-10
  description: {
    en: string;
    ar: string;
  };
}

export interface RacingStyleImpact {
  preferredPosition: {
    en: string;
    ar: string;
  };
  distanceSuitability: {
    sprint: DistanceSuitability;
    middle: DistanceSuitability;
    long: DistanceSuitability;
  };
  drawAdvantage: {
    lowDraw: DrawAdvantage;
    highDraw: DrawAdvantage;
  };
}

export interface PredictionFactor {
  weight: number; // 0-1
  description: {
    en: string;
    ar: string;
  };
}

export interface PredictionFactors {
  stamina: PredictionFactor;
  speed: PredictionFactor;
  acceleration: PredictionFactor;
  courseExperience?: PredictionFactor;
  drawAdvantage?: PredictionFactor;
  uphillAbility?: PredictionFactor;
  turfExperience?: PredictionFactor;
}

export interface HistoricalPatterns {
  frontRunnerWinRate: number; // 0-1
  closerWinRate: number; // 0-1
  favoriteWinRate: number; // 0-1
  averageWinningDistance: number; // lengths
  description: {
    en: string;
    ar: string;
  };
}

export interface NotableRace {
  name: string;
  distance: number; // meters
  surface: 'dirt' | 'turf';
  grade: string;
  prize: string;
}

export interface SeasonInfo {
  start: string;
  end: string;
  peakMonth: string;
  description: {
    en: string;
    ar: string;
  };
}

export interface TrackRecord {
  distance: number;
  time: string;
  horse: string;
}

export interface TrackProfile {
  name: {
    en: string;
    ar: string;
  };
  location: {
    en: string;
    ar: string;
  };
  tracks: {
    dirt?: TrackInfo;
    turf?: TrackInfo;
    main?: TrackInfo;
  };
  direction: 'left-handed' | 'right-handed';
  chute?: ChuteInfo;
  chutes?: {
    sprint?: ChuteInfo;
    mile?: ChuteInfo;
  };
  characteristics: TrackCharacteristics;
  racingStyle: RacingStyleImpact;
  predictionFactors: PredictionFactors;
  patterns: HistoricalPatterns;
  notableRaces: NotableRace[];
  season: SeasonInfo;
  records?: {
    sprint?: TrackRecord;
    mile?: TrackRecord;
    staying?: TrackRecord;
  };
  info?: {
    established?: number;
    capacity?: {
      en: string;
      ar: string;
    };
    surface?: {
      type: string;
      description?: {
        en: string;
        ar: string;
      };
    };
    historic?: {
      en: string;
      ar: string;
    };
    facilities?: {
      en: string;
      ar: string;
    };
  };
  // Track-specific features
  jebelAliSpecific?: {
    staminaCalculation: {
      baseWeight: number;
      weightImpact: {
        en: string;
        ar: string;
      };
      distanceImpact: {
        en: string;
        ar: string;
      };
    };
    uphillAnalysis: {
      section: string;
      gradient: string;
      impact: {
        en: string;
        ar: string;
      };
      horseType: {
        en: string;
        ar: string;
      };
    };
    toobukAnalysis: {
      position: string;
      impact: {
        en: string;
        ar: string;
      };
      tactical: {
        en: string;
        ar: string;
      };
    };
  };
  alAinSpecific?: {
    arabianFocus: {
      en: string;
      ar: string;
    };
    facilities: {
      en: string;
      ar: string;
    };
    trackAdvantage: {
      en: string;
      ar: string;
    };
    typicalDistances: number[];
  };
  sharjahSpecific?: {
    historic: {
      en: string;
      ar: string;
    };
    construction: {
      year: number;
      underSupervision: string;
    };
    arabianRaces: {
      en: string;
      ar: string;
    };
    frequency: {
      en: string;
      ar: string;
    };
    typicalDistances: number[];
  };
  abuDhabiSpecific?: {
    turfOnly: {
      en: string;
      ar: string;
    };
    arabianFocus: {
      en: string;
      ar: string;
    };
    presidentCup: {
      en: string;
      ar: string;
    };
    typicalDistances: number[];
  };
  turfVsDirt?: {
    surface: {
      en: string;
      ar: string;
    };
    stamina: {
      en: string;
      ar: string;
    };
    speed: {
      en: string;
      ar: string;
    };
  };
}

// Helper type for track identification
export type TrackName = 'meydan' | 'jebel-ali' | 'al-ain' | 'sharjah' | 'abu-dhabi';

// Track name mapping for search/identification
export const trackNameMappings: Record<string, TrackName> = {
  // English names
  'meydan': 'meydan',
  'jebel ali': 'jebel-ali',
  'jebelali': 'jebel-ali',
  'al ain': 'al-ain',
  'alain': 'al-ain',
  'sharjah': 'sharjah',
  'abu dhabi': 'abu-dhabi',
  'abudhabi': 'abu-dhabi',
  'abu dhabi turf club': 'abu-dhabi',
  // Arabic names
  'ميدان': 'meydan',
  'جبل علي': 'jebel-ali',
  'جبل على': 'jebel-ali',
  'العين': 'al-ain',
  'الشارقة': 'sharjah',
  'الشارقه': 'sharjah',
  'أبوظبي': 'abu-dhabi',
  'ابوظبي': 'abu-dhabi',
  'ابو ظبي': 'abu-dhabi'
};
