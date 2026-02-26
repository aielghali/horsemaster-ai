/**
 * Elghali AI - Email Service
 * Professional email sending with PDF attachments
 */

import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

// Email configuration
const EMAIL_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'ai.elghali.ali@gmail.com',
    pass: 'uboj rlmd jnmn dgfw'
  }
}

export interface EmailResult {
  success: boolean
  message: string
  messageId?: string
}

export interface PredictionEmailData {
  to: string
  racecourse: string
  date: string
  totalRaces: number
  napOfTheDay: {
    horseName: string
    raceName: string
    reason: string
    confidence: number
  }
  pdfPath?: string
}

/**
 * Create email transporter
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: EMAIL_CONFIG.host,
    port: EMAIL_CONFIG.port,
    secure: EMAIL_CONFIG.secure,
    auth: EMAIL_CONFIG.auth,
    tls: {
      rejectUnauthorized: false
    }
  })
}

/**
 * Generate HTML email content
 */
function generateEmailHTML(data: PredictionEmailData): string {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #fef3e2 0%, #ffffff 100%);
      margin: 0;
      padding: 20px;
      direction: rtl;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(139, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #8B0000 0%, #A52A2A 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      color: #D4AF37;
    }
    .header p {
      margin: 10px 0 0;
      opacity: 0.9;
    }
    .content {
      padding: 30px;
    }
    .highlight-box {
      background: linear-gradient(135deg, #FFF8DC 0%, #FFFACD 100%);
      border: 2px solid #D4AF37;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      text-align: center;
    }
    .highlight-box h3 {
      color: #8B0000;
      margin: 0 0 10px;
    }
    .stats {
      display: flex;
      justify-content: space-around;
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .stat {
      text-align: center;
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #8B0000;
    }
    .stat-label {
      font-size: 14px;
      color: #666;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    .warning {
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 4px;
      padding: 10px;
      margin: 20px 0;
      font-size: 12px;
      color: #856404;
    }
    .confidence {
      display: inline-block;
      background: #28a745;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: bold;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #8B0000 0%, #A52A2A 100%);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐴 Elghali AI</h1>
      <p>تقرير ترشيحات سباقات الخيل</p>
    </div>
    
    <div class="content">
      <p style="font-size: 16px; color: #333;">
        مرحباً،
      </p>
      <p style="color: #666;">
        يرجى إيجاد تقرير الترشيحات الكامل في المرفقات.
      </p>
      
      <div class="stats">
        <div class="stat">
          <div class="stat-value">${data.racecourse}</div>
          <div class="stat-label">المضمار</div>
        </div>
        <div class="stat">
          <div class="stat-value">${data.date}</div>
          <div class="stat-label">التاريخ</div>
        </div>
        <div class="stat">
          <div class="stat-value">${data.totalRaces}</div>
          <div class="stat-label">السباقات</div>
        </div>
      </div>
      
      <div class="highlight-box">
        <h3>🌟 NAP of the Day - ترشيح اليوم</h3>
        <p style="font-size: 24px; font-weight: bold; color: #D4AF37; margin: 10px 0;">
          ${data.napOfTheDay.horseName}
        </p>
        <p style="color: #666; font-size: 14px;">
          ${data.napOfTheDay.raceName}
        </p>
        <p class="confidence">${data.napOfTheDay.confidence}% ثقة</p>
        <p style="color: #333; font-size: 13px; margin-top: 10px;">
          ${data.napOfTheDay.reason}
        </p>
      </div>
      
      <div class="warning">
        ⚠️ تنبيه: هذه الترشيحات مبنية على تحليل الذكاء الاصطناعي للبيانات المتاحة. 
        المراهنة تنطوي على مخاطر - الرجاء المراهنة بمسؤولية.
      </div>
      
      <p style="color: #333; margin-top: 20px; text-align: center;">
        📎 ملف PDF المرفق يحتوي على الترشيحات الكاملة لجميع السباقات
      </p>
      
      <p style="color: #333; margin-top: 20px;">
        مع أطيب التحيات،<br>
        <strong>فريق Elghali AI</strong>
      </p>
    </div>
    
    <div class="footer">
      <p>© 2025 Elghali AI - جميع الحقوق محفوظة</p>
      <p>هذا البريد الإلكتروني تم إرساله تلقائياً - لا ترد عليه</p>
    </div>
  </div>
</body>
</html>
  `
}

/**
 * Generate plain text email content
 */
function generateEmailText(data: PredictionEmailData): string {
  return `
Elghali AI - تقرير ترشيحات سباقات الخيل
=====================================

المضمار: ${data.racecourse}
التاريخ: ${data.date}
عدد السباقات: ${data.totalRaces}

🌟 NAP of the Day - ترشيح اليوم: ${data.napOfTheDay.horseName}
مستوى الثقة: ${data.napOfTheDay.confidence}%
السباق: ${data.napOfTheDay.raceName}
السبب: ${data.napOfTheDay.reason}

---
يرجى إيجاد ملف PDF المرفق الذي يحتوي على الترشيحات الكاملة.

تنبيه: هذه الترشيحات مبنية على تحليل الذكاء الاصطناعي للبيانات المتاحة.
المراهنة تنطوي على مخاطر - الرجاء المراهنة بمسؤولية.

© 2025 Elghali AI
  `
}

/**
 * Send prediction email with PDF attachment
 */
export async function sendPredictionEmail(data: PredictionEmailData): Promise<EmailResult> {
  try {
    console.log(`[Email] Sending to: ${data.to}`)
    
    const transporter = createTransporter()
    
    // Verify connection
    await transporter.verify()
    console.log('[Email] SMTP connection verified')
    
    // Prepare email options
    const mailOptions: nodemailer.SendMailOptions = {
      from: {
        name: 'Elghali AI',
        address: 'aielghali@gmail.com'
      },
      to: data.to,
      subject: `🏇 Elghali AI - ترشيحات ${data.racecourse} - ${data.date}`,
      html: generateEmailHTML(data),
      text: generateEmailText(data)
    }
    
    // Add PDF attachment if exists
    if (data.pdfPath && fs.existsSync(data.pdfPath)) {
      const filename = path.basename(data.pdfPath)
      mailOptions.attachments = [{
        filename,
        path: data.pdfPath,
        contentType: 'text/html'
      }]
      console.log(`[Email] Attachment added: ${filename}`)
    }
    
    // Send email
    const info = await transporter.sendMail(mailOptions)
    
    console.log(`[Email] Sent successfully: ${info.messageId}`)
    
    return {
      success: true,
      message: `تم إرسال البريد الإلكتروني بنجاح إلى ${data.to}`,
      messageId: info.messageId
    }
    
  } catch (error) {
    console.error('[Email] Error:', error)
    
    return {
      success: false,
      message: `فشل إرسال البريد: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
    }
  }
}

/**
 * Send test email
 */
export async function sendTestEmail(to: string): Promise<EmailResult> {
  return sendPredictionEmail({
    to,
    racecourse: 'Meydan',
    date: new Date().toISOString().split('T')[0],
    totalRaces: 0,
    napOfTheDay: {
      horseName: 'Test Horse',
      raceName: 'Test Race',
      reason: 'This is a test email',
      confidence: 85
    }
  })
}

/**
 * Check email configuration
 */
export function isEmailConfigured(): boolean {
  return !!(EMAIL_CONFIG.auth.user && EMAIL_CONFIG.auth.pass)
}
