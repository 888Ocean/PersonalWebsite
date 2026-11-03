"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/work", label: "Work" },
  { href: "/photography", label: "Photography" },
  { href: "/about", label: "About" },
  { href: "/journal", label: "Journal" },
];

export default function TidalNav() {
  const pathname = usePathname();

  return (
    <header className="personal-nav">
      <Link className="personal-nav-name" href="/">Ocean</Link>
      <nav aria-label="Main navigation">
        {links.map(({ href, label }) => (
          <Link key={href} href={href} aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}>
            {label}
          </Link>
        ))}
      </nav>
      <Link className="personal-nav-contact" href="/#contact">Contact</Link>
    </header>
  );
}
