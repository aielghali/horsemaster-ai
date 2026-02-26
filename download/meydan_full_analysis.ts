import ZAI from 'z-ai-web-dev-sdk';

async function generateFullMeydanPredictions() {
  const zai = await ZAI.create();

  const raceData = `
  سباقات الخيل في ميدان - 13 فبراير 2026
  مهرجان دبي العالمي للسباقات - الأسبوع 7
  المصادر: emiratesracing.com, attheraces.com, racingpost.com, skyracingworld.com
  
  === السباق 1 (13:30) - Longines Conquest - Purebred Arabian Handicap - Dirt ===
  المسافة: 7f | الجائزة: AED 72,000 | العدد: 16 runners
  
  الخيول الرئيسية:
  1. Ah Tahan (AE) - Rating 96 - Jockey: Bernardo Pinheiro
     فاز في آخر سباق في العين على مسافة 1m handicap
  2. Muthabir (GB) - Rating 12 - Jockey: TBA
  3. Raddad Al Wathba (AE) - Jockey: TBA
  4. Baeed (AE) - Rating 85
  5. Kayaan SB (AE)
  
  === السباق 2 (14:05) - Longines Master Collection Year Of The Horse Maiden - Dirt ===
  المسافة: 1m 1f 110y | الجائزة: AED 99,000 | العدد: 12 runners
  
  الخيول:
  1. Daayyem (USA) - Rating 27 - Jockey: K Neyadi
     Bolt D'oro - Sauvecito
  2. Desert Horizon (GB) - Rating 19 - Jockey: Daniel Tudhope
     Caravaggio - Tandragee
  3. Fayadh (USA) - Rating 13
  4. Fiction Maker (GB) - Rating 35
  5. Hidden Secret (IRE) - Rating 28
  6. Inner Wisdom (GB) - Rating 19
  7. Justanotherdance
  
  === السباق 3 (14:40) - Longines Primaluna Handicap - Turf ===
  المسافة: 1m 2f | الجائزة: AED 105,000 | التصنيف: 70-90
  
  الخيول:
  1. Saafeer (FR) - Rating 90 - Jockey: Silvestre De Sousa
     تدريب: Eric Lemartinel
  2. Ss Izz Dubai (AE)
  
  === السباق 4 (15:15) - Longines Spirit Pilot Handicap - Dirt ===
  المسافة: 1m | الجائزة: AED 114,000 | العدد: 14 runners
  
  الخيول:
  1. Mozahim (USA) - Rating 14
  2. Roi De France - Rating 28
  3. Army Ethos - Rating 28
  4. Diamond Dealer
  5. Force And Valour
  6. Laasudood
  7. One More
  8. Gray Fog
  9. Gun Carriage
  10. Crown
  
  الباقي: 4/1 Diamond Dealer, Force And Valour, Laasudood, 13/2 One More
  
  === السباق 5 (15:50) - Longines Spirit Pilot Flyback Handicap - Turf ===
  المسافة: 7f | الجائزة: AED 150,000 | العدد: 14 runners | التصنيف: 80-100
  
  الخيول:
  1. English Oak (GB) - Rating 100 - Jockey: Daniel Tudhope
     Wootton Bassett - Forest Crown
     تدريب: Hamad Al Jehani
  2. Cavallo Bay (GB) - Jockey: O J Orr
     Pinatubo - La Pelosa
  3. Native Knight - Rating 40
  
  === السباق 6 (16:25) - Longines Master Collection Moon Phase Chronograph Handicap - Dirt ===
  المسافة: 1m 2f | الجائزة: AED 105,000 | العدد: 18 runners | التصنيف: 65-85
  
  الخيول:
  1. Elusive Trevor (IRE) - Jockey: T P O'Shea
  2. Mr Kafoo - Rating 85 - Jockey: S Hitchcott
     تدريب: A Bin Harmash
  3. No Escape - Jockey: R Mullen
     تدريب: B Seemar
  4. Dukedom (IRE) - المفضل في السوق
  
  === السباق 7 (17:00) - Longines Conquest Chronograph Handicap - Turf ===
  المسافة: 6f | الجائزة: AED 105,000 | التصنيف: 60-80
  
  الخيول:
  1. Justanotherdance - مرشح Racing Post
  
  === السباق 8 (17:35) - Longines Spirit Zulu Time 1925 Handicap ===
  المسافة: 6f | الجائزة: AED 105,000 | العدد: 18 runners
  
  الخيول:
  1. Mr Kafoo - Jockey: S Hitchcott - Trainer: A Bin Harmash
  2. No Escape - Jockey: R Mullen - Trainer: B Seemar
  3. Dukedom (IRE) - المفضل - Jockey: Reserve - Trainer: A Cintra & Julio
  4. Run With The Cash (USA) - Rating 69 - Jockey: Royston Ffrench
  
  === معلومات المضمار ===
  ميدان: مضمار دبي العالمي
  الأسطح: Dirt (سريع) و Turf (جيد)
  عدد السباقات: 8
  بداية السباقات: 13:30
  
  === الفرسان البارزين ===
  - Silvestre De Sousa (بطل سابق في دبي)
  - Bernardo Pinheiro
  - Daniel Tudhope
  - T P O'Shea
  - R Mullen
  - Royston Ffrench
  `;

  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `أنت "Elghali Ai" - نموذج متخصص في تحليل سباقات الخيل وتقديم الترشيحات.
        
        تقوم بتحليل:
        - تصنيف الخيل (Rating) والأداء السابق
        - الفارس والمدرب
        - نوع السطح (Dirt/Turf) والمسافة
        - شروط السباق والتصنيف المطلوب
        - أسعار السوق والأفضليات
        
        تقدم ترشيحاتك:
        1. المركز الأول والثاني والثالث
        2. تحليل مختصر
        3. نسبة الثقة في الترشيح
        4. NAP of the Day (أفضل رهان اليوم)`
      },
      {
        role: 'user',
        content: `قدم تحليلاً شاملاً وترشيحات لجميع السباقات الثمانية في ميدان يوم 13 فبراير 2026.
        
        البيانات المتاحة من المصادر:
        ${raceData}
        
        المطلوب لكل سباق:
        1. ترشيح المركز الأول والثاني والثالث
        2. تحليل مختصر للمرشحين
        3. نسبة الثقة
        4. في النهاية: NAP of the Day و Next Best`
      }
    ]
  });

  return completion.choices[0]?.message?.content;
}

generateFullMeydanPredictions().then(result => {
  console.log(result);
});
