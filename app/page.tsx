import type { Metadata } from "next";
import PersonalHome from "./components/PersonalHome";
import { getProjectsForSite } from "./lib/projects";

export const metadata: Metadata = {
  title: "Ocean — AI 应用开发与摄影",
  description: "Ocean 的 AI 应用项目、产品实践与摄影故事。",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  return <PersonalHome projects={await getProjectsForSite()} />;
}
