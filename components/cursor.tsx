"use client";

import { useEffect, useRef } from "react";

/** Follows the pointer with a ring that grows over interactive elements. Fine pointers only. */
export default function CursorRing() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = -100, y = -100, tx = -100, ty = -100, raf = 0;
    const move = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      el.classList.add("on");
      const t = e.target as HTMLElement | null;
      el.classList.toggle("hot", !!t?.closest("a,button,input,textarea,select,[role=button],label"));
    };
    const leave = () => el.classList.remove("on");
    const loop = () => {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2;
      el.style.transform = `translate3d(${x}px,${y}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", leave); };
  }, []);
  return <div ref={ref} className="cursor-ring" aria-hidden="true" />;
}
