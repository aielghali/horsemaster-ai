# 🚀 دليل نشر HorseMaster AI على Render

## 📋 الخطوات التفصيلية

### الخطوة 1: إنشاء مستودع GitHub

1. اذهب إلى: https://github.com/new
2. اسم المستودع: `horsemaster-ai`
3. اختر **Public**
4. اضغط **Create repository**

### الخطوة 2: رفع الكود إلى GitHub

```bash
# على جهازك في Terminal
cd horsemaster-deploy

# أضف remote
git remote add origin https://github.com/YOUR_USERNAME/horsemaster-ai.git

# تغيير اسم الفرع
git branch -M main

# رفع الكود
git push -u origin main
```

### الخطوة 3: على Render

1. في صفحة https://dashboard.render.com/web/new
2. اختر **Build and deploy from a Git repository**
3. اضغط **Connect account** لـ GitHub
4. اختر المستودع `horsemaster-ai`
5. املأ الإعدادات:

| الإعداد | القيمة |
|---------|--------|
| **Name** | `horsemaster-ai` |
| **Region** | Oregon (US West) أو Frankfurt |
| **Branch** | main |
| **Root Directory** | (اتركه فارغاً) |
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn app:app` |
| **Instance Type** | Free |

6. اضغط **Deploy Web Service**

### الخطوة 4: انتظر

- سيستغرق 2-5 دقائق
- ستجد رابط التطبيق مثل:
  ```
  https://horsemaster-ai.onrender.com
  ```

---

## ⚡ طريقة أسرع: deploy from ZIP

### إذا لم تكن لديك GitHub:

1. على Render، اختر **Deploy an existing image from a registry**
2. استخدم Docker Hub أو أي registry آخر

---

## 🎯 بعد النشر

اختبر التطبيق:
```
https://YOUR-APP.onrender.com/api/test
```

---

## 📞 للمساعدة

إذا واجهت أي مشكلة، أخبرني:
- ما هي الخطوة التي توقفت عندها؟
- ما هي الرسالة التي ظهرت؟

---
**Elghali AI Solutions 🐎**
