import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReelPhotographyStory from "./ReelPhotographyStory";
import {
  getNextPhotographyStory,
  getPhotographyStory,
  photographyStories,
} from "../data";

type PhotographyStoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return photographyStories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: PhotographyStoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getPhotographyStory(slug);

  if (!story) return { title: "Photography story not found" };

  return {
    title: `${story.title} — Ocean Photography`,
    description: story.summary,
  };
}

export default async function PhotographyStoryPage({ params }: PhotographyStoryPageProps) {
  const { slug } = await params;
  const story = getPhotographyStory(slug);

  if (!story) notFound();

  return (
    <ReelPhotographyStory
      story={story}
      nextStory={getNextPhotographyStory(story.slug)}
    />
  );
}
