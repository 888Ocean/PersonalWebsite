import Link from "next/link";
import TidalNav from "./TidalNav";

export function PersonalFooter() {
  return <footer className="personal-footer"><Link href="/">Ocean</Link><div><Link href="/work">Work</Link><Link href="/photography">Photography</Link><Link href="/about">About</Link></div><span>Made with attention · 2026</span></footer>;
}

export default function PersonalFrame({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <main className="personal-home inner-page"><TidalNav /><section className="inner-intro"><h1 data-enter>{title}</h1><p data-enter>{description}</p></section>{children}<PersonalFooter /></main>;
}
