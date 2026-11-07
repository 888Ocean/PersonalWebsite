import type { Metadata } from "next";
import localFont from "next/font/local";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import "./globals.css";

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
  title: {
    default: "[SiteName]",
    template: "%s · [SiteName]",
  },
  description: "Ocean 的作品、照片与笔记。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${barlow.variable} ${barlowCondensed.variable}`}>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
