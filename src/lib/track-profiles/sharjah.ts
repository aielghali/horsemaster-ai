/**
 * ملف تعريف مضمار الشارقة - Sharjah Equestrian & Racing Club Profile
 * مضمار تاريخي مع خصائص فريدة
 * المعلومات مستخلصة من البحث على الويب
 */

import { TrackProfile } from './meydan';

export const sharjahProfile: TrackProfile = {
  id: 'sharjah',
  name: 'Sharjah Equestrian & Racing Club',
  nameAr: 'نادي الشارقة للفروسية والسباقات',
  location: 'Sharjah, UAE',
  locationAr: 'الشارقة، الإمارات العربية المتحدة',
  
  surfaces: [
    {
      type: 'dirt',
      typeAr: 'ترابي',
      circumference: 1750,
      homeStraight: 300,
      width: 16,
      description: 'LEFT-HANDED dirt oval track. Distance from final turn to finish line is 300m (1.5 furlongs). Traditional dirt surface that can ride deep and testing. Smaller facility with grandstand capacity of 1,000.',
      descriptionAr: 'مضمار ترابي بيضاوي يساري. المسافة من المنعطف الأخير لخط النهاية 300 متر (1.5 فلونج). سطح ترابي تقليدي يمكن أن يكون عميقاً ومجرداً. منشأة أصغر بسعة مدرج 1,000 متفرج.'
    }
  ],
  
  trackCharacteristics: {
    direction: 'left-handed',
    directionAr: 'يسار',
    shape: 'oval',
    shapeAr: 'بيضاوي',
    gradient: 'Flat track with no significant elevation changes. Shorter home straight (300m) than other UAE tracks.',
    gradientAr: 'مضمار مسطح بدون تغييرات ارتفاع كبيرة. خط نهاية أقصر (300م) من مضامين الإمارات الأخرى.',
    turns: {
      numberOfTurns: 2,
      turnRadius: 'tight',
      turnRadiusAr: 'ضيق',
      firstTurnDistance: 400,
      finalTurnDistance: 300
    },
    drainage: 'Standard drainage. Can become heavy after rain. Surface conditions can vary more than at major tracks.',
    drainageAr: 'تصريف قياسي. يمكن أن يصبح ثقيلاً بعد المطر. ظروف السطح يمكن أن تختلف أكثر من المضامين الرئيسية.'
  },
  
  distanceFactors: {
    sprint: {
      range: '1000m-1200m',
      staminaRequired: 4,
      speedImportance: 9,
      accelerationImportance: 8,
      positionAtTurn: 'critical',
      earlySpeedValue: 9,
      finishSpeedValue: 7,
      description: 'Speed important but surface can be tiring. The short 300m straight means position at the turn is crucial. Inside draws very valuable.',
      descriptionAr: 'السرعة مهمة لكن السطح قد يكون مرهقاً. المستقيم القصير 300م يعني أن المركز عند المنعطف حاسم. الانطلاقات الداخلية قيمة جداً.'
    },
    mile: {
      range: '1400m-1600m',
      staminaRequired: 5,
      speedImportance: 7,
      accelerationImportance: 8,
      positionAtTurn: 'important',
      earlySpeedValue: 7,
      finishSpeedValue: 8,
      description: 'Tight turns test agility. Position at the final turn crucial due to short straight. Tactical racing is common.',
      descriptionAr: 'المنعطفات الضيقة تختبر الرشاقة. المركز عند المنعطف الأخير حاسم بسبب المستقيم القصير. السباقات التكتيكية شائعة.'
    },
    middle: {
      range: '1700m-2000m',
      staminaRequired: 7,
      speedImportance: 5,
      accelerationImportance: 7,
      positionAtTurn: 'important',
      earlySpeedValue: 5,
      finishSpeedValue: 8,
      description: 'Stamina becomes important. The deep surface tests staying power. Limited meetings mean horses may lack course experience.',
      descriptionAr: 'قوة التحمل تصبح مهمة. السطح العميق يختبر قوة البقاء. الاجتماعات المحدودة تعني أن الخيول قد تفتقر لخبرة المضمار.'
    },
    long: {
      range: '2200m+',
      staminaRequired: 8,
      speedImportance: 4,
      accelerationImportance: 6,
      positionAtTurn: 'moderate',
      earlySpeedValue: 4,
      finishSpeedValue: 7,
      description: 'Full stamina test. Often attracts local stayers. Surface can be very testing in longer races. Less common distance at this track.',
      descriptionAr: 'اختبار تحمل كامل. غالباً يجذب خيول التحمل المحلية. السطح قد يكون مجهداً جداً في السباقات الطويلة. مسافة أقل شيوعاً في هذا المضمار.'
    }
  },
  
  positionAdvantages: {
    insideAdvantage: 4,
    middleAdvantage: 2,
    outsideAdvantage: -3,
    frontRunning: 7,
    stalking: 6,
    closers: 5,
    description: 'Tight turns and short 300m home straight HEAVILY favor inside draws. Rail position very valuable. Front-runners have advantage as closers have less time to make up ground. The narrow track (16m) amplifies draw bias.',
    descriptionAr: 'المنعطفات الضيقة وخط النهاية القصير 300م يفضلان بشدة الانطلاقات الداخلية. مركز السياج قيم جداً. المتقدمون لديهم ميزة لأن المتأخرين لديهم وقت أقل لتعويض الأرضية. المضمار الضيق (16م) يضخم تحيز الانطلاق.'
  },
  
  weightImpact: {
    overall: 6,
    sprintImpact: 4,
    distanceImpact: 8,
    description: 'Weight has moderate to high impact. Deep surface amplifies weight effect in longer races. Smaller fields can mean less weight variation.',
    descriptionAr: 'الوزن له تأثير متوسط إلى عالي. السطح العميق يضخم تأثير الوزن في السباقات الطويلة. الحقول الأصغر قد تعني تباين وزن أقل.'
  },
  
  weatherSensitivity: {
    rain: 'high',
    rainAr: 'عالي',
    wind: 'medium',
    windAr: 'متوسط',
    temperature: 'medium',
    temperatureAr: 'متوسط',
    description: 'Surface changes significantly with weather. Rain makes track heavy and stamina-sapping. More variable conditions than major tracks like Meydan. Afternoon racing exposes to weather.',
    descriptionAr: 'السطح يتغير بشكل كبير مع الطقس. المطر يجعل المضمار ثقيلاً ومجرداً للتحمل. ظروف أكثر تقلباً من المضامين الرئيسية مثل ميدان. السباقات بعد الظهر مكشوفة للطقس.'
  },
  
  specialFeatures: [
    {
      name: 'Tight Turns',
      nameAr: 'منعطفات ضيقة',
      impact: 'positive',
      description: 'Sharp left-handed turns. Favors agile horses and inside draws significantly. Horses that can maintain position on turns excel.',
      descriptionAr: 'منعطفات يسارية حادة. تفضل الخيول الرشيقة والانطلاقات الداخلية بشكل كبير. الخيول التي تحافظ على مركزها في المنعطفات تتفوق.'
    },
    {
      name: 'Short Home Straight',
      nameAr: 'خط نهاية قصير',
      impact: 'positive',
      description: 'Only 300m from final turn to finish - shortest in UAE. Heavily favors horses with position at the turn. Closers struggle to make up ground. Front-runners and stalkers advantaged.',
      descriptionAr: 'فقط 300م من المنعطف الأخير للنهاية - الأقصر في الإمارات. يفضل بشدة الخيول ذات المركز عند المنعطف. المتأخرون يعانون لتعويض الأرضية. المتقدمون والمتتبعون لديهم ميزة.'
    },
    {
      name: 'Historic Venue',
      nameAr: 'مكان تاريخي',
      impact: 'neutral',
      description: 'Traditional atmosphere with smaller crowds. Familiarity helps local horses. Less intimidating for young or inexperienced horses.',
      descriptionAr: 'أجواء تقليدية مع حشود أصغر. المعرفة تساعد الخيول المحلية. أقل إرهاباً للخيول الصغيرة أو عديمة الخبرة.'
    },
    {
      name: 'Limited Season (6 Meetings)',
      nameAr: 'موسم محدود (6 اجتماعات)',
      impact: 'neutral',
      description: 'Only six race meetings per season. Horses may lack course experience. Form can be harder to assess with limited data.',
      descriptionAr: 'فقط ستة اجتماعات سباق لكل موسم. الخيول قد تفتقر لخبرة المضمار. الأداء قد يكون أصعب في التقييم مع بيانات محدودة.'
    },
    {
      name: 'Afternoon Racing Only',
      nameAr: 'سباقات بعد الظهر فقط',
      impact: 'neutral',
      description: 'Day racing only - different conditions than evening tracks. Weather and temperature have more impact. No floodlights.',
      descriptionAr: 'سباقات نهارية فقط - ظروف مختلفة عن مضامين المساء. الطقس ودرجة الحرارة لهما تأثير أكبر. لا أضواء كاشفة.'
    },
    {
      name: 'Smaller Field Sizes',
      nameAr: 'حقول أصغر',
      impact: 'positive',
      description: 'Often smaller fields than Meydan. Reduces traffic problems. Inside draws still valuable but less chaotic than big-field races.',
      descriptionAr: 'غالباً حقول أصغر من ميدان. يقلل من مشاكل الزحام. الانطلاقات الداخلية لا تزال قيمة لكن أقل فوضى من سباقات الحقول الكبيرة.'
    },
    {
      name: 'Narrow Track (16m)',
      nameAr: 'مضمار ضيق (16م)',
      impact: 'neutral',
      description: 'At 16m wide, narrower than Meydan (25m) and Al Ain (20m). Amplifies draw bias. Traffic issues more likely in larger fields.',
      descriptionAr: 'بعرض 16م، أضيق من ميدان (25م) والعين (20م). يضخم تحيز الانطلاق. مشاكل الزحام أكثر احتمالاً في الحقول الأكبر.'
    }
  ]
};

export default sharjahProfile;
