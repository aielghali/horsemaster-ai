# 🐎 دليل نشر HorseMaster على Heroku

## 📋 المتطلبات
- حساب Heroku
- API Key من Heroku
- المشروع المُعد (horsemaster-heroku.zip)

---

## 🔑 كيفية الحصول على API Key

### الطريقة 1: من Terminal (إذا سبق لك الدخول)
```bash
heroku auth:token
```

### الطريقة 2: من ملف التكوين
- **Windows:** `%LOCALAPPDATA%\.heroku\netrc`
- **Mac/Linux:** `~/.netrc`

---

## 🚀 خطوات النشر الكاملة

### 1. فك ضغط المشروع
```bash
unzip horsemaster-heroku.zip
cd horsemaster-heroku
```

### 2. تسجيل الدخول (تفاعلي)
```bash
heroku login -i
```
أدخل:
- Email: بريدك الإلكتروني
- Password: كلمة المرور أو API Key

### 3. إنشاء تطبيق جديد
```bash
heroku create horsemaster-ai
```

### 4. رفع المشروع
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku master
```

### 5. فتح التطبيق
```bash
heroku open
```

---

## 🔧 إذا واجهت مشاكل

### مشكلة: "Authentication required"
**الحل:**
```bash
heroku logout
heroku login -i
```

### مشكلة: "App name already taken"
**الحل:**
```bash
# استخدم اسم مختلف
heroku create horsemaster-ai-2026
```

### مشكلة: "No git repository"
**الحل:**
```bash
git init
git config user.email "your-email@example.com"
git config user.name "Your Name"
```

---

## 📱 بديل: استخدام Heroku Container Registry

### 1. بناء Docker Image
```bash
docker build -t horsemaster .
```

### 2. تسجيل الدخول لـ Container Registry
```bash
heroku container:login
```

### 3. رفع الصورة
```bash
heroku container:push web -a horsemaster-ai
heroku container:release web -a horsemaster-ai
```

---

## ✅ التحقق من النجاح

بعد النشر، ستتلقى رابط مثل:
```
https://horsemaster-ai-xxxx.herokuapp.com
```

اختبر التطبيق:
```bash
curl https://horsemaster-ai-xxxx.herokuapp.com
```

---

## 📧 إضافة خدمة البريد الإلكتروني

لإرسال النتائج تلقائياً، أضف SendGrid:
```bash
heroku addons:create sendgrid:starter
```

---

## 🆘 الدعم الفني

- وثائق Heroku: https://devcenter.heroku.com
- مجتمع Heroku: https://help.heroku.com

---

**تم إعداد هذا الدليل خصيصاً لمشروع HorseMaster AI 🐎**
