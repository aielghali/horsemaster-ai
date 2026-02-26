# 🐎 HorseMaster - نظام ترشيحات سباقات الخيل

نظام ذكاء اصطناعي لتحليل وترشيح سباقات الخيل مع دعم كامل للغة العربية.

![HorseMaster](https://img.shields.io/badge/HorseMaster-v2.0-green)
![Python](https://img.shields.io/badge/Python-3.11-blue)
![Flask](https://img.shields.io/badge/Flask-2.3-orange)

## ✨ المميزات

- 🌍 دعم 7 دول (الإمارات، بريطانيا، أستراليا، أمريكا، فرنسا، السعودية، قطر)
- 📊 تحليل 17+ عامل لكل حصان
- 🏆 ترشيح اليوم (NAP) + الترشيح الثاني + ترشيح القيمة
- 📱 تصميم متجاوب للجوال
- 🔤 دعم كامل للغة العربية

## 🚀 النشر على Heroku

### الطريقة 1: عبر Heroku CLI

```bash
# 1. تسجيل الدخول
heroku login

# 2. إنشاء تطبيق جديد
heroku create horsemaster-app

# 3. إضافة الملفات
git add .
git commit -m "Initial commit"

# 4. النشر
git push heroku master

# 5. فتح التطبيق
heroku open
```

### الطريقة 2: عبر GitHub

1. ارفع المشروع إلى GitHub
2. اذهب إلى [Heroku Dashboard](https://dashboard.heroku.com)
3. أنشئ تطبيق جديد
4. اربط GitHub repository
5. فعّل Automatic Deploys

## 📁 هيكل المشروع

```
horsemaster-heroku/
├── app.py              # التطبيق الرئيسي (Flask)
├── requirements.txt    # المتطلبات
├── Procfile           # تكوين Heroku
├── runtime.txt        # إصدار Python
├── templates/
│   └── index.html     # الصفحة الرئيسية
└── README.md          # التوثيق
```

## 🔧 التشغيل المحلي

```bash
# تثبيت المتطلبات
pip install -r requirements.txt

# تشغيل التطبيق
python app.py

# افتح http://localhost:5000
```

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | الصفحة الرئيسية |
| `/api/horsemaster` | GET | قائمة المضامير |
| `/api/horsemaster` | POST | الحصول على الترشيحات |
| `/health` | GET | فحص صحة التطبيق |

### مثال على طلب الترشيحات

```bash
curl -X POST https://your-app.herokuapp.com/api/horsemaster \
  -H "Content-Type: application/json" \
  -d '{"country":"UAE","track_id":"meydan","date":"2026-02-25"}'
```

## 🌍 الدول المدعومة

| الدولة | الكود | المضامير |
|--------|-------|----------|
| 🇦🇪 الإمارات | UAE | Meydan, Jebel Ali, Al Ain, Abu Dhabi, Sharjah |
| 🇬🇧 بريطانيا | UK | Ascot, Newmarket, Kempton, Lingfield, Sandown |
| 🇦🇺 أستراليا | AUSTRALIA | Flemington, Randwick, Caulfield |
| 🇺🇸 أمريكا | USA | Churchill Downs, Santa Anita, Belmont |
| 🇫🇷 فرنسا | FRANCE | Longchamp, Chantilly |
| 🇸🇦 السعودية | SAUDI_ARABIA | King Abdulaziz |
| 🇶🇦 قطر | QATAR | Al Rayyan |

## 📄 الرخصة

MIT License - © 2026 HorseMaster

---

**⚠️ تنبيه:** هذه الترشيحات للترفيه فقط. المراهنة تنطوي على مخاطر.
