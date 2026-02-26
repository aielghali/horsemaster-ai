/**
 * ملف تعريف مضمار جبل علي - Jebel Ali Racecourse Profile
 * مضمار فريد من نوعه مع خصائص مميزة - نهاية صاعدة حادة
 * المعلومات مستخلصة من البحث على الويب
 */

import { TrackProfile } from './meydan';

export const jebelAliProfile: TrackProfile = {
  id: 'jebel-ali',
  name: 'Jebel Ali Racecourse',
  nameAr: 'مضمار جبل علي',
  location: 'Dubai, UAE',
  locationAr: 'دبي، الإمارات العربية المتحدة',
  
  surfaces: [
    {
      type: 'sand',
      typeAr: 'رمل مختلط بالزيت',
      circumference: 2200,
      homeStraight: 900,
      width: 18,
      description: 'Right-handed horseshoe-shaped track with 2200m racing distance. Unique sand surface mixed with recycled engine oil - very deep and stamina-sapping. Famous for its steep uphill finish in the final 200m, testing stamina and strength like European courses.',
      descriptionAr: 'مضمار على شكل حدوة حصان يميني بمسافة سباق 2200 متر. سطح رملي فريد مختلط بزيت محركات معاد تدويره - عميق جداً ومجهد للتحمل. مشهور بنهايته الصاعدة الحادة في آخر 200 متر، يختبر التحمل والقوة مثل المضامين الأوروبية.'
    }
  ],
  
  trackCharacteristics: {
    direction: 'right-handed',
    directionAr: 'يمين',
    shape: 'horseshoe',
    shapeAr: 'حدوة حصان',
    gradient: 'Flat for most part with STEEP uphill finish in last 200m. This unique European-style feature gives more action and tests genuine stamina. The uphill incline is a natural feature more commonly seen in UK courses.',
    gradientAr: 'مسطح في معظمه مع نهاية صاعدة حادة في آخر 200 متر. هذه الميزة الفريدة على الطراز الأوروبي تعطي إثارة أكبر وتختبر التحمل الحقيقي. الصعود الطبيعي يُرى أكثر في المضامين البريطانية.',
    turns: {
      numberOfTurns: 2,
      turnRadius: 'medium',
      turnRadiusAr: 'متوسط',
      firstTurnDistance: 400,
      finalTurnDistance: 900
    },
    drainage: 'Good natural drainage. Sand and oil mixture handles weather well but can become softer. Surface changes with weather conditions.',
    drainageAr: 'تصريف طبيعي جيد. خليط الرمل والزيت يتعامل مع الطقس جيداً لكن يمكن أن يصبح أكثر ليونة. السطح يتغير مع ظروف الطقس.'
  },
  
  distanceFactors: {
    sprint: {
      range: '1000m-1200m',
      staminaRequired: 5,
      speedImportance: 9,
      accelerationImportance: 8,
      positionAtTurn: 'critical',
      earlySpeedValue: 9,
      finishSpeedValue: 7,
      description: 'Speed is important but the deep surface and uphill finish require stamina even in sprints. 900m straight chute available for sprints. OUTSIDE DRAWS PERFORM BETTER in sprints (based on 15 Feb 2026 results - Malzoom won from gate 14, Triple Espresso from gate 9). Horses must handle the stamina-testing surface.',
      descriptionAr: 'السرعة مهمة لكن السطح العميق والنهاية الصاعدة تتطلب تحملاً حتى في السباقات القصيرة. مسار مستقيم 900م متاح للسباقات القصيرة. الانطلاقات الخارجية تؤدي أفضل في السباقات القصيرة (بناءً على نتائج 15 فبراير 2026 - Malzoom فاز من البوابة 14، Triple Espresso من البوابة 9). الخيول يجب أن تتعامل مع السطح المختبر للتحمل.'
    },
    mile: {
      range: '1400m-1600m',
      staminaRequired: 6,
      speedImportance: 7,
      accelerationImportance: 8,
      positionAtTurn: 'important',
      earlySpeedValue: 7,
      finishSpeedValue: 9,
      description: 'Tobuk curve is crucial in 1400m races. The unique right-handed turn tests balance. Uphill finish demands stamina. Position at final turn vital. 1400m straight chute provides fairer starts.',
      descriptionAr: 'منحنى تبوك حاسم في سباقات 1400م. المنعطف اليميني الفريد يختبر التوازن. النهاية الصاعدة تتطلب تحملاً. المركز عند المنعطف الأخير حيوي. مسار 1400م المستقيم يوفر انطلاقات أكثر عدلاً.'
    },
    middle: {
      range: '1800m-2000m',
      staminaRequired: 8,
      speedImportance: 5,
      accelerationImportance: 7,
      positionAtTurn: 'important',
      earlySpeedValue: 5,
      finishSpeedValue: 9,
      description: 'True stamina test. The 900m run-in is the longest in UAE. Horses must conserve energy for the uphill finish. Closers have significant advantage with the long straight and uphill finish.',
      descriptionAr: 'اختبار تحمل حقيقي. الجري النهائي 900م هو الأطول في الإمارات. يجب على الخيول حفظ الطاقة للنهاية الصاعدة. المتأخرون لديهم ميزة كبيرة مع المستقيم الطويل والنهاية الصاعدة.'
    },
    long: {
      range: '2200m-2400m',
      staminaRequired: 10,
      speedImportance: 3,
      accelerationImportance: 6,
      positionAtTurn: 'moderate',
      earlySpeedValue: 3,
      finishSpeedValue: 8,
      description: 'Extreme stamina required. Oil-mixed sand surface is very testing. The steep uphill finish breaks horses that lack genuine stamina. AMERICAN-BRED horses excel here (Killer Collect, Arlan - 15 Feb 2026). Older horses (7yo+) often place well. Only true stayers succeed here.',
      descriptionAr: 'تحمل شديد مطلوب. السطح الرملي المختلط بالزيت مجهد جداً. النهاية الصاعدة الحادة تحطم الخيول التي تفتقر للتحمل الحقيقي. الخيول الأمريكية الأصل تتفوق هنا (Killer Collect, Arlan - 15 فبراير 2026). الخيول الأكبر سناً (7+) غالباً تحتل مراكز متقدمة. فقط خيول التحمل الحقيقية تنجح هنا.'
    }
  },
  
  positionAdvantages: {
    // تم التعديل بناءً على نتائج 15 فبراير 2026
    // الخارجية أفضل في السبرنت بسبب السطح العميق
    insideAdvantage: 1,  // أقل من السابق (كان 3)
    middleAdvantage: 2,
    outsideAdvantage: 1,  // أفضل من السابق (كان -2)
    frontRunning: 6,
    stalking: 7,
    closers: 8,
    description: 'Draw bias is LESS significant than previously thought. Deep sand/oil surface actually favors OUTSIDE draws in sprints (1000-1200m) due to cleaner run. Inside draws still advantageous in longer races (1800m+) where position matters. The 900m run-in benefits closers significantly. UPDATED based on 15 Feb 2026 results where outside draws won sprints.',
    descriptionAr: 'تحيز الانطلاق أقل أهمية مما كان يُعتقد. السطح الرملي العميق يفضل الانطلاقات الخارجية في السباقات القصيرة (1000-1200م) بسبب الجري الأنظف. الانطلاقات الداخلية لا تزال مفضلة في السباقات الطويلة (1800م+) حيث المركز مهم. الجري النهائي 900م يفيد المتأخرين بشكل كبير. تم التحديث بناءً على نتائج 15 فبراير 2026.'
  },
  
  weightImpact: {
    overall: 8,
    sprintImpact: 5,
    distanceImpact: 9,
    description: 'Weight has HIGH impact due to deep sand/oil surface and steep uphill finish. Top weights struggle significantly in longer races. The stamina-sapping surface amplifies weight effects more than any other UAE track.',
    descriptionAr: 'الوزن له تأثير عالي جداً بسبب السطح العميق المختلط بالزيت والنهاية الصاعدة الحادة. الأوزان العالية تعاني بشدة في السباقات الطويلة. السطح المختبر للتحمل يضخم تأثيرات الوزن أكثر من أي مضمار إماراتي آخر.'
  },
  
  weatherSensitivity: {
    rain: 'medium',
    rainAr: 'متوسط',
    wind: 'low',
    windAr: 'منخفض',
    temperature: 'high',
    temperatureAr: 'عالي',
    description: 'Surface changes significantly with weather. Oil mixture can become slick in extreme heat. Cooler temperatures favor stamina horses. The sand/oil composition is unique and behaves differently than regular dirt.',
    descriptionAr: 'السطح يتغير بشكل كبير مع الطقس. خليط الزيت قد يصبح زلقاً في الحرارة الشديدة. درجات الحرارة الباردة تفضل خيول التحمل. تركيبة الرمل/الزيت فريدة وتتصرف بشكل مختلف عن التراب العادي.'
  },
  
  specialFeatures: [
    {
      name: 'Steep Uphill Finish',
      nameAr: 'نهاية صاعدة حادة',
      impact: 'positive',
      description: '200m steep uphill run to the finish - the most significant in UAE. Natural incline resembling European courses. Demands genuine stamina. Horses that stay win here. Front-runners often caught in final stages.',
      descriptionAr: '200 متر صعود حاد للنهاية - الأكثر أهمية في الإمارات. ميل طبيعي يشبه المضامين الأوروبية. يتطلب تحملاً حقيقياً. الخيول التي تصمد تفوز هنا. المتقدمون غالباً يُمسكون في المراحل النهائية.'
    },
    {
      name: 'Tobuk Curve',
      nameAr: 'منحنى تبوك',
      impact: 'positive',
      description: 'Unique sharp right-handed turn at the 1400m marker. Tests balance and agility. Position entering this turn is crucial. Tactical positioning essential.',
      descriptionAr: 'منعطف يميني حاد فريد عند علامة 1400م. يختبر التوازن والرشاقة. المركز عند دخول هذا المنعطف حاسم. التموضع التكتيكي ضروري.'
    },
    {
      name: 'Oil-Mixed Sand Surface',
      nameAr: 'سطح رمل مختلط بالزيت',
      impact: 'positive',
      description: 'Unique surface composition with recycled engine oil. Very deep and stamina-testing. Completely different from other UAE tracks. Horses need time to adapt to this surface.',
      descriptionAr: 'تركيبة سطح فريدة مع زيت محركات معاد تدويره. عميق جداً ويختبر التحمل. مختلف تماماً عن مضامين الإمارات الأخرى. الخيول تحتاج وقتاً للتأقلم مع هذا السطح.'
    },
    {
      name: 'Longest Run-In in UAE',
      nameAr: 'أطول جري نهائي في الإمارات',
      impact: 'positive',
      description: '900m from final turn to finish - longest in UAE. Combined with uphill finish, gives closers maximum opportunity to make up ground. Tactical races common.',
      descriptionAr: '900 متر من المنعطف الأخير للنهاية - الأطول في الإمارات. مع النهاية الصاعدة، يعطي المتأخرين فرصة قصوى لتعويض الأرضية. السباقات التكتيكية شائعة.'
    },
    {
      name: '1400m Straight Chute',
      nameAr: 'مسار مستقيم 1400م',
      impact: 'neutral',
      description: 'Dedicated straight chute for 1400m races. Level start with fairer draw distribution than the round course.',
      descriptionAr: 'مسار مستقيم مخصص لسباقات 1400م. انطلاق مستوي مع توزيع انطلاق أكثر عدلاً من المضمار الدائري.'
    },
    {
      name: 'Intimate Family Atmosphere',
      nameAr: 'أجواء عائلية حميمية',
      impact: 'neutral',
      description: 'Known for family-friendly atmosphere and picnic culture. Smaller crowds than Meydan mean less noise distraction. Historic venue opened 1990 under Sheikh Ahmed bin Rashid Al Maktoum.',
      descriptionAr: 'معروف بالأجواء العائلية وثقافة النزهات. الحشود الأصغر من ميدان تعني تشتيتاً أقل بالضوضاء. مكان تاريخي افتتح 1990 تحت رعاية الشيخ أحمد بن راشد آل مكتوم.'
    },
    {
      name: 'Right-Handed Direction',
      nameAr: 'اتجاه يميني',
      impact: 'neutral',
      description: 'Only right-handed dirt track in UAE. Horses that prefer right-handed running have advantage. Catches out horses used to left-handed Meydan.',
      descriptionAr: 'المضمار الترابي اليميني الوحيد في الإمارات. الخيول التي تفضل الجري يميناً لها ميزة. يفاجئ الخيول المعتادة على ميدان اليساري.'
    },
    {
      name: 'American-Bred Horses Excel',
      nameAr: 'تفوق الخيول الأمريكية',
      impact: 'positive',
      description: 'NEW (15 Feb 2026): American-bred horses show exceptional performance at Jebel Ali. Killer Collect and Arlan (1st & 2nd in Jebel Ali Stakes) both USA-bred. Consider this factor strongly for long distance races.',
      descriptionAr: 'جديد (15 فبراير 2026): الخيول الأمريكية الأصل تظهر أداءً استثنائياً في جبل علي. Killer Collect و Arlan (الأول والثاني في كأس جبل علي) كلاهما أمريكي. ضع هذا العامل بقوة للسباقات الطويلة.'
    },
    {
      name: 'Outside Draws Favorable in Sprints',
      nameAr: 'الانطلاقات الخارجية مفضلة في السبرنت',
      impact: 'positive',
      description: 'NEW (15 Feb 2026): Contrary to initial belief, outside draws (gates 9-14) performed BETTER in sprints. Malzoom won from gate 14, Triple Espresso from gate 9. Deep surface may give outside horses cleaner run.',
      descriptionAr: 'جديد (15 فبراير 2026): على عكس الاعتقاد الأولي، الانطلاقات الخارجية (البوابات 9-14) أدت أفضل في السباقات القصيرة. Malzoom فاز من البوابة 14، Triple Espresso من البوابة 9. السطح العميق قد يعطي الخيول الخارجية جرياً أنظف.'
    },
    {
      name: 'Tadhg O Shea Factor',
      nameAr: 'عامل تادغ أوشي',
      impact: 'positive',
      description: 'NEW (15 Feb 2026): Tadhg O Shea won 2 races on the card (Almutanabbi & Killer Collect). His experience at Jebel Ali is exceptional. Strongly consider his mounts.',
      descriptionAr: 'جديد (15 فبراير 2026): تادغ أوشي فاز بسباقين في البطاقة (Almutanabbi و Killer Collect). خبرته في جبل علي استثنائية. ضع في اعتبارك بقوة الخيول التي يركبها.'
    },
    {
      name: 'Older Horses Place Well',
      nameAr: 'الخيول الأكبر سناً تتقدم',
      impact: 'neutral',
      description: 'NEW (15 Feb 2026): Saayedd (8yo) placed 3rd in Jebel Ali Stakes. Older horses (7yo+) with experience often outrun younger rivals in stamina tests.',
      descriptionAr: 'جديد (15 فبراير 2026): Saayedd (8 سنوات) حل ثالثاً في كأس جبل علي. الخيول الأكبر سناً (7+ سنوات) ذات الخبرة غالباً تتفوق على المنافسين الأصغر في اختبارات التحمل.'
    }
  ]
};

export default jebelAliProfile;
