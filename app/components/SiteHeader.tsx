"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteName, siteNav } from "../site-nav";

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="shell">
        <Link href="/" className="site-name" aria-current={pathname === "/" ? "page" : undefined}>
          {siteName}
        </Link>
        <nav aria-label="主导航" className="site-nav">
          {siteNav.map((item) => {
            const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} aria-current={current ? "page" : undefined}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
