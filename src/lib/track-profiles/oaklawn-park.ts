/**
 * ملف تعريف مضمار أوكلاند بارك - Oaklawn Park Profile
 * مضمار أمريكي شهير في هوت سبرينغز، أركنساس
 * يستضيف Arkansas Derby و Rebel Stakes
 */

export interface TrackProfile {
  id: string;
  name: string;
  nameAr: string;
  location: string;
  locationAr: string;
  country: string;
  countryAr: string;
  surfaces: Surface[];
  trackCharacteristics: TrackCharacteristics;
  distanceFactors: DistanceFactors;
  positionAdvantages: PositionAdvantages;
  weightImpact: WeightImpact;
  weatherSensitivity: WeatherSensitivity;
  specialFeatures: SpecialFeature[];
}

export interface Surface {
  type: 'dirt' | 'turf' | 'sand' | 'mixed';
  typeAr: string;
  circumference: number;
  homeStraight: number;
  width: number;
  banking?: number;
  description: string;
  descriptionAr: string;
}

export interface TrackCharacteristics {
  direction: 'left-handed' | 'right-handed';
  directionAr: string;
  shape: 'oval' | 'horseshoe' | 'straight';
  shapeAr: string;
  gradient: string;
  gradientAr: string;
  turns: TurnCharacteristics;
  drainage: string;
  drainageAr: string;
}

export interface TurnCharacteristics {
  numberOfTurns: number;
  turnRadius: 'tight' | 'medium' | 'wide';
  turnRadiusAr: string;
  firstTurnDistance: number;
  finalTurnDistance: number;
  bankingPercentage?: number;
}

export interface DistanceFactors {
  sprint: DistanceProfile;
  mile: DistanceProfile;
  middle: DistanceProfile;
  long: DistanceProfile;
}

export interface DistanceProfile {
  range: string;
  staminaRequired: number;
  speedImportance: number;
  accelerationImportance: number;
  positionAtTurn: 'critical' | 'important' | 'moderate';
  earlySpeedValue: number;
  finishSpeedValue: number;
  description: string;
  descriptionAr: string;
}

export interface PositionAdvantages {
  insideAdvantage: number;
  middleAdvantage: number;
  outsideAdvantage: number;
  frontRunning: number;
  stalking: number;
  closers: number;
  description: string;
  descriptionAr: string;
}

export interface WeightImpact {
  overall: number;
  sprintImpact: number;
  distanceImpact: number;
  description: string;
  descriptionAr: string;
}

export interface WeatherSensitivity {
  rain: 'high' | 'medium' | 'low';
  rainAr: string;
  wind: 'high' | 'medium' | 'low';
  windAr: string;
  temperature: 'high' | 'medium' | 'low';
  temperatureAr: string;
  description: string;
  descriptionAr: string;
}

export interface SpecialFeature {
  name: string;
  nameAr: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  descriptionAr: string;
}

