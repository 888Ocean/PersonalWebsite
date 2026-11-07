import TidalNav from "./TidalNav";

type ArchivePageProps = {
  code: string;
  eyebrow: string;
  title: string;
  italic: string;
  description: string;
  children: React.ReactNode;
  tone: "current" | "reef" | "shore" | "deep";
};

export default function ArchivePage({ code, eyebrow, title, italic, description, children, tone }: ArchivePageProps) {
  return (
    <main className={`archive-page archive-${tone}`}>
      <TidalNav />
      <div className="archive-watermark" aria-hidden="true">{code}</div>
      <section className="archive-hero">
        <div className="archive-coordinates"><span>{code}</span><span>{eyebrow}</span></div>
        <h1>{title}<br /><em>{italic}</em></h1>
        <p>{description}</p>
        <div className="archive-tide-line" aria-hidden="true"><i /><i /><i /></div>
      </section>
      {children}
      <footer className="bright-footer"><span>[SiteName] · {code}</span></footer>
    </main>
  );
}
