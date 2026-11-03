"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import TidalNav from "../../components/TidalNav";
import type { PhotographyStory as PhotographyStoryData } from "../data";

gsap.registerPlugin(useGSAP);

type FocusPhotographyStoryProps = {
  story: PhotographyStoryData;
  nextStory: PhotographyStoryData;
};

export default function FocusPhotographyStory({ story, nextStory }: FocusPhotographyStoryProps) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLElement>(null);
  const activeFrameRef = useRef(0);
  const wheelLocked = useRef(false);
  const [activeFrame, setActiveFrame] = useState(0);

  const selectFrame = (index: number) => {
    const normalized = (index + story.images.length) % story.images.length;
    activeFrameRef.current = normalized;
    setActiveFrame(normalized);
  };

  useGSAP(
    () => {
      const canvas = stage.current;
      if (!canvas) return;

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
            gsap.set([".story-focus-plane", ".story-frame", ".story-topbar", ".story-controls"], {
              autoAlpha: 1,
              clearProps: "transform",
            });
            return;
          }

          const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
          intro
            .from(".story-backdrop", { scale: 1.08, duration: 1.2 }, 0)
            .from(".story-focus-plane", { scale: .94, duration: 1 }, .08)
            .from(".story-frame", {
              scale: .76,
              duration: .85,
              stagger: { amount: .32, from: "edges" },
            }, .26)
            .from(".story-identity > *", {
              y: 14,
              duration: .6,
              stagger: .05,
            }, .48)
            .from([".story-topbar", ".story-controls"], {
              y: 10,
              duration: .7,
              stagger: .08,
            }, .58);

          if (!desktop) return;

          const frameNodes = gsap.utils.toArray<HTMLElement>(".story-frame");
          const frameMovers = frameNodes.map((frame, index) => ({
            frame,
            index,
            x: gsap.quickTo(frame, "x", { duration: .85, ease: "power3.out" }),
            y: gsap.quickTo(frame, "y", { duration: .85, ease: "power3.out" }),
          }));

          const background = root.current?.querySelector<HTMLElement>(".story-backgrounds");
          const xBackground = background ? gsap.quickTo(background, "x", { duration: 1.1, ease: "power3.out" }) : null;
          const yBackground = background ? gsap.quickTo(background, "y", { duration: 1.1, ease: "power3.out" }) : null;

          const move = (event: PointerEvent) => {
            const bounds = canvas.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - .5;
            const y = (event.clientY - bounds.top) / bounds.height - .5;
            frameMovers.forEach((item) => {
              const depth = item.index + 1;
              item.x(x * 9 * depth);
              item.y(y * 7 * depth);
            });
            xBackground?.(x * -12);
            yBackground?.(y * -10);
          };

          const leave = () => {
            frameMovers.forEach((item) => {
              item.x(0);
              item.y(0);
            });
            xBackground?.(0);
            yBackground?.(0);
          };

          const wheel = (event: WheelEvent) => {
            if (Math.abs(event.deltaY) < 8 && Math.abs(event.deltaX) < 8) return;
            event.preventDefault();
            if (wheelLocked.current) return;
            wheelLocked.current = true;
            const direction = event.deltaY + event.deltaX > 0 ? 1 : -1;
            selectFrame(activeFrameRef.current + direction);
            window.setTimeout(() => { wheelLocked.current = false; }, 520);
          };

          const keydown = (event: KeyboardEvent) => {
            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
              selectFrame(activeFrameRef.current + 1);
            }
            if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
              selectFrame(activeFrameRef.current - 1);
            }
          };

          canvas.addEventListener("pointermove", move);
          canvas.addEventListener("pointerleave", leave);
          canvas.addEventListener("wheel", wheel, { passive: false });
          window.addEventListener("keydown", keydown);

          return () => {
            canvas.removeEventListener("pointermove", move);
            canvas.removeEventListener("pointerleave", leave);
            canvas.removeEventListener("wheel", wheel);
            window.removeEventListener("keydown", keydown);
          };
        },
      );

      return () => media.revert();
    },
    { scope: root },
  );

  useGSAP(
    () => {
      gsap.to(".story-backdrop", {
        autoAlpha: 0,
        scale: 1.05,
        duration: .55,
        ease: "power2.out",
        overwrite: true,
      });
      gsap.to(`.story-backdrop[data-frame="${activeFrame}"]`, {
        autoAlpha: 1,
        scale: 1,
        duration: .82,
        ease: "power3.out",
        overwrite: true,
      });
      gsap.to(".story-frame", {
        scale: .92,
        autoAlpha: .58,
        filter: "saturate(0.45)",
        duration: .55,
        ease: "power3.out",
        overwrite: true,
      });
      gsap.to(`.story-frame[data-frame="${activeFrame}"]`, {
        scale: 1.06,
        autoAlpha: 1,
        filter: "saturate(1)",
        duration: .68,
        ease: "power3.out",
        overwrite: true,
      });
      gsap.fromTo(
        ".story-frame-caption-live",
        { y: 8 },
        { y: 0, duration: .45, ease: "power3.out" },
      );
    },
    { scope: root, dependencies: [activeFrame], revertOnUpdate: true },
  );

  const activeImage = story.images[activeFrame];

  return (
    <main
      className="story-focus-page"
      ref={root}
      style={{ "--story-accent": story.accent, "--next-accent": nextStory.accent } as CSSProperties}
    >
      <TidalNav />

      <div className="story-backgrounds" aria-hidden="true">
        {story.images.map((image, index) => (
          <Image
            className="story-backdrop"
            data-frame={index}
            src={image.src}
            alt=""
            fill
            sizes="100vw"
            priority={index === 0}
            key={image.src}
          />
        ))}
        <div className="story-background-shade" />
        <div className="story-tide-rings"><i /><i /><i /></div>
      </div>

      <header className="story-topbar">
        <Link href="/photography">← All currents</Link>
        <span>{story.index} / {story.title}</span>
        <span>{story.place}</span>
      </header>

      <section className="story-stage" ref={stage} aria-label={`${story.titleCn}摄影故事交互画布`}>
        <div className="story-focus-plane">
          <div className="story-plane-cross" aria-hidden="true"><i /><i /></div>

          <div className="story-identity">
            <span>{story.eyebrow}</span>
            <h1>{story.title}</h1>
            <p className="story-identity-cn">{story.titleCn}</p>
            <p>{story.summary}</p>
          </div>

          <div className="story-frames">
            {story.images.map((image, index) => (
              <button
                className={`story-frame story-frame--${index} ${activeFrame === index ? "is-active" : ""}`}
                data-frame={index}
                type="button"
                aria-label={`聚焦第 ${index + 1} 张照片：${image.alt}`}
                aria-pressed={activeFrame === index}
                onPointerEnter={() => selectFrame(index)}
                onFocus={() => selectFrame(index)}
                onClick={() => selectFrame(index)}
                key={image.src}
              >
                <Image
                  className="story-frame-image"
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 820px) 88vw, 44vw"
                />
                <span>{(index + 1).toString().padStart(2, "0")}</span>
              </button>
            ))}
          </div>

          <div className="story-frame-caption-live" aria-live="polite" key={activeFrame}>
            <span>{(activeFrame + 1).toString().padStart(2, "0")} / {story.images.length.toString().padStart(2, "0")}</span>
            <p>{activeImage.caption}</p>
          </div>

          <Link className="story-next-current" href={`/photography/${nextStory.slug}`}>
            <span>Next current {nextStory.index}</span>
            <strong>{nextStory.title}</strong>
            <em>↗</em>
          </Link>
        </div>
      </section>

      <footer className="story-controls">
        <span>Wheel / arrows to refocus</span>
        <div className="story-frame-dots" aria-label="照片进度">
          {story.images.map((image, index) => (
            <button
              className={activeFrame === index ? "is-active" : ""}
              type="button"
              onClick={() => selectFrame(index)}
              aria-label={`查看第 ${index + 1} 张照片`}
              key={image.src}
            />
          ))}
        </div>
        <span>{story.depth}</span>
      </footer>
    </main>
  );
}
