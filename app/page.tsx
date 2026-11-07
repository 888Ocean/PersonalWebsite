import type { Metadata } from "next";
import Link from "next/link";
import { mission, positioning } from "./archive-copy";
import ColdOpen from "./components/ColdOpen";

export const metadata: Metadata = {
  title: { absolute: "[SiteName]" },
  description: "Ocean 的作品、照片与笔记。",
};

export default function Home() {
  return (
    <>
      <ColdOpen />
      <main className="shell land">
        <p className="mission">{mission}</p>
        <div>
          <h1>Ocean</h1>
          <p className="position">{positioning}</p>
        </div>
        <Link className="text-link" href="/work">
          进入 Work
        </Link>
      </main>
    </>
  );
}
