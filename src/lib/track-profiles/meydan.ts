/**
 * ملف تعريف مضمار ميدان - Meydan Racecourse Profile
 * الأكبر والأحدث في الإمارات - يستضيف كأس دبي العالمي
 * المعلومات مستخلصة من البحث على الويب
 */

export interface TrackProfile {
  id: string;
  name: string;
  nameAr: string;
  location: string;
  locationAr: string;
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
  staminaRequired: number; // 1-10
  speedImportance: number; // 1-10
  accelerationImportance: number; // 1-10
  positionAtTurn: 'critical' | 'important' | 'moderate';
  earlySpeedValue: number; // 1-10
  finishSpeedValue: number; // 1-10
  description: string;
  descriptionAr: string;
}

export interface PositionAdvantages {
  insideAdvantage: number; // -5 to +5
  middleAdvantage: number;
  outsideAdvantage: number;
  frontRunning: number; // 1-10
  stalking: number; // 1-10
  closers: number; // 1-10
  description: string;
  descriptionAr: string;
}

export interface WeightImpact {
  overall: number; // 1-10
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

export const meydanProfile: TrackProfile = {
  id: 'meydan',
  name: 'Meydan Racecourse',
  nameAr: 'مضمار ميدان',
  location: 'Dubai, UAE',
  locationAr: 'دبي، الإمارات العربية المتحدة',
  
  surfaces: [
    {
      type: 'dirt',
      typeAr: 'ترابي',
      circumference: 1750,
      homeStraight: 400,
      width: 25,
      banking: 5.5,
      description: 'Left-handed oval dirt course measuring 1750m in circumference. Approximately 25m wide with 5.5% banking on turns and 1.5% on the straight. The surface was introduced in 2014 to replicate American dirt surfaces. Deep and testing surface that rewards stamina.',
      descriptionAr: 'مضمار ترابي بيضاوي يساري بمحيط 1750 متر. عرضه حوالي 25 متر مع ميل 5.5% في المنعطفات و 1.5% في المستقيم. تم تقديم السطح عام 2014 لمحاكاة المضامين الترابية الأمريكية. سطح عميق ومجهد يكافئ قوة التحمل.'
    },
    {
      type: 'turf',
      typeAr: 'عشبي',
      circumference: 2400,
      homeStraight: 400,
      width: 20,
      description: 'Left-handed turf track measuring 2400m (12 furlongs) in circumference. The turf course sits outside the dirt track with a slightly longer run-in. Both courses are essentially flat with banked bends. High-quality turf with excellent drainage. Typically firm or good going.',
      descriptionAr: 'مضمار عشبي يساري بمحيط 2400 متر (12 فلونج). المضمار العشبي يقع خارج المضمار الترابي مع خط نهاية أطول قليلاً. كلا المضمارين مسطحان أساساً مع منعطفات مائلة. عشب عالي الجودة مع تصريف ممتاز. عادة أرضية متماسكة أو جيدة.'
    }
  ],
  
  trackCharacteristics: {
    direction: 'left-handed',
    directionAr: 'يسار',
    shape: 'oval',
    shapeAr: 'بيضاوي',
    gradient: 'Both dirt and turf courses are essentially flat, though the bends are banked at 5.5%. No significant uphill or downhill sections. Very fair and galloping track.',
    gradientAr: 'كلا المضمارين الترابي والعشبي مسطحان أساساً، مع أن المنعطفات مائلة بنسبة 5.5%. لا توجد أقسام صعود أو هبوط كبيرة. مضمار عادل جداً للجري.',
    turns: {
      numberOfTurns: 2,
      turnRadius: 'wide',
      turnRadiusAr: 'واسع',
      firstTurnDistance: 500,
      finalTurnDistance: 400,
      bankingPercentage: 5.5
    },
    drainage: 'Excellent drainage system on both surfaces. Quick-drying after rain. Irrigation can influence turf conditions. Rain is rare in Dubai.',
    drainageAr: 'نظام تصريف ممتاز على كلا السطحين. يجف بسرعة بعد المطر. الري يمكن أن يؤثر على حالة العشب. المطر نادر في دبي.'
  },
  
  distanceFactors: {
    sprint: {
      range: '1000m-1300m',
      staminaRequired: 3,
      speedImportance: 10,
      accelerationImportance: 9,
      positionAtTurn: 'critical',
      earlySpeedValue: 10,
      finishSpeedValue: 8,
      description: 'Pure speed contests. The chute on the backstretch provides straight starts for sprints. Early position crucial. Draw advantage significant on dirt.',
      descriptionAr: 'سباقات سرعة بحتة. المسار الخلفي يوفر انطلاقات مستقيمة للسباقات القصيرة. المركز المبكر حاسم. ميزة الانطلاق مهمة على التراب.'
    },
    mile: {
      range: '1400m-1700m',
      staminaRequired: 5,
      speedImportance: 8,
      accelerationImportance: 8,
      positionAtTurn: 'important',
      earlySpeedValue: 8,
      finishSpeedValue: 9,
      description: 'Balanced tests. The 1600m starts from a chute on the backstretch. Tactical speed and finishing kick both important. 400m home straight gives closers a chance.',
      descriptionAr: 'اختبارات متوازنة. انطلاق 1600م من مسار على المستقيم الخلفي. السرعة التكتيكية وركلة النهاية كلاهما مهم. خط النهاية 400م يعطي المتأخرين فرصة.'
    },
    middle: {
      range: '1800m-2100m',
      staminaRequired: 7,
      speedImportance: 6,
      accelerationImportance: 7,
      positionAtTurn: 'moderate',
      earlySpeedValue: 6,
      finishSpeedValue: 9,
      description: 'Stamina becomes more important. Wide turns allow horses to maintain position. Closers have better chance with 400m straight. Dubai World Cup distance (2000m) is the highlight.',
      descriptionAr: 'قوة التحمل تصبح أكثر أهمية. المنعطفات الواسعة تسمح بالحفاظ على المركز. المتأخرون لديهم فرصة أفضل مع المستقيم 400م. مسافة كأس دبي العالمي (2000م) هي الأبرز.'
    },
    long: {
      range: '2200m-3200m',
      staminaRequired: 9,
      speedImportance: 4,
      accelerationImportance: 6,
      positionAtTurn: 'moderate',
      earlySpeedValue: 4,
      finishSpeedValue: 8,
      description: 'Stamina tests. Pace judgment crucial. Closers well suited. Dubai Sheema Classic (2410m) and Dubai Gold Cup (3200m) test true stayers.',
      descriptionAr: 'اختبارات تحمل. تقدير الوتيرة حاسم. المتأخرون مناسبون. كأس شيما كلاسيك (2410م) وكأس دبي الذهبي (3200م) يختبران خيول التحمل الحقيقية.'
    }
  },
  
  positionAdvantages: {
    insideAdvantage: 2,
    middleAdvantage: 1,
    outsideAdvantage: -1,
    frontRunning: 7,
    stalking: 8,
    closers: 7,
    description: 'Wide track (25m) reduces draw bias compared to narrower tracks. Stalkers and tactical runners have slight advantage. Outside draws not significantly disadvantaged. The chutes provide fairer starts for certain distances.',
    descriptionAr: 'المضمار الواسع (25م) يقلل من تحيز الانطلاق مقارنة بالمضامين الأضيق. المتتبعون والخيول التكتيكية لديهم ميزة طفيفة. الانطلاقات الخارجية ليست محرومة بشكل كبير. المسارات توفر انطلاقات أكثر عدلاً لمسافات معينة.'
  },
  
  weightImpact: {
    overall: 6,
    sprintImpact: 4,
    distanceImpact: 8,
    description: 'Weight has moderate impact on dirt due to deep surface, higher on turf in longer races. Longer distances amplify weight effects. The deep dirt surface makes weight more significant than on firier tracks.',
    descriptionAr: 'الوزن له تأثير معتدل على التراب بسبب السطح العميق، أعلى على العشب في السباقات الطويلة. المسافات الطويلة تضخم تأثيرات الوزن. السطح الترابي العميق يجعل الوزن أكثر أهمية من المضامين الأكثر ثباتاً.'
  },
  
  weatherSensitivity: {
    rain: 'low',
    rainAr: 'منخفض',
    wind: 'medium',
    windAr: 'متوسط',
    temperature: 'medium',
    temperatureAr: 'متوسط',
    description: 'Excellent all-weather facility. Rain has minimal impact due to excellent drainage. Wind can affect turf races more than dirt. Night racing under floodlights reduces heat stress.',
    descriptionAr: 'منشأة ممتازة لجميع الأجواء. المطر له تأثير ضئيل بسبب التصريف الممتاز. الرياح قد تؤثر على سباقات العشب أكثر من التراب. السباقات الليلية تحت الأضواء تقلل من إجهاد الحرارة.'
  },
  
  specialFeatures: [
    {
      name: 'World-Class Facility',
      nameAr: 'منشأة عالمية المستوى',
      impact: 'positive',
      description: 'Grandstand seats 60,000. The 1.6km long grandstand is the longest in the world. State-of-the-art facilities. Hosts Dubai World Cup, worlds richest horse race.',
      descriptionAr: 'المدرج يسع 60,000 متفرج. المدرج بطول 1.6 كم هو الأطول في العالم. مرافق متطورة. يستضيف كأس دبي العالمي، أغنى سباق خيول في العالم.'
    },
    {
      name: 'Wide Turns with Banking',
      nameAr: 'منعطفات واسعة مع ميل',
      impact: 'positive',
      description: 'Wide, sweeping turns with 5.5% banking allow horses to maintain momentum. Benefits long-striding horses and reduces positional disadvantage.',
      descriptionAr: 'المنعطفات الواسعة المنحنية مع ميل 5.5% تسمح للخيول بالحفاظ على الزخم. يفيد الخيول ذات الخطوات الطويلة ويقلل من الحرج المركزي.'
    },
    {
      name: '400m Home Straight',
      nameAr: 'خط نهاية 400م',
      impact: 'positive',
      description: '400m home straight gives closers plenty of time to make their move on both surfaces.',
      descriptionAr: 'خط النهاية 400م يعطي الخيول المتأخرة متسع من الوقت للحركة على كلا السطحين.'
    },
    {
      name: 'Chutes for Various Distances',
      nameAr: 'مسارات لمسافات مختلفة',
      impact: 'neutral',
      description: 'Chute located on the backstretch provides starts for 1200m, 1400m, 1600m sprints and miles. Some chute starts favor inside draws.',
      descriptionAr: 'مسار على المستقيم الخلفي يوفر انطلاقات لسباقات 1200م و 1400م و 1600م. بعض انطلاقات المسارات تفضل الانطلاقات الداخلية.'
    },
    {
      name: 'Floodlit Night Racing',
      nameAr: 'سباقات ليلية تحت الأضواء',
      impact: 'neutral',
      description: 'World-class floodlighting for night racing. Cooler temperatures benefit horse performance. Some horses perform better under lights.',
      descriptionAr: 'إضاءة كاشفة عالمية المستوى للسباقات الليلية. درجات الحرارة الأكثر برودة تفيد أداء الحصان. بعض الخيول تؤدي أفضل تحت الأضواء.'
    },
    {
      name: 'Dual Surface Venue',
      nameAr: 'مضمار مزدوج السطح',
      impact: 'positive',
      description: 'Both dirt and turf tracks offer versatility. Different surfaces attract different types of horses. Turf track is outside the dirt.',
      descriptionAr: 'كلا المضمارين الترابي والعشبي يوفران تنوعاً. الأسطح المختلفة تجذب أنواعاً مختلفة من الخيول. المضمار العشبي خارج الترابي.'
    }
  ]
};

export default meydanProfile;
