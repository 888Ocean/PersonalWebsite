import type { Metadata } from "next";
import localFont from "next/font/local";
import PersonalMotion from "./components/PersonalMotion";
import "./globals.css";
import "./case-editor-adaptive.css";

const barlow = localFont({
  src: [
    { path: "../public/fonts/Barlow-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/Barlow-Medium.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = localFont({
  src: "../public/fonts/BarlowCondensed-Bold.ttf",
  weight: "700",
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ocean — AI application developer and photographer",
  description: "AI application projects, product thinking, and photography by Ocean.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body className={`${barlow.variable} ${barlowCondensed.variable}`}>{children}<PersonalMotion /></body>
    </html>
  );
}
