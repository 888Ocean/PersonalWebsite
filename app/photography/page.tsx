import type { Metadata } from "next";
import ReelPhotographyIndex from "./ReelPhotographyIndex";
import { photographyStories } from "./data";

export const metadata: Metadata = {
  title: "Photo stories — Ocean",
  description: "按故事与记忆编排的摄影档案，而不是传统摄影类型目录。",
};

export default function PhotographyPage() {
  return <ReelPhotographyIndex stories={photographyStories} />;
}
