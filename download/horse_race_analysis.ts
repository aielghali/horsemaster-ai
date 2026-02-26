import ZAI from 'z-ai-web-dev-sdk';

async function generateHorseRacePredictions() {
  const zai = await ZAI.create();

  const raceData = `
  سباقات الخيل في ميدان - 13 فبراير 2026 (مهرجان دبي العالمي للسباقات - الأسبوع 7)
  
  الرابط: https://www.racingpost.com/racecards/1231/meydan/2026-02-13/913621/
  
  === السباق المطلوب (2:05) ===
  Longines Master Collection Year Of The Horse (Maiden) - Dirt
  المسافة: 7 furlongs
  الجائزة: AED 120,000
  
  === جدول السباقات الكامل ===
  
  السباق 1 (13:30): Longines Conquest - Purebred Arabian Handicap - Dirt
  الخيول الرئيسية:
  - Ah Tahan (AE) - Rating 96 - Jockey: Bernardo Pinheiro
  - Baeed (AE) - Rating 85
  - Kayaan SB (AE)
  ملاحظات: Ah Tahan فاز في آخر سباق له في العين، قوي في 1200-1400م
  
  السباق 2 (14:05): Longines Primaluna Handicap - Dirt
  الخيول:
  - Daayyem (USA) - Jockey: K Neyadi
  - Desert Horizon (GB) - Jockey: M Al Muhairi, Daniel Tudhope
  - Fayadh (USA)
  - Fiction Maker (GB) - Rating 35
  - Hidden Secret (IRE) - Rating 28
  - Inner Wisdom (GB)
  
  السباق 3 (14:40): Longines Spirit Pilot Handicap
  الخيول:
  - Saafeer (FR) - Rating 90 - Jockey: Silvestre De Sousa
  - Ss Izz Dubai
  ملاحظات: Saafeer من تدريب Eric Lemartinel، فارس محترف
  
  السباق 4 (15:15): Longines Spirit Pilot Handicap - Dirt (1 mile)
  15 runners
  - Mozahim (USA) - Rating 14
  - Roi De France - Rating 28
  - Army Ethos - Rating 28
  
  السباق 5 (15:50): Handicap
  
  السباق 6 (16:25): Longines Master Collection Moon Phase Chronograph Handicap - Dirt
  18 runners
  - Elusive Trevor (IRE) - Jockey: T P O'Shea
  
  السباق 7 (17:00): Longines Conquest Chronograph Handicap - Turf
  
  السباق 8 (17:35): Longines Spirit Zulu Time 1925 Handicap - 6f
  18 runners
  - Mr Kafoo - Jockey: S Hitchcott - Trainer: A Bin Harmash
  - No Escape - Jockey: R Mullen - Trainer: B Seemar
  
  === معلومات المضمار ===
  ميدان: مضمار دبي العالمي
  السطح: Dirt و Turf
  الطقس: متوقع أن يكون جيداً
  
  === الفرسان البارزين ===
  - Silvestre De Sousa (بطل سابق في دبي)
  - Bernardo Pinheiro
  - T P O'Shea
  - Daniel Tudhope
  - R Mullen
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
        
        تقدم ترشيحاتك بناءً على:
        1. تحليل علمي للبيانات المتاحة
        2. تقييم العوامل المؤثرة
        3. احتمالات الفوز للمرشحين الثلاثة الأوائل`
      },
      {
        role: 'user',
        content: `بناءً على بيانات سباقات ميدان في 13 فبراير 2026، قدم تحليلاً شاملاً وترشيحات لكل سباق.
        
        البيانات المتاحة:
        ${raceData}
        
        المطلوب:
        1. ترشيح لكل سباق (المركز الأول والثاني والثالث)
        2. تحليل مختصر لكل خيل مرشح
        3. تقييم نسبة الفوز
        4. نصيحة للمراهنة (NAP - Best Bet of the Day)`
      }
    ]
  });

  return completion.choices[0]?.message?.content;
}

generateHorseRacePredictions().then(result => {
  console.log(result);
});
