"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, MousePointer2, Plus, Share2 } from "lucide-react";

const LOG = [
  { t: "09:41:02", n: "image batch 0142", m: "128 items" },
  { t: "09:38:57", n: "speech batch 0087", m: "64 clips" },
  { t: "09:31:14", n: "llm eval batch 0031", m: "40 prompts" },
  { t: "09:22:40", n: "text batch 0219", m: "310 rows" },
  { t: "09:18:05", n: "video batch 0012", m: "22 clips" },
];

export default function Hero() {
  const card = useRef<HTMLDivElement>(null);
  const [off, setOff] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setOff((o) => (o + 1) % LOG.length), 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = card.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mq = window.matchMedia("(min-width: 900px)");
    const on = (e: PointerEvent) => {
      if (!mq.matches) return;
      const x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
      el.style.transform = `perspective(1800px) rotateY(${-11 + x * 4}deg) rotateX(${3 - y * 4}deg) rotateZ(-.6deg)`;
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, []);

  const rows = [0, 1, 2].map((i) => LOG[(off + i) % LOG.length]);

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-[132px] lg:pb-20">
      <div className="wrap2 relative grid w-full items-center gap-14 lg:block">
        <div className="hero-copy relative z-10 max-w-[34rem]">
          <span className="chip"><i aria-hidden="true" />accepting pilots / 8 services</span>
          <h1 className="h-hero mt-9">
            Human data,<br />
            <span className="serif">built for AI.</span>
          </h1>
          <p className="copy mt-8">
            Dense AI collects, annotates and evaluates the human data your AI team needs, and only brings in a person where judgment matters.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/contact" className="btn-lime">Start a project</Link>
            <Link href="#how" className="btn-ghost"><Play size={13} fill="currentColor" aria-hidden="true" />See how a project runs</Link>
          </div>
          <p className="mono mt-7">pilot first / scoped to your task / no fixed template</p>
        </div>

        <div className="hero-card-wrap lg:absolute lg:right-[calc(-1*clamp(1.25rem,5.5vw,5rem)-9vw)] lg:top-1/2 lg:w-[min(58vw,820px)] lg:-translate-y-[46%]">
          <div ref={card} className="tilt glass hero-card overflow-hidden" aria-label="Illustrative project workflow">
            <div className="flex items-center gap-4 border-b border-[var(--line)] px-6 py-4 text-[.9rem]">
              <span className="text-[#b9bdb3]">Image batch 0142</span>
              <span className="h-4 w-px bg-[var(--line)]" aria-hidden="true" />
              <span className="mono !text-[#9a9f95]">4 stages / 1 review branch</span>
              <span className="mono ml-auto !text-[var(--lime)]">running</span>
            </div>

            <div className="relative px-6 pb-2 pt-5">
              <div className="absolute left-6 top-5 hidden flex-col gap-2 sm:flex">
                {[MousePointer2, Plus, Share2].map((I, i) => (
                  <span key={i} className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--line)] bg-white/[.04] text-[#9a9f95]"><I size={14} aria-hidden="true" /></span>
                ))}
              </div>
              <span className="mono absolute right-6 top-5 rounded-md border border-[var(--line)] px-2 py-1">100%</span>

              <div className="relative mx-auto mt-6 h-[19rem] w-full max-w-[44rem] sm:mt-0 sm:h-[20.5rem]">
                <svg viewBox="0 0 700 330" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="lg" x1="0" x2="1"><stop offset="0" stopColor="#BFF346" stopOpacity=".9" /><stop offset="1" stopColor="#BFF346" stopOpacity=".35" /></linearGradient>
                  </defs>
                  {["M160 165 C 210 165 215 80 262 80", "M160 165 C 210 165 215 250 262 250", "M420 80 C 480 80 480 150 530 150", "M420 250 C 480 250 480 150 530 150"].map((d, i) => (
                    <path key={i} d={d} stroke="url(#lg)" strokeWidth="1.4" className="flow" />
                  ))}
                  <circle r="3.5" fill="#BFF346" className="pulse"><animateMotion dur="3.6s" repeatCount="indefinite" path="M160 165 C 210 165 215 80 262 80 L 420 80 C 480 80 480 150 530 150" /></circle>
                </svg>
                <div className="node left-[1%] top-[40%]">Batch received<small>instructions v3</small></div>
                <div className="node left-[37%] top-[10%] min-w-[10.5rem]">Quality check<small>against gold set</small></div>
                <div className="node left-[37%] top-[64%] min-w-[10.5rem]">Send to review<small>second reviewer</small></div>
                <div className="node left-[75%] top-[34%]">Accepted<small>waiting on sign-off</small></div>
                <span className="node !px-2 !py-1 left-[24%] top-[27%] !text-[.7rem] font-mono !bg-black/60">pass</span>
                <span className="node !px-2 !py-1 left-[24%] top-[60%] !text-[.7rem] font-mono !bg-black/60">flag</span>
                <span className="mono node !px-2 !py-1 left-[75%] top-[60%] !border-[var(--line)]"><i className="dot mr-1.5" aria-hidden="true" />reviewing</span>
              </div>

              <div className="mt-3 border-t border-[var(--line)] py-4">
                <p className="mono mb-3">last batches</p>
                <ul className="space-y-2.5">
                  {rows.map((r, i) => (
                    <li key={r.t + r.n} className={`flex items-center gap-4 text-[.82rem] transition-opacity duration-700 ${i === 0 ? "opacity-100" : "opacity-60"}`}>
                      <span className={`dot ${i === 0 ? "" : "!bg-[#4b5043] !shadow-none"}`} aria-hidden="true" />
                      <span className="mono">{r.t}</span>
                      <span className="font-mono text-[#b9bdb3]">{r.n}</span>
                      <span className="mono ml-auto">{r.m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <p className="mono mt-4 lg:pl-6">illustrative workflow, not client data</p>
        </div>
      </div>
    </section>
  );
}
