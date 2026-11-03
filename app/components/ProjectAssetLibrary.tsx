"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ProjectAsset } from "./projectData";

const kindLabels: Record<ProjectAsset["kind"], string> = {
  prd: "PRD / 文档",
  prototype: "PROTOTYPE / 原型",
  screenshot: "SCREENSHOT / 界面",
};

function AssetThumbnail({ asset }: { asset: ProjectAsset }) {
  if (asset.mediaType === "pdf") {
    return <div className="evidence-pdf-cover"><span>PDF</span><small>DOCUMENT</small></div>;
  }
  if (asset.mediaType === "markdown") {
    return <div className="evidence-pdf-cover"><span>MD</span><small>MARKDOWN</small></div>;
  }

  return <img src={asset.url} alt="" />;
}

export default function ProjectAssetLibrary({ assets }: { assets: ProjectAsset[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const activeAsset = activeIndex === null ? null : assets[activeIndex];
  const counts = useMemo(() => ({
    prototype: assets.filter((asset) => asset.kind === "prototype").length,
    screenshot: assets.filter((asset) => asset.kind === "screenshot").length,
    prd: assets.filter((asset) => asset.kind === "prd").length,
  }), [assets]);

  const openAsset = (index: number) => {
    setActiveIndex(index);
    setZoom(1);
  };

  const move = (direction: -1 | 1) => {
    if (activeIndex === null || assets.length < 2) return;
    setActiveIndex((activeIndex + direction + assets.length) % assets.length);
    setZoom(1);
  };

  useEffect(() => {
    if (activeIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
      if ((event.key === "+" || event.key === "=") && activeAsset?.mediaType === "image") setZoom((value) => Math.min(3, value + 0.25));
      if (event.key === "-" && activeAsset?.mediaType === "image") setZoom((value) => Math.max(0.5, value - 0.25));
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeAsset?.mediaType, activeIndex, assets.length]);

  if (assets.length === 0) return null;

  return (
    <section className="evidence-library" aria-label="项目资料库">
      <header className="evidence-library-head">
        <div>
          <span>PROJECT EVIDENCE / 项目证据库</span>
          <h3>从概述进入完整产品。</h3>
        </div>
        <p>页面内保留可快速扫读的资料索引；点击任意资料，在深度查看窗口中阅读完整原型、界面或 PDF 文档。</p>
      </header>

      <div className="evidence-summary" aria-label="资料类型统计">
        <span><b>{String(assets.length).padStart(2, "0")}</b> ALL FILES</span>
        <span><b>{String(counts.prototype).padStart(2, "0")}</b> PROTOTYPES</span>
        <span><b>{String(counts.screenshot).padStart(2, "0")}</b> SCREENS</span>
        <span><b>{String(counts.prd).padStart(2, "0")}</b> DOCUMENTS</span>
      </div>

      <div className="evidence-grid">
        {assets.map((asset, index) => (
          <button className={`evidence-card evidence-card-${asset.mediaType}`} type="button" key={asset.id} onClick={() => openAsset(index)}>
            <span className="evidence-card-index">{String(index + 1).padStart(2, "0")}</span>
            <div className="evidence-card-preview"><AssetThumbnail asset={asset} /></div>
            <div className="evidence-card-copy">
              <small>{kindLabels[asset.kind]}</small>
              <strong>{asset.title}</strong>
              <p>{asset.caption || (asset.mediaType === "image" ? "打开高清原图查看页面细节与交互说明。" : "打开完整文档并连续阅读。")}</p>
              <span>OPEN DEEP VIEW <i>↗</i></span>
            </div>
          </button>
        ))}
      </div>

      {activeAsset && activeIndex !== null && (
        <div className="evidence-modal" role="dialog" aria-modal="true" aria-label={`${activeAsset.title} 深度查看`}>
          <button className="evidence-modal-backdrop" type="button" aria-label="关闭资料窗口" onClick={() => setActiveIndex(null)} />
          <section className="evidence-modal-shell">
            <header className="evidence-modal-head">
              <div><span>{String(activeIndex + 1).padStart(2, "0")} / {String(assets.length).padStart(2, "0")}</span><strong>{activeAsset.title}</strong></div>
              <div className="evidence-modal-tools">
                {activeAsset.mediaType === "image" && <><button type="button" onClick={() => setZoom((value) => Math.max(0.5, value - 0.25))} aria-label="缩小图片">−</button><span>{Math.round(zoom * 100)}%</span><button type="button" onClick={() => setZoom((value) => Math.min(3, value + 0.25))} aria-label="放大图片">+</button><button type="button" onClick={() => setZoom(1)}>FIT</button></>}
                <button className="evidence-modal-close" type="button" onClick={() => setActiveIndex(null)}>CLOSE ×</button>
              </div>
            </header>

            <div className="evidence-modal-body">
              <div className="evidence-modal-viewer">
                {activeAsset.mediaType === "pdf" ? (
                  <object data={activeAsset.url} type="application/pdf" aria-label={`${activeAsset.title} PDF 文档`}><Link href={activeAsset.url} target="_blank">新窗口打开 PDF</Link></object>
                ) : activeAsset.mediaType === "markdown" ? (
                  <iframe src={activeAsset.url} title={`${activeAsset.title} Markdown 文档`} />
                ) : (
                  <div className="evidence-image-stage"><img src={activeAsset.url} alt={activeAsset.title} style={{ transform: `scale(${zoom})` }} /></div>
                )}
              </div>

              <aside className="evidence-modal-notes">
                <span>{kindLabels[activeAsset.kind]}</span>
                <h3>{activeAsset.title}</h3>
                {activeAsset.caption && <p className="evidence-modal-lead">{activeAsset.caption}</p>}
                <div className="evidence-modal-description"><small>READING NOTE / 阅读提示</small><p>{activeAsset.description || "这份资料用于展示产品界面、页面状态与用户路径。可以放大图片查看细节，或通过下方缩略图继续阅读同一项目的其他证据。"}</p></div>
                <Link href={activeAsset.url} target="_blank">OPEN ORIGINAL ↗</Link>
                <small className="evidence-modal-shortcuts">ESC 关闭 · ← → 切换 · + − 缩放</small>
              </aside>
            </div>

            <footer className="evidence-modal-foot">
              <button type="button" onClick={() => move(-1)} disabled={assets.length < 2}>← PREVIOUS</button>
              <div className="evidence-modal-thumbs">
                {assets.map((asset, index) => <button className={index === activeIndex ? "is-active" : ""} type="button" key={asset.id} onClick={() => openAsset(index)} aria-label={`查看 ${asset.title}`}><AssetThumbnail asset={asset} /></button>)}
              </div>
              <button type="button" onClick={() => move(1)} disabled={assets.length < 2}>NEXT →</button>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
}
