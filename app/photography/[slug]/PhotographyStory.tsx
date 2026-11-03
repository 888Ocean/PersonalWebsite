"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TidalNav from "../../components/TidalNav";
import type { PhotographyStory as PhotographyStoryData } from "../data";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type PhotographyStoryProps = {
  story: PhotographyStoryData;
  nextStory: PhotographyStoryData;
};

export default function PhotographyStory({ story, nextStory }: PhotographyStoryProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const media = gsap.matchMedia();

      media.add(
        {
          desktop: "(min-width: 821px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, reduceMotion } = context.conditions as {
            desktop: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) {
            gsap.set(".photo-sequence-item", { autoAlpha: 1, y: 0 });
            gsap.set(".photo-story-depth-fill", { scaleY: 1 });
            return;
          }

          const intro = gsap.timeline({
            defaults: { duration: 1, ease: "power3.out" },
          });

          intro
            .from(".photo-detail-back", { autoAlpha: 0, y: -12 }, 0)
            .from(".photo-detail-index", { autoAlpha: 0, x: 20 }, 0.08)
            .from(".photo-detail-hero-image", { scale: 1.12, duration: 1.5 }, 0)
            .from(".photo-detail-kicker", { autoAlpha: 0, y: 18 }, 0.22)
            .from(
              ".photo-detail-title-line",
              { autoAlpha: 0, yPercent: 110, stagger: 0.08 },
              0.3,
            )
            .from(".photo-detail-hero-meta", { autoAlpha: 0, y: 16 }, 0.64);

          gsap.to(".photo-detail-hero-image", {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: ".photo-detail-hero",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });

          gsap.to(".photo-story-depth-fill", {
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: scope,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.4,
            },
          });

          const figures = gsap.utils.toArray<HTMLElement>(".photo-sequence-item");
          figures.forEach((figure) => {
            const image = figure.querySelector<HTMLElement>(".photo-sequence-image");
            const caption = figure.querySelector<HTMLElement>("figcaption");

            gsap.fromTo(
              figure,
              { autoAlpha: 0, y: 72 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 1.05,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: figure,
                  start: "top 88%",
                  once: true,
                },
              },
            );

            if (image && desktop) {
              gsap.fromTo(
                image,
                { scale: 1.05, yPercent: -2 },
                {
                  scale: 1,
                  yPercent: 2,
                  ease: "none",
                  scrollTrigger: {
                    trigger: figure,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                  },
                },
              );
            }

            if (caption) {
              gsap.from(caption, {
                autoAlpha: 0,
                x: figure.classList.contains("photo-sequence-item--right") ? 18 : -18,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: caption,
                  start: "top 92%",
                  once: true,
                },
              });
            }
          });
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
    <main
      className="photo-detail-page"
      ref={root}
      style={{ "--story-accent": story.accent } as CSSProperties}
    >
      <TidalNav />

      <div className="photo-story-depth" aria-hidden="true">
        <span>{story.depth.split("—")[0]}</span>
        <i><b className="photo-story-depth-fill" /></i>
        <span>{story.depth.split("—")[1]}</span>
      </div>

      <section className="photo-detail-hero">
        <Image
          className="photo-detail-hero-image"
          src={story.images[0].src}
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div className="photo-detail-hero-shade" aria-hidden="true" />
        <div className="photo-detail-caustics" aria-hidden="true" />

        <Link className="photo-detail-back" href="/photography">
          <span aria-hidden="true">←</span> All stories
        </Link>
        <span className="photo-detail-index">02 / {story.index}</span>

        <div className="photo-detail-hero-copy">
          <p className="photo-detail-kicker">{story.eyebrow}</p>
          <h1>
            <span className="photo-detail-title-mask"><span className="photo-detail-title-line">{story.title}</span></span>
            <span className="photo-detail-title-mask is-italic"><span className="photo-detail-title-line">{story.titleCn}</span></span>
          </h1>
        </div>

        <div className="photo-detail-hero-meta">
          <span>{story.place}</span>
          <span>{story.period}</span>
          <span>{story.images.length.toString().padStart(2, "0")} photographs</span>
        </div>
      </section>

      <section className="photo-story-introduction">
        <div className="photo-story-intro-label">
          <span>Current {story.index}</span>
          <span>{story.depth}</span>
        </div>
        <div className="photo-story-intro-copy">
          <p>{story.summary}</p>
          <p>{story.note}</p>
        </div>
        <div className="photo-story-prototype" role="note">
          Prototype imagery · Replace through <code>app/photography/data.ts</code>
        </div>
      </section>

      <section className="photo-sequence" aria-label={`${story.titleCn}摄影作品`}>
        {story.images.map((image, index) => (
          <figure
            className={`photo-sequence-item photo-sequence-item--${image.placement}`}
            data-frame={index + 1}
            key={image.src}
          >
            <div className="photo-sequence-picture">
              <Image
                className="photo-sequence-image"
                src={image.src}
                width={image.width}
                height={image.height}
                sizes={image.placement === "full" ? "(max-width: 820px) 100vw, 88vw" : "(max-width: 820px) 100vw, 62vw"}
                alt={image.alt}
              />
              <span className="photo-sequence-mark">{(index + 1).toString().padStart(2, "0")} / {story.images.length.toString().padStart(2, "0")}</span>
            </div>
            <figcaption>
              <span>{story.place}</span>
              <p>{image.caption}</p>
            </figcaption>
          </figure>
        ))}
      </section>

      <section className="photo-story-end">
        <span>End of current {story.index}</span>
        <p>照片停止，但观看留下的距离还在继续。</p>
      </section>

      <Link
        className="photo-next-story"
        href={`/photography/${nextStory.slug}`}
        style={{ "--next-accent": nextStory.accent } as CSSProperties}
      >
        <Image
          className="photo-next-story-image"
          src={nextStory.images[0].src}
          alt=""
          fill
          sizes="100vw"
        />
        <span className="photo-next-story-shade" aria-hidden="true" />
        <span className="photo-next-story-label">Next current · {nextStory.index}</span>
        <span className="photo-next-story-title">{nextStory.title}<em>{nextStory.titleCn}</em></span>
        <span className="photo-next-story-enter">Continue drifting ↗</span>
      </Link>

      <footer className="photography-footer photography-footer--detail">
        <span>Tidal Archive · 02 / REEF</span>
        <Link href="/photography">Return to all stories</Link>
      </footer>
    </main>
  );
}
