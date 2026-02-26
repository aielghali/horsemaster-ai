/**
 * ملف تعريف مضمار وولفرهامبتون - Wolverhampton Racecourse Profile
 * مضمار All-Weather في المملكة المتحدة
 * تم التحديث: 16 فبراير 2026 - بناءً على النتائج الفعلية
 */

import { TrackProfile } from './meydan';

export const wolverhamptonProfile: TrackProfile = {
  id: 'wolverhampton',
  name: 'Wolverhampton Racecourse',
  nameAr: 'مضمار وولفرهامبتون',
  location: 'Dunstall Park, Wolverhampton, UK',
  locationAr: 'دونستول بارك، وولفرهامبتون، المملكة المتحدة',
  
  surfaces: [
    {
      type: 'synthetic',  // Tapeta
      typeAr: 'تابيتا (اصطناعي)',
      circumference: 1600,  // Just under a mile
      homeStraight: 350,  // Under 2 furlongs - short
      width: 20,
      description: 'Left-handed flat oval circuit just under a mile in circumference. TAPETA surface - first UK track to install it in 2014. Silica sand with wax and fibers. Fairly sharp bends with narrow straight. Tight track with MODERATE draw bias - less pronounced than previously thought based on Feb 16 2026 results.',
      descriptionAr: 'مضمار بيضاوي مسطح يساري بمحيط أقل قليلاً من الميل. سطح تابيتا - أول مضمار بريطاني يركبه عام 2014. رمل سيليكا مع شمع وألياف. منعطفات حادة نوعاً ما مع خط مستقيم ضيق. تحيز انطلاق معتدل - أقل وضوحاً مما كان متوقعاً.'
    }
  ],
  
  trackCharacteristics: {
    direction: 'left-handed',
    directionAr: 'يسار',
    shape: 'oval',
    shapeAr: 'بيضاوي',
    gradient: 'Flat track - pan-flat throughout. No elevation changes. Tight turns require agility. Short run-in of under 2 furlongs.',
    gradientAr: 'مضمار مسطح تماماً - بدون تغييرات في الارتفاع. المنعطفات الحادة تتطلب رشاقة. خط نهاية قصير أقل من 2 فلونج.',
    turns: {
      numberOfTurns: 2,
      turnRadius: 'tight',
      turnRadiusAr: 'ضيق',
      firstTurnDistance: 300,
      finalTurnDistance: 350
    },
    drainage: 'All-weather surface - consistent drainage. Races in all weather conditions. Tapeta handles rain well. Standard going most common.',
    drainageAr: 'سطح جميع الأجواء - تصريف ثابت. السباقات في جميع الظروف الجوية. التابيتا يتعامل مع المطر جيداً. الأرضية القياسية هي الأكثر شيوعاً.'
  },
  
  distanceFactors: {
    sprint: {
      range: '1000m-1200m (5f-6f)',
      staminaRequired: 3,
      speedImportance: 10,
      accelerationImportance: 9,
      positionAtTurn: 'critical',
      earlySpeedValue: 10,
      finishSpeedValue: 8,
      // UPDATED: Based on Feb 16 2026 - low draw won Race 1 (5f)
      description: 'Pure speed on Tapeta. LOW draws have MODERATE advantage (not strong). Based on Feb 16 2026: 5f winner from draw 2, but high draws can also win. Market confidence more important than draw position. Front-runners perform well.',
      descriptionAr: 'سرعة بحتة على التابيتا. الانطلاقات المنخفضة لها ميزة معتدلة (ليست قوية). بناءً على 16 فبراير 2026: فائز 5f من الانطلاق 2، لكن الانطلاقات العالية يمكن أن تفوز أيضاً. ثقة السوق أهم من موقع الانطلاق.'
    },
    mile: {
      range: '1400m-1700m (7f-1m)',
      staminaRequired: 5,
      speedImportance: 7,
      accelerationImportance: 8,
      positionAtTurn: 'important',
      earlySpeedValue: 7,
      finishSpeedValue: 9,
      // UPDATED: Based on Feb 16 2026 - 7f winner from draw 9 (HIGH)!
      description: 'Balanced test. Draw bias MINIMAL at 7f. Feb 16 2026: Faster Bee won 7f race from draw 9 at 16/1! Market confidence and recent form more important than draw. Tactical speed important.',
      descriptionAr: 'اختبار متوازن. تحيز الانطلاق ضئيل في 7f. 16 فبراير 2026: Faster Bee فاز بسباق 7f من الانطلاق 9 بـ 16/1! ثقة السوق والأداء الأخير أهم من الانطلاق.'
    },
    middle: {
      range: '1800m-2200m (1m-1m2f)',
      staminaRequired: 6,
      speedImportance: 6,
      accelerationImportance: 7,
      positionAtTurn: 'moderate',
      earlySpeedValue: 6,
      finishSpeedValue: 8,
      description: 'Stamina becomes more relevant. Draw bias MINIMAL at longer distances. Closers have more chance with longer run. Standard mile test.',
      descriptionAr: 'قوة التحمل تصبح أكثر أهمية. تحيز الانطلاق ضئيل في المسافات الطويلة. المتأخرون لديهم فرصة أكبر مع الجري الأطول. اختبار ميل قياسي.'
    },
    long: {
      range: '2400m+ (1m4f+)',
      staminaRequired: 8,
      speedImportance: 4,
      accelerationImportance: 6,
      positionAtTurn: 'moderate',
      earlySpeedValue: 4,
      finishSpeedValue: 7,
      description: 'Stamina test on Tapeta. 1m4f races test staying power. Draw irrelevant at this distance. Genuine stayers required. Rarely run here.',
      descriptionAr: 'اختبار تحمل على التابيتا. سباقات 1m4f تختبر قوة البقاء. الانطلاق غير مهم في هذه المسافة. يحتاج خيول تحمل حقيقية. نادراً ما تُركض هنا.'
    }
  },
  
  positionAdvantages: {
    // UPDATED: Reduced from 4 to 2 based on actual results
    insideAdvantage: 2,  // MODERATE inside bias (reduced from 4)
    middleAdvantage: 1,
    // UPDATED: Reduced penalty from -3 to -1
    outsideAdvantage: -1,  // Outside draws less disadvantaged than thought
    frontRunning: 8,
    stalking: 7,
    closers: 5,  // Short straight hurts closers
    description: 'MODERATE LOW DRAW BIAS - less pronounced than previously thought. Based on Feb 16 2026 results: High draws CAN win (Faster Bee draw 9, Beauzon draw 7). Market confidence and recent form often MORE important than draw position. Short straight (under 2f) still benefits leaders.',
    descriptionAr: 'تحيز انطلاق منخفض معتدل - أقل وضوحاً مما كان متوقعاً. بناءً على نتائج 16 فبراير 2026: الانطلاقات العالية يمكن أن تفوز. ثقة السوق والأداء الأخير غالباً أهم من موقع الانطلاق.'
  },
  
  weightImpact: {
    overall: 5,
    sprintImpact: 3,
    distanceImpact: 7,
    description: 'Weight has moderate impact on Tapeta surface. Less significant than on turf. Firm surface reduces weight effects. Standard all-weather conditions.',
    descriptionAr: 'الوزن له تأثير معتدل على سطح التابيتا. أقل أهمية من العشب. السطح الثابت يقلل من تأثيرات الوزن. ظروف جميع الأجواء القياسية.'
  },
  
  weatherSensitivity: {
    rain: 'low',
    rainAr: 'منخفض',
    wind: 'medium',
    windAr: 'متوسط',
    temperature: 'low',
    temperatureAr: 'منخفض',
    description: 'All-weather surface means consistent conditions. Rain has minimal impact on Tapeta. Wind can affect exposed sections. Temperature has little effect. Standard going predominates.',
    descriptionAr: 'سطح جميع الأجواء يعني ظروفاً ثابتة. المطر له تأثير ضئيل على التابيتا. الرياح قد تؤثر على الأقسام المكشوفة. درجة الحرارة لها تأثير قليل. الأرضية القياسية هي السائدة.'
  },
  
  specialFeatures: [
    {
      name: 'Tapeta Surface',
      nameAr: 'سطح تابيتا',
      impact: 'positive',
      description: 'First UK track to install Tapeta (2014). Silica sand with wax and fibers. Consistent surface that handles all weather. Different from Polytrack - more cushioned. Horses need to adapt to this surface.',
      descriptionAr: 'أول مضمار بريطاني يركب التابيتا (2014). رمل سيليكا مع شمع وألياف. سطح ثابت يتعامل مع جميع الأجواء. مختلف عن بوليتراك - أكثر نعومة. الخيول تحتاج للتأقلم مع هذا السطح.'
    },
    {
      name: 'Tight Oval',
      nameAr: 'مضمار بيضاوي ضيق',
      impact: 'positive',
      description: 'Circuit just under a mile with sharp bends. Tight turns favor agile horses. Position at turns important but not critical. Short straight benefits leaders.',
      descriptionAr: 'دائرة أقل قليلاً من الميل مع منعطفات حادة. المنعطفات الضيقة تفضل الخيول الرشيقة. المركز عند المنعطفات مهم لكن ليس حاسماً.'
    },
    {
      name: 'Moderate Draw Bias',
      nameAr: 'تحيز انطلاق معتدل',
      impact: 'positive',
      // UPDATED
      description: 'MODERATE low draw bias - LESS PRONOUNCED than expected. High draws CAN win (Feb 16 2026: Faster Bee draw 9 won 7f at 16/1, Beauzon draw 7 won 6f). Draw bias varies by distance: 5f (moderate), 6f-7f (minimal), 1m+ (negligible).',
      descriptionAr: 'تحيز انطلاق منخفض معتدل - أقل وضوحاً من المتوقع. الانطلاقات العالية يمكن أن تفوز. التحيز يختلف حسب المسافة: 5f (معتدل)، 6f-7f (ضئيل)، 1m+ (معدوم).'
    },
    {
      name: 'Short Home Straight',
      nameAr: 'خط نهاية قصير',
      impact: 'positive',
      description: 'Under 2 furlongs (approx 350m) from final turn to finish. Closers have less time to make up ground. Front-runners and stalkers advantaged. Position at turn vital.',
      descriptionAr: 'أقل من 2 فلونج (حوالي 350م) من المنعطف الأخير للنهاية. المتأخرون لديهم وقت أقل لتعويض الأرضية. المتقدمون والمتتبعون لديهم ميزة. المركز عند المنعطف حيوي.'
    },
    {
      // NEW: Based on Feb 16 2026 results
      name: 'Market Confidence Important',
      nameAr: 'ثقة السوق مهمة',
      impact: 'positive',
      description: 'Favorites perform well at Wolverhampton. Feb 16 2026: 40% favorite win rate (Silky Wilkie 10/3F, Beauzon 11/10F). When market supports a horse, respect it highly. SP shorter than 3/1 = +15% confidence boost.',
      descriptionAr: 'المفضلون يؤدون جيداً في وولفرهامبتون. 16 فبراير 2026: 40% نسبة فوز للمفضلين. عندما السوق يدعم حصاناً، احترمه بشكل كبير. احتمالات أقل من 3/1 = +15% ثقة.'
    },
    {
      // NEW: Based on Feb 16 2026 results
      name: 'Recent Form Critical',
      nameAr: 'الأداء الأخير حاسم',
      impact: 'positive',
      description: 'Horses with good recent form can win from any draw. Feb 16 2026: Faster Bee won from draw 9 at 16/1 - had decent recent runs. Recent form often outweighs draw disadvantage. Weight recent runs heavily.',
      descriptionAr: 'الخيول ذات الأداء الجيد الأخير يمكن أن تفوز من أي انطلاق. الأداء الأخير غالباً يفوق ضرر الانطلاق السيء. وزّع الجريات الأخيرة بثقل.'
    },
    {
      name: 'Course and Distance Specialists',
      nameAr: 'متخصصون في المضمار والمسافة',
      impact: 'positive',
      description: 'Horses with good record at Wolverhampton (CD or C mark) often repeat. Tapeta specialists exist. Course form very relevant.',
      descriptionAr: 'الخيول ذات السجل الجيد في وولفرهامبتون (علامة CD أو C) غالباً تكرر. يوجد متخصصون في التابيتا. أداء المضمار ذو صلة كبيرة.'
    }
  ],
  
  // NEW: Actual Results for Training/Reference
  actualResults: {
    '2026-02-16': {
      races: [
        {
          race: 1,
          time: '17:00',
          name: 'Midnite A Next Generation Betting App Handicap',
          distance: '5f 21y',
          results: [
            { pos: 1, horse: 'Cressida Wildes', num: 3, draw: 2, sp: '12/1' },
            { pos: 2, horse: 'Alondra', num: 1, draw: 5, sp: '13/8 F' },
            { pos: 3, horse: "Lion's House", num: 5, draw: 1, sp: '4/1' },
          ]
        },
        {
          race: 2,
          time: '17:30',
          name: 'Bet £10 Get £40 With BetMGM Handicap',
          distance: '7f 36y',
          results: [
            { pos: 1, horse: 'Faster Bee', num: 10, draw: 9, sp: '16/1' },
            { pos: 2, horse: 'Nammos', num: 6, draw: 1, sp: '11/2' },
            { pos: 3, horse: 'Instant Bond', num: 5, draw: 3, sp: '7/1' },
          ],
          note: 'HIGH DRAW WON! Draw 9 winner at 16/1 - model needs to consider longshots from wide draws'
        },
        {
          race: 3,
          time: '18:00',
          name: 'Midnite: Built For 2026 Not 2006 Maiden Stakes',
          distance: '6f 20y',
          results: [
            { pos: 1, horse: "Arishka's Dream", num: 3, draw: 5, sp: '5/2' },
            { pos: 2, horse: 'Perola', num: 2, draw: 1, sp: '11/10 F' },
            { pos: 3, horse: 'Lovethiswayagain', num: 1, draw: 1, sp: '15/8' },
          ]
        },
        {
          race: 4,
          time: '18:30',
          name: 'Make The Move To Midnite Handicap',
          distance: '6f 20y',
          results: [
            { pos: 1, horse: 'Silky Wilkie', num: 1, draw: 3, sp: '10/3 F' },
            { pos: 2, horse: 'Water Of Leith', num: 8, draw: 4, sp: '13/2' },
            { pos: 3, horse: 'Papa Cocktail', num: 2, draw: 5, sp: '9/4' },
          ],
          note: 'FAVORITE WON - model should weight market confidence more'
        },
        {
          race: 5,
          time: '19:00',
          name: 'Midnite Are Upping The Betting Game Handicap',
          distance: '6f 20y',
          results: [
            { pos: 1, horse: 'Beauzon', num: 3, draw: 7, sp: '11/10 F' },
            { pos: 2, horse: 'Dark Sun', num: 4, draw: 1, sp: '22/1' },
            { pos: 3, horse: 'Ardaddy', num: 7, draw: 5, sp: '3/1' },
          ],
          note: 'HIGH DRAW FAVORITE WON - draw 7 won as 11/10 favorite'
        },
        {
          race: 6,
          time: '19:30',
          name: 'Watch Race Replays Handicap',
          distance: '1m 142y',
          results: [
            { pos: 1, horse: 'Samra Star', num: 6, draw: null, sp: '10/3' },
          ]
        },
        {
          race: 7,
          time: '20:00',
          name: 'Join The Midnite Movement Handicap',
          distance: '6f 20y',
          results: [
            { pos: 1, horse: 'Little Miss India', num: 4, draw: 5, sp: null },
            { pos: 2, horse: 'Zenato', num: 3, draw: null, sp: null },
          ]
        }
      ],
      lessonsLearned: [
        'Draw bias less pronounced than expected',
        'Favorites win ~40% - respect market',
        'High draws CAN win, especially at 7f',
        'Recent form often outweighs draw',
        'Longshots from wide draws possible'
      ]
    }
  }
};

export default wolverhamptonProfile;
