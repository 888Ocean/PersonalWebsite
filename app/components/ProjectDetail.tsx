"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { updateProjectCaseAction } from "../studio/projects/actions";
import { ChapterAssetEditor, ChallengeEditor, MetricsEditor, ProcessEditor } from "../studio/projects/StructuredEditors";
import TidalNav from "./TidalNav";
import { PersonalFooter } from "./PersonalFrame";
import type { Project, ProjectAsset, ProjectChapterId } from "./projectData";

const chapters = [
  ["overview", "概述"],
  ["solution", "方案"],
  ["problem", "问题"],
  ["process", "过程"],
  ["challenges", "难点"],
  ["result", "成果"],
  ["reflection", "复盘"],
] as const;

function DetailSignal({ theme }: { theme: Project["theme"] }) {
  return (
    <div className={`detail-signal detail-signal-${theme}`} aria-hidden="true">
      <div className="detail-signal-grid" />
      <span className="detail-signal-label">LIVE SYSTEM / 2026</span>
      {theme === "linkphoto" && <><div className="detail-window detail-window-main"><small>AI BRIEF</small><strong>海边 · 自然 · 电影感</strong><span>3 photographers found</span></div><div className="detail-window detail-window-side"><i /><i /><i /></div><b>↗</b></>}
      {theme === "club" && <><div className="detail-command">今天有什么需要<br /><em>一起完成？</em></div><div className="detail-checks"><span>47 份报名表已识别 <b>✓</b></span><span>成员名单已去重 <b>✓</b></span><span>活动群通知待确认 <b>→</b></span></div></>}
      {theme === "agent" && <><svg viewBox="0 0 900 420"><path d="M90 230 C210 230 220 100 340 100 S470 250 575 250 S700 130 820 130" /><path d="M90 230 C220 230 240 355 350 355 S470 250 575 250" /></svg><i className="detail-agent-node detail-agent-input">INPUT</i><i className="detail-agent-node detail-agent-output">OUTPUT</i><i className="detail-agent-node detail-agent-core">ORCHESTRATOR</i></>}
      <span className="detail-signal-index">{theme === "linkphoto" ? "01" : theme === "club" ? "02" : "03"}</span>
    </div>
  );
}

function EditorPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="inline-editor"><div className="inline-editor-head"><span>EDIT MODULE</span><strong>{title}</strong></div>{children}</div>;
}

type AssetShape = "loading" | "panorama" | "wide" | "square" | "portrait";
type AssetZoom = "smart" | "fit" | "readable" | "actual" | number;

function SolutionAssetCard({
  asset,
  index,
  onOpen,
}: {
  asset: ProjectAsset;
  index: number;
  onOpen: () => void;
}) {
  const [shape, setShape] = useState<AssetShape>("loading");
  const [previewWidth, setPreviewWidth] = useState(1400);
  const imageRef = useRef<HTMLImageElement>(null);

  const classifyImage = (image: HTMLImageElement) => {
    const ratio = image.naturalWidth / image.naturalHeight;
    setPreviewWidth(Math.min(Math.max(image.naturalWidth, 1200), 1900));
    setShape(ratio >= 2.2 ? "panorama" : ratio >= 1.25 ? "wide" : ratio <= 0.82 ? "portrait" : "square");
  };

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0) classifyImage(image);
  }, [asset.url]);

  const assetMedia = (
    <div className="solution-asset-media">
      {asset.mediaType === "pdf" ? (
        <div
          className="solution-asset-pdf-preview"
          role="button"
          tabIndex={0}
          aria-label={`深度查看 PDF：${asset.title}`}
          onClick={onOpen}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onOpen();
            }
          }}
        >
          <iframe src={`${asset.url}#toolbar=0&navpanes=0&view=FitH`} title={`${asset.title} PDF 自动预览`} />
          <span className="solution-asset-open-label">点击深度查看 PDF ↗</span>
        </div>
      ) : asset.mediaType === "markdown" ? (
        <MarkdownAssetPreview asset={asset} onOpen={onOpen} />
      ) : (
        <button className="solution-asset-image-preview" type="button" onClick={onOpen} aria-label={`深度查看图片：${asset.title}`}>
          <img ref={imageRef} src={asset.url} alt={asset.title} onLoad={(event) => classifyImage(event.currentTarget)} />
          <span className="solution-asset-open-label">点击深度查看图片 ↗</span>
        </button>
      )}
    </div>
  );

  const assetCopy = (
    <div className="solution-asset-copy">
      <span>{asset.mediaType === "image" ? `${String(index + 1).padStart(2, "0")} / ${asset.kind}` : "DOCUMENT / 项目资料"}</span>
      <strong>{asset.title}</strong>
      {asset.caption && <p>{asset.caption}</p>}
      {asset.description && <p className="solution-asset-description">{asset.description}</p>}
      <div className="solution-asset-actions">
        <button type="button" onClick={onOpen}>Deep view</button>
        <Link href={asset.url} target="_blank" rel="noreferrer">Open original ↗</Link>
      </div>
    </div>
  );

  return (
    <article
      className={`solution-asset-card solution-asset-card-${asset.mediaType === "image" ? shape : "document"}`}
      style={{ "--asset-preview-width": `${previewWidth}px` } as React.CSSProperties}
    >
      {asset.mediaType === "image" ? <>{assetMedia}{assetCopy}</> : <>{assetCopy}{assetMedia}</>}
    </article>
  );
}

