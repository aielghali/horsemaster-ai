/**
 * فهرس ملفات تعريف المضامين
 * Track Profiles Index
 * المعلومات مستخلصة من البحث على الويب
 */

import { TrackProfile, meydanProfile } from './meydan';
import { jebelAliProfile } from './jebel-ali';
import { abuDhabiProfile } from './abu-dhabi';
import { sharjahProfile } from './sharjah';
import { alAinProfile } from './al-ain';
import { wolverhamptonProfile } from './wolverhampton';
import { oaklawnParkProfile } from './oaklawn-park';

// تصدير جميع الملفات
export { meydanProfile } from './meydan';
export { jebelAliProfile } from './jebel-ali';
export { abuDhabiProfile } from './abu-dhabi';
export { sharjahProfile } from './sharjah';
export { alAinProfile } from './al-ain';
export { wolverhamptonProfile } from './wolverhampton';
export { oaklawnParkProfile } from './oaklawn-park';

// قائمة بجميع المضامين
export const allTrackProfiles: TrackProfile[] = [
  meydanProfile,
  jebelAliProfile,
  abuDhabiProfile,
  sharjahProfile,
  alAinProfile,
  wolverhamptonProfile,
  oaklawnParkProfile
];

// أنواع السطوح
export type SurfaceType = 'dirt' | 'turf' | 'sand' | 'mixed' | 'synthetic';

// أنواع المسافات
export type DistanceType = 'sprint' | 'mile' | 'middle' | 'long';

// نتائج تحليل المضمار
export interface TrackAnalysisResult {
  track: TrackProfile;
  surface: ReturnType<typeof getTrackSurface>;
  distanceProfile: ReturnType<typeof getDistanceProfile>;
  recommendations: {
    staminaRequired: number;
    speedImportance: number;
    accelerationImportance: number;
    insideAdvantage: number;
    frontRunningValue: number;
    stalkingValue: number;
    closersValue: number;
    weightImpact: number;
    specialFactors: string[];
  };
}

/**
 * الحصول على ملف تعريف المضمار بالاسم
 * Get track profile by name (supports English and Arabic names)
 */
export function getTrackProfile(trackName: string): TrackProfile | null {
  const normalizedName = trackName.toLowerCase().trim();
  
  for (const profile of allTrackProfiles) {
    // مطابقة الاسم الإنجليزي
    if (profile.name.toLowerCase().includes(normalizedName) ||
        normalizedName.includes(profile.id) ||
        normalizedName.includes(profile.name.toLowerCase())) {
      return profile;
    }
    
    // مطابقة الاسم العربي
    if (profile.nameAr.includes(trackName) || trackName.includes(profile.nameAr)) {
      return profile;
    }
    
    // مطابقات خاصة
    const aliases: Record<string, string[]> = {
      'meydan': ['ميدان', 'meydan', 'dubai'],
      'jebel-ali': ['جبل علي', 'جبل على', 'jebel ali', 'jebel', 'jabal ali'],
      'abu-dhabi': ['أبوظبي', 'ابوظبي', 'ابو ظبي', 'abu dhabi', 'abudhabi'],
      'sharjah': ['الشارقة', 'الشارقه', 'sharjah'],
      'al-ain': ['العين', 'al ain', 'alain'],
      'wolverhampton': ['وولفرهامبتون', 'wolverhampton', 'wolves', 'dunstall'],
      'oaklawn-park': ['أوكلاند بارك', 'اوكلاند', 'oaklawn', 'oaklawn park', 'hot springs', 'arkansas']
    };
    
    if (aliases[profile.id]) {
      for (const alias of aliases[profile.id]) {
        if (normalizedName.includes(alias.toLowerCase()) || 
            trackName.includes(alias)) {
          return profile;
        }
      }
    }
  }
  
  return null;
}

/**
 * الحصول على معلومات السطح
 * Get surface information for a track
 */
export function getTrackSurface(track: TrackProfile, surfaceType?: SurfaceType) {
  if (surfaceType) {
    return track.surfaces.find(s => s.type === surfaceType) || track.surfaces[0];
  }
  return track.surfaces[0]; // السطح الافتراضي
}

