import ZAI from 'z-ai-web-dev-sdk';

async function generateAllRacePredictions() {
  const zai = await ZAI.create();

  const raceData = `
  جميع سباقات ميدان - 13 فبراير 2026 (مهرجان دبي العالمي للسباقات - الأسبوع 7)
  
  === السباق 1 (13:30) - Longines Conquest Handicap - Dirt ===
  المسافة: 7f | الجائزة: AED 72,000 | عدد الخيول: 16-18
  الخيول الرئيسية:
  - Ah Tahan (AE) - Rating 96 - فاز آخر سباق في العين
  - Baeed (AE) - Rating 85
  - Muthabir (GB) - Rating 97
  - Raddad Al Wathba - Rating 79
  - Kayan SB
  ملاحظات: Ah Tahan يعود بعد راحة 13 أسبوع، فاز آخر مرة
  
  === السباق 2 (14:05) - Longines Master Collection Year Of The Horse (Maiden) - Dirt ===
  المسافة: 7f | الجائزة: AED 120,000
  الخيول:
  - Daayyem (USA) - Jockey: K Neyadi
  - Desert Horizon (GB) - Jockey: Daniel Tudhope
  - Fayadh (USA)
  - Fiction Maker (GB)
  - Hidden Secret (IRE) - Rating 28 - Timeform Tip
  - Inner Wisdom (GB)
  
  === السباق 3 (14:40) - Longines Primaluna Handicap - Dirt ===
  المسافة: 1m | عدد الخيول: 14
  الخيول:
  - Rock Of Cashel (11)
  - Ruling Dynasty (6) - 3 wins from 10
  - High Season (4)
  - Silver Sword (7)
  - War Hawk (2)
  - Saafeer (FR) - Rating 90 - Jockey: Silvestre De Sousa
  ملاحظات: Daamiss مرشح قوي للمسافة الممتدة
  
  === السباق 4 (15:15) - Longines Spirit Pilot Handicap - Dirt ===
  المسافة: 1m | الجائزة: AED 114,000 | عدد الخيول: 14-15
  الخيول:
  - Mozahim (USA) - Rating 14
  - Roi De France - Rating 28
  - Army Ethos - Rating 28
  ملاحظات: سباق تنافسي على المضمار الترابي
  
  === السباق 5 (15:50) - Longines Spirit Pilot Flyback Handicap - Turf ===
  المسافة: 7f | الجائزة: AED 150,000 | عدد الخيول: 14
  الخيول:
  - English Oak - Jockey: D Tudhope
  - Cavallo Bay - Jockey: O J Orr
  - Native Silence
  - Justanotherdance - Timeform tip: "يظهر قدرة على 7f و1m"
  ملاحظات: السباق الرئيسي في الاجتماع - على العشب
  
  === السباق 6 (16:25) - Longines Master Collection Moon Phase Chronograph Handicap - Dirt ===
  المسافة: 1m2f | عدد الخيول: 18
  الخيول:
  - Elusive Trevor (IRE) - Jockey: T P O'Shea
  - Rebel's Gamble - "مرشح للأداء الجيد رغم الاحتمالات العالية"
  ملاحظات: مسافة ممتدة على المضمار الترابي
  
  === السباق 7 (17:00) - Longines Conquest Chronograph Handicap - Turf ===
  المسافة: 6f | عدد الخيول: 14
  الخيول:
  - Arigatou Gozaimasu (USA) - Rating 27
  - Deep Hope (USA) - Rating 7
  - Spitzbergen (FR) - Rating 122 - الأعلى تصنيفاً
  - Condor Pasa (ARG) - Rating 28
  - Mustajaab (GB) - Rating 357
  - Odai (IRE)
  ملاحظات: Spitzbergen الأعلى تصنيفاً بكثير
  
  === السباق 8 (17:35) - Longines Spirit Zulu Time 1925 Handicap - Dirt ===
  المسافة: 6f | عدد الخيول: 18
  الخيول:
  - Mr Kafoo (USA) - Rating 7 - Jockey: S Hitchcott - Trainer: A Bin Harmash
  - No Escape - Rating 41 - Jockey: R Mullen - Trainer: B Seemar
  - Dukedom (IRE) - المفضل في السوق - Trainer: A Cintra
  - Muzaahim - "مرشح للمركز الثاني"
  ملاحظات: Dukedom المفضل في السوق
  
  === معلومات المضمار ===
  ميدان: مضمار دبي العالمي
  الأسطح: Dirt و Turf
  حالة الأرض: Fast (Dirt), Good (Turf)
  الطقس: جيد
  
  === الفرسان البارزين ===
  - Silvestre De Sousa (بطل سابق في دبي)
  - Bernardo Pinheiro
  - T P O'Shea
  - Daniel Tudhope
  - R Mullen
  - D Tudhope
  
  === نصائح من المصادر ===
  - Telegraph: Ron Wood tips لجميع السباقات السبعة
  - Racing Insider: Daamiss و Rebel's Gamble مرشحين
  - Timeform: Hidden Secret, Justanotherdance
  - Racing Post: Justanotherdance "مناسب للرحلة الأطول"
  `;

  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `أنت "Elghali Ai" - نموذج متخصص في تحليل سباقات الخيل وتقديم الترشيحات.
        
        تقوم بتحليل:
        - تصنيف الخيل (Rating)
        - أداء الخيل السابق
        - الفارس والمدرب
        - نوع السطح (Dirt/Turf)
        - المسافة المناسبة
        - شروط السباق
        - نصائح الخبراء من المصادر المتعددة
        
        تقدم ترشيحاتك بناءً على:
        1. تحليل علمي للبيانات المتاحة
        2. تقييم العوامل المؤثرة
        3. احتمالات الفوز للمرشحين الثلاثة الأوائل
        4. توضيح سبب الترشيح لكل خيل`
      },
      {
        role: 'user',
        content: `بناءً على بيانات جميع سباقات ميدان في 13 فبراير 2026 من المواقع:
        - emiratesracing.com
        - attheraces.com
        - racingpost.com
        - skyracingworld.com
        
        قدم تحليلاً شاملاً وترشيحات لجميع السباقات الثمانية.
        
        البيانات المتاحة:
        ${raceData}
        
        المطلوب لكل سباق:
        1. ترشيح للمركز الأول والثاني والثالث
        2. تحليل مختصر لكل خيل مرشح
        3. تقييم نسبة الفوز
        4. NAP of the Day (أفضل رهان في اليوم)
        5. Each-Way Value (أفضل قيمة للرهان المزدوج)`
      }
    ]
  });

  return completion.choices[0]?.message?.content;
}

generateAllRacePredictions().then(result => {
  console.log(result);
});