function safeMarkdownUrl(value: string) {
  const url = value.trim();
  return /^(https?:\/\/|\/|#)/i.test(url) ? url : "#";
}

function renderMarkdownInline(value: string, keyPrefix: string): React.ReactNode[] {
  const tokenPattern = /(!\[[^\]]*\]\([^\s)]+(?:\s+"[^"]*")?\)|\[[^\]]+\]\([^\s)]+(?:\s+"[^"]*")?\)|\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*|_[^_]+_)/g;
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(value)) !== null) {
    if (match.index > cursor) nodes.push(value.slice(cursor, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${match.index}`;
    const imageMatch = token.match(/^!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]*)")?\)$/);
    const linkMatch = token.match(/^\[([^\]]+)\]\(([^\s)]+)(?:\s+"([^"]*)")?\)$/);
    if (imageMatch) {
      nodes.push(<img className="markdown-inline-image" src={safeMarkdownUrl(imageMatch[2])} alt={imageMatch[1]} title={imageMatch[3]} key={key} />);
    } else if (linkMatch) {
      nodes.push(<a href={safeMarkdownUrl(linkMatch[2])} title={linkMatch[3]} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} key={key}>{linkMatch[1]}</a>);
    } else if (token.startsWith("**") || token.startsWith("__")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    }
    cursor = match.index + token.length;
  }
  if (cursor < value.length) nodes.push(value.slice(cursor));
  return nodes;
}

function splitMarkdownTableRow(line: string) {
  return line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
}

function isMarkdownTableDivider(line: string) {
  const cells = splitMarkdownTableRow(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function renderMarkdown(content: string) {
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index += 1; continue; }

    const fence = line.match(/^\s*```([^\s`]*)\s*$/);
    if (fence) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !/^\s*```/.test(lines[index])) { code.push(lines[index]); index += 1; }
      if (index < lines.length) index += 1;
      blocks.push(<pre className="markdown-code-block" key={`code-${index}`}><code data-language={fence[1] || undefined}>{code.join("\n")}</code></pre>);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const children = renderMarkdownInline(heading[2], `heading-${index}`);
      if (level === 1) blocks.push(<h1 key={`heading-${index}`}>{children}</h1>);
      else if (level === 2) blocks.push(<h2 key={`heading-${index}`}>{children}</h2>);
      else if (level === 3) blocks.push(<h3 key={`heading-${index}`}>{children}</h3>);
      else if (level === 4) blocks.push(<h4 key={`heading-${index}`}>{children}</h4>);
      else if (level === 5) blocks.push(<h5 key={`heading-${index}`}>{children}</h5>);
      else blocks.push(<h6 key={`heading-${index}`}>{children}</h6>);
      index += 1;
      continue;
    }

    if (index + 1 < lines.length && line.includes("|") && isMarkdownTableDivider(lines[index + 1])) {
      const headers = splitMarkdownTableRow(line);
      const alignments = splitMarkdownTableRow(lines[index + 1]).map((cell): React.CSSProperties["textAlign"] => {
        if (cell.startsWith(":") && cell.endsWith(":")) return "center";
        if (cell.endsWith(":")) return "right";
        return "left";
      });
      const rows: string[][] = [];
      index += 2;
      while (index < lines.length && lines[index].includes("|") && lines[index].trim()) {
        rows.push(splitMarkdownTableRow(lines[index]));
        index += 1;
      }
      blocks.push(
        <div className="markdown-table-scroll" key={`table-${index}`}>
          <table>
            <thead><tr>{headers.map((cell, cellIndex) => <th style={{ textAlign: alignments[cellIndex] }} key={cellIndex}>{renderMarkdownInline(cell, `th-${index}-${cellIndex}`)}</th>)}</tr></thead>
            <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{headers.map((_, cellIndex) => <td style={{ textAlign: alignments[cellIndex] }} key={cellIndex}>{renderMarkdownInline(row[cellIndex] || "", `td-${index}-${rowIndex}-${cellIndex}`)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
      continue;
    }

    if (/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(line)) {
      blocks.push(<hr key={`hr-${index}`} />);
      index += 1;
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) { quote.push(lines[index].replace(/^\s*>\s?/, "")); index += 1; }
      blocks.push(<blockquote key={`quote-${index}`}>{renderMarkdownInline(quote.join(" "), `quote-${index}`)}</blockquote>);
      continue;
    }

    const unordered = line.match(/^\s*[-*+]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (unordered || ordered) {
      const items: string[] = [];
      const pattern = ordered ? /^\s*\d+[.)]\s+(.+)$/ : /^\s*[-*+]\s+(.+)$/;
      while (index < lines.length) {
        const item = lines[index].match(pattern);
        if (!item) break;
        items.push(item[1]);
        index += 1;
      }
      const children = items.map((item, itemIndex) => <li key={itemIndex}>{renderMarkdownInline(item, `li-${index}-${itemIndex}`)}</li>);
      blocks.push(ordered ? <ol key={`list-${index}`}>{children}</ol> : <ul key={`list-${index}`}>{children}</ul>);
      continue;
    }

    const paragraph: string[] = [line.trim()];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^(#{1,6})\s+|^\s*```|^\s*>\s?|^\s*[-*+]\s+|^\s*\d+[.)]\s+/.test(lines[index])) {
      if (index + 1 < lines.length && lines[index].includes("|") && isMarkdownTableDivider(lines[index + 1])) break;
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(<p key={`paragraph-${index}`}>{renderMarkdownInline(paragraph.join(" "), `paragraph-${index}`)}</p>);
  }

  return blocks;
}

function MarkdownAssetPreview({ asset, onOpen }: { asset: ProjectAsset; onOpen: () => void }) {
  const [content, setContent] = useState("正在读取 Markdown…");

  useEffect(() => {
    let cancelled = false;
    fetch(asset.url)
      .then((response) => response.ok ? response.text() : Promise.reject(new Error("读取失败")))
      .then((text) => { if (!cancelled) setContent(text); })
      .catch(() => { if (!cancelled) setContent("暂时无法预览此 Markdown 文件，请打开原文件查看。"); });
    return () => { cancelled = true; };
  }, [asset.url]);

  return (
    <div className="solution-asset-markdown-preview" role="button" tabIndex={0} onClick={onOpen} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onOpen(); }} aria-label={`深度查看 Markdown：${asset.title}`}>
      <article className="markdown-document">{renderMarkdown(content)}</article>
      <span className="solution-asset-open-label">点击深度查看 Markdown ↗</span>
    </div>
  );
}

function ChapterAssetGallery({
  assets,
  chapterId,
  onOpen,
}: {
  assets: ProjectAsset[];
  chapterId: ProjectChapterId;
  onOpen: (index: number) => void;
}) {
  const chapterAssets = assets
    .map((asset, index) => ({ asset, index }))
    .filter(({ asset }) => (asset.chapter || "solution") === chapterId);
  if (chapterAssets.length === 0) return null;
  return (
    <div className="solution-assets chapter-assets" aria-label={`${chapterId} 章节资料`}>
      {chapterAssets.map(({ asset, index }) => <SolutionAssetCard key={asset.id} asset={asset} index={index} onOpen={() => onOpen(index)} />)}
    </div>
  );
}

type IndexedAsset = {
  asset: ProjectAsset;
  assetIndex: number;
};

type PrototypeFocus = {
  scale: number;
  shiftX: number;
  shiftY: number;
};

const defaultPrototypeFocus: PrototypeFocus = { scale: 1, shiftX: 0, shiftY: 0 };

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function removeOuterWhiteBackground(image: HTMLImageElement) {
  try {
    const maxDimension = 2400;
    const ratio = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * ratio));
    const height = Math.max(1, Math.round(image.naturalHeight * ratio));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return null;
    context.drawImage(image, 0, 0, width, height);
    const pixels = context.getImageData(0, 0, width, height);
    const data = pixels.data;
    const borderSamples: Array<{ r: number; g: number; b: number }> = [];
    const sample = (x: number, y: number) => {
      const offset = (y * width + x) * 4;
      borderSamples.push({ r: data[offset], g: data[offset + 1], b: data[offset + 2] });
    };
    for (let step = 0; step <= 12; step += 1) {
      const x = Math.round((width - 1) * (step / 12));
      const y = Math.round((height - 1) * (step / 12));
      sample(x, 0);
      sample(x, height - 1);
      sample(0, y);
      sample(width - 1, y);
    }
    const brightest = borderSamples.sort((a, b) => (b.r + b.g + b.b) - (a.r + a.g + a.b)).slice(0, 12);
    const background = {
      r: brightest.reduce((total, color) => total + color.r, 0) / brightest.length,
      g: brightest.reduce((total, color) => total + color.g, 0) / brightest.length,
      b: brightest.reduce((total, color) => total + color.b, 0) / brightest.length,
    };
    const backgroundIsWhite = Math.min(background.r, background.g, background.b) > 218
      && Math.max(background.r, background.g, background.b) - Math.min(background.r, background.g, background.b) < 24;
    if (!backgroundIsWhite) return null;

    const isOuterBackground = (x: number, y: number) => {
      const offset = (y * width + x) * 4;
      if (data[offset + 3] < 20) return true;
      const distance = Math.abs(data[offset] - background.r) + Math.abs(data[offset + 1] - background.g) + Math.abs(data[offset + 2] - background.b);
      return distance < 55;
    };
    const visited = new Uint8Array(width * height);
    const queue = new Int32Array(width * height);
    let head = 0;
    let tail = 0;
    const enqueue = (x: number, y: number) => {
      if (x < 0 || y < 0 || x >= width || y >= height) return;
      const index = y * width + x;
      if (visited[index] || !isOuterBackground(x, y)) return;
      visited[index] = 1;
      queue[tail] = index;
      tail += 1;
    };
    for (let x = 0; x < width; x += 1) {
      enqueue(x, 0);
      enqueue(x, height - 1);
    }
    for (let y = 1; y < height - 1; y += 1) {
      enqueue(0, y);
      enqueue(width - 1, y);
    }
    while (head < tail) {
      const index = queue[head];
      head += 1;
      const x = index % width;
      const y = Math.floor(index / width);
      data[index * 4 + 3] = 0;
      enqueue(x - 1, y);
      enqueue(x + 1, y);
      enqueue(x, y - 1);
      enqueue(x, y + 1);
    }
    if (tail < width * height * .01) return null;
    context.putImageData(pixels, 0, 0);
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

function isReferencePrototype(asset: ProjectAsset) {
  return /发布/.test(asset.title);
}

function analyzePrototypeFocus(image: HTMLImageElement, viewport?: HTMLElement | null): PrototypeFocus {
  try {
    const sampleWidth = Math.min(520, image.naturalWidth);
    const sampleHeight = Math.max(1, Math.round(image.naturalHeight * (sampleWidth / image.naturalWidth)));
    const canvas = document.createElement("canvas");
    canvas.width = sampleWidth;
    canvas.height = sampleHeight;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return defaultPrototypeFocus;

    context.drawImage(image, 0, 0, sampleWidth, sampleHeight);
    const pixels = context.getImageData(0, 0, sampleWidth, sampleHeight).data;
    const borderSamples: Array<{ r: number; g: number; b: number }> = [];
    const samplePixel = (x: number, y: number) => {
      const offset = (y * sampleWidth + x) * 4;
      borderSamples.push({ r: pixels[offset], g: pixels[offset + 1], b: pixels[offset + 2] });
    };
    for (let step = 0; step <= 10; step += 1) {
      const x = Math.round((sampleWidth - 1) * (step / 10));
      const y = Math.round((sampleHeight - 1) * (step / 10));
      samplePixel(x, 0);
      samplePixel(x, sampleHeight - 1);
      samplePixel(0, y);
      samplePixel(sampleWidth - 1, y);
    }
    const corners = borderSamples.sort((a, b) => (b.r + b.g + b.b) - (a.r + a.g + a.b));
    const backgroundSamples = corners.slice(0, Math.max(4, Math.round(corners.length * .4)));
    const background = {
      r: backgroundSamples.reduce((total, color) => total + color.r, 0) / backgroundSamples.length,
      g: backgroundSamples.reduce((total, color) => total + color.g, 0) / backgroundSamples.length,
      b: backgroundSamples.reduce((total, color) => total + color.b, 0) / backgroundSamples.length,
    };

    const columnWeight = new Uint16Array(sampleWidth);
    const rowWeight = new Uint16Array(sampleHeight);

    for (let y = 0; y < sampleHeight; y += 1) {
      for (let x = 0; x < sampleWidth; x += 1) {
        const offset = (y * sampleWidth + x) * 4;
        const distance = Math.abs(pixels[offset] - background.r) + Math.abs(pixels[offset + 1] - background.g) + Math.abs(pixels[offset + 2] - background.b);
        if (pixels[offset + 3] > 20 && distance > 40) {
          columnWeight[x] += 1;
          rowWeight[y] += 1;
        }
      }
    }

    const columnThreshold = Math.max(2, Math.round(sampleHeight * .006));
    const rowThreshold = Math.max(2, Math.round(sampleWidth * .004));
    let minX = columnWeight.findIndex((weight) => weight >= columnThreshold);
    let maxX = sampleWidth - 1 - Array.from(columnWeight).reverse().findIndex((weight) => weight >= columnThreshold);
    let minY = rowWeight.findIndex((weight) => weight >= rowThreshold);
    let maxY = sampleHeight - 1 - Array.from(rowWeight).reverse().findIndex((weight) => weight >= rowThreshold);
    if (minX < 0 || minY < 0 || maxX >= sampleWidth || maxY >= sampleHeight) return defaultPrototypeFocus;
    if (maxX < minX || maxY < minY) return defaultPrototypeFocus;
    const paddingX = sampleWidth * .035;
    const paddingY = sampleHeight * .045;
    minX = Math.max(0, minX - paddingX);
    maxX = Math.min(sampleWidth, maxX + paddingX);
    minY = Math.max(0, minY - paddingY);
    maxY = Math.min(sampleHeight, maxY + paddingY);

    const contentWidth = Math.max(.01, (maxX - minX) / sampleWidth);
    const centerX = (minX + maxX) / (2 * sampleWidth);
    const centerY = (minY + maxY) / (2 * sampleHeight);
    const renderedWidth = image.clientWidth || image.naturalWidth;
    const viewportWidth = viewport?.clientWidth || renderedWidth;
    const scaleForWidth = (viewportWidth * .9) / (renderedWidth * contentWidth);

    return {
      scale: clamp(scaleForWidth * 1.08, 1.08, 1.8),
      shiftX: clamp((.5 - centerX) * 100, -18, 18),
      shiftY: clamp((.5 - centerY) * 100, -18, 18),
    };
  } catch {
    return defaultPrototypeFocus;
  }
}

function PrototypeWindow({
  entries,
  onOpen,
}: {
  entries: IndexedAsset[];
  onOpen: (assetIndex: number) => void;
}) {
  const [pageIndex, setPageIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState<"smart" | "full">("smart");
  const [focusByAsset, setFocusByAsset] = useState<Record<string, PrototypeFocus>>({});
  const [referenceScale, setReferenceScale] = useState<number | null>(null);
  const previewRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (pageIndex >= entries.length) setPageIndex(Math.max(0, entries.length - 1));
  }, [entries.length, pageIndex]);

  const current = entries[pageIndex];
  const updateFocus = () => {
    const image = imageRef.current;
    if (!current || !image || image.naturalWidth < 1) return;
    const nextFocus = analyzePrototypeFocus(image, previewRef.current);
    setFocusByAsset((value) => ({ ...value, [current.asset.id]: nextFocus }));
  };

  const handlePrototypeImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    if (!current) return;
    const nextFocus = analyzePrototypeFocus(image, previewRef.current);
    setFocusByAsset((value) => ({ ...value, [current.asset.id]: nextFocus }));
    if (isReferencePrototype(current.asset) || (!entries.some(({ asset }) => isReferencePrototype(asset)) && pageIndex === 0)) {
      const configuredScale = current.asset.previewScale
        ? clamp(current.asset.previewScale / 100, .8, 2.6)
        : nextFocus.scale;
      setReferenceScale((value) => value ?? configuredScale);
    }
  };

  useEffect(() => {
    const image = imageRef.current;
    if (current && image?.complete && image.naturalWidth > 0) {
      handlePrototypeImageLoad({ currentTarget: image } as React.SyntheticEvent<HTMLImageElement>);
    }
    const preview = previewRef.current;
    if (!preview || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => updateFocus());
    observer.observe(preview);
    return () => observer.disconnect();
  }, [current?.asset.id, current?.asset.url]);

  if (!current) return null;
  const focus = focusByAsset[current.asset.id] || defaultPrototypeFocus;
  const referenceAsset = entries.find(({ asset }) => isReferencePrototype(asset))?.asset;
  const configuredReferenceScale = referenceAsset?.previewScale
    ? clamp(referenceAsset.previewScale / 100, .8, 2.6)
    : null;
  const previewScale = referenceScale ?? configuredReferenceScale ?? focus.scale;
  const previewShiftX = focus.shiftX + (current.asset.previewOffsetX || 0);
  const previewShiftY = focus.shiftY + (current.asset.previewOffsetY || 0);

  return (
    <section className="prototype-browser" aria-label="产品原型浏览窗口">
      <header className="prototype-browser-head">
        <div><span>INTERACTIVE PROTOTYPE</span><strong>产品原型页</strong></div>
        <span>{String(pageIndex + 1).padStart(2, "0")} / {String(entries.length).padStart(2, "0")} PAGES</span>
      </header>

      <div className="prototype-browser-body">
        <aside className="prototype-page-list" aria-label="原型页面目录">
          <small>PROJECT PAGES</small>
          <div>
            {entries.map(({ asset }, index) => (
              <button
                type="button"
                className={pageIndex === index ? "is-active" : ""}
                aria-pressed={pageIndex === index}
                onClick={() => setPageIndex(index)}
                key={asset.id}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{asset.title}</strong>
              </button>
            ))}
          </div>
        </aside>

        <div className="prototype-stage">
          <div className="prototype-stage-toolbar">
            <div><span>PAGE</span><strong>{current.asset.title}</strong></div>
            <div>
              <button type="button" disabled={pageIndex === 0} onClick={() => setPageIndex((value) => value - 1)} aria-label="上一张原型图">←</button>
              <button type="button" disabled={pageIndex === entries.length - 1} onClick={() => setPageIndex((value) => value + 1)} aria-label="下一张原型图">→</button>
              <button type="button" className={previewMode === "smart" ? "is-active" : ""} aria-pressed={previewMode === "smart"} onClick={() => setPreviewMode("smart")}>智能居中</button>
              <button type="button" className={previewMode === "full" ? "is-active" : ""} aria-pressed={previewMode === "full"} onClick={() => setPreviewMode("full")}>完整画布</button>
              <button type="button" onClick={() => onOpen(current.assetIndex)}>深度查看 ↗</button>
            </div>
          </div>

          <button ref={previewRef} className="prototype-page-preview" type="button" onClick={() => onOpen(current.assetIndex)} aria-label={`深度查看原型页：${current.asset.title}`}>
            <img
              ref={imageRef}
              key={current.asset.id}
              className={previewMode === "smart" ? "is-smart-centered" : ""}
              style={previewMode === "smart" ? { width: `${previewScale * 100}%`, maxWidth: "none", transform: `translate(${previewShiftX}%, ${previewShiftY}%)` } : undefined}
              src={current.asset.url}
              alt={current.asset.title}
              onLoad={handlePrototypeImageLoad}
            />
            <span>CLICK TO INSPECT</span>
          </button>

          <footer className="prototype-stage-foot">
            <div><span>{String(pageIndex + 1).padStart(2, "0")} / PROTOTYPE</span><strong>{current.asset.title}</strong></div>
            <p>{current.asset.caption || current.asset.description || "选择左侧页面，在同一个窗口中浏览完整产品原型。"}</p>
            <Link href={current.asset.url} target="_blank" rel="noreferrer">VIEW ORIGINAL ↗</Link>
          </footer>
        </div>
      </div>
    </section>
  );
}

function AssetViewer({
  assets,
  activeIndex,
  onChange,
  onClose,
}: {
  assets: ProjectAsset[];
  activeIndex: number;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const asset = assets[activeIndex];
  const closeRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewerImageRef = useRef<HTMLImageElement>(null);
  const [zoom, setZoom] = useState<AssetZoom>("fit");
  const [isPanorama, setIsPanorama] = useState(false);
  const [viewerFocus, setViewerFocus] = useState(defaultPrototypeFocus);
  const [viewerDisplayUrl, setViewerDisplayUrl] = useState(asset?.url || "");

  useEffect(() => {
    setZoom(asset?.kind === "prototype" && asset.mediaType === "image" ? "smart" : "fit");
    setIsPanorama(false);
    setViewerFocus(defaultPrototypeFocus);
    setViewerDisplayUrl(asset?.url || "");
  }, [activeIndex, asset?.kind, asset?.mediaType]);

  const updateViewerFocus = () => {
    const image = viewerImageRef.current;
    if (!image || image.naturalWidth < 1) return;
    setViewerFocus(analyzePrototypeFocus(image, stageRef.current));
  };

  useEffect(() => {
    const stage = stageRef.current;
    const image = viewerImageRef.current;
    if (image?.complete && image.naturalWidth > 0) updateViewerFocus();
    if (!stage || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => updateViewerFocus());
    observer.observe(stage);
    return () => observer.disconnect();
  }, [activeIndex, viewerDisplayUrl]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && activeIndex > 0) onChange(activeIndex - 1);
      if (event.key === "ArrowRight" && activeIndex < assets.length - 1) onChange(activeIndex + 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, assets.length, onChange, onClose]);

  useEffect(() => {
    if (zoom !== "readable") return;
    const frame = window.requestAnimationFrame(() => {
      const stage = stageRef.current;
      if (stage) stage.scrollLeft = Math.max(0, (stage.scrollWidth - stage.clientWidth) / 2);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [zoom]);

  if (!asset) return null;

  const zoomOut = () => setZoom((value) => (typeof value === "number" ? Math.max(50, value - 25) : value === "readable" ? 125 : 75));
  const zoomIn = () => setZoom((value) => (typeof value === "number" ? Math.min(250, value + 25) : value === "readable" ? 200 : 125));
  const viewerDisplayScale = asset.previewScale ? clamp(asset.previewScale / 100, .8, 2.6) : 1;
  const viewerShiftX = viewerFocus.shiftX + (asset.previewOffsetX || 0);
  const viewerShiftY = viewerFocus.shiftY + (asset.previewOffsetY || 0);

  return (
    <div className="asset-viewer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="asset-viewer" role="dialog" aria-modal="true" aria-label={`查看资料：${asset.title}`}>
        <header className="asset-viewer-head">
          <div><span>{String(activeIndex + 1).padStart(2, "0")} / {asset.kind}</span><strong>{asset.title}</strong></div>
          <div className="asset-viewer-controls">
            {asset.mediaType === "image" && (
              <>
                <button type="button" onClick={zoomOut} aria-label="缩小图片">−</button>
                {asset.kind === "prototype" && <button type="button" className={zoom === "smart" ? "is-active" : ""} onClick={() => setZoom("smart")}>智能</button>}
                <button type="button" className={zoom === "fit" ? "is-active" : ""} onClick={() => setZoom("fit")}>适应</button>
                {isPanorama && <button type="button" className={zoom === "readable" ? "is-active" : ""} onClick={() => setZoom("readable")}>阅读</button>}
                <button type="button" className={zoom === "actual" ? "is-active" : ""} onClick={() => setZoom("actual")}>原始</button>
                <button type="button" onClick={zoomIn} aria-label="放大图片">＋</button>
              </>
            )}
            <Link href={asset.url} target="_blank" rel="noreferrer">新窗口 ↗</Link>
            <button ref={closeRef} className="asset-viewer-close" type="button" onClick={onClose}>关闭 ×</button>
          </div>
        </header>

        <div ref={stageRef} className={`asset-viewer-stage ${asset.mediaType === "image" ? `is-image ${zoom === "smart" ? "is-smart-mode" : zoom === "fit" ? "" : "is-pannable"}` : "is-document"}`}>
          {asset.mediaType === "pdf" ? (
            <iframe src={`${asset.url}#view=FitH`} title={`${asset.title} PDF 文档查看器`} />
          ) : asset.mediaType === "markdown" ? (
            <MarkdownAssetPreview asset={asset} onOpen={() => undefined} />
          ) : (
            <img
              ref={viewerImageRef}
              className={zoom === "smart" ? "is-smart" : zoom === "fit" ? "is-fit" : zoom === "readable" ? "is-readable" : zoom === "actual" ? "is-actual" : "is-zoomed"}
              style={zoom === "smart" ? { width: `${viewerDisplayScale * 100}%`, transform: `translate(${viewerShiftX}%, ${viewerShiftY}%)` } : typeof zoom === "number" ? { width: `${zoom}%` } : undefined}
              src={viewerDisplayUrl || asset.url}
              alt={asset.title}
              onLoad={(event) => {
                const image = event.currentTarget;
                const panorama = image.naturalWidth / image.naturalHeight >= 1.7;
                setIsPanorama(panorama);
                updateViewerFocus();
              }}
            />
          )}
        </div>

        <footer className="asset-viewer-foot">
          <button type="button" disabled={activeIndex === 0} onClick={() => onChange(activeIndex - 1)}>← 上一个</button>
          <div>{asset.caption && <strong>{asset.caption}</strong>}{asset.description && <p>{asset.description}</p>}</div>
          <button type="button" disabled={activeIndex === assets.length - 1} onClick={() => onChange(activeIndex + 1)}>下一个 →</button>
        </footer>
      </section>
    </div>
  );
}

export default function ProjectDetail({
  project,
  editMode = false,
  canSave = false,
  saved = false,
}: {
  project: Project;
  editMode?: boolean;
  canSave?: boolean;
  saved?: boolean;
}) {
  const [activeChapter, setActiveChapter] = useState("overview");
  const [processIndex, setProcessIndex] = useState(0);
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const [background, setBackground] = useState(project.background);
  const [goal, setGoal] = useState(project.goal);
  const [stack, setStack] = useState(project.stack);
  const [problem, setProblem] = useState(project.problem);
  const [solution, setSolution] = useState(project.solution);
  const [assets, setAssets] = useState(project.solutionAssets);
  const [process, setProcess] = useState(project.process);
  const [challenges, setChallenges] = useState(project.challenges);
  const [result, setResult] = useState(project.result);
  const [metrics, setMetrics] = useState(project.metrics);
  const [reflection, setReflection] = useState(project.reflection);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const assetsForChapter = (chapterId: ProjectChapterId) => assets.filter((asset) => (asset.chapter || "solution") === chapterId);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    let frame = 0;

    const updateActiveChapter = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const marker = window.innerHeight * 0.32;
        let current = elements[0];
        for (const element of elements) {
          if (element.getBoundingClientRect().top <= marker) current = element;
          else break;
        }
        if (current) setActiveChapter(current.getAttribute("data-chapter") || "overview");
      });
    };

    updateActiveChapter();
    window.addEventListener("scroll", updateActiveChapter, { passive: true });
    window.addEventListener("resize", updateActiveChapter);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveChapter);
      window.removeEventListener("resize", updateActiveChapter);
    };
  }, []);

  const scrollToChapter = (id: string) => {
    setActiveChapter(id);
    document.getElementById(`chapter-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const selectedProcess = process[Math.min(processIndex, Math.max(process.length - 1, 0))];
  const solutionAssets = assetsForChapter("solution");
  const prototypeEntries = assets.map((asset, assetIndex) => ({ asset, assetIndex })).filter(({ asset }) => (asset.chapter || "solution") === "solution" && asset.kind === "prototype" && asset.mediaType === "image");
  const supportingEntries = assets.map((asset, assetIndex) => ({ asset, assetIndex })).filter(({ asset }) => (asset.chapter || "solution") === "solution" && (asset.kind !== "prototype" || asset.mediaType !== "image"));

  return (
    <form className={`personal-home detail-page detail-page-${project.theme} ${editMode ? "is-editing" : ""}`} action={updateProjectCaseAction}>
      <input type="hidden" name="slug" value={project.slug} />
      <input type="hidden" name="solutionAssets" value={JSON.stringify(assets)} />
      <input type="hidden" name="process" value={JSON.stringify(process)} />
      <input type="hidden" name="challenges" value={JSON.stringify(challenges)} />
      <input type="hidden" name="metrics" value={JSON.stringify(metrics)} />

      <TidalNav />
      {editMode && (
        <div className="inline-edit-toolbar">
          <div><span>LIVE CASE EDITOR</span><strong>{saved ? "已保存，页面已更新" : "正在展示页编辑"}</strong></div>
          {!canSave && <small>需先配置 DATABASE_URL 才能保存</small>}
          <Link href="/studio" prefetch={false}>Exit to Studio</Link>
          <button type="submit" disabled={!canSave}>Save all</button>
        </div>
      )}

      <section className="detail-hero">
        <div className="detail-hero-meta"><Link href="/work">返回项目</Link><span>{project.period}</span></div>
        <div className="detail-hero-grid">
          <div><small>{project.cn}</small><h1>{project.name}</h1><p>{project.detail}</p></div>
          <div className="case-summary"><h2>项目目标</h2><p>{goal}</p><h2>我的角色</h2><p>{project.responsibility}</p></div>
        </div>
        <div className="detail-hero-bottom"><span>{project.role}</span><span>{stack}</span><span>Case study</span></div>
      </section>

      <section className="detail-body">
        <aside className="detail-rail">
          <Link href={editMode ? "/studio" : "/work"} className="detail-back" prefetch={!editMode}>{editMode ? "← Back to Studio" : "← Back to work"}</Link>
          <nav aria-label="Case study chapters">
            {chapters.map(([id, label], index) => <button type="button" className={activeChapter === id ? "is-active" : ""} key={id} onClick={() => scrollToChapter(id)}><span>{String(index + 1).padStart(2, "0")}</span>{label}</button>)}
          </nav>
          <span className="detail-rail-note">A FIELD NOTE<br />BY OCEAN</span>
        </aside>

        <div className="detail-sections">
          <section className="detail-section detail-overview" id="chapter-overview" data-chapter="overview">
            <div className="detail-section-head"><span>01 / 概述</span><small>THE CONTEXT</small></div>
            <div className="detail-section-intro"><h2>从背景到<br /><em>可验证的目标。</em></h2><p>{background}</p></div>
            <div className="overview-grid">
              <article><small>BACKGROUND / 背景</small><p>{background}</p></article>
              <article><small>GOAL / 目标</small><p>{goal}</p></article>
              <article><small>TECH STACK / 技术栈</small><strong>{stack}</strong><span>{project.role}</span></article>
            </div>
            <ChapterAssetGallery assets={assets} chapterId="overview" onOpen={setViewerIndex} />
            {editMode && <EditorPanel title="概述"><label><span>背景</span><textarea name="background" rows={5} value={background} onChange={(event) => setBackground(event.target.value)} /></label><label><span>目标</span><textarea name="goal" rows={5} value={goal} onChange={(event) => setGoal(event.target.value)} /></label><label><span>技术栈</span><input name="stack" value={stack} onChange={(event) => setStack(event.target.value)} /></label><ChapterAssetEditor chapterId="overview" assets={assets} onChange={setAssets} /></EditorPanel>}
            {!editMode && <><input type="hidden" name="background" value={background} /><input type="hidden" name="goal" value={goal} /><input type="hidden" name="stack" value={stack} /></>}
          </section>

          <section className="detail-section detail-solution" id="chapter-solution" data-chapter="solution">
            <div className="detail-section-head"><span>02 / 方案</span><small>THE ROUTE</small></div>
            <div className="detail-section-intro"><h2>把一句话<br /><em>带到结果。</em></h2><p>{solution}</p></div>
            <div className="solution-flow"><article><i>01</i><strong>Capture</strong><span>自然语言<br />捕捉意图</span></article><b>→</b><article><i>02</i><strong>Structure</strong><span>字段抽取<br />可编辑确认</span></article><b>→</b><article><i>03</i><strong>Match</strong><span>混合检索<br />解释推荐</span></article><b>→</b><article><i>04</i><strong>Complete</strong><span>预约下单<br />闭环完成</span></article></div>
            {solutionAssets.length > 0 && (
              <div className="solution-assets">
                {prototypeEntries.length > 0 && <PrototypeWindow entries={prototypeEntries} onOpen={setViewerIndex} />}
                {supportingEntries.map(({ asset, assetIndex }) => <SolutionAssetCard asset={asset} index={assetIndex} onOpen={() => setViewerIndex(assetIndex)} key={asset.id} />)}
              </div>
            )}
            {editMode && <EditorPanel title="方案与资料"><label><span>方案说明</span><textarea name="solution" rows={6} value={solution} onChange={(event) => setSolution(event.target.value)} /></label><ChapterAssetEditor chapterId="solution" assets={assets} onChange={setAssets} /></EditorPanel>}
            {!editMode && <input type="hidden" name="solution" value={solution} />}
          </section>

          <section className="detail-section detail-problem" id="chapter-problem" data-chapter="problem">
            <div className="detail-section-head"><span>03 / 问题</span><small>THE SIGNAL</small></div>
            <div className="detail-section-intro"><h2>先找到真正<br /><em>卡住的地方。</em></h2><p>{problem}</p></div>
            <div className="problem-pair"><div><small>BEFORE / 用户表达</small><strong>“我想要一组<br />有感觉的照片。”</strong><span>需求真实，但无法直接匹配。</span></div><div><small>DESIGN QUESTION</small><strong>如何让模糊的<br />感觉变成下一步？</strong><span>不牺牲自然表达，也不放弃可执行性。</span></div></div>
            <ChapterAssetGallery assets={assets} chapterId="problem" onOpen={setViewerIndex} />
            {editMode && <EditorPanel title="问题"><label><span>问题描述</span><textarea name="problem" rows={7} value={problem} onChange={(event) => setProblem(event.target.value)} /></label><ChapterAssetEditor chapterId="problem" assets={assets} onChange={setAssets} /></EditorPanel>}
            {!editMode && <input type="hidden" name="problem" value={problem} />}
          </section>

          <section className="detail-section detail-process" id="chapter-process" data-chapter="process">
            <div className="detail-section-head"><span>04 / 过程</span><small>THE TIDE</small></div>
            <div className="detail-section-intro"><h2>每一次<br /><em>转向都有原因。</em></h2><p>把项目从直觉带到证据，过程中留下判断发生的痕迹。</p></div>
            <div className="process-timeline">{process.map(([number, title], index) => <button type="button" className={processIndex === index ? "is-active" : ""} key={`${number}-${index}`} onClick={() => setProcessIndex(index)}><span>{number}</span><strong>{title}</strong><i /></button>)}</div>
            {selectedProcess && <div className="process-note"><small>FIELD NOTE / {selectedProcess[0]}</small><h3>{selectedProcess[1]}</h3><p>{selectedProcess[2]}</p><span>Scroll or choose another step above ↑</span></div>}
            <ChapterAssetGallery assets={assets} chapterId="process" onOpen={setViewerIndex} />
            {editMode && <EditorPanel title="过程"><ProcessEditor process={process} onChange={setProcess} /><ChapterAssetEditor chapterId="process" assets={assets} onChange={setAssets} /></EditorPanel>}
          </section>

          <section className="detail-section detail-challenges" id="chapter-challenges" data-chapter="challenges">
            <div className="detail-section-head"><span>05 / 难点</span><small>PROBLEM ↔ SOLUTION</small></div>
            <div className="detail-section-intro"><h2>把阻力<br /><em>变成判断。</em></h2><p>不只记录遇到了什么，也说清选择了哪种解法，以及为什么。</p></div>
            <div className="challenge-grid">{challenges.map((challenge, index) => <article key={challenge.id}><header><span>{String(index + 1).padStart(2, "0")}</span><small>CHALLENGE</small></header><div><section><small>PROBLEM / 问题</small><p>{challenge.problem}</p></section><i>→</i><section><small>SOLUTION / 方案</small><p>{challenge.solution}</p></section></div></article>)}</div>
            <ChapterAssetGallery assets={assets} chapterId="challenges" onOpen={setViewerIndex} />
            {editMode && <EditorPanel title="难点"><ChallengeEditor challenges={challenges} onChange={setChallenges} /><ChapterAssetEditor chapterId="challenges" assets={assets} onChange={setAssets} /></EditorPanel>}
          </section>

          <section className="detail-section detail-result" id="chapter-result" data-chapter="result">
            <div className="detail-section-head"><span>06 / 成果</span><small>WHAT MOVED</small></div>
            <div className="detail-section-intro"><h2>结果要能<br /><em>被看见。</em></h2><p>{result}</p></div>
            <div className="result-metrics">{metrics.map(([value, label], index) => <div key={`${label}-${index}`}><strong>{value}</strong><span>{label}</span></div>)}</div>
            <div className="result-statement"><span>THE TAKEAWAY</span><p>{result} 但更重要的是，产品从一次演示变成了可以被使用、被质疑、再被改进的系统。</p></div>
            <ChapterAssetGallery assets={assets} chapterId="result" onOpen={setViewerIndex} />
            {editMode && <EditorPanel title="成果"><label><span>成果描述</span><textarea name="result" rows={6} value={result} onChange={(event) => setResult(event.target.value)} /></label><MetricsEditor metrics={metrics} onChange={setMetrics} /><ChapterAssetEditor chapterId="result" assets={assets} onChange={setAssets} /></EditorPanel>}
            {!editMode && <input type="hidden" name="result" value={result} />}
          </section>

          <section className="detail-section detail-reflection" id="chapter-reflection" data-chapter="reflection">
            <div className="detail-section-head"><span>07 / 复盘</span><small>AFTER THE TIDE</small></div>
            <div className="detail-section-intro"><h2>留下一个<br /><em>还没结束的问题。</em></h2><p>{reflection}</p></div>
            <button className={`reflection-reveal ${reflectionOpen ? "is-open" : ""}`} type="button" onClick={() => setReflectionOpen((value) => !value)}><span>{reflectionOpen ? "Hide next experiment" : "Reveal next experiment"}</span><i>{reflectionOpen ? "↑" : "↓"}</i></button>
            {reflectionOpen && <div className="reflection-panel"><small>NEXT EXPERIMENT / 08</small><h3>继续把判断交还给真实的人。</h3><p>下一轮会补上用户访谈、对照实验和更清晰的成功指标，让设计感和产品证据一起向前。</p></div>}
            <ChapterAssetGallery assets={assets} chapterId="reflection" onOpen={setViewerIndex} />
            {editMode && <EditorPanel title="复盘"><label><span>复盘内容</span><textarea name="reflection" rows={7} value={reflection} onChange={(event) => setReflection(event.target.value)} /></label><ChapterAssetEditor chapterId="reflection" assets={assets} onChange={setAssets} /></EditorPanel>}
            {!editMode && <input type="hidden" name="reflection" value={reflection} />}
          </section>
        </div>
      </section>
      <PersonalFooter />
      {viewerIndex !== null && <AssetViewer assets={assets} activeIndex={viewerIndex} onChange={setViewerIndex} onClose={() => setViewerIndex(null)} />}
    </form>
  );
}
