/**
 * Elghali AI - Professional PDF Generator
 * Generates beautiful PDF reports for horse racing predictions
 */

import fs from 'fs'
import path from 'path'

export interface HorsePredictionPDF {
  position: number
  number: number
  name: string
  jockey: string
  trainer: string
  rating: number
  powerScore: number
  winProbability: number
  placeProbability: number
  draw: number
  weight: number
  form: string
  valueRating: string
  strengths: string[]
  concerns: string[]
}

export interface RacePredictionPDF {
  raceNumber: number
  raceName: string
  raceTime: string
  distance: number
  surface: string
  going: string
  predictions: HorsePredictionPDF[]
  raceAnalysis: string
}

export interface ReportDataPDF {
  racecourse: string
  country: string
  date: string
  totalRaces: number
  races: RacePredictionPDF[]
  napOfTheDay: {
    horseName: string
    raceName: string
    reason: string
    confidence: number
  }
  nextBest: {
    horseName: string
    raceName: string
    reason: string
  }
  valuePick: {
    horseName: string
    raceName: string
    reason: string
  }
  generatedAt: string
}

class PDFGenerator {
  /**
   * Generate HTML report and save as PDF-compatible HTML
   */
  async generateReport(data: ReportDataPDF): Promise<{ success: boolean; pdfPath: string | null; error?: string }> {
    try {
      const html = this.generateHTML(data)
      
      // Ensure download directory exists
      const downloadDir = '/home/z/my-project/download'
      if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true })
      }
      
      // Save HTML file (can be converted to PDF)
      const filename = `Elghali_AI_${data.racecourse.replace(/\s+/g, '_')}_${data.date}_Report.html`
      const filepath = path.join(downloadDir, filename)
      
      fs.writeFileSync(filepath, html, 'utf-8')
      
      console.log(`[PDF Generator] Report saved: ${filepath}`)
      
      return { success: true, pdfPath: filepath }
    } catch (error) {
      console.error('[PDF Generator] Error:', error)
      return { success: false, pdfPath: null, error: String(error) }
    }
  }

  /**
   * Generate beautiful HTML report
   */
  private generateHTML(data: ReportDataPDF): string {
    const isArabic = true
    const dir = isArabic ? 'rtl' : 'ltr'
    const lang = isArabic ? 'ar' : 'en'

    return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Elghali AI - ${data.racecourse} ${data.date}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
      background: linear-gradient(135deg, #fef3e2 0%, #ffffff 100%);
      color: #333;
      line-height: 1.6;
      padding: 20px;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(139, 0, 0, 0.15);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #8B0000 0%, #A52A2A 50%, #8B0000 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    
    .logo {
      font-size: 36px;
      margin-bottom: 10px;
    }
    
    .header h1 {
      font-size: 28px;
      color: #D4AF37;
      margin-bottom: 5px;
    }
    
    .header .subtitle {
      color: #f0d0a0;
      font-size: 16px;
    }
    
    .header .meta {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-top: 20px;
      flex-wrap: wrap;
    }
    
    .header .meta-item {
      text-align: center;
    }
    
    .header .meta-value {
      font-size: 20px;
      font-weight: bold;
      color: #D4AF37;
    }
    
    .header .meta-label {
      font-size: 12px;
      color: #f0d0a0;
    }
    
    .content {
      padding: 30px;
    }
    
    .nap-section {
      background: linear-gradient(135deg, #FFF8DC 0%, #FFFACD 100%);
      border: 2px solid #D4AF37;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 30px;
      text-align: center;
    }
    
    .nap-section .label {
      font-size: 14px;
      color: #8B0000;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .nap-section .horse-name {
      font-size: 32px;
      font-weight: bold;
      color: #D4AF37;
      margin-bottom: 10px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }
    
    .nap-section .race-name {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
    }
    
    .nap-section .confidence {
      display: inline-block;
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 16px;
    }
    
    .nap-section .reason {
      margin-top: 15px;
      font-size: 14px;
      color: #555;
    }
    
    .picks-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .pick-card {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 20px;
      border-left: 4px solid #D4AF37;
    }
    
    .pick-card .label {
      font-size: 12px;
      color: #8B0000;
      font-weight: bold;
      margin-bottom: 8px;
    }
    
    .pick-card .horse-name {
      font-size: 20px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }
    
    .pick-card .race-name {
      font-size: 12px;
      color: #666;
      margin-bottom: 8px;
    }
    
    .pick-card .reason {
      font-size: 12px;
      color: #555;
    }
    
    .race-section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    
    .race-header {
      background: linear-gradient(135deg, #8B0000 0%, #A52A2A 100%);
      color: white;
      padding: 15px 20px;
      border-radius: 10px 10px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .race-header .race-title {
      font-size: 16px;
      font-weight: bold;
    }
    
    .race-header .race-info {
      font-size: 12px;
      color: #f0d0a0;
    }
    
    .race-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 0 0 10px 10px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    
    .race-table th {
      background: #f8f9fa;
      padding: 12px 8px;
      text-align: right;
      font-size: 11px;
      font-weight: bold;
      color: #8B0000;
      border-bottom: 2px solid #D4AF37;
    }
    
    .race-table td {
      padding: 10px 8px;
      text-align: right;
      font-size: 12px;
      border-bottom: 1px solid #eee;
    }
    
    .race-table tr:nth-child(1) {
      background: linear-gradient(90deg, #FFF8DC 0%, transparent 100%);
    }
    
    .race-table tr:nth-child(2) {
      background: linear-gradient(90deg, #f0f0f0 0%, transparent 100%);
    }
    
    .race-table tr:nth-child(3) {
      background: linear-gradient(90deg, #ffe4c4 0%, transparent 100%);
    }
    
    .position-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font-weight: bold;
      font-size: 12px;
      color: white;
    }
    
    .position-1 { background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); }
    .position-2 { background: linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%); }
    .position-3 { background: linear-gradient(135deg, #CD7F32 0%, #B8860B 100%); }
    .position-other { background: #ccc; }
    
    .power-bar {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .power-bar-fill {
      height: 8px;
      background: linear-gradient(90deg, #28a745 0%, #ffc107 50%, #dc3545 100%);
      border-radius: 4px;
    }
    
    .power-bar-text {
      font-weight: bold;
      font-size: 11px;
      color: #8B0000;
    }
    
    .value-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: bold;
    }
    
    .value-excellent { background: #28a745; color: white; }
    .value-good { background: #17a2b8; color: white; }
    .value-fair { background: #ffc107; color: #333; }
    .value-poor { background: #6c757d; color: white; }
    
    .analysis-section {
      padding: 15px;
      background: #f8f9fa;
      border-radius: 0 0 10px 10px;
      font-size: 12px;
    }
    
    .analysis-item {
      margin-bottom: 10px;
    }
    
    .analysis-item:last-child {
      margin-bottom: 0;
    }
    
    .analysis-item strong {
      color: #8B0000;
    }
    
    .strengths {
      color: #28a745;
    }
    
    .concerns {
      color: #dc3545;
    }
    
    .footer {
      background: #8B0000;
      color: white;
      padding: 20px;
      text-align: center;
    }
    
    .footer p {
      font-size: 12px;
      color: #f0d0a0;
      margin-bottom: 5px;
    }
    
    .footer .warning {
      font-size: 11px;
      color: #ffc107;
      padding: 10px;
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
      margin-top: 10px;
    }
    
    .watermark {
      position: fixed;
      bottom: 50%;
      right: 50%;
      transform: translate(50%, 50%);
      font-size: 80px;
      color: rgba(139, 0, 0, 0.03);
      font-weight: bold;
      pointer-events: none;
      z-index: -1;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .container {
        box-shadow: none;
      }
      
      .race-section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="watermark">ELGHALI AI</div>
  
  <div class="container">
    <div class="header">
      <div class="logo">🏇</div>
      <h1>Elghali AI</h1>
      <p class="subtitle">نظام الذكاء الاصطناعي لترشيحات سباقات الخيل</p>
      
      <div class="meta">
        <div class="meta-item">
          <div class="meta-value">${data.racecourse}</div>
          <div class="meta-label">المضمار</div>
        </div>
        <div class="meta-item">
          <div class="meta-value">${data.date}</div>
          <div class="meta-label">التاريخ</div>
        </div>
        <div class="meta-item">
          <div class="meta-value">${data.totalRaces}</div>
          <div class="meta-label">السباقات</div>
        </div>
        <div class="meta-item">
          <div class="meta-value">${data.country}</div>
          <div class="meta-label">الدولة</div>
        </div>
      </div>
    </div>
    
    <div class="content">
      <!-- NAP of the Day -->
      <div class="nap-section">
        <div class="label">🌟 ترشيح اليوم - NAP of the Day</div>
        <div class="horse-name">${data.napOfTheDay.horseName}</div>
        <div class="race-name">${data.napOfTheDay.raceName}</div>
        <div class="confidence">${data.napOfTheDay.confidence}% ثقة</div>
        <div class="reason">${data.napOfTheDay.reason}</div>
      </div>
      
      <!-- Quick Picks -->
      <div class="picks-grid">
        <div class="pick-card">
          <div class="label">📈 الترشيح الثاني</div>
          <div class="horse-name">${data.nextBest.horseName}</div>
          <div class="race-name">${data.nextBest.raceName}</div>
          <div class="reason">${data.nextBest.reason}</div>
        </div>
        <div class="pick-card">
          <div class="label">💎 ترشيح القيمة</div>
          <div class="horse-name">${data.valuePick.horseName}</div>
          <div class="race-name">${data.valuePick.raceName}</div>
          <div class="reason">${data.valuePick.reason}</div>
        </div>
      </div>
      
      <!-- Race by Race Analysis -->
      ${data.races.map(race => `
        <div class="race-section">
          <div class="race-header">
            <div class="race-title">🏆 السباق ${race.raceNumber}: ${race.raceName}</div>
            <div class="race-info">${race.distance}م | ${race.surface} | ${race.going} | ${race.raceTime}</div>
          </div>
          
          <table class="race-table">
            <thead>
              <tr>
                <th>المركز</th>
                <th>رقم</th>
                <th>الحصان</th>
                <th>البوابة</th>
                <th>الفارس</th>
                <th>التقييم</th>
                <th>القوة</th>
                <th>الفوز</th>
                <th>القيمة</th>
              </tr>
            </thead>
            <tbody>
              ${race.predictions.slice(0, 5).map((p, i) => `
                <tr>
                  <td><span class="position-badge position-${i === 0 ? '1' : i === 1 ? '2' : i === 2 ? '3' : 'other'}">${i + 1}</span></td>
                  <td>${p.number}</td>
                  <td><strong>${p.name}</strong></td>
                  <td>${p.draw}</td>
                  <td>${p.jockey}</td>
                  <td>${p.rating}</td>
                  <td>
                    <div class="power-bar">
                      <div class="power-bar-fill" style="width: ${p.powerScore}px"></div>
                      <span class="power-bar-text">${p.powerScore.toFixed(1)}</span>
                    </div>
                  </td>
                  <td>${p.winProbability.toFixed(1)}%</td>
                  <td><span class="value-badge value-${p.valueRating.toLowerCase()}">${p.valueRating}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="analysis-section">
            ${race.predictions.slice(0, 3).map((p, i) => `
              <div class="analysis-item">
                <strong>${i + 1}. ${p.name}</strong> ${p.jockey ? `(${p.jockey})` : ''}
                ${p.strengths.length > 0 ? `<span class="strengths">✓ ${p.strengths.slice(0, 2).join(' • ')}</span>` : ''}
                ${p.concerns.length > 0 ? `<span class="concerns">⚠ ${p.concerns[0]}</span>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="footer">
      <p>© 2025 Elghali AI - جميع الحقوق محفوظة</p>
      <p>تم إنشاء التقرير: ${data.generatedAt}</p>
      <div class="warning">
        ⚠️ تنبيه: هذه الترشيحات مبنية على تحليل الذكاء الاصطناعي للبيانات المتاحة.
        المراهنة تنطوي على مخاطر - الرجاء المراهنة بمسؤولية.
      </div>
    </div>
  </div>
</body>
</html>`
  }
}

export const pdfGenerator = new PDFGenerator()
