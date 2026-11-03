"use client";

import { useMemo, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import TidalNav from "../components/TidalNav";
import type { PhotographyStory } from "./data";

gsap.registerPlugin(useGSAP);

type FocusPhotographyIndexProps = {
  stories: PhotographyStory[];
};

export default function FocusPhotographyIndex({ stories }: FocusPhotographyIndexProps) {
  const root = useRef<HTMLElement>(null);
  const board = useRef<HTMLElement>(null);
  const [activeSlug, setActiveSlug] = useState(stories[0]?.slug ?? "");

  const activeStory = stories.find((story) => story.slug === activeSlug) ?? stories[0];
  const tiles = useMemo(
    () => stories.flatMap((story) => story.images.slice(0, 2).map((image, imageIndex) => ({
      story,
      image,
      imageIndex,
    }))),
    [stories],
  );

  useGSAP(
    () => {
      const stage = board.current;
      if (!stage) return;

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
            gsap.set([".focus-board", ".focus-tile", ".focus-topbar", ".focus-footer"], {
              autoAlpha: 1,
              clearProps: "transform",
            });
            return;
          }

          const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
          intro
            .from(".focus-backdrop", { scale: 1.08, duration: 1.2 }, 0)
            .from(".focus-board", { scale: .94, duration: 1.05 }, .08)
            .from(".focus-tile", {
              scale: .78,
              duration: .9,
              stagger: { amount: .42, from: "random" },
            }, .24)
            .from(".focus-active-copy > *", {
              y: 18,
              duration: .65,
              stagger: .06,
            }, .5)
            .from([".focus-topbar", ".focus-footer"], {
              y: 10,
              duration: .7,
              stagger: .08,
            }, .55);

          if (!desktop) return;

          const cursor = root.current?.querySelector<HTMLElement>(".focus-cursor");
          const xCursor = cursor ? gsap.quickTo(cursor, "x", { duration: .24, ease: "power3.out" }) : null;
          const yCursor = cursor ? gsap.quickTo(cursor, "y", { duration: .24, ease: "power3.out" }) : null;
          const tileNodes = gsap.utils.toArray<HTMLElement>(".focus-tile");
          const tileMovers = tileNodes.map((tile) => ({
            tile,
            x: gsap.quickTo(tile, "x", { duration: .8, ease: "power3.out" }),
            y: gsap.quickTo(tile, "y", { duration: .8, ease: "power3.out" }),
            depth: Number(tile.dataset.depth ?? 1),
          }));

          const move = (event: PointerEvent) => {
            const bounds = stage.getBoundingClientRect();
            const normalizedX = (event.clientX - bounds.left) / bounds.width - .5;
            const normalizedY = (event.clientY - bounds.top) / bounds.height - .5;

            xCursor?.(event.clientX);
            yCursor?.(event.clientY);
            tileMovers.forEach((item) => {
              item.x(normalizedX * 18 * item.depth);
              item.y(normalizedY * 14 * item.depth);
            });
          };

          const enter = () => {
            if (cursor) gsap.to(cursor, { autoAlpha: 1, scale: 1, duration: .2 });
          };
          const leave = () => {
            if (cursor) gsap.to(cursor, { autoAlpha: 0, scale: .6, duration: .2 });
            tileMovers.forEach((item) => {
              item.x(0);
              item.y(0);
            });
          };

          stage.addEventListener("pointermove", move);
          stage.addEventListener("pointerenter", enter);
          stage.addEventListener("pointerleave", leave);

          return () => {
            stage.removeEventListener("pointermove", move);
            stage.removeEventListener("pointerenter", enter);
            stage.removeEventListener("pointerleave", leave);
          };
        },
      );

      return () => media.revert();
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (!activeStory) return;

      gsap.to(".focus-backdrop", {
        autoAlpha: 0,
        scale: 1.05,
        duration: .65,
        ease: "power2.out",
        overwrite: true,
      });
      gsap.to(`.focus-backdrop[data-story="${activeStory.slug}"]`, {
        autoAlpha: 1,
        scale: 1,
        duration: .85,
        ease: "power3.out",
        overwrite: true,
      });
      gsap.fromTo(
        ".focus-active-copy > *",
        { y: 12 },
        { y: 0, duration: .48, stagger: .04, ease: "power3.out" },
      );
    },
    { scope: root, dependencies: [activeSlug], revertOnUpdate: true },
  );

  if (!activeStory) return null;

  const activate = (slug: string) => {
    setActiveSlug(slug);
    root.current?.classList.add("is-focusing");
  };

  const release = () => root.current?.classList.remove("is-focusing");

  return (
    <main
      className="focus-page"
      ref={root}
      style={{ "--focus-accent": activeStory.accent } as CSSProperties}
    >
      <TidalNav />

      <div className="focus-backgrounds" aria-hidden="true">
        {stories.map((story) => (
          <Image
            className="focus-backdrop"
            data-story={story.slug}
            src={story.images[0].src}
            alt=""
            fill
            priority={story.index === "01"}
            sizes="100vw"
            key={story.slug}
          />
        ))}
        <div className="focus-background-shade" />
        <div className="focus-water-lines"><i /><i /><i /></div>
      </div>

      <header className="focus-topbar">
        <span>02 / Reef</span>
        <span>Ocean&apos;s photography archive</span>
        <span>{stories.length.toString().padStart(2, "0")} currents</span>
      </header>

      <section className="focus-board" ref={board} aria-label="摄影故事聚焦画布">
        <div className="focus-board-coordinate"><span>08°S</span><span>151°E</span></div>
        <div className="focus-crosshair" aria-hidden="true"><i /><i /></div>
        <p className="focus-board-hint">Move to focus · Click to enter</p>

        <nav className="focus-tiles" aria-label="Photography stories">
          {tiles.map(({ story, image, imageIndex }, tileIndex) => (
            <Link
              href={`/photography/${story.slug}`}
              className={`focus-tile focus-tile--${tileIndex} ${activeSlug === story.slug ? "is-active" : ""}`}
              data-depth={(tileIndex % 3) + 1}
              aria-label={`打开摄影故事：${story.titleCn}，照片 ${imageIndex + 1}`}
              onPointerEnter={() => activate(story.slug)}
              onPointerLeave={release}
              onFocus={() => activate(story.slug)}
              onBlur={release}
              key={`${story.slug}-${imageIndex}`}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="(max-width: 820px) 38vw, 18vw"
                className="focus-tile-image"
              />
              <span>{story.index}.{imageIndex + 1}</span>
            </Link>
          ))}
        </nav>

        <div className="focus-active-copy" aria-live="polite" key={activeSlug}>
          <span>Current {activeStory.index} · {activeStory.depth}</span>
          <h1>{activeStory.title}</h1>
          <p className="focus-active-cn">{activeStory.titleCn}</p>
          <p className="focus-active-summary">{activeStory.summary}</p>
        </div>

        <div className="focus-story-list" aria-hidden="true">
          {stories.map((story) => (
            <span className={activeSlug === story.slug ? "is-active" : ""} key={story.slug}>
              {story.index} {story.title}
            </span>
          ))}
        </div>
      </section>

      <footer className="focus-footer">
        <span>Not categories. Connected observations.</span>
        <span>Temporary imagery · Replace with Ocean&apos;s work</span>
      </footer>

      <div className="focus-cursor" aria-hidden="true"><span>+</span></div>
    </main>
  );
}
