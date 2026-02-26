# تعليمات رفع المشروع على GitHub

## الخطوة 1: إنشاء المستودع

1. اذهب إلى: https://github.com/new
2. Repository name: elghali-ai
3. Public ✅
4. اضغط "Create repository"

---

## الخطوة 2: رفع الملفات يدوياً

### الملفات الأساسية (ارفعها بالترتيب):

### 1. package.json
```
{
  "name": "elghali-ai",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "eslint .",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.1.1",
    "@prisma/client": "^6.11.1",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.525.0",
    "next": "^16.1.1",
    "nodemailer": "^8.0.1",
    "prisma": "^6.11.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.60.0",
    "tailwind-merge": "^3.3.1",
    "z-ai-web-dev-sdk": "^0.0.16",
    "zod": "^4.0.2"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "^16.1.1",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

### 2. next.config.ts
```
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
```

### 3. vercel.json
```
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "functions": {
    "src/app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

### 4. .env.example
```
DATABASE_URL=file:/tmp/database.db
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM_NAME=Elghali Ai
EMAIL_FROM_ADDRESS=noreply@elghali.ai
```

### 5. .gitignore
```
node_modules/
.next/
.env
*.db
```

---

## الخطوة 3: هيكل المجلدات

بعد رفع الملفات الأساسية، أنشئ المجلدات:

```
elghali-ai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/route.ts
│   │   │   ├── search-races/route.ts
│   │   │   ├── generate-report/route.ts
│   │   │   └── send-email/route.ts
│   │   ├── download/[filename]/route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/ui/
│   ├── lib/
│   └── hooks/
├── public/
├── prisma/schema.prisma
└── (الملفات الأساسية أعلاه)
```

---

## الخطوة 4: متغيرات البيئة في Vercel

بعد رفع المشروع، أضف في Vercel:

```
DATABASE_URL=file:/tmp/database.db
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=ai.elghali.ali@gmail.com
SMTP_PASSWORD=uboj rlmd jnmn dgfw
EMAIL_FROM_NAME=Elghali Ai
EMAIL_FROM_ADDRESS=noreply@elghali.ai
```

---

## ملاحظة مهمة

الرفع اليدوي لكل الملفات صعب. الحل الأسهل:

1. ثبت GitHub Desktop: https://desktop.github.com/
2. سجل دخولك
3. Clone مستودعك
4. انسخ ملفات المشروع
5. Commit و Push
