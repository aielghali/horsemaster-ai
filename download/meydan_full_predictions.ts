import ZAI from 'z-ai-web-dev-sdk';

async function generateMeydanPredictions() {
  const zai = await ZAI.create();

  const raceData = `
  === سباقات ميدان الكاملة - 13 فبراير 2026 ===
  مهرجان دبي العالمي للسباقات - الأسبوع السابع
  
  === السباق 1 (13:30 / 5:30 PM) ===
  Longines Conquest - Purebred Arabian Handicap - Dirt
  المسافة: 7f | الجائزة: AED 120,000 | عدد الخيول: 18
  
  الخيول الرئيسية:
  - Saafear (FR) - Rating 90 - Jockey: Silvestre De Sousa
  - Ah Tahan (AE) - Rating 96 (Arabian)
  - Namoor - Jockey: T O'Shea
  - Kayaan SB
  - Sand Storm AA
  - Baeed (AE)
  - Af Ghayyar - Jockey: M Rodrigues
  - Af Layth - Jockey: A Da Silva
  - Af Muhem
  - Af Yatwa'ad - فاز في العين مؤخراً

  === السباق 2 (14:05 / 6:05 PM) ===
  Longines Master Collection Year Of The Horse Maiden Stakes - Dirt
  المسافة: 1m 1f 110y | الجائزة: AED 165,002 | عدد الخيول: 12
  
  === السباق 3 (14:40 / 6:40 PM) ===
  Longines Spirit Pilot Handicap - Dirt
  المسافة: 1m | عدد الخيول: 14
  
  الخيول:
  - Rock Of Cashel
  - Ruling Dynasty
  - High Season
  - Silver Sword
  - War Hawk
  - Motadarrek
  - City Of Delight

  === السباق 4 (15:15 / 7:15 PM) ===
  Longines Spirit Pilot Handicap - Dirt
  المسافة: 1m | الجائزة: AED 114,002 | عدد الخيول: 15
  
  الخيول:
  - Mozahim (USA) - Rating 14
  - Roi De France - Rating 28 - Jockey: H Al Busaidi
  - Army Ethos - Rating 28 - Jockey: A de Vries
  - Laasudood - Jockey: Chantal Sutherland
  - Force And Valour - Jockey: Ray Dawson

  === السباق 5 (15:50 / 7:50 PM) ===
  Longines Spirit Pilot Flyback Handicap - Turf
  المسافة: 7f | الجائزة: AED 150,001 | عدد الخيول: 14

  === السباق 6 (16:25 / 8:25 PM) ===
  Longines Master Collection Moon Phase Chronograph Handicap - Dirt
  عدد الخيول: 18
  
  الخيول:
  - Elusive Trevor (IRE) - Jockey: T P O'Shea
  - من التوقعات: Daamiss (مرشح قوي)
  
  === السباق 7 (17:00 / 9:00 PM) ===
  Longines Conquest Chronograph Handicap - Turf
  المسافة: 6f | الجائزة: AED 105,000 | عدد الخيول: 18
  
  الخيول:
  - Secret State - Jockey: Jose Santiago
  - Arigatou Gozaimasu - Jockey: Bernardo Pinheiro
  - Deep Hope - Jockey: Tadhg O'Shea

  === السباق 8 (17:35 / 9:35 PM) ===
  Longines Spirit Zulu Time 1925 Handicap
  المسافة: 6f | الجائزة: AED 105,000 | عدد الخيول: 18
  
  الخيول:
  - Mr Kafoo - Jockey: S Hitchcott - Trainer: A Bin Harmash
  - No Escape - Jockey: R Mullen - Trainer: B Seemar
  - Dukedom (IRE) - المفضل في السوق
  - Muzaahim - 4/1 في التوقعات
  - Action Point
  - Mutaany
  - Almutanabbi
  - Ah Tahan (AE) - Rating 96
  - Raddad Al Wathba (AE)

  === معلومات إضافية من التوقعات ===
  - NAP مرشح: Daamiss في السباق 3 (2:40)
  - Rebel's Gamble: متوقع أداء جيد رغم الاحتمالات الطويلة
  - المفضلات في السباق 8: Dukedom (IRE), Muzaahim, No Escape

  === الفرسان البارزين ===
  - Silvestre De Sousa (بطل سابق في دبي)
  - Bernardo Pinheiro
  - Tadhg O'Shea
  - Ray Dawson
  - Chantal Sutherland
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
        - توقعات السوق والمراهنات
        
        تقدم ترشيحاتك بناءً على تحليل علمي للبيانات المتاحة من المصادر الموثوقة.`
      },
      {
        role: 'user',
        content: `بناءً على بيانات سباقات ميدان في 13 فبراير 2026 من المواقع التالية:
        - emiratesracing.com
        - attheraces.com
        - racingpost.com
        - skyracingworld.com
        
        قدم تحليلاً شاملاً وترشيحات لجميع السباقات الثمانية.
        
        البيانات المتاحة:
        ${raceData}
        
        المطلوب لكل سباق:
        1. ترشيح للمركز الأول والثاني والثالث
        2. تحليل مختصر للمرشحين
        3. نسبة الفوز المتوقعة
        4. نصيحة المراهنة (NAP - Best Bet of the Day)`
      }
    ]
  });

  return completion.choices[0]?.message?.content;
}

generateMeydanPredictions().then(result => {
  console.log(result);
});
