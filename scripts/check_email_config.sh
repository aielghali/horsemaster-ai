#!/bin/bash
echo "📧 Elghali Ai - Email Configuration Check"
echo "=========================================="
echo ""

# Load environment variables
if [ -f .env.local ]; then
    export $(grep -v '^#' .env.local | xargs)
fi

if [ -z "$SMTP_USERNAME" ] || [ -z "$SMTP_PASSWORD" ]; then
    echo "❌ Email not configured!"
    echo ""
    echo "To configure email, edit .env.local and set:"
    echo "  SMTP_USERNAME=your-email@gmail.com"
    echo "  SMTP_PASSWORD=your-app-password"
    echo ""
    echo "For Gmail, you need an App Password:"
    echo "  1. Go to https://myaccount.google.com/apppasswords"
    echo "  2. Sign in with your Google account"
    echo "  3. Click 'Create' to generate a new app password"
    echo "  4. Select 'Mail' and 'Other (Custom name)'"
    echo "  5. Copy the 16-character password"
    echo "  6. Add it to .env.local as SMTP_PASSWORD"
    echo ""
    echo "Example .env.local:"
    echo "  SMTP_SERVER=smtp.gmail.com"
    echo "  SMTP_PORT=587"
    echo "  SMTP_USERNAME=youremail@gmail.com"
    echo "  SMTP_PASSWORD=xxxx xxxx xxxx xxxx"
    exit 1
else
    echo "✅ Email is configured!"
    echo ""
    echo "SMTP Server: $SMTP_SERVER:$SMTP_PORT"
    echo "Username: $SMTP_USERNAME"
    echo "From: $EMAIL_FROM_NAME <$EMAIL_FROM_ADDRESS>"
    echo ""
    echo "Ready to send reports!"
fi