/**
 * الحصول على ملف تعريف المسافة
 * Get distance profile based on race distance
 */
export function getDistanceProfile(track: TrackProfile, distanceMeters: number) {
  if (distanceMeters <= 1300) {
    return {
      type: 'sprint' as DistanceType,
      profile: track.distanceFactors.sprint
    };
  } else if (distanceMeters <= 1700) {
    return {
      type: 'mile' as DistanceType,
      profile: track.distanceFactors.mile
    };
  } else if (distanceMeters <= 2100) {
    return {
      type: 'middle' as DistanceType,
      profile: track.distanceFactors.middle
    };
  } else {
    return {
      type: 'long' as DistanceType,
      profile: track.distanceFactors.long
    };
  }
}

/**
 * حساب معاملات التعديل بناءً على خصائص المضمار
 * Calculate adjustment factors based on track characteristics
 */
export function calculateTrackAdjustments(
  track: TrackProfile,
  distance: number,
  surfaceType?: SurfaceType
): TrackAnalysisResult['recommendations'] {
  const surface = getTrackSurface(track, surfaceType);
  const distanceProfile = getDistanceProfile(track, distance);
  
  // العوامل الخاصة
  const specialFactors: string[] = track.specialFeatures
    .filter(f => f.impact === 'positive' || f.impact === 'negative')
    .map(f => `${f.nameAr}: ${f.descriptionAr}`);

  return {
    staminaRequired: distanceProfile.profile.staminaRequired,
    speedImportance: distanceProfile.profile.speedImportance,
    accelerationImportance: distanceProfile.profile.accelerationImportance,
    insideAdvantage: track.positionAdvantages.insideAdvantage,
    frontRunningValue: track.positionAdvantages.frontRunning,
    stalkingValue: track.positionAdvantages.stalking,
    closersValue: track.positionAdvantages.closers,
    weightImpact: track.weightImpact.overall,
    specialFactors
  };
}

/**
 * تحليل شامل للمضمار
 * Comprehensive track analysis
 */
export function analyzeTrack(
  trackName: string,
  distance: number,
  surfaceType?: SurfaceType
): TrackAnalysisResult | null {
  const track = getTrackProfile(trackName);
  
  if (!track) {
    return null;
  }
  
  const surface = getTrackSurface(track, surfaceType);
  const distanceProfile = getDistanceProfile(track, distance);
  const recommendations = calculateTrackAdjustments(track, distance, surfaceType);
  
  return {
    track,
    surface,
    distanceProfile,
    recommendations
  };
}

/**
 * الحصول على جميع أسماء المضامين المتاحة
 * Get all available track names
 */
export function getAvailableTracks(): { id: string; name: string; nameAr: string }[] {
  return allTrackProfiles.map(profile => ({
    id: profile.id,
    name: profile.name,
    nameAr: profile.nameAr
  }));
}

/**
 * التحقق من صحة اسم المضمار
 * Validate track name
 */
export function isValidTrack(trackName: string): boolean {
  return getTrackProfile(trackName) !== null;
}

/**
 * الحصول على نصائح خاصة بالمضمار للعربية
 * Get track-specific tips in Arabic
 */
