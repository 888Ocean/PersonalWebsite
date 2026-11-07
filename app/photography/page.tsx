import type { Metadata } from "next";
import { photoSlots } from "../archive-copy";

export const metadata: Metadata = {
  title: "Photographs",
  description: "摄影示意位置。",
};

export default function PhotographsPage() {
  return (
    <main className="shell page">
      <header className="page-intro">
        <h1>Photographs</h1>
        <p>六张照片的位置。画面还没换上，每一格都是示意。</p>
      </header>
      <div className="photo-grid">
        {photoSlots.map((slot) => (
          <figure key={slot.id} className="photo-slot">
            <div className="photo-frame">示意</div>
            <figcaption>
              {slot.id} {slot.label} · 示意
            </figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
