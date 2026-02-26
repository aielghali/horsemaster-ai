import ZAI from 'z-ai-web-dev-sdk';

async function generateRacePredictions() {
  const zai = await ZAI.create();

  const raceData = `
  سباقات المضمار والميدان - 24 أغسطس 2025:
  
  1. ABSA RUN YOUR CITY TSHWANE 10K (جنوب أفريقيا):
     - النتائج: Kabelo Mulaudzi (RSA) 29:00 - فاز بفارق ضئيل جداً
     - المركز الثاني: Aklilu Asfaw (ETH) 29:01
     - السيدات: Glenrose Xaba (RSA) 31:50
  
  2. Diamond League Lausanne (20 أغسطس 2025):
     - 100م رجال: Oblique Seville (JAM) 9.87 ثانية - هزم Noah Lyles
  
  3. Diamond League Brussels (23 أغسطس 2025):
     - نهائيات الدوري الماسي
  
  4. Klaverblad International High Jump Meeting 2025 (هولندا):
     - جزء من World Athletics Continental Tour
  
  5. Winter Track and Field Series 3
  `;

  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `أنت "New Elghali Ai" - نموذج متخصص في تحليل سباقات المضمار والميدان وتقديم الترشيحات.
        تقوم بتحليل:
        - أداء الرياضيين السابق
        - الأرقام القياسية
        - الظروف المحيطة بالسباق
        - المنافسات المباشرة
        
        تقدم ترشيحاتك بناءً على تحليل علمي دقيق.`
      },
      {
        role: 'user',
        content: `بناءً على بيانات سباقات اليوم 24 أغسطس 2025، قدم تحليلاً شاملاً وترشيحات للسباقات المستقبلية القادمة.
        
        البيانات المتاحة:
        ${raceData}
        
        المطلوب:
        1. تحليل أداء الفائزين اليوم
        2. ترشيحات لبطولة العالم طوكيو 2025 (سبتمبر)
        3. توقعات للمنافسات القادمة
        4. رياضيون يستحقون المتابعة`
      }
    ]
  });

  return completion.choices[0]?.message?.content;
}

generateRacePredictions().then(result => {
  console.log(result);
});
