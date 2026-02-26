@echo off
chcp 65001 >nul
echo.
echo ==========================================
echo   🏇 Horse AI Predictor
echo   نظام ترشيحات سباقات الخيل
echo ==========================================
echo.
echo اختر طريقة التشغيل:
echo.
echo [1] واجهة الويب (Streamlit)
echo [2] سطر الأوامر
echo [3] اختبار النظام
echo.
set /p choice="أدخل رقم الاختيار: "

if "%choice%"=="1" (
    echo.
    echo 🚀 تشغيل واجهة الويب...
    streamlit run app.py
)
if "%choice%"=="2" (
    echo.
    echo 🚀 تشغيل سطر الأوامر...
    python race_bot.py -i
)
if "%choice%"=="3" (
    echo.
    echo 🧪 اختبار النظام...
    python -c "from race_bot import HorseAIPredictor; p = HorseAIPredictor(); r = p.predict('meydan', '2026-02-18'); p.display_predictions(r)"
)
pause
