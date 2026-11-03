"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PersonalMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("has-entered");
        observer.unobserve(entry.target);
      }
    }, { threshold: .12 });
    document.querySelectorAll("[data-enter]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
