import type { Metadata } from "next";
import { workPieces } from "../archive-copy";
import SketchMark from "../components/SketchMark";

export const metadata: Metadata = {
  title: "Work",
  description: "三件示意项目。",
};

export default function WorkPage() {
  return (
    <main className="shell page">
      <header className="page-intro">
        <h1>Work</h1>
        <p>三件项目。真素材还没到，卡片都是示意。</p>
      </header>
      <div className="work-grid">
        {workPieces.map((piece) => (
          <article key={piece.name} className="work-card">
            <SketchMark />
            <h2>{piece.name}</h2>
            <p className="work-cn">{piece.title}</p>
            <p>{piece.summary}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
