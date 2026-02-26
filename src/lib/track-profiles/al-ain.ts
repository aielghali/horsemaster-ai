/**
 * ملف تعريف مضمار العين - Al Ain Racecourse Profile
 * أكبر مضمار في الإمارات - 2500م محيط
 * المعلومات مستخلصة من البحث على الويب
 */

import { TrackProfile } from './meydan';

export const alAinProfile: TrackProfile = {
  id: 'al-ain',
  name: 'Al Ain Racecourse',
  nameAr: 'مضمار العين',
  location: 'Al Ain, UAE',
  locationAr: 'العين، الإمارات العربية المتحدة',
  
  surfaces: [
    {
      type: 'mixed',
      typeAr: 'رمل وألياف',
      circumference: 2500,
      homeStraight: 500,
      width: 20,
      description: 'LARGEST track in UAE at 2500m circumference. Natural sand and dirt mixture with fiber - described as sand and fiber surface. Deep and stamina-testing. Modern facility that opened in 2014.',
      descriptionAr: 'أكبر مضمار في الإمارات بمحيط 2500 متر. خليط رمل وتراب طبيعي مع ألياف - يُوصف كسطح رمل وألياف. عميق ويختبر التحمل. منشأة حديثة افتتحت عام 2014.'
    }
  ],
  
  trackCharacteristics: {
    direction: 'left-handed',
    directionAr: 'يسار',
    shape: 'oval',
    shapeAr: 'بيضاوي',
    gradient: 'Flat track with wide, sweeping turns. No significant elevation changes. Very galloping track with plenty of room.',
    gradientAr: 'مضمار مسطح مع منعطفات واسعة ومنحنية. لا توجد تغييرات ارتفاع كبيرة. مضمار للجري مع مساحة كبيرة.',
    turns: {
      numberOfTurns: 2,
      turnRadius: 'wide',
      turnRadiusAr: 'واسع',
      firstTurnDistance: 500,
      finalTurnDistance: 500
    },
    drainage: 'Good natural drainage. Sand and fiber mixture handles weather conditions well. Surface remains consistent.',
    drainageAr: 'تصريف طبيعي جيد. خليط الرمل والألياف يتعامل مع ظروف الطقس جيداً. السطح يبقى ثابتاً.'
  },
  
  distanceFactors: {
    sprint: {
      range: '1000m-1200m',
      staminaRequired: 4,
      speedImportance: 9,
      accelerationImportance: 8,
      positionAtTurn: 'important',
      earlySpeedValue: 9,
      finishSpeedValue: 8,
      description: 'Speed contests but deep surface demands more stamina than typical sprints. Wide track reduces draw bias. Horses need to handle the stamina-sapping surface.',
      descriptionAr: 'سباقات سرعة لكن السطح العميق يتطلب تحملاً أكثر من السباقات القصيرة العادية. المضمار الواسع يقلل من تحيز الانطلاق. الخيول تحتاج للتعامل مع السطح المختبر للتحمل.'
    },
    mile: {
      range: '1400m-1600m',
      staminaRequired: 6,
      speedImportance: 7,
      accelerationImportance: 8,
      positionAtTurn: 'moderate',
      earlySpeedValue: 7,
      finishSpeedValue: 9,
      description: 'Wide sweeping turns allow smooth running. Balanced test of speed and stamina. The large circumference gives horses time to find position.',
      descriptionAr: 'المنعطفات الواسعة المنحنية تسمح بجري سلس. اختبار متوازن للسرعة والتحمل. المحيط الكبير يعطي الخيول وقتاً لإيجاد المركز.'
    },
    middle: {
      range: '1800m-2200m',
      staminaRequired: 8,
      speedImportance: 5,
      accelerationImportance: 7,
      positionAtTurn: 'moderate',
      earlySpeedValue: 5,
      finishSpeedValue: 8,
      description: 'Stamina becomes crucial on the large track. The 2500m circumference means horses cover a full circuit. Closers have room to run. Al Ain Cup distance tests true stayers.',
      descriptionAr: 'قوة التحمل تصبح حاسمة على المضمار الكبير. محيط 2500م يعني أن الخيول تغطي دائرة كاملة. المتأخرون لديهم مساحة للجري. مسافة كأس العين تختبر خيول التحمل الحقيقية.'
    },
    long: {
      range: '2400m+',
      staminaRequired: 9,
      speedImportance: 4,
      accelerationImportance: 6,
      positionAtTurn: 'moderate',
      earlySpeedValue: 4,
      finishSpeedValue: 7,
      description: 'Full stamina test on the largest UAE track. The deep sand/fiber surface is very testing. Genuine stayers excel. Long races showcase the tracks stamina demands.',
      descriptionAr: 'اختبار تحمل كامل على أكبر مضمار إماراتي. السطح العميق من الرمل/الألياف مجهد جداً. خيول التحمل الحقيقية تتفوق. السباقات الطويلة تُظهر متطلبات التحمل للمضمار.'
    }
  },
  
  positionAdvantages: {
    insideAdvantage: 1,
    middleAdvantage: 2,
    outsideAdvantage: 1,
    frontRunning: 6,
    stalking: 8,
    closers: 7,
    description: 'Wide 2500m track provides fair races with minimal draw bias. Outside draws are not disadvantaged. Stalkers have advantage on the large galloping track. The wide turns suit horses that maintain momentum.',
    descriptionAr: 'المضمار الواسع 2500م يوفر سباقات عادلة مع تحيز انطلاق ضئيل. الانطلاقات الخارجية ليست محرومة. المتتبعون لديهم ميزة على المضمار الكبير للجري. المنعطفات الواسعة تناسب الخيول التي تحافظ على الزخم.'
  },
  
  weightImpact: {
    overall: 7,
    sprintImpact: 4,
    distanceImpact: 9,
    description: 'Weight is significant on the deep sand/fiber surface. The large circumference amplifies weight effect over longer distances. Top weights can struggle in stamina tests.',
    descriptionAr: 'الوزن مهم على السطح العميق من الرمل/الألياف. المحيط الكبير يضخم تأثير الوزن على المسافات الطويلة. الأوزان العالية قد تعاني في اختبارات التحمل.'
  },
  
  weatherSensitivity: {
    rain: 'low',
    rainAr: 'منخفض',
    wind: 'low',
    windAr: 'منخفض',
    temperature: 'medium',
    temperatureAr: 'متوسط',
    description: 'Good all-weather surface. Natural sand mixture handles conditions well. Al Ains inland location can mean cooler evening temperatures. Sand/fiber surface is less affected by weather than pure dirt.',
    descriptionAr: 'سطح جيد لجميع الأجواء. خليط الرمل الطبيعي يتعامل مع الظروف جيداً. موقع العين الداخلي قد يعني درجات حرارة مسائية أبرد. سطح الرمل/الألياف أقل تأثراً بالطقس من التراب البحت.'
  },
  
  specialFeatures: [
    {
      name: 'Largest Track in UAE',
      nameAr: 'أكبر مضمار في الإمارات',
      impact: 'positive',
      description: '2500m circumference - the largest in UAE. Plenty of room for horses throughout the race. Reduces traffic issues. The sheer size makes it a unique stamina test.',
      descriptionAr: 'محيط 2500م - الأكبر في الإمارات. مساحة كبيرة للخيول خلال السباق. يقلل من مشاكل الزحام. الحجم الكبير يجعله اختبار تحمل فريد.'
    },
    {
      name: 'Sand and Fiber Surface',
      nameAr: 'سطح رمل وألياف',
      impact: 'positive',
      description: 'Natural sand mixed with fiber creates a unique surface. Different from other UAE tracks. Deep and stamina-testing. Horses need specific experience on this surface.',
      descriptionAr: 'رمل طبيعي مختلط بألياف يخلق سطحاً فريداً. مختلف عن مضامين الإمارات الأخرى. عميق ويختبر التحمل. الخيول تحتاج خبرة محددة على هذا السطح.'
    },
    {
      name: 'Wide Galloping Turns',
      nameAr: 'منعطفات واسعة للجري',
      impact: 'positive',
      description: 'Sweeping wide turns allow horses to maintain momentum throughout. Benefits long-striding horses. Fair for all running styles.',
      descriptionAr: 'المنعطفات الواسعة المنحنية تسمح للخيول بالحفاظ على الزخم طوال الوقت. تفيد الخيول ذات الخطوات الطويلة. عادل لجميع أساليب الجري.'
    },
    {
      name: 'Modern Facility (2014)',
      nameAr: 'منشأة حديثة (2014)',
      impact: 'positive',
      description: 'Opened in 2014 as a state-of-the-art facility. Good amenities and infrastructure. The track was built with modern specifications under Al Ain Equestrian, Shooting & Golf Club.',
      descriptionAr: 'افتتحت عام 2014 كمنشأة متطورة. وسائل راحة وبنية تحتية جيدة. بُني المضمار بمواصفات حديثة تحت نادي العين للفروسية والرماية والغولف.'
    },
    {
      name: 'Evening Racing',
      nameAr: 'سباقات مسائية',
      impact: 'positive',
      description: 'Night racing under lights. Cooler conditions in Al Ains desert location benefit performance. Evening meetings are popular.',
      descriptionAr: 'سباقات ليلية تحت الأضواء. الظروف الأكثر برودة في موقع العين الصحراوي تفيد الأداء. الاجتماعات المسائية شائعة.'
    },
    {
      name: 'Minimal Draw Bias',
      nameAr: 'تحيز انطلاق ضئيل',
      impact: 'positive',
      description: 'The wide 2500m track means very fair races. All positions have equal chance. Outside draws perform as well as inside. One of the fairest tracks in UAE.',
      descriptionAr: 'المضمار الواسع 2500م يعني سباقات عادلة جداً. جميع المراكز لها فرصة متساوية. الانطلاقات الخارجية تؤدي وكذلك الداخلية. أحد أكثر المضامين عدلاً في الإمارات.'
    }
  ]
};

export default alAinProfile;
