import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Email configuration - hard coded for reliability
const EMAIL_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'ai.elghali.ali@gmail.com',
    pass: 'uboj rlmd jnmn dgfw'
  }
}

// Default recipient
const DEFAULT_RECIPIENT = 'paidera21@gmail.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      to = DEFAULT_RECIPIENT, 
      racecourse, 
      date, 
      napOfTheDay, 
      totalRaces,
      pdfContent,
      pdfFilename
    } = body

    console.log('[Email API] Sending email to:', to || DEFAULT_RECIPIENT)

    // Create transporter with explicit config
    const transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.host,
      port: EMAIL_CONFIG.port,
      secure: EMAIL_CONFIG.secure,
      auth: EMAIL_CONFIG.auth,
      tls: {
        rejectUnauthorized: false
      }
    })

    // Verify connection
    await transporter.verify()
    console.log('[Email API] SMTP verified successfully')

    const horseName = napOfTheDay?.horseName || 'Top Pick'
    const raceDate = date || new Date().toISOString().split('T')[0]
    const course = racecourse || 'Meydan'
    const races = totalRaces || 0

    // Build email options
    const mailOptions: nodemailer.SendMailOptions = {
      from: {
        name: 'Elghali AI',
        address: 'ai.elghali.ali@gmail.com'
      },
      to: to || DEFAULT_RECIPIENT,
      subject: `🏇 Elghali AI - ترشيحات ${course} - ${raceDate}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; direction: rtl; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #8B0000 0%, #A52A2A 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; color: #D4AF37; }
            .content { padding: 30px; }
            .stats { display: flex; justify-content: space-around; background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .stat { text-align: center; }
            .stat-value { font-size: 20px; font-weight: bold; color: #8B0000; }
            .stat-label { font-size: 12px; color: #666; }
            .nap-box { background: linear-gradient(135deg, #FFF8DC 0%, #FFFACD 100%); border: 2px solid #D4AF37; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
            .nap-box h3 { color: #8B0000; margin: 0 0 10px; }
            .confidence { display: inline-block; background: #28a745; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .warning { background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; padding: 10px; margin: 20px 0; font-size: 12px; color: #856404; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🐴 Elghali AI</h1>
              <p>تقرير ترشيحات سباقات الخيل</p>
            </div>
            <div class="content">
              <p>مرحباً،</p>
              <p>يرجى إيجاد تقرير الترشيحات الكامل.</p>
              
              <div class="stats">
                <div class="stat">
                  <div class="stat-value">${course}</div>
                  <div class="stat-label">المضمار</div>
                </div>
                <div class="stat">
                  <div class="stat-value">${raceDate}</div>
                  <div class="stat-label">التاريخ</div>
                </div>
                <div class="stat">
                  <div class="stat-value">${races}</div>
                  <div class="stat-label">السباقات</div>
                </div>
              </div>
              
              <div class="nap-box">
                <h3>🌟 NAP of the Day - ترشيح اليوم</h3>
                <p style="font-size: 24px; font-weight: bold; color: #D4AF37; margin: 10px 0;">${horseName}</p>
                <p style="color: #666;">${napOfTheDay?.raceName || 'Best bet of the day'}</p>
                ${napOfTheDay?.confidence ? `<p class="confidence">${napOfTheDay.confidence}% ثقة</p>` : ''}
                ${napOfTheDay?.reason ? `<p style="color: #333; font-size: 13px; margin-top: 10px;">${napOfTheDay.reason}</p>` : ''}
              </div>
              
              <div class="warning">
                ⚠️ تنبيه: هذه الترشيحات مبنية على تحليل الذكاء الاصطناعي. المراهنة تنطوي على مخاطر.
              </div>
              
              <p>مع أطيب التحيات،<br><strong>فريق Elghali AI</strong></p>
            </div>
            <div class="footer">
              <p>© 2026 Elghali AI - جميع الحقوق محفوظة</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Elghali AI - تقرير ترشيحات سباقات الخيل
=====================================

المضمار: ${course}
التاريخ: ${raceDate}
عدد السباقات: ${races}

🌟 NAP of the Day: ${horseName}
${napOfTheDay?.reason || ''}

---
تنبيه: هذه الترشيحات مبنية على تحليل الذكاء الاصطناعي.
المراهنة تنطوي على مخاطر.

© 2026 Elghali AI
      `
    }

    // Add PDF attachment if provided
    if (pdfContent) {
      mailOptions.attachments = [{
        filename: pdfFilename || 'elghali-report.html',
        content: pdfContent,
        contentType: 'text/html'
      }]
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log('[Email API] Email sent successfully:', info.messageId)

    return NextResponse.json({ 
      success: true, 
      message: 'تم إرسال البريد الإلكتروني بنجاح',
      messageId: info.messageId 
    })

  } catch (error) {
    console.error('[Email API] Error:', error)
    return NextResponse.json({ 
      success: false, 
      message: `فشل إرسال البريد: ${error instanceof Error ? error.message : 'خطأ غير معروف'}` 
    }, { status: 500 })
  }
}

// GET endpoint to test email
export async function GET() {
  try {
    const transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.host,
      port: EMAIL_CONFIG.port,
      secure: EMAIL_CONFIG.secure,
      auth: EMAIL_CONFIG.auth,
      tls: { rejectUnauthorized: false }
    })

    await transporter.verify()
    
    return NextResponse.json({ 
      success: true, 
      message: 'SMTP connection verified',
      config: {
        host: EMAIL_CONFIG.host,
        port: EMAIL_CONFIG.port,
        user: EMAIL_CONFIG.auth.user,
        defaultRecipient: DEFAULT_RECIPIENT
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: `SMTP verification failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
}
