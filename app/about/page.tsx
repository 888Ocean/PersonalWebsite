import type { Metadata } from "next";
import { contacts, mission, positioning } from "../archive-copy";
import SketchMark from "../components/SketchMark";

export const metadata: Metadata = {
  title: "About",
  description: "Ocean 的使命与联系入口。",
};

export default function AboutPage() {
  return (
    <main className="shell page">
      <header className="page-intro">
        <h1>About</h1>
      </header>
      <section className="about-block">
        <p className="mission">{mission}</p>
        <p className="position">Ocean。{positioning}</p>
      </section>
      <section className="about-block" id="contact">
        <h2>联系</h2>
        <ul className="contact-list">
          {contacts.map((item) => (
            <li key={item.label}>
              <a href={item.href}>{item.label}</a>
              <span>{item.value}</span>
              <SketchMark />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
