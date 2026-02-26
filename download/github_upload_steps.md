# 📤 خطوات رفع المشروع إلى GitHub

## ✅ المتطلبات الجاهزة:
- [x] حساب GitHub
- [x] حساب Vercel

---

## 🔢 الخطوات بالتفصيل:

### الخطوة 1: إنشاء مستودع جديد على GitHub

1. افتح المتصفح واذهب إلى:
   👉 https://github.com/new

2. املأ البيانات:
   - Repository name: `elghali-ai`
   - Description: `Horse Racing Predictions`
   - اختر: Public ✅
   - لا تضف README أو .gitignore (موجودين مسبقاً)

3. اضغط: **Create repository**

---

### الخطوة 2: نسخ رابط المستودع

بعد إنشاء المستودع، ستجد صفحة بها أوامر.

انسخ الرابط الذي يبدأ بـ:
```
https://github.com/YOUR_USERNAME/elghali-ai.git
```

---

### الخطوة 3: رفع الملفات

### 🎯 الطريقة الأسهل: السحب والإفلات

1. في صفحة المستودع، ابحث عن رابط:
   **"uploading an existing file"** (اضغط عليه)

2. ستجد منطقة للسحب والإفلات

3. اسحب هذه المجلدات والملفات من جهازك:
   ```
   📁 src/
   📁 public/
   📁 prisma/
   📄 package.json
   📄 next.config.ts
   📄 tailwind.config.ts
   📄 tsconfig.json
   📄 vercel.json
   📄 .env.example
   📄 .gitignore
   ```

4. اضغط **Commit changes**

---

## ⚡ الطريقة السريعة: باستخدام الرابط

بعد إنشاء المستودع، أخبرني برابط المستودع (مثال):
```
https://github.com/USERNAME/elghali-ai
```

وسأساعدك في باقي الخطوات!

---

## 📋 بعد رفع الملفات:

### الخطوة 4: الذهاب إلى Vercel

1. افتح: https://vercel.com
2. اضغط: **Add New → Project**
3. اختر: **Import Git Repository**
4. ابحث عن: `elghali-ai`
5. اضغط: **Import**

### الخطوة 5: إضافة متغيرات البيئة

اضغط **Environment Variables** وأضف:

```
DATABASE_URL=file:/tmp/database.db
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=ai.elghali.ali@gmail.com
SMTP_PASSWORD=uboj rlmd jnmn dgfw
EMAIL_FROM_NAME=Elghali Ai
EMAIL_FROM_ADDRESS=noreply@elghali.ai
```

### الخطوة 6: النشر

اضغط **Deploy** ✅

---

## 🌐 رابط موقعك النهائي:
```
https://elghali-ai.vercel.app
```