export function getTrackTipsArabic(trackName: string, distance: number): string[] {
  const analysis = analyzeTrack(trackName, distance);
  
  if (!analysis) {
    return ['لم يتم العثور على معلومات المضمار'];
  }
  
  const tips: string[] = [];
  const { track, recommendations, distanceProfile } = analysis;
  
  // نصائح عامة
  tips.push(`📍 المضمار: ${track.nameAr}`);
  tips.push(`📏 المسافة: ${distance}م (${distanceProfile.type === 'sprint' ? 'سباق قصير' : distanceProfile.type === 'mile' ? 'سباق ميل' : distanceProfile.type === 'middle' ? 'سباق متوسط' : 'سباق طويل'})`);
  
  // نصائح التحمل والسرعة
  if (recommendations.staminaRequired >= 7) {
    tips.push(`💪 قوة التحمل عالية جداً مطلوبة (${recommendations.staminaRequired}/10)`);
  } else if (recommendations.staminaRequired >= 5) {
    tips.push(`💪 قوة تحمل متوسطة مطلوبة (${recommendations.staminaRequired}/10)`);
  }
  
  // نصائح المركز
  if (recommendations.insideAdvantage >= 3) {
    tips.push(`🎯 الانطلاقات الداخلية لها ميزة واضحة`);
  } else if (recommendations.insideAdvantage <= -2) {
    tips.push(`🎯 الانطلاقات الخارجية مفضلة`);
  }
  
  // نصائح أسلوب السباق
  if (recommendations.closersValue >= 8) {
    tips.push(`🏁 الخيول المتأخرة (Closers) لها ميزة`);
  } else if (recommendations.frontRunningValue >= 8) {
    tips.push(`🏁 الخيول المتقدمة (Front-runners) لها ميزة`);
  }
  
  // عوامل خاصة
  const positiveFeatures = track.specialFeatures.filter(f => f.impact === 'positive');
  if (positiveFeatures.length > 0) {
    tips.push(`⚡ عوامل مميزة: ${positiveFeatures.map(f => f.nameAr).join('، ')}`);
  }
  
  return tips;
}

/**
 * الحصول على معلومات تفصيلية عن المضمار
 * Get detailed track information
 */
export function getTrackDetailedInfo(trackName: string): string {
  const track = getTrackProfile(trackName);
  
  if (!track) {
    return 'المضمار غير موجود';
  }
  
  const info = `
=== ${track.nameAr} ===
📍 الموقع: ${track.locationAr}
🔄 الاتجاه: ${track.trackCharacteristics.directionAr}
📐 الشكل: ${track.trackCharacteristics.shapeAr}

=== الأسطح ===
${track.surfaces.map(s => `
• ${s.typeAr}: محيط ${s.circumference}م، خط نهاية ${s.homeStraight}م، عرض ${s.width}م
  ${s.descriptionAr}
`).join('\n')}

=== مميزات خاصة ===
${track.specialFeatures.map(f => `• ${f.nameAr}: ${f.descriptionAr}`).join('\n')}
`;
  
  return info;
}

/**
 * حساب تأثير الانطلاق
 * Calculate draw impact based on draw number and field size
 */
export function calculateDrawImpact(
  trackName: string,
  drawNumber: number,
  fieldSize: number,
  distance: number
): { advantage: number; description: string } {
  const analysis = analyzeTrack(trackName, distance);
  
  if (!analysis) {
    return { advantage: 0, description: 'لا توجد معلومات' };
  }
  
  const { track } = analysis;
  const insideAdv = track.positionAdvantages.insideAdvantage;
  
  // حساب المركز النسبي للانطلاق
  const relativePosition = drawNumber / fieldSize;
  
  let advantage = 0;
  let description = '';
  
  if (relativePosition <= 0.33) {
    // انطلاقة داخلية
    advantage = insideAdv;
    description = insideAdv >= 3 ? 'انطلاقة داخلية مفضلة' : 
                  insideAdv >= 1 ? 'انطلاقة داخلية جيدة' : 
                  'انطلاقة داخلية محايدة';
  } else if (relativePosition <= 0.66) {
    // انطلاقة وسط
    advantage = track.positionAdvantages.middleAdvantage;
    description = 'انطلاقة وسط';
  } else {
    // انطلاقة خارجية
    advantage = track.positionAdvantages.outsideAdvantage;
    description = advantage < 0 ? 'انطلاقة خارجية صعبة' : 'انطلاقة خارجية';
  }
  
  return { advantage, description };
}

const trackProfiles = {
  allTrackProfiles,
  getTrackProfile,
  getTrackSurface,
  getDistanceProfile,
  calculateTrackAdjustments,
  analyzeTrack,
  getAvailableTracks,
  isValidTrack,
  getTrackTipsArabic,
  getTrackDetailedInfo,
  calculateDrawImpact
};

export default trackProfiles;
