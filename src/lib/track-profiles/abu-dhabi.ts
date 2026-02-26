/**
 * ملف تعريف مضمار أبوظبي - Abu Dhabi Equestrian Club / Turf Club Profile
 * المضمار العشبي الوحيد في الإمارات - يركز على سباقات الخيول العربية
 * المعلومات مستخلصة من البحث على الويب
 */

import { TrackProfile } from './meydan';

export const abuDhabiProfile: TrackProfile = {
  id: 'abu-dhabi',
  name: 'Abu Dhabi Equestrian Club',
  nameAr: 'نادي أبوظبي للفروسية',
  location: 'Abu Dhabi, UAE',
  locationAr: 'أبوظبي، الإمارات العربية المتحدة',
  
  surfaces: [
    {
      type: 'turf',
      typeAr: 'عشبي',
      circumference: 2000,
      homeStraight: 400,
      width: 18,
      description: 'RIGHT-HANDED turf track with 2000m circumference. The ONLY track in UAE that races on turf for the whole season. Home straight of 400m (2 furlongs). Excellent drainage, typically good to firm going. Major emphasis on Purebred Arabian racing.',
      descriptionAr: 'مضمار عشبي يميني بمحيط 2000 متر. المضمار الوحيد في الإمارات الذي يسبق على العشب طوال الموسم. خط نهاية 400 متر (2 فلونج). تصريف ممتاز، عادة أرضية جيدة إلى متماسكة. تركيز كبير على سباقات الخيول العربية الأصيلة.'
    }
  ],
  
  trackCharacteristics: {
    direction: 'right-handed',
    directionAr: 'يمين',
    shape: 'oval',
    shapeAr: 'بيضاوي',
    gradient: 'Flat track with no significant undulations. Fair test for all horses. The 400m home straight provides fair run to the line.',
    gradientAr: 'مضمار مسطح بدون تضاريس كبيرة. اختبار عادل لجميع الخيول. خط النهاية 400م يوفر جرياً عادلاً للخط.',
    turns: {
      numberOfTurns: 2,
      turnRadius: 'medium',
      turnRadiusAr: 'متوسط',
      firstTurnDistance: 400,
      finalTurnDistance: 400
    },
    drainage: 'Excellent drainage on turf. Rarely races on soft ground due to UAE climate and irrigation control.',
    drainageAr: 'تصريف ممتاز على العشب. نادراً ما تسبق على أرضية لينة بسبب مناخ الإمارات والتحكم في الري.'
  },
  
  distanceFactors: {
    sprint: {
      range: '1000m-1200m',
      staminaRequired: 2,
      speedImportance: 10,
      accelerationImportance: 9,
      positionAtTurn: 'critical',
      earlySpeedValue: 10,
      finishSpeedValue: 8,
      description: 'Pure speed on turf - unique in UAE. Early speed crucial. Rail position valuable. Turf specialists excel. Sprint distances less common here due to Arabian focus.',
      descriptionAr: 'سرعة بحتة على العشب - فريد في الإمارات. السرعة المبكرة حاسمة. مركز السياج قيم. متخصصو العشب يتفوقون. مسافات السرعة أقل شيوعاً هنا بسبب التركيز على العربي.'
    },
    mile: {
      range: '1400m-1600m',
      staminaRequired: 4,
      speedImportance: 8,
      accelerationImportance: 8,
      positionAtTurn: 'important',
      earlySpeedValue: 8,
      finishSpeedValue: 9,
      description: 'Tactical races. Position at turn important. Turf specialists with quick action excel. The 400m straight allows closers to make their move.',
      descriptionAr: 'سباقات تكتيكية. المركز عند المنعطف مهم. متخصصو العشب ذوو الحركة السريعة يتفوقون. المستقيم 400م يسمح للمتأخرين بالحركة.'
    },
    middle: {
      range: '1800m-2200m',
      staminaRequired: 6,
      speedImportance: 6,
      accelerationImportance: 7,
      positionAtTurn: 'moderate',
      earlySpeedValue: 6,
      finishSpeedValue: 8,
      description: 'Standard turf tests. Major venue for Purebred Arabian racing. Abu Dhabi Championship (2200m) is a highlight. Stamina and class both count. Often attracts European-style trainers.',
      descriptionAr: 'اختبارات عشبية قياسية. مكان رئيسي لسباقات الخيول العربية الأصيلة. بطولة أبوظبي (2200م) حدث بارز. التحمل والفصيلة كلاهما مهم. غالباً يجذب مدربين على الطراز الأوروبي.'
    },
    long: {
      range: '2400m+',
      staminaRequired: 8,
      speedImportance: 4,
      accelerationImportance: 6,
      positionAtTurn: 'moderate',
      earlySpeedValue: 4,
      finishSpeedValue: 7,
      description: 'Stamina tests on turf. UAE President Cup distance hosted here. Pure stayers needed. The Abu Dhabi Gold Cup (Feb) is a major international race worth $1 million.',
      descriptionAr: 'اختبارات تحمل على العشب. مسافة كأس رئيس الإمارات تُقام هنا. يحتاج خيول تحمل بحتة. كأس أبوظبي الذهبي (فبراير) سباق دولي رئيسي بقيمة مليون دولار.'
    }
  },
  
  positionAdvantages: {
    insideAdvantage: 4,
    middleAdvantage: 2,
    outsideAdvantage: -3,
    frontRunning: 8,
    stalking: 7,
    closers: 6,
    description: 'Tight right-handed turns favor inside draws significantly. Rail runners have distinct advantage. Front-runners do well on firm turf. The right-handed direction is unique for turf in UAE. Horses used to left-handed tracks need to adapt.',
    descriptionAr: 'المنعطفات اليمينية الضيقة تفضل الانطلاقات الداخلية بشكل كبير. الخيول على السياج لها ميزة واضحة. المتقدمون يؤدون جيداً على العشب المتماسك. الاتجاه اليميني فريد للعشب في الإمارات. الخيول المعتادة على المضامين اليسارية تحتاج للتأقلم.'
  },
  
  weightImpact: {
    overall: 5,
    sprintImpact: 3,
    distanceImpact: 7,
    description: 'Weight less significant on turf than dirt. Firm surface reduces weight impact. However, Arabian horses can be more weight-sensitive than Thoroughbreds.',
    descriptionAr: 'الوزن أقل أهمية على العشب من التراب. السطح المتماسك يقلل من تأثير الوزن. ومع ذلك، الخيول العربية قد تكون أكثر حساسية للوزن من الخيول الأصيلة.'
  },
  
  weatherSensitivity: {
    rain: 'medium',
    rainAr: 'متوسط',
    wind: 'low',
    windAr: 'منخفض',
    temperature: 'low',
    temperatureAr: 'منخفض',
    description: 'Turf reacts to rain but drains excellently. Going can change from firm to good quickly. Evening racing reduces heat stress. The controlled irrigation keeps the surface consistent.',
    descriptionAr: 'العشب يتفاعل مع المطر لكنه يصرف بشكل ممتاز. الأرضية يمكن أن تتغير من متماسكة إلى جيدة بسرعة. السباقات المسائية تقلل من إجهاد الحرارة. الري المسيطر عليه يبقي السطح ثابتاً.'
  },
  
  specialFeatures: [
    {
      name: 'Only Pure Turf Track in UAE',
      nameAr: 'المضمار العشبي البحت الوحيد في الإمارات',
      impact: 'positive',
      description: 'Unique in UAE as the only track that races exclusively on turf all season. Attracts turf specialists and European trainers. Horses that prefer grass have their chance here.',
      descriptionAr: 'فريد في الإمارات كمضمار يسبق حصرياً على العشب طوال الموسم. يجذب متخصصي العشب والمدربين الأوروبيين. الخيول التي تفضل العشب لديها فرصتها هنا.'
    },
    {
      name: 'Right-Handed Direction',
      nameAr: 'اتجاه يميني',
      impact: 'neutral',
      description: 'Only right-handed turf track in UAE. Horses must handle right-hand turns. Catches out horses used to left-handed Meydan. Some horses prefer this direction.',
      descriptionAr: 'المضمار العشبي اليميني الوحيد في الإمارات. الخيول يجب أن تتعامل مع المنعطفات اليمينية. يفاجئ الخيول المعتادة على ميدان اليساري. بعض الخيول تفضل هذا الاتجاه.'
    },
    {
      name: 'Purebred Arabian Focus',
      nameAr: 'تركيز على الخيول العربية الأصيلة',
      impact: 'positive',
      description: 'Major venue for Purebred Arabian racing with 16 fixtures per season. UAE President Cup and Abu Dhabi Gold Cup are highlights. Arabian races often have different dynamics than Thoroughbred races.',
      descriptionAr: 'مكان رئيسي لسباقات الخيول العربية الأصيلة مع 16 اجتماعاً لكل موسم. كأس رئيس الإمارات وكأس أبوظبي الذهبي أبرز الأحداث. سباقات العربي غالباً لها ديناميكيات مختلفة عن سباقات الأصيل.'
    },
    {
      name: 'Chutes for Different Distances',
      nameAr: 'مسارات لمسافات مختلفة',
      impact: 'neutral',
      description: 'Chutes available for various distances including 1000m sprints. Provide fairer starts. The track layout offers flexibility for race distances.',
      descriptionAr: 'مسارات متاحة لمسافات مختلفة تشمل سباقات 1000م السريعة. توفر انطلاقات أكثر عدلاً. تخطيط المضمار يوفر مرونة لمسافات السباق.'
    },
    {
      name: 'Evening Floodlit Racing',
      nameAr: 'سباقات مسائية تحت الأضواء',
      impact: 'positive',
      description: 'Races under floodlights with 5-star dining trackside. Cooler temperatures benefit horse performance. Elegant atmosphere attracts a refined crowd.',
      descriptionAr: 'سباقات تحت الأضواء الكاشفة مع عشاء 5 نجوم على جانب المضمار. درجات الحرارة الأكثر برودة تفيد أداء الحصان. الأجواء الأنيقة تجذب حشداً راقياً.'
    },
    {
      name: 'Firm to Good Going',
      nameAr: 'أرضية متماسكة إلى جيدة',
      impact: 'positive',
      description: 'Usually firm to good ground due to excellent drainage and controlled irrigation. Favors speed horses and those with quick action. Very consistent surface.',
      descriptionAr: 'عادة أرضية متماسكة إلى جيدة بسبب التصريف الممتاز والري المسيطر عليه. تفضل خيول السرعة وسريعة الحركة. سطح ثابت جداً.'
    },
    {
      name: 'Abu Dhabi Gold Cup ($1M)',
      nameAr: 'كأس أبوظبي الذهبي (مليون دولار)',
      impact: 'positive',
      description: 'Inaugural Abu Dhabi Gold Cup in February worth US$1 million attracts international field. Major highlight of the season. Showcases the track on global stage.',
      descriptionAr: 'كأس أبوظبي الذهبي الافتتاحي في فبراير بقيمة مليون دولار يجذب مشاركين دوليين. حدث بارز للموسم. يعرض المضمار على المسرح العالمي.'
    }
  ]
};

export default abuDhabiProfile;
