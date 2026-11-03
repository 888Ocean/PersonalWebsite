import Image from "next/image";
import Link from "next/link";
import PersonalFrame from "../components/PersonalFrame";
import type { PhotographyStory } from "./data";

export default function ReelPhotographyIndex({ stories }: { stories: PhotographyStory[] }) {
  return <PersonalFrame title="Photo stories" description="每个故事是一组照片、一段文字，以及它们被放在一起的理由。当前为示例图片的展示原型。">
    <section className="photo-story-index" aria-label="摄影故事">
      {stories.map((story) => <article key={story.slug} data-enter><Link href={`/photography/${story.slug}`} aria-label={`进入摄影故事：${story.titleCn}`}><div className="story-cover"><Image src={story.images[0].src} alt={story.images[0].alt} width={story.images[0].width} height={story.images[0].height} sizes="(max-width: 700px) 100vw, 65vw" /></div><div className="story-index-copy"><h2>{story.titleCn}</h2><p>{story.summary}</p><span>{story.images.length} 张 · 故事原型</span></div></Link></article>)}
    </section>
  </PersonalFrame>;
}
