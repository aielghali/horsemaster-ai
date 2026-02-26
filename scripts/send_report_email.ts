#!/usr/bin/env npx ts-node
/**
 * Send Report Email Script
 * Usage: npx ts-node scripts/send_report_email.ts <email> [pdf_path]
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface EmailConfig {
  server: string;
  port: number;
  username: string;
  password: string;
  fromName: string;
  fromAddress: string;
}

function getConfig(): EmailConfig {
  return {
    server: process.env.SMTP_SERVER || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    username: process.env.SMTP_USERNAME || '',
    password: process.env.SMTP_PASSWORD || '',
    fromName: process.env.EMAIL_FROM_NAME || 'Elghali Ai',
    fromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@elghali.ai'
  };
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string,
  pdfPath: string,
  config: EmailConfig
): Promise<boolean> {
  const pythonScript = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import sys

def send_email():
    smtp_server = '${config.server}'
    smtp_port = ${config.port}
    smtp_username = '${config.username}'
    smtp_password = '${config.password}'
    
    msg = MIMEMultipart('alternative')
    msg['From'] = '${config.fromName} <${config.fromAddress}>'
    msg['To'] = '${to}'
    msg['Subject'] = """${subject.replace(/"/g, '\\"')}"""
    
    text_body = """${text.replace(/"/g, '\\"')}"""
    msg.attach(MIMEText(text_body, 'plain', 'utf-8'))
    
    html_body = '''${html.replace(/'/g, "\\'")}'''
    msg.attach(MIMEText(html_body, 'html', 'utf-8'))
    
    with open('${pdfPath}', 'rb') as f:
        part = MIMEBase('application', 'octet-stream')
        part.set_payload(f.read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', 'attachment', filename='${path.basename(pdfPath)}')
        msg.attach(part)
    
    try:
        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(smtp_username, smtp_password)
            server.send_message(msg)
        print('✅ Email sent successfully to ${to}')
        return True
    except smtplib.SMTPAuthenticationError as e:
        print('❌ SMTP Authentication failed. Check your username and password.')
        print(f'Details: {e}')
        return False
    except Exception as e:
        print(f'❌ Failed to send email: {e}')
        return False

if __name__ == '__main__':
    success = send_email()
    sys.exit(0 if success else 1)
`;

  const scriptPath = `/tmp/send_email_${Date.now()}.py`;
  fs.writeFileSync(scriptPath, pythonScript);
  
  try {
    const { stdout, stderr } = await execAsync(`python3 "${scriptPath}"`, { timeout: 60000 });
    console.log(stdout);
    if (stderr) console.error(stderr);
    return stdout.includes('Email sent successfully');
  } finally {
    try { fs.unlinkSync(scriptPath); } catch {}
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📧 Elghali Ai - Email Report Sender');
    console.log('====================================');
    console.log('');
    console.log('Usage: npx ts-node scripts/send_report_email.ts <email> [pdf_path]');
    console.log('');
    console.log('Environment variables required:');
    console.log('  SMTP_SERVER   - SMTP server (default: smtp.gmail.com)');
    console.log('  SMTP_PORT     - SMTP port (default: 587)');
    console.log('  SMTP_USERNAME - Your email address');
    console.log('  SMTP_PASSWORD - Your email password or app password');
    console.log('');
    console.log('Example:');
    console.log('  SMTP_USERNAME=you@gmail.com SMTP_PASSWORD=your-app-password \\');
    console.log('  npx ts-node scripts/send_report_email.ts recipient@example.com');
    process.exit(1);
  }
  
  const to = args[0];
  const pdfPath = args[1] || '/home/z/my-project/download/Wolverhampton_Racecard_16Feb2026.pdf';
  
  const config = getConfig();
  
  console.log('📧 Elghali Ai - Email Report Sender');
  console.log('====================================');
  console.log(`To: ${to}`);
  console.log(`PDF: ${pdfPath}`);
  console.log(`SMTP: ${config.server}:${config.port}`);
  console.log(`From: ${config.fromName} <${config.fromAddress}>`);
  console.log('');
  
  // Check configuration
  if (!config.username || !config.password) {
    console.log('❌ Email not configured!');
    console.log('');
    console.log('Please set environment variables:');
    console.log('  export SMTP_USERNAME=your-email@gmail.com');
    console.log('  export SMTP_PASSWORD=your-app-password');
    console.log('');
    console.log('For Gmail, you need an App Password:');
    console.log('  1. Go to https://myaccount.google.com/apppasswords');
    console.log('  2. Generate a new app password');
    console.log('  3. Use that password as SMTP_PASSWORD');
    process.exit(1);
  }
  
  // Check PDF
  if (!fs.existsSync(pdfPath)) {
    console.log(`❌ PDF not found: ${pdfPath}`);
    process.exit(1);
  }
  
  const subject = '🏇 Elghali Ai - ترشيحات Wolverhampton - 16 February 2026';
  
  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>Elghali Ai - تقرير الترشيحات</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #fef3e2; margin: 0; padding: 20px; direction: rtl; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(139,0,0,0.1); overflow: hidden; }
    .header { background: linear-gradient(135deg, #8B0000, #A52A2A); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; color: #D4AF37; }
    .content { padding: 30px; }
    .highlight-box { background: linear-gradient(135deg, #FFF8DC, #FFFACD); border: 2px solid #D4AF37; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
    .stats { display: flex; justify-content: space-around; background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .stat { text-align: center; }
    .stat-value { font-size: 24px; font-weight: bold; color: #8B0000; }
    .stat-label { font-size: 14px; color: #666; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐴 Elghali Ai</h1>
      <p>تقرير ترشيحات سباقات الخيل</p>
    </div>
    <div class="content">
      <p>مرحباً،</p>
      <p>يرجى إيجاد ملف PDF المرفق الذي يحتوي على ترشيحات سباقات الخيل.</p>
      
      <div class="stats">
        <div class="stat">
          <div class="stat-value">Wolverhampton</div>
          <div class="stat-label">المضمار</div>
        </div>
        <div class="stat">
          <div class="stat-value">16 Feb 2026</div>
          <div class="stat-label">التاريخ</div>
        </div>
        <div class="stat">
          <div class="stat-value">7</div>
          <div class="stat-label">السباقات</div>
        </div>
      </div>
      
      <div class="highlight-box">
        <h3>🌟 NAP of the Day - ترشيح اليوم</h3>
        <p style="font-size: 24px; font-weight: bold; color: #D4AF37; margin: 10px 0;">Alondra</p>
        <p style="color: #666;">Race 1 - 17:00</p>
        <p style="color: #333; margin-top: 10px;">Strong recent form, optimal draw position, course experience. 85% confidence.</p>
      </div>
      
      <p style="text-align: center;">📎 ملف PDF المرفق يحتوي على الترشيحات الكاملة</p>
      
      <p>مع أطيب التحيات،<br><strong>فريق Elghali Ai</strong></p>
    </div>
    <div class="footer">
      <p>© 2025 Elghali Ai - جميع الحقوق محفوظة</p>
    </div>
  </div>
</body>
</html>
`;

  const text = `
Elghali Ai - تقرير ترشيحات سباقات الخيل
=====================================

المضمار: Wolverhampton
التاريخ: 16 February 2026
عدد السباقات: 7

🌟 NAP of the Day: Alondra
السباق: Race 1 - 17:00
مستوى الثقة: 85%

يرجى إيجاد ملف PDF المرفق.

© 2025 Elghali Ai
`;

  const success = await sendEmail(to, subject, html, text, pdfPath, config);
  process.exit(success ? 0 : 1);
}

main().catch(console.error);
