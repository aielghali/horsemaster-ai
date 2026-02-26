import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elghali Ai - ترشيحات سباقات الخيل الذكية",
  description: "نظام الذكاء الاصطناعي المتخصص في تحليل سباقات الخيل وإنشاء ترشيحات دقيقة. AI-powered horse racing predictions.",
  keywords: ["Elghali Ai", "horse racing", "سباقات الخيل", "ترشيحات", "predictions", "AI", "Dubai Racing", "Meydan"],
  authors: [{ name: "Elghali Ai Team" }],
  icons: {
    icon: "/elghali-logo.png",
  },
  openGraph: {
    title: "Elghali Ai - Horse Racing Predictions",
    description: "AI-powered horse racing predictions with Arabic support",
    url: "https://elghaliai.com",
    siteName: "Elghali Ai",
    type: "website",
    images: ["/elghali-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elghali Ai - Horse Racing Predictions",
    description: "AI-powered horse racing predictions with Arabic support",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "'Noto Sans Arabic', 'Geist', sans-serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
