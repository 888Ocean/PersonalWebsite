"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Project } from "./projectData";
import TidalNav from "./TidalNav";

export default function PersonalHome({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const project = projects[Math.min(activeIndex, projects.length - 1)];

  return (
    <main className="personal-home">
      <TidalNav />
      <section className="personal-hero" id="top">
        <div className="home-title-block">
          <h1>Ocean</h1>
        </div>
        <div className="home-bottomline">
          <p data-enter>AI application developer & photographer.<br />把想法做成工具，把日常留在照片里。</p>
          <Link className="home-primary-link" data-enter href="#selected-work">See selected work <span aria-hidden="true">↘</span></Link>
        </div>
      </section>

      <section className="selected-work" id="selected-work">
        <div className="section-heading" data-enter>
          <h2>Selected work</h2>
        </div>
        <div className="work-browser">
          <div className="work-list" aria-label="选择项目">
            {projects.map((item, index) => (
              <button
                key={item.slug}
                type="button"
                id={`project-tab-${item.slug}`}
                aria-pressed={activeIndex === index}
                aria-controls="project-preview"
                className={activeIndex === index ? "is-active" : ""}
                data-enter
                onClick={() => setActiveIndex(index)}
              >
                <span>{item.name}</span><span>{item.cn}</span>
              </button>
            ))}
          </div>
          <article className="work-preview" id="project-preview" aria-live="polite" aria-labelledby={`project-tab-${project.slug}`}>
            <h3>{project.name}</h3>
            <p>{project.role}</p>
            <p>{project.summary}</p>
            <Link href={`/work/${project.slug}`}>Read the case study <span aria-hidden="true">↗</span></Link>
            <div className="project-decision"><strong>我的工作</strong><p>{project.responsibility}</p></div>
          </article>
        </div>
        <Link className="work-all-link" href="/work">All projects</Link>
      </section>

      <section className="practice-note">
        <p className="practice-statement" data-enter>先观察，再动手。<br />做完以后，再问一次为什么。</p>
        <div data-enter>
          <h2>Making & seeing</h2>
          <p>开发和摄影，都从观察开始。一个项目里，我关心工具能否真正完成任务，也关心使用它的人能不能理解过程、调整结果。拿起相机时，我关心光线、距离，以及画面之外的故事。</p>
          <Link href="/about">A little more about me <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="photo-entry">
        <div className="section-heading" data-enter><h2>Photography</h2><Link href="/photography">看摄影故事</Link></div>
        <p className="photo-context" data-enter>以故事编排照片。当前为版式原型，展示用样片尚未替换为个人作品。</p>
        <div className="home-photo-layout">
          {[
            {src:"/photography/city-breath-01.jpg",alt:"高楼之间的城市街道",title:"城市的间隙",href:"city-holds-its-breath"},
            {src:"/photography/kept-light-01.jpg",alt:"傍晚亮着灯的住宅",title:"光停留过",href:"what-light-kept"},
            {src:"/photography/city-breath-02.jpg",alt:"现代建筑立面",title:"立面与秩序",href:"city-holds-its-breath"},
            {src:"/photography/city-breath-03.jpg",alt:"城市建筑与阴影",title:"日常切片",href:"city-holds-its-breath"},
          ].map((image) => <figure key={image.src} data-enter><Link href={`/photography/${image.href}`}><div className="photo-window"><Image src={image.src} alt={image.alt} width={1800} height={1200} sizes="(max-width: 700px) 100vw, 50vw" /></div><figcaption>{image.title}<span>故事原型</span></figcaption></Link></figure>)}
        </div>
      </section>

      <footer className="home-footer" id="contact">
        <h2 data-enter>Let’s make<br />something useful.</h2>
        <div data-enter><p>欢迎讨论 AI 应用、产品与摄影合作。</p><p>正式联系方式正在补充。</p><Link href="/about">认识一下 Ocean</Link></div>
        <span>Ocean · 2026</span>
      </footer>
    </main>
  );
}
