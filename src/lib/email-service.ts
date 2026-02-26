/**
 * Elghali AI - Email Service
 * نظام إرسال التقارير بالبريد الإلكتروني
 */

// Email configuration
const EMAIL_CONFIG = {
  // Using Resend API (free tier available)
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  RESEND_API_URL: 'https://api.resend.com/emails',
  
  // Or using SMTP
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  
  // Default sender
  FROM_EMAIL: 'noreply@elghali-ai.vercel.app',
  FROM_NAME: 'Elghali AI'
}

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
  attachments?: {
    filename: string
    content: string | Buffer
    contentType?: string
  }[]
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Send email using Resend API (preferred)
 */
async function sendWithResend(email: EmailData): Promise<EmailResult> {
  if (!EMAIL_CONFIG.RESEND_API_KEY) {
    return { success: false, error: 'RESEND_API_KEY not configured' }
  }

  try {
    const response = await fetch(EMAIL_CONFIG.RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${EMAIL_CONFIG.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `${EMAIL_CONFIG.FROM_NAME} <${EMAIL_CONFIG.FROM_EMAIL}>`,
        to: email.to,
        subject: email.subject,
        html: email.html,
        text: email.text,
        attachments: email.attachments?.map(a => ({
          filename: a.filename,
          content: typeof a.content === 'string' ? a.content : a.content.toString('base64')
        }))
      })
    })

    const data = await response.json()

    if (response.ok) {
      return { success: true, messageId: data.id }
    } else {
      return { success: false, error: data.message || 'Failed to send email' }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Send email using SMTP (fallback)
 */
async function sendWithSMTP(email: EmailData): Promise<EmailResult> {
  // For serverless environments, we need to use a service like SendGrid, Mailgun, etc.
  // This is a placeholder for SMTP implementation
  return { success: false, error: 'SMTP not available in serverless environment' }
}

/**
 * Main send email function
 */
export async function sendEmail(email: EmailData): Promise<EmailResult> {
  // Try Resend first
  if (EMAIL_CONFIG.RESEND_API_KEY) {
    return sendWithResend(email)
  }

  // Fallback to SMTP
  if (EMAIL_CONFIG.SMTP_HOST && EMAIL_CONFIG.SMTP_USER) {
    return sendWithSMTP(email)
  }

  return { success: false, error: 'No email service configured' }
}

/**
 * Generate prediction email HTML
 */
export function generatePredictionEmailHTML(data: {
  racecourse: string
  date: string
  races: any[]
  napOfTheDay: any
  nextBest: any
  valuePick: any
}): string {
  const { racecourse, date, races, napOfTheDay, nextBest, valuePick } = data

  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #8b0000, #b22222); color: #fff; padding: 30px; text-align: center; }
    .header h1 { color: #ffd700; margin: 0; font-size: 28px; }
    .header p { margin: 10px 0 0; opacity: 0.9; }
    .content { padding: 30px; }
    .nap-card { background: linear-gradient(135deg, #ffd700, #ffb300); border-radius: 10px; padding: 25px; text-align: center; margin-bottom: 25px; }
    .nap-card h2 { color: #8b0000; margin: 0 0 15px; }
    .nap-card .horse { font-size: 28px; font-weight: bold; color: #8b0000; }
    .nap-card .confidence { background: #8b0000; color: #fff; padding: 5px 15px; border-radius: 20px; display: inline-block; margin-top: 10px; }
    .picks { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }
    .pick-card { background: #f8f9fa; border-radius: 8px; padding: 15px; }
    .pick-card h3 { margin: 0 0 10px; color: #333; font-size: 14px; }
    .pick-card .horse { font-weight: bold; color: #8b0000; }
    .race { border: 1px solid #eee; border-radius: 8px; margin-bottom: 15px; overflow: hidden; }
    .race-header { background: #f8f9fa; padding: 15px; border-bottom: 1px solid #eee; }
    .race-header h3 { margin: 0; color: #8b0000; }
    .horse-row { display: flex; padding: 10px 15px; border-bottom: 1px solid #f0f0f0; }
    .horse-row:last-child { border-bottom: none; }
    .position { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-left: 10px; }
    .pos-1 { background: #ffd700; color: #8b0000; }
    .pos-2 { background: #c0c0c0; color: #333; }
    .pos-3 { background: #cd7f32; color: #fff; }
    .horse-name { flex: 1; font-weight: 500; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏇 Elghali AI</h1>
      <p>ترشيحات سباقات الخيل - ${racecourse}</p>
      <p>${date}</p>
    </div>
    
    <div class="content">
      ${napOfTheDay ? `
      <div class="nap-card">
        <h2>🏆 ترشيح اليوم (NAP)</h2>
        <div class="horse">${napOfTheDay.horseName}</div>
        <p>${napOfTheDay.raceName}</p>
        <div class="confidence">${napOfTheDay.confidence}% ثقة</div>
        <p style="margin-top: 15px; color: #8b0000;">${napOfTheDay.reason}</p>
      </div>
      ` : ''}
      
      <div class="picks">
        ${nextBest ? `
        <div class="pick-card">
          <h3>📈 الترشيح الثاني</h3>
          <div class="horse">${nextBest.horseName}</div>
          <p style="font-size: 12px; color: #666;">${nextBest.raceName}</p>
        </div>
        ` : ''}
        ${valuePick ? `
        <div class="pick-card">
          <h3>💎 ترشيح القيمة</h3>
          <div class="horse">${valuePick.horseName}</div>
          <p style="font-size: 12px; color: #666;">${valuePick.raceName}</p>
        </div>
        ` : ''}
      </div>
      
      <h3 style="color: #8b0000; margin-bottom: 15px;">📊 تفاصيل السباقات</h3>
      
      ${races.map((race: any) => `
      <div class="race">
        <div class="race-header">
          <h3>السباق ${race.number}: ${race.name}</h3>
          <p style="margin: 5px 0 0; font-size: 12px; color: #666;">
            📏 ${race.distance}m | 🏔️ ${race.surface} | 🕐 ${race.time}
          </p>
        </div>
        ${race.predictions?.slice(0, 5).map((h: any, i: number) => `
        <div class="horse-row">
          <div class="position pos-${i + 1}">${i + 1}</div>
          <div class="horse-name">
            <strong>#${h.number} ${h.name}</strong>
            <div style="font-size: 12px; color: #666;">
              ${h.jockey ? `الفارس: ${h.jockey}` : ''} | 
              البوابة: ${h.draw} |
              القوة: ${h.powerScore?.toFixed(0) || 0}%
            </div>
          </div>
          <div style="color: #22c55e; font-weight: bold;">${h.winProbability?.toFixed(0) || 0}%</div>
        </div>
        `).join('') || ''}
      </div>
      `).join('')}
    </div>
    
    <div class="footer">
      <p>© 2026 Elghali AI - جميع الحقوق محفوظة</p>
      <p>هذه الترشيحات للأغراض الترفيهية فقط</p>
      <p style="margin-top: 10px;">
        <a href="https://elghali-ai.vercel.app" style="color: #8b0000;">زيارة الموقع</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Generate plain text version
 */
export function generatePredictionEmailText(data: {
  racecourse: string
  date: string
  races: any[]
  napOfTheDay: any
  nextBest: any
  valuePick: any
}): string {
  const { racecourse, date, races, napOfTheDay, nextBest, valuePick } = data

  let text = `
═══════════════════════════════════════════════════════
🏇 Elghali AI - ترشيحات سباقات الخيل
═══════════════════════════════════════════════════════

المضمار: ${racecourse}
التاريخ: ${date}

`

  if (napOfTheDay) {
    text += `
🏆 ترشيح اليوم (NAP)
────────────────────────────────────────────────────
${napOfTheDay.horseName}
السباق: ${napOfTheDay.raceName}
الثقة: ${napOfTheDay.confidence}%
السبب: ${napOfTheDay.reason}
`
  }

  if (nextBest) {
    text += `
📈 الترشيح الثاني: ${nextBest.horseName}
   السباق: ${nextBest.raceName}
`
  }

  if (valuePick) {
    text += `
💎 ترشيح القيمة: ${valuePick.horseName}
   السباق: ${valuePick.raceName}
`
  }

  text += `
────────────────────────────────────────────────────
📊 تفاصيل السباقات
────────────────────────────────────────────────────
`

  for (const race of races) {
    text += `
السباق ${race.number}: ${race.name}
📏 ${race.distance}m | 🏔️ ${race.surface} | 🕐 ${race.time}
`
    for (const h of (race.predictions?.slice(0, 5) || [])) {
      text += `  ${h.position || 1}. #${h.number} ${h.name} - الفارس: ${h.jockey} - القوة: ${h.powerScore?.toFixed(0) || 0}%\n`
    }
  }

  text += `
═══════════════════════════════════════════════════════
© 2026 Elghali AI
https://elghali-ai.vercel.app
═══════════════════════════════════════════════════════
`

  return text.trim()
}

/**
 * Send prediction report email
 */
export async function sendPredictionEmail(
  email: string,
  data: {
    racecourse: string
    date: string
    races: any[]
    napOfTheDay: any
    nextBest: any
    valuePick: any
  }
): Promise<EmailResult> {
  const html = generatePredictionEmailHTML(data)
  const text = generatePredictionEmailText(data)

  return sendEmail({
    to: email,
    subject: `🏇 Elghali AI - ترشيحات ${data.racecourse} - ${data.date}`,
    html,
    text
  })
}
