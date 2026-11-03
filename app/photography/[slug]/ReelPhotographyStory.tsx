"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TidalNav from "../../components/TidalNav";
import { PersonalFooter } from "../../components/PersonalFrame";
import type { PhotographyStory } from "../data";

export default function ReelPhotographyStory({ story, nextStory }: { story: PhotographyStory; nextStory: PhotographyStory }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let nearest = 0, distance = Infinity;
        document.querySelectorAll<HTMLElement>("[data-photo-frame]").forEach((item, index) => {
          const rect = item.getBoundingClientRect();
          const next = Math.abs(rect.top + rect.height / 2 - innerHeight / 2);
          if (next < distance) { distance = next; nearest = index; }
        });
        setActive(nearest);
      });
    };
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();
    return () => { removeEventListener("scroll", update); removeEventListener("resize", update); cancelAnimationFrame(frame); };
  }, [story.slug]);

  return <main className="personal-home inner-page"><TidalNav /><div className="story-breadcrumb"><Link href="/photography">返回摄影故事</Link><span>示例图 · 展示原型</span></div><section className="photo-story-layout"><aside className="photo-story-intro"><h1>{story.titleCn}</h1><p>{story.summary}</p><nav aria-label="照片导航">{story.images.map((image, index) => <a key={image.src} href={`#photo-${index}`} aria-label={`查看照片：${image.alt}`} aria-current={active === index ? "location" : undefined}><Image src={image.src} alt="" width={120} height={90} sizes="72px" /></a>)}</nav><p>{story.images.length} 张照片</p></aside><div className="story-photo-sequence">{story.images.map((image, index) => <figure id={`photo-${index}`} key={image.src} data-photo-frame data-enter><Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 700px) 100vw, 65vw" loading={index === 0 ? "eager" : "lazy"} /><figcaption>{image.caption}</figcaption></figure>)}</div></section><section className="next-photo-story"><h2>Next story</h2><Link href={`/photography/${nextStory.slug}`}>{nextStory.titleCn}</Link></section><PersonalFooter /></main>;
}