export const oaklawnParkProfile: TrackProfile = {
  id: 'oaklawn-park',
  name: 'Oaklawn Park',
  nameAr: 'مضمار أوكلاند بارك',
  location: 'Hot Springs, Arkansas',
  locationAr: 'هوت سبرينغز، أركنساس',
  country: 'United States',
  countryAr: 'الولايات المتحدة الأمريكية',

  surfaces: [
    {
      type: 'dirt',
      typeAr: 'ترابي',
      circumference: 1700,
      homeStraight: 380,
      width: 24,
      banking: 6,
      description: 'One-mile (1609m) oval dirt track with 6% banking on turns. The surface is typically fast and favors speed horses. Known for its consistent dirt surface that handles moisture well. Home straight of approximately 380m gives closers a fair chance.',
      descriptionAr: 'مضمار ترابي بيضاوي بطول ميل واحد (1609م) مع ميل 6% في المنعطفات. السطح عادة سريع ويفضل خيول السرعة. معروف بسطحه الترابي المتسق الذي يتعامل مع الرطوبة بشكل جيد. خط النهاية حوالي 380م يعطي المتأخرين فرصة عادلة.'
    }
  ],

  trackCharacteristics: {
    direction: 'left-handed',
    directionAr: 'يسار',
    shape: 'oval',
    shapeAr: 'بيضاوي',
    gradient: 'Mostly flat oval track with gradual banking on turns. No significant elevation changes. The track is known for its fair racing surface.',
    gradientAr: 'مضمار بيضاوي مسطح في الغالب مع ميل تدريجي في المنعطفات. لا توجد تغييرات ارتفاع كبيرة. المضمار معروف بسطحه العادل.',
    turns: {
      numberOfTurns: 2,
      turnRadius: 'wide',
      turnRadiusAr: 'واسع',
      firstTurnDistance: 450,
      finalTurnDistance: 380,
      bankingPercentage: 6
    },
    drainage: 'Good drainage system. The track handles rain well and dries quickly. Can be sealed in wet conditions to maintain safe racing.',
    drainageAr: 'نظام تصريف جيد. المضمار يتعامل مع المطر بشكل جيد ويجف بسرعة. يمكن إغلاقه في الظروف الرطبة للحفاظ على سباقات آمنة.'
  },

  distanceFactors: {
    sprint: {
      range: '1000m-1300m',
      staminaRequired: 3,
      speedImportance: 10,
      accelerationImportance: 9,
      positionAtTurn: 'critical',
      earlySpeedValue: 9,
      finishSpeedValue: 8,
      description: 'Pure speed contests. Early speed is crucial. Inside draws have advantage in sprints. Quick breaks from the gate essential.',
      descriptionAr: 'سباقات سرعة بحتة. السرعة المبكرة حاسمة. الانطلاقات الداخلية لها ميزة في السباقات القصيرة. الانطلاق السريع من البوابة ضروري.'
    },
    mile: {
      range: '1400m-1700m',
      staminaRequired: 5,
      speedImportance: 8,
      accelerationImportance: 8,
      positionAtTurn: 'important',
      earlySpeedValue: 8,
      finishSpeedValue: 9,
      description: 'Balanced tests. Tactical speed and stamina both important. One-mile races start from a chute. Stalkers perform well.',
      descriptionAr: 'اختبارات متوازنة. السرعة التكتيكية والتحمل كلاهما مهم. سباقات الميل تبدأ من مسار خاص. المتتبعون يؤدون بشكل جيد.'
    },
    middle: {
      range: '1800m-2100m',
      staminaRequired: 7,
      speedImportance: 6,
      accelerationImportance: 7,
      positionAtTurn: 'moderate',
      earlySpeedValue: 6,
      finishSpeedValue: 9,
      description: 'Arkansas Derby distance (1800m/1-1/8 miles). Stamina becomes more important. Closers have good chance with long stretch. Pace setup crucial.',
      descriptionAr: 'مسافة Arkansas Derby (1800م). قوة التحمل تصبح أكثر أهمية. المتأخرون لديهم فرصة جيدة مع خط النهاية الطويل. إعداد الوتيرة حاسم.'
    },
    long: {
      range: '2200m-2800m',
      staminaRequired: 9,
      speedImportance: 4,
      accelerationImportance: 6,
      positionAtTurn: 'moderate',
      earlySpeedValue: 4,
      finishSpeedValue: 8,
      description: 'Stamina tests. Rarely run at Oaklawn. True stayers required. Pace judgment and stamina crucial.',
      descriptionAr: 'اختبارات تحمل. نادراً ما تُجرى في أوكلاند. تتطلب خيول تحمل حقيقية. تقدير الوتيرة والتحمل حاسم.'
    }
  },

  positionAdvantages: {
    insideAdvantage: 3,
    middleAdvantage: 1,
    outsideAdvantage: -1,
    frontRunning: 8,
    stalking: 8,
    closers: 7,
    description: 'Speed-friendly track with inside advantage in sprints. Stalkers and front-runners have slight edge. Wide draws can be competitive with early speed. The long stretch helps closers in route races.',
    descriptionAr: 'مضمار يفضل السرعة مع ميزة داخلية في السباقات القصيرة. المتتبعون والمتقدمون لديهم ميزة طفيفة. الانطلاقات الواسعة يمكن أن تكون تنافسية مع سرعة مبكرة. خط النهاية الطويل يساعد المتأخرين في سباقات المسافات.'
  },

  weightImpact: {
    overall: 6,
    sprintImpact: 4,
    distanceImpact: 7,
    description: 'Moderate weight impact. Higher impact in longer races. Weight assignments in handicap races can influence outcomes, especially in graded stakes.',
    descriptionAr: 'تأثير الوزن معتدل. تأثير أعلى في السباقات الطويلة. توزيع الأوزان في سباقات الهانديكاب يمكن أن يؤثر على النتائج، خاصة في السباقات المهمة.'
  },

  weatherSensitivity: {
    rain: 'medium',
    rainAr: 'متوسط',
    wind: 'low',
    windAr: 'منخفض',
    temperature: 'medium',
    temperatureAr: 'متوسط',
    description: 'Track handles moisture reasonably well. Can be sealed during rain. Spring racing (Jan-April) means cooler temperatures. Summer heat can affect surface conditions.',
    descriptionAr: 'المضمار يتعامل مع الرطوبة بشكل معقول. يمكن إغلاقه أثناء المطر. سباقات الربيع (يناير-أبريل) تعني درجات حرارة أبرد. حرارة الصيف يمكن أن تؤثر على حالة السطح.'
  },

  specialFeatures: [
    {
      name: 'Arkansas Derby Host',
      nameAr: 'مستضيف Arkansas Derby',
      impact: 'positive',
      description: 'Hosts the Arkansas Derby (G1), a major Kentucky Derby prep race. Winners often go on to Triple Crown success. Rich history of producing champions.',
      descriptionAr: 'يستضيف Arkansas Derby (G1)، سباق تحضيري رئيسي لـ Kentucky Derby. الفائزون غالباً ما يحققون نجاحاً في Triple Crown. تاريخ غني في إنتاج الأبطال.'
    },
    {
      name: 'Speed-Friendly Surface',
      nameAr: 'سطح يفضل السرعة',
      impact: 'positive',
      description: 'Fast dirt surface that favors speed and early position. Horses with early speed perform well. Consistent surface throughout the meet.',
      descriptionAr: 'سطح ترابي سريع يفضل السرعة والمركز المبكر. الخيول ذات السرعة المبكرة تؤد بشكل جيد. سطح متسق طوال الموسم.'
    },
    {
      name: 'Long Racing Season',
      nameAr: 'موسم سباقات طويل',
      impact: 'neutral',
      description: 'Racing from January through early May. Winter racing means potential for off-track conditions. Spring meet attracts top horses nationwide.',
      descriptionAr: 'السباقات من يناير إلى أوائل مايو. سباقات الشتاء تعني إمكانية ظروف مضمار مختلفة. ملتقى الربيع يجذب أفضل الخيول على مستوى البلاد.'
    },
    {
      name: 'Spa City Location',
      nameAr: 'موقع مدينة المنتجع',
      impact: 'positive',
      description: 'Located in Hot Springs, Arkansas, a historic spa city. Beautiful surroundings and tourist destination. Adds to the racing experience.',
      descriptionAr: 'يقع في هوت سبرينغز، أركنساس، مدينة منتجع تاريخية. محيط جميل ووجهة سياحية. يضيف إلى تجربة السباقات.'
    },
    {
      name: 'Rebel Stakes',
      nameAr: 'سباق Rebel Stakes',
      impact: 'positive',
      description: 'Another major prep race for Kentucky Derby. Attracts top 3-year-olds. Strong field quality and competitive racing.',
      descriptionAr: 'سباق تحضيري رئيسي آخر لـ Kentucky Derby. يجذب أفضل الخيول بعمر 3 سنوات. جودة ميدان قوية وسباقات تنافسية.'
    },
    {
      name: 'Oaklawn Handicap',
      nameAr: 'سباق Oaklawn Handicap',
      impact: 'positive',
      description: 'Prestigious race for older horses. Attracts graded stakes winners. Tests class and stamina at 1-1/8 miles.',
      descriptionAr: 'سباق مرموق للخيول الأكبر سناً. يجذب الفائزين في السباقات المهمة. يختبر الفئة والتحمل على مسافة 1-1/8 ميل.'
    }
  ]
};

export default oaklawnParkProfile;
