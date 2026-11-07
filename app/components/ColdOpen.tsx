"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "sitename-cold-open";

function canPlayColdOpen() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return false;
  } catch {
    return false;
  }
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");
    return Boolean(gl);
  } catch {
    return false;
  }
}

function rememberColdOpen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* Private mode can block storage. The open still ends. */
  }
}

export default function ColdOpen() {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (!canPlayColdOpen()) return;
    setPlay(true);
  }, []);

  useEffect(() => {
    if (!play) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stopForMotion = () => {
      if (!media.matches) return;
      rememberColdOpen();
      setPlay(false);
    };
    media.addEventListener("change", stopForMotion);
    return () => {
      document.body.style.overflow = previous;
      media.removeEventListener("change", stopForMotion);
    };
  }, [play]);

  function end() {
    rememberColdOpen();
    setPlay(false);
  }

  if (!play) return null;

  return (
    <div
      className="cold-open"
      role="dialog"
      aria-modal="true"
      aria-label="开场"
      onAnimationEnd={(event) => {
        if (event.animationName === "cold-field") end();
      }}
    >
      <button type="button" className="cold-skip" onClick={end}>
        Skip
      </button>
      <div className="cold-figure" aria-hidden="true">
        <svg viewBox="0 0 200 280">
          <path d="M18 268c22-62 48-84 82-84s60 22 82 84" fill="var(--bg)" />
          <rect x="86" y="156" width="28" height="36" fill="var(--bg)" />
          <ellipse cx="100" cy="104" rx="48" ry="58" fill="var(--bg)" />
          <path d="M68 108h24M108 108h24" fill="none" stroke="var(--deep)" strokeWidth="2" />
          <g className="eyes-open">
            <ellipse cx="80" cy="104" rx="6" ry="3.5" fill="var(--deep)" />
            <ellipse cx="120" cy="104" rx="6" ry="3.5" fill="var(--deep)" />
          </g>
        </svg>
        <span className="cold-mark">示意</span>
      </div>
    </div>
  );
}
