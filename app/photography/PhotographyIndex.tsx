"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TidalNav from "../components/TidalNav";
import type { PhotographyStory } from "./data";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type PhotographyIndexProps = {
  stories: PhotographyStory[];
};

export default function PhotographyIndex({ stories }: PhotographyIndexProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const media = gsap.matchMedia();

      media.add(
        {
          desktop: "(min-width: 821px)",
          mobile: "(max-width: 820px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, reduceMotion } = context.conditions as {
            desktop: boolean;
            mobile: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) {
            gsap.set(".photography-reveal", { autoAlpha: 1, y: 0 });
            gsap.set(".photography-current-progress", { scaleY: 1 });
            return;
          }

          const intro = gsap.timeline({
            defaults: { duration: 1, ease: "power3.out" },
          });

          intro
            .from(".photography-coordinate", { autoAlpha: 0, y: -12 }, 0)
            .from(
              ".photography-title-line",
              { autoAlpha: 0, yPercent: 110, stagger: 0.1 },
              0.12,
            )
            .from(".photography-intro-copy", { autoAlpha: 0, y: 24 }, 0.42)
            .from(".photography-dive-cue", { autoAlpha: 0, y: 16 }, 0.62);

          gsap.to(".photography-hero-current.is-one", {
            xPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: ".photography-hero",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });

          gsap.to(".photography-current-progress", {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: scope,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.4,
            },
          });

          const cards = gsap.utils.toArray<HTMLElement>(".photo-story-card");
          const pointerCleanups: Array<() => void> = [];

          cards.forEach((card) => {
            const picture = card.querySelector<HTMLElement>(".photo-story-picture");
            const image = card.querySelector<HTMLElement>(".photo-story-image");
            if (!picture || !image) return;

            gsap.fromTo(
              card,
              { autoAlpha: 0, y: 80 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 1.05,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 88%",
                  once: true,
                },
              },
            );

            gsap.fromTo(
              image,
              { scale: 1.08, yPercent: -3 },
              {
                scale: 1.02,
                yPercent: 3,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              },
            );

            if (!desktop) return;

            const xTo = gsap.quickTo(image, "x", {
              duration: 0.5,
              ease: "power3.out",
            });
            const yTo = gsap.quickTo(image, "y", {
              duration: 0.5,
              ease: "power3.out",
            });

            const move = (event: PointerEvent) => {
              const bounds = picture.getBoundingClientRect();
              xTo(((event.clientX - bounds.left) / bounds.width - 0.5) * 18);
              yTo(((event.clientY - bounds.top) / bounds.height - 0.5) * 18);
            };
            const leave = () => {
              xTo(0);
              yTo(0);
            };

            picture.addEventListener("pointermove", move);
            picture.addEventListener("pointerleave", leave);

            pointerCleanups.push(() => {
              picture.removeEventListener("pointermove", move);
              picture.removeEventListener("pointerleave", leave);
            });
          });

          return () => pointerCleanups.forEach((cleanup) => cleanup());
        },
      );

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh, { once: true });

      return () => {
        window.removeEventListener("load", refresh);
        media.revert();
      };
    },
    { scope: root },
  );

  return (
    <main className="photography-page" ref={root}>
      <TidalNav />

      <div className="photography-depth-rail" aria-hidden="true">
        <span>Surface</span>
        <i><b className="photography-current-progress" /></i>
        <span>45 M</span>
      </div>

      <section className="photography-hero">
        <div className="photography-coordinate">
          <span>02 / REEF</span>
          <span>08°S / 151°E</span>
        </div>

        <div className="photography-hero-current is-one" aria-hidden="true" />
        <div className="photography-hero-current is-two" aria-hidden="true" />
        <div className="photography-sun" aria-hidden="true" />

        <div className="photography-hero-copy">
          <p className="photography-kicker photography-reveal">A visual archive of light</p>
          <h1 aria-label="What the camera keeps">
            <span className="photography-title-mask"><span className="photography-title-line">What the</span></span>
            <span className="photography-title-mask is-italic"><span className="photography-title-line">camera keeps.</span></span>
          </h1>
          <p className="photography-intro-copy">
            不按摄影类型整理。每一组照片从一次经历、一个观察或一段尚未结束的记忆开始。
          </p>
        </div>

        <a className="photography-dive-cue" href="#stories">
          <span>Follow the current</span>
          <i aria-hidden="true">↓</i>
        </a>
      </section>

      <section className="photography-stories" id="stories" aria-labelledby="photography-stories-title">
        <header className="photography-stories-head photography-reveal">
          <div>
            <span>Four currents / Twelve photographs</span>
            <h2 id="photography-stories-title">Stories, <em>not categories.</em></h2>
          </div>
          <p>
            从封面进入一组照片。滚动不是翻页，而是在图片、留白与文字之间改变观看距离。
          </p>
        </header>

        <div className="photography-prototype-note photography-reveal" role="note">
          <span>Prototype notice</span>
          <p>当前影像仅用于验证版式与交互，之后将由 Ocean 的真实摄影作品替换。</p>
        </div>

        <div className="photo-story-grid">
          {stories.map((story) => (
            <Link
              className={`photo-story-card photo-story-card--${story.layout}`}
              href={`/photography/${story.slug}`}
              key={story.slug}
              style={{ "--story-accent": story.accent } as CSSProperties}
            >
              <div className="photo-story-picture">
                <Image
                  className="photo-story-image"
                  src={story.images[0].src}
                  alt={story.images[0].alt}
                  fill
                  sizes="(max-width: 820px) 100vw, (max-width: 1200px) 70vw, 58vw"
                  priority={story.index === "01"}
                />
                <span className="photo-story-watermark">Prototype image</span>
                <span className="photo-story-enter" aria-hidden="true">Open current ↗</span>
              </div>

              <div className="photo-story-meta">
                <span>{story.index}</span>
                <span>{story.place}</span>
                <span>{story.images.length.toString().padStart(2, "0")} frames</span>
              </div>
              <div className="photo-story-title">
                <h3>{story.title}</h3>
                <p>{story.titleCn}</p>
              </div>
              <p className="photo-story-summary">{story.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="photography-footer">
        <span>[SiteName]</span>
        <span>Story-led photography, collected slowly.</span>
      </footer>
    </main>
  );
}
