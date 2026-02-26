#!/bin/bash
echo "=========================================="
echo "    نشر Elghali AI على Vercel"
echo "=========================================="
echo ""
echo "الخطوات:"
echo "1. تأكد من تسجيل الدخول في Vercel"
echo "2. سيتم النشر تلقائياً"
echo ""

# Check if vercel is logged in
npx vercel whoami 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ مسجل الدخول في Vercel"
    echo "جاري النشر..."
    npx vercel --prod --yes
else
    echo "❌ يجب تسجيل الدخول أولاً"
    echo "شغل: npx vercel login"
    npx vercel login
    npx vercel --prod --yes
fi
