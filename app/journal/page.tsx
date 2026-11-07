import type { Metadata } from "next";
import { journalNotes } from "../archive-copy";
import SketchMark from "../components/SketchMark";

export const metadata: Metadata = {
  title: "Journal",
  description: "按时间倒序的短记。",
};

export default function JournalPage() {
  const notes = [...journalNotes].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main className="shell page">
      <header className="page-intro">
        <h1>Journal</h1>
        <p>短记按时间倒序排。还不是文章，条数也少，都标着示意。</p>
      </header>
      <ol className="notes">
        {notes.map((note) => (
          <li key={note.date}>
            <time dateTime={note.date}>{note.date}</time>
            <div>
              <h2>{note.title}</h2>
              <p>{note.body}</p>
              <SketchMark />
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
