"use client";

import { useRef, useState } from "react";
import type { ProjectAsset, ProjectAssetKind, ProjectChapterId, ProjectChallenge } from "../../components/projectData";

function uid(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function moveItem<T>(items: T[], from: number, to: number) {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function optionalNumber(value: string) {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function isMarkdownFile(file: File) {
  return file.type === "text/markdown" || file.name.toLowerCase().endsWith(".md");
}

function UploadDropzone({
  kind,
  label,
  accept,
  onUploaded,
}: {
  kind: ProjectAssetKind;
  label: string;
  accept: string;
  onUploaded: (asset: ProjectAsset) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<"idle" | "uploading" | "error">("idle");

  const upload = async (file?: File) => {
    if (!file) return;
    setState("uploading");
    const body = new FormData();
    body.set("file", file);
    body.set("kind", kind);

    try {
      const response = await fetch("/api/studio/uploads", { method: "POST", body });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) throw new Error(payload.error || "Upload failed");

      onUploaded({
        id: uid("asset"),
        kind,
        title: file.name.replace(/\.[^.]+$/, ""),
        caption: "",
        description: "",
        url: payload.url,
        mediaType: file.type === "application/pdf" ? "pdf" : isMarkdownFile(file) ? "markdown" : "image",
        chapter: undefined,
      });
      setState("idle");
    } catch {
      setState("error");
    }
  };

  return (
    <button
      className={`asset-dropzone ${state === "error" ? "is-error" : ""}`}
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        void upload(event.dataTransfer.files[0]);
      }}
    >
      <input ref={inputRef} type="file" accept={accept} hidden onChange={(event) => void upload(event.target.files?.[0])} />
      <span>{state === "uploading" ? "UPLOADING…" : state === "error" ? "RETRY UPLOAD" : label}</span>
      <small>{kind === "prd" ? "PDF / MD · 自动预览" : "PNG / JPG / WEBP · 可拖拽"}</small>
    </button>
  );
}

export function AssetEditor({
  assets,
  onChange,
  chapterId,
}: {
  assets: ProjectAsset[];
  onChange: (assets: ProjectAsset[]) => void;
  chapterId?: ProjectChapterId;
}) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const update = (id: string, patch: Partial<ProjectAsset>) => {
    onChange(assets.map((asset) => (asset.id === id ? { ...asset, ...patch } : asset)));
  };

  return (
    <div className="asset-editor">
      <div className="asset-upload-grid">
        <UploadDropzone kind="prd" label="上传 PRD / PDF / MD" accept="application/pdf,text/markdown,.md" onUploaded={(asset) => onChange([...assets, { ...asset, chapter: chapterId }])} />
        <UploadDropzone kind="prototype" label="上传原型图" accept="image/png,image/jpeg,image/webp,image/gif" onUploaded={(asset) => onChange([...assets, { ...asset, chapter: chapterId }])} />
        <UploadDropzone kind="screenshot" label="上传产品截图" accept="image/png,image/jpeg,image/webp,image/gif" onUploaded={(asset) => onChange([...assets, { ...asset, chapter: chapterId }])} />
      </div>

      {assets.length > 0 && (
        <div className="asset-sort-list">
          {assets.map((asset, index) => (
            <article
              className="asset-sort-item"
              draggable
              key={asset.id}
              onDragStart={() => setDraggedId(asset.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                const from = assets.findIndex((item) => item.id === draggedId);
                if (from >= 0 && from !== index) onChange(moveItem(assets, from, index));
                setDraggedId(null);
              }}
            >
              <div className="asset-sort-handle" aria-label="拖拽排序">⋮⋮</div>
              <div className="asset-sort-preview">
                {asset.mediaType === "pdf" ? <span>PDF</span> : asset.mediaType === "markdown" ? <span>MD</span> : <img src={asset.url} alt="" />}
              </div>
              <div className="asset-sort-fields">
                <select value={asset.kind} onChange={(event) => update(asset.id, { kind: event.target.value as ProjectAssetKind })}>
                  <option value="prd">PRD / 文档</option>
                  <option value="prototype">原型图</option>
                  <option value="screenshot">产品截图</option>
                </select>
                <input value={asset.title} placeholder="资料标题" onChange={(event) => update(asset.id, { title: event.target.value })} />
                <input value={asset.caption} placeholder="一句话摘要（可选）" onChange={(event) => update(asset.id, { caption: event.target.value })} />
                <textarea rows={3} value={asset.description || ""} placeholder="详细说明 / 阅读提示（可选）" onChange={(event) => update(asset.id, { description: event.target.value })} />
                {asset.mediaType === "markdown" && <small className="asset-markdown-note">Markdown 文档将以可读文本预览，并保留原文件链接。</small>}
                {asset.kind === "prototype" && asset.mediaType === "image" && (
                  <div className="asset-focus-fields">
                    <small>默认自动识别留白；以下数值只在自动结果上微调，留空即可。</small>
                    <label>
                      <span>水平微调 %</span>
                      <input type="number" min="-35" max="35" step="1" value={asset.previewOffsetX ?? ""} placeholder="自动" onChange={(event) => update(asset.id, { previewOffsetX: optionalNumber(event.target.value) })} />
                    </label>
                    <label>
                      <span>垂直微调 %</span>
                      <input type="number" min="-25" max="25" step="1" value={asset.previewOffsetY ?? ""} placeholder="自动" onChange={(event) => update(asset.id, { previewOffsetY: optionalNumber(event.target.value) })} />
                    </label>
                    <label>
                      <span>预览缩放 %</span>
                      <input type="number" min="80" max="260" step="5" value={asset.previewScale ?? ""} placeholder="自动" onChange={(event) => update(asset.id, { previewScale: optionalNumber(event.target.value) })} />
                    </label>
                  </div>
                )}
              </div>
              <div className="asset-sort-actions">
                <button type="button" disabled={index === 0} onClick={() => onChange(moveItem(assets, index, index - 1))}>↑</button>
                <button type="button" disabled={index === assets.length - 1} onClick={() => onChange(moveItem(assets, index, index + 1))}>↓</button>
                <button type="button" onClick={() => onChange(assets.filter((item) => item.id !== asset.id))}>删除</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export function ChapterAssetEditor({
  chapterId,
  assets,
  onChange,
}: {
  chapterId: ProjectChapterId;
  assets: ProjectAsset[];
  onChange: (assets: ProjectAsset[]) => void;
}) {
  const chapterAssets = assets.filter((asset) => (asset.chapter || "solution") === chapterId);
  return (
    <AssetEditor
      chapterId={chapterId}
      assets={chapterAssets}
      onChange={(nextChapterAssets) => {
        const otherAssets = assets.filter((asset) => (asset.chapter || "solution") !== chapterId);
        onChange([...otherAssets, ...nextChapterAssets.map((asset) => ({ ...asset, chapter: chapterId }))]);
      }}
    />
  );
}

export function ChallengeEditor({
  challenges,
  onChange,
}: {
  challenges: ProjectChallenge[];
  onChange: (challenges: ProjectChallenge[]) => void;
}) {
  const update = (id: string, patch: Partial<ProjectChallenge>) => {
    onChange(challenges.map((challenge) => (challenge.id === id ? { ...challenge, ...patch } : challenge)));
  };

  return (
    <div className="structured-list">
      {challenges.map((challenge, index) => (
        <article className="structured-card challenge-edit-card" key={challenge.id}>
          <header><span>CHALLENGE {String(index + 1).padStart(2, "0")}</span><button type="button" onClick={() => onChange(challenges.filter((item) => item.id !== challenge.id))}>删除</button></header>
          <label><span>遇到的问题</span><textarea rows={3} value={challenge.problem} onChange={(event) => update(challenge.id, { problem: event.target.value })} /></label>
          <label><span>解决方案</span><textarea rows={3} value={challenge.solution} onChange={(event) => update(challenge.id, { solution: event.target.value })} /></label>
        </article>
      ))}
      <button className="structured-add" type="button" onClick={() => onChange([...challenges, { id: uid("challenge"), problem: "", solution: "" }])}>+ 添加问题—方案</button>
    </div>
  );
}

export function ProcessEditor({
  process,
  onChange,
}: {
  process: Array<[string, string, string]>;
  onChange: (process: Array<[string, string, string]>) => void;
}) {
  const update = (index: number, value: [string, string, string]) => onChange(process.map((item, itemIndex) => (itemIndex === index ? value : item)));

  return (
    <div className="structured-list">
      {process.map(([number, title, copy], index) => (
        <article className="structured-card process-edit-card" key={`${number}-${index}`}>
          <input aria-label="序号" value={number} onChange={(event) => update(index, [event.target.value, title, copy])} />
          <input aria-label="阶段名称" value={title} onChange={(event) => update(index, [number, event.target.value, copy])} />
          <textarea aria-label="阶段说明" rows={3} value={copy} onChange={(event) => update(index, [number, title, event.target.value])} />
          <button type="button" onClick={() => onChange(process.filter((_, itemIndex) => itemIndex !== index))}>删除</button>
        </article>
      ))}
      <button className="structured-add" type="button" onClick={() => onChange([...process, [String(process.length + 1).padStart(2, "0"), "New step", ""]])}>+ 添加过程节点</button>
    </div>
  );
}

export function MetricsEditor({
  metrics,
  onChange,
}: {
  metrics: Array<[string, string]>;
  onChange: (metrics: Array<[string, string]>) => void;
}) {
  const update = (index: number, value: [string, string]) => onChange(metrics.map((item, itemIndex) => (itemIndex === index ? value : item)));

  return (
    <div className="metrics-editor">
      {metrics.map(([value, label], index) => (
        <div key={`${label}-${index}`}>
          <input aria-label="成果数值" value={value} onChange={(event) => update(index, [event.target.value, label])} />
          <input aria-label="成果标签" value={label} onChange={(event) => update(index, [value, event.target.value])} />
          <button type="button" onClick={() => onChange(metrics.filter((_, itemIndex) => itemIndex !== index))}>×</button>
        </div>
      ))}
      <button className="structured-add" type="button" onClick={() => onChange([...metrics, ["01", "NEW METRIC"]])}>+ 添加成果指标</button>
    </div>
  );
}
