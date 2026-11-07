import Link from "next/link";
import { siteName, siteNav } from "../site-nav";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <Link href="/">{siteName}</Link>
        <nav aria-label="页脚" className="site-nav">
          {siteNav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
