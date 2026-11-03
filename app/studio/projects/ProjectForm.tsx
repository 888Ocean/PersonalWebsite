"use client";

import Link from "next/link";
import { useState } from "react";
import type { StudioProject } from "../../lib/projects";
import { createProjectAction, updateProjectAction } from "./actions";
import { ChapterAssetEditor, ChallengeEditor, MetricsEditor, ProcessEditor } from "./StructuredEditors";

const emptyProject: StudioProject = {
  slug: "",
  index: "04",
  name: "",
  cn: "",
  period: "2026",
  label: "DRAFT CURRENT",
  summary: "",
  role: "AI Product · Vibe Coding",
  stack: "Agents · Workflow · Next.js",
  accent: "#67b7b8",
  theme: "agent",
  metrics: [["01", "SIGNAL"]],
  detail: "",
  background: "",
  goal: "",
  problem: "",
  solution: "",
  solutionAssets: [],
  aiCapability: "",
  responsibility: "",
  process: [["01", "Frame", ""]],
  challenges: [{ id: "challenge-01", problem: "", solution: "" }],
  result: "",
  reflection: "",
  isPublished: false,
  sortOrder: 4,
  source: "database",
};

function metricsToText(project: StudioProject) {
  return project.metrics.map(([value, label]) => `${value} | ${label}`).join("\n");
}

function processToText(project: StudioProject) {
  return project.process.map(([number, title, copy]) => `${number} | ${title} | ${copy}`).join("\n");
}

export default function ProjectForm({
  project,
  mode,
  canSave,
}: {
  project?: StudioProject;
  mode: "create" | "edit";
  canSave: boolean;
}) {
  const current = project || emptyProject;
  const [assets, setAssets] = useState(current.solutionAssets);
  const [challenges, setChallenges] = useState(current.challenges);
  const [metrics, setMetrics] = useState(current.metrics);
  const [process, setProcess] = useState(current.process);

  return (
    <form className="studio-form" action={mode === "create" ? createProjectAction : updateProjectAction}>
      <input type="hidden" name="originalSlug" value={current.slug} />
      <input type="hidden" name="solutionAssets" value={JSON.stringify(assets)} />
      <input type="hidden" name="challenges" value={JSON.stringify(challenges)} />
      <input type="hidden" name="metrics" value={metricsToText({ ...current, metrics })} />
      <input type="hidden" name="process" value={processToText({ ...current, process })} />

      <div className="studio-form-head">
        <div>
          <span>{mode === "create" ? "NEW CASE" : "EDIT CASE"}</span>
          <h1>{mode === "create" ? "Create project" : current.name}</h1>
        </div>
        <div className="studio-actions">
          {mode === "edit" && <Link href={`/work/${current.slug}?edit=1`}>Edit on page</Link>}
          <Link href="/studio">Back</Link>
          <button type="submit" disabled={!canSave}>
            Save project
          </button>
        </div>
      </div>

      {!canSave && (
        <p className="studio-warning">
          DATABASE_URL is missing. You can review the form, but saving requires a Supabase Postgres connection string.
        </p>
      )}

      <section className="studio-panel">
        <h2>Overview</h2>
        <div className="studio-grid">
          <label>
            <span>Slug</span>
            <input name="slug" required defaultValue={current.slug} placeholder="linkphoto" />
          </label>
          <label>
            <span>Sort order</span>
            <input name="sortOrder" type="number" defaultValue={current.sortOrder} />
          </label>
          <label>
            <span>Index label</span>
            <input name="indexLabel" required defaultValue={current.index} placeholder="01" />
          </label>
          <label>
            <span>Theme</span>
            <select name="theme" defaultValue={current.theme}>
              <option value="linkphoto">LinkPhoto</option>
              <option value="club">Club</option>
              <option value="agent">Agent</option>
            </select>
          </label>
          <label>
            <span>Name</span>
            <input name="name" required defaultValue={current.name} />
          </label>
          <label>
            <span>Chinese name</span>
            <input name="cn" required defaultValue={current.cn} />
          </label>
          <label>
            <span>Period</span>
            <input name="period" required defaultValue={current.period} />
          </label>
          <label>
            <span>Label</span>
            <input name="label" required defaultValue={current.label} />
          </label>
          <label>
            <span>Role</span>
            <input name="role" required defaultValue={current.role} />
          </label>
          <label>
            <span>Stack</span>
            <input name="stack" required defaultValue={current.stack} />
          </label>
          <label>
            <span>Accent</span>
            <input name="accent" required defaultValue={current.accent} />
          </label>
          <label className="studio-check">
            <input name="isPublished" type="checkbox" defaultChecked={current.isPublished} />
            <span>Published</span>
          </label>
        </div>
        <label>
          <span>Homepage summary</span>
          <textarea name="summary" required rows={3} defaultValue={current.summary} />
        </label>
        <label>
          <span>Hero detail</span>
          <textarea name="detail" required rows={4} defaultValue={current.detail} />
        </label>
      </section>

      <section className="studio-panel">
        <h2>01 / 概述</h2>
        <label>
          <span>背景</span>
          <textarea name="background" required rows={4} defaultValue={current.background} />
        </label>
        <label>
          <span>目标</span>
          <textarea name="goal" required rows={4} defaultValue={current.goal} />
        </label>
        <ChapterAssetEditor chapterId="overview" assets={assets} onChange={setAssets} />
      </section>

      <section className="studio-panel">
        <h2>02 / 方案</h2>
        <label>
          <span>方案说明</span>
          <textarea name="solution" required rows={5} defaultValue={current.solution} />
        </label>
        <ChapterAssetEditor chapterId="solution" assets={assets} onChange={setAssets} />
      </section>

      <section className="studio-panel">
        <h2>03 / 问题</h2>
        <label>
          <span>Problem</span>
          <textarea name="problem" required rows={5} defaultValue={current.problem} />
        </label>
        <ChapterAssetEditor chapterId="problem" assets={assets} onChange={setAssets} />
      </section>

      <section className="studio-panel">
        <h2>04 / 过程</h2>
        <ProcessEditor process={process} onChange={setProcess} />
        <ChapterAssetEditor chapterId="process" assets={assets} onChange={setAssets} />
      </section>

      <section className="studio-panel">
        <h2>05 / 难点</h2>
        <ChallengeEditor challenges={challenges} onChange={setChallenges} />
        <ChapterAssetEditor chapterId="challenges" assets={assets} onChange={setAssets} />
      </section>

      <section className="studio-panel studio-panel-muted">
        <h2>保留的旧字段</h2>
        <label>
          <span>AI capability</span>
          <textarea name="aiCapability" required rows={5} defaultValue={current.aiCapability} />
        </label>
        <label>
          <span>Responsibility</span>
          <textarea name="responsibility" required rows={5} defaultValue={current.responsibility} />
        </label>
      </section>

      <section className="studio-panel">
        <h2>06 / 成果</h2>
        <label>
          <span>Result</span>
          <textarea name="result" required rows={5} defaultValue={current.result} />
        </label>
        <MetricsEditor metrics={metrics} onChange={setMetrics} />
        <ChapterAssetEditor chapterId="result" assets={assets} onChange={setAssets} />
      </section>

      <section className="studio-panel">
        <h2>07 / 复盘</h2>
        <label>
          <span>Reflection</span>
          <textarea name="reflection" required rows={5} defaultValue={current.reflection} />
        </label>
        <ChapterAssetEditor chapterId="reflection" assets={assets} onChange={setAssets} />
      </section>
    </form>
  );
}
