"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Clock, Lock, Pause, ArrowRight } from "lucide-react";
import { pilotSteps, securityCards } from "@/lib/config";

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** true once the element has entered the viewport */
function useSeen<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced() || !("IntersectionObserver" in window)) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

/* ---------- data types strip ---------- */
const TYPES = [
  { c: "IM", l: "image" }, { c: "VD", l: "video" }, { c: "AU", l: "audio" },
  { c: "TX", l: "text" }, { c: "ML", l: "multilingual" }, { c: "EV", l: "llm eval" },
];

export function DataTypes() {
  const [i, setI] = useState(1);
  useEffect(() => {
    if (reduced()) return;
    const id = setInterval(() => setI((n) => (n + 1) % TYPES.length), 1700);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="wrap2 pb-10 pt-4 sm:pt-10">
      <p className="mono rv">works across image, video, audio, text, and every language your model speaks</p>
      <ul className="rv mt-8 grid grid-cols-3 gap-y-8 sm:grid-cols-6">
        {TYPES.map((t, k) => (
          <li key={t.c} className="relative">
            <span className={`tile ${k === i ? "on" : ""}`} aria-hidden="true">{t.c}</span>
            <span className="mono mt-3 block">{t.l}</span>
            {k < TYPES.length - 1 && (
              <span className="absolute left-[4.6rem] top-[1.85rem] hidden h-px w-[calc(100%-5.4rem)] border-t border-dotted border-[#3a3e36] sm:block" aria-hidden="true">
                {k === i && <span className="dot absolute -top-[3px] left-0 animate-[travel_1.7s_linear_infinite]" />}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- feature 1: run timeline ---------- */
export function RunTimeline() {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const rows = [
    { l: "qualify contributors", from: 0, w: 38, ok: true, r: "day 1" },
    { l: "label items", from: 14, w: 58, ok: true, r: "day 2" },
    { l: "second review", from: 60, w: 22, ok: true, r: "day 3" },
    { l: "final validation", from: 78, w: 14, ok: false, r: "on Dana" },
  ];
  return (
    <div ref={ref} className="glass glass-pad">
      <div className="flex justify-between font-mono text-[.8rem]"><span className="mono-fg">batch 0142</span><span className="mono">accepted after review</span></div>
      <ul className="mt-7 space-y-5">
        {rows.map((r, i) => (
          <li key={r.l} className="grid grid-cols-[minmax(0,10.5rem)_1fr_4rem] items-center gap-3 font-mono text-[.78rem]">
            <span className="flex items-center gap-2 text-[#d4d8cd]">{r.ok ? <Check size={14} className="text-[var(--lime)]" aria-hidden="true" /> : <Clock size={14} className="text-[#8b9086]" aria-hidden="true" />}{r.l}</span>
            <span className="relative h-3">
              <span
                className={`absolute inset-y-0 rounded-[4px] origin-left transition-transform duration-[1100ms] ease-out ${r.ok ? (i === 0 ? "bg-[var(--lime)]" : "bg-[#d9ddd0]") : "bg-[repeating-linear-gradient(90deg,#5B8CFF_0_2px,transparent_2px_4px)]"}`}
                style={{ left: `${r.from}%`, width: `${r.w}%`, transform: seen ? "scaleX(1)" : "scaleX(0)", transitionDelay: `${i * 140}ms` }}
              />
            </span>
            <span className="mono text-right">{r.r}</span>
          </li>
        ))}
      </ul>
      <div className="mono ml-[11.5rem] mt-6 hidden justify-between pr-16 sm:flex"><span>0</span><span>25</span><span>50</span><span>75</span><span>100 % of batch</span></div>
    </div>
  );
}

/* ---------- feature 2: review card ---------- */
export function ReviewCard() {
  const [state, setState] = useState<"open" | "accepted" | "held">("open");
  return (
    <div className="glass glass-pad">
      <div className="flex justify-between text-[.85rem]"><span className="font-medium">#review</span><span className="mono">today</span></div>
      <div className="mt-6 flex items-start gap-3">
        <Image src="/logo-mark.png" alt="" width={72} height={64} className="mt-0.5 h-7 w-auto" />
        <div className="min-w-0 flex-1">
          <div className="flex justify-between text-[.85rem]"><span className="font-medium">Dense AI</span><span className="mono">9:41</span></div>
          <p className="mt-1 text-[.95rem] text-[#c9cdc2]">“Orion scanner” was tagged ORG. A reviewer thinks it is a PRODUCT. Accept the change?</p>
          <dl className="mt-4 space-y-1.5 border-l-2 border-[var(--lime)] pl-4 text-[.9rem]">
            {[["item", "img_0412.jpg"], ["label", "ORG → PRODUCT"], ["rule", "below agreement, needs a human"]].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[5rem_1fr] gap-2"><dt className="mono !text-[.72rem]">{k}</dt><dd className="text-[#e5e8de]">{v}</dd></div>
            ))}
          </dl>
          <div className="mt-5 flex items-center gap-3" aria-live="polite">
            {state === "open" ? (
              <>
                <button type="button" onClick={() => setState("accepted")} className="btn-lime btn-sm !h-10 !gap-1.5 !rounded-lg !px-4"><Check size={15} aria-hidden="true" />Accept</button>
                <button type="button" onClick={() => setState("held")} className="btn-ghost btn-sm !h-10 !gap-1.5 !rounded-lg !px-4"><Pause size={13} aria-hidden="true" />Hold</button>
              </>
            ) : (
              <>
                <span className={`inline-flex items-center gap-2 text-[.9rem] ${state === "accepted" ? "text-[var(--lime)]" : "text-[#c9cdc2]"}`}>
                  {state === "accepted" ? <Check size={16} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
                  {state === "accepted" ? "Accepted. Label is now PRODUCT." : "On hold. Nothing changes until you decide."}
                </span>
                <button type="button" onClick={() => setState("open")} className="mono underline underline-offset-4 hover:!text-[var(--lime)]">undo</button>
              </>
            )}
            <span className="mono ml-auto hidden sm:block">{state === "open" ? "waiting 26 min" : "decided just now"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- feature 3: isometric bars ---------- */
export function IsoBars() {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const days = ["mon", "tue", "wed", "thu", "fri", "sat"];
  const hs = [58, 88, 112, 138, 166, 186];
  const a = 40, b = 20, yb = 232;
  return (
    <div ref={ref} className="glass glass-pad">
      <div className="flex gap-6 font-mono text-[.78rem]"><span className="mono">labels reviewed per weekday</span><span className="text-[#c9cdc2]">illustrative</span></div>
      <svg viewBox="0 0 700 300" className="mt-2 w-full" role="img" aria-label="Isometric bar chart of labels reviewed per weekday, illustrative">
        <defs>
          <linearGradient id="gl" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#2b2c27" /><stop offset="1" stopColor="#17181a" /></linearGradient>
          <linearGradient id="gr" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3a3b35" /><stop offset="1" stopColor="#1f2021" /></linearGradient>
        </defs>
        <line x1="20" x2="680" y1={yb + b + 16} y2={yb + b + 16} stroke="rgba(255,255,255,.06)" />
        {days.map((d, i) => {
          const cx = 70 + i * 112;
          const h = hs[i];
          const last = i === days.length - 1;
          const [L, R, T] = last ? ["#2a49c9", "#4f7bff", "#7fe3f0"] : ["url(#gl)", "url(#gr)", "#3b3c36"];
          const pts = (arr: number[][]) => arr.map((p) => p.join(",")).join(" ");
          return (
            <g key={d}>
              <g style={{ transformBox: "fill-box", transformOrigin: "50% 100%", transform: seen ? "scaleY(1)" : "scaleY(0.02)", transition: `transform 1000ms cubic-bezier(.2,.7,.2,1) ${i * 110}ms` }}>
                <polygon points={pts([[cx - a, yb - h], [cx, yb - h + b], [cx, yb + b], [cx - a, yb]])} fill={L} />
                <polygon points={pts([[cx, yb - h + b], [cx + a, yb - h], [cx + a, yb], [cx, yb + b]])} fill={R} />
                <polygon points={pts([[cx, yb - h - b], [cx + a, yb - h], [cx, yb - h + b], [cx - a, yb - h]])} fill={T} />
              </g>
              <g style={{ opacity: seen ? 1 : 0, transition: `opacity 600ms ${600 + i * 110}ms` }}>
                <polygon points={pts([[cx, yb - h - b - 42], [cx + a * 0.8, yb - h - 42], [cx, yb - h + b * 0.8 - 42], [cx - a * 0.8, yb - h - 42]])} fill={last ? "rgba(91,140,255,.35)" : i === 4 ? "rgba(255,255,255,.12)" : "rgba(235,238,230,.82)"} />
              </g>
              <text x={cx} y={yb + b + 38} textAnchor="middle" className="fill-[#666b62]" style={{ font: "12px var(--font-mono)" }} fill={last ? "#5B8CFF" : undefined}>{d}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ---------- lime statement panel (scroll-driven) ---------- */
export function LimePanel() {
  const wrap = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const t1 = useRef<HTMLSpanElement>(null);
  const t2 = useRef<HTMLSpanElement>(null);
  const t3 = useRef<HTMLSpanElement>(null);
  const icon = useRef<HTMLDivElement>(null);
  const lab = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const w = wrap.current, p = panel.current;
    if (!w || !p) return;
    const still = reduced();
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    const seg = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const upd = () => {
      const r = w.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const sp = still ? 1 : clamp(-r.top / Math.max(1, total));
      const open = still ? 1 : ease(seg(window.innerHeight - r.top, window.innerHeight * 0.15, window.innerHeight * 1.25));
      const inset = (1 - open) * 9 + 0.2; // vw
      p.style.marginInline = `${inset}vw`;
      p.style.borderRadius = `${46 - open * 14}px`;
      p.style.minHeight = `${58 + open * 14}vh`;
      const tr = still ? 1 : clamp(seg(open, 0.6, 1) * 0.4 + sp * 1.1);
      if (lab.current) { lab.current.style.opacity = String(seg(tr, 0, 0.3)); }
      if (t1.current) { t1.current.style.opacity = String(seg(tr, 0.05, 0.4)); t1.current.style.filter = `blur(${(1 - seg(tr, 0.05, 0.4)) * 10}px)`; }
      const s2 = ease(seg(tr, 0.3, 0.7));
      if (t2.current) { t2.current.style.opacity = String(s2); t2.current.style.transform = `translateX(${(1 - s2) * -70}px)`; t2.current.style.filter = `blur(${(1 - s2) * 8}px)`; }
      if (t3.current) { const s3 = seg(tr, 0.4, 0.8); t3.current.style.opacity = String(s3); t3.current.style.filter = `blur(${(1 - s3) * 8}px)`; }
      if (icon.current) { const s4 = ease(seg(tr, 0.6, 1)); icon.current.style.opacity = String(s4); icon.current.style.transform = `scale(${0.6 + s4 * 0.4})`; }
    };
    upd();
    window.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    return () => { window.removeEventListener("scroll", upd); window.removeEventListener("resize", upd); };
  }, []);

  return (
    <div ref={wrap} className="relative h-[190vh] max-md:h-[150vh]">
      <div className="sticky top-0 grid h-screen place-items-center overflow-hidden">
        <div ref={panel} className="lime relative grid w-full place-items-center px-6 text-center" style={{ marginInline: "9vw", borderRadius: 46, minHeight: "58vh" }}>
          <div className="max-w-[54rem] py-16">
            <p ref={lab} className="font-mono text-[.78rem] text-white/80">[ what we are actually delivering ]</p>
            <h2 className="mt-8 text-[clamp(2.1rem,4.4vw,3.9rem)] font-semibold leading-[1.1] tracking-[-0.035em]">
              <span ref={t1} className="block">The best dataset is the one</span>
              <span ref={t2} className="serif inline-block text-[1.12em] leading-[1] text-white">nobody has to</span>{" "}
              <span ref={t3} className="inline-block">re-label.</span>
            </h2>
            <div ref={icon} className="mx-auto mt-10 grid h-[4.75rem] w-[4.75rem] place-items-center rounded-[22px] bg-[#0a0c06] shadow-[0_20px_50px_-15px_rgba(0,0,0,.5)]">
              <Image src="/logo-mark.png" alt="Dense AI" width={72} height={64} className="h-9 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- careful: two cards ---------- */
export function HubCard() {
  const sats = [{ c: "IM", l: "image", x: "6%", y: "12%" }, { c: "AU", l: "audio", x: "78%", y: "6%" }, { c: "TX", l: "text", x: "0%", y: "62%" }, { c: "ML", l: "language", x: "84%", y: "58%" }];
  return (
    <div className="glass glass-pad flex flex-col">
      <h3 className="h-card">One team, every data type</h3>
      <p className="copy-sm mt-3 max-w-[30rem]">Dense AI holds the instructions, training and review process, so a task behaves the same on an image label as on a language judgment.</p>
      <p className="mono mt-8">one process, every data type</p>
      <div className="relative mx-auto mt-6 h-[15rem] w-full max-w-[28rem]">
        <svg viewBox="0 0 400 240" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
          {[[60, 50], [330, 40], [40, 160], [350, 150]].map(([x, y], i) => (
            <line key={i} x1="200" y1="120" x2={x} y2={y} stroke="rgba(255,255,255,.12)" strokeDasharray="2 5" />
          ))}
        </svg>
        <div className="absolute left-1/2 top-1/2 grid h-[5.5rem] w-[5.5rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[26px] bg-[var(--lime)] shadow-[0_0_70px_-8px_rgba(91,140,255,.55)]">
          <Image src="/logo-mark.png" alt="" width={72} height={64} className="h-10 w-auto" />
        </div>
        {sats.map((s) => (
          <div key={s.c} className="absolute text-center" style={{ left: s.x, top: s.y }}>
            <span className="tile !h-11 !w-11 !rounded-full" aria-hidden="true">{s.c}</span>
            <span className="mono mt-1.5 block">{s.l}</span>
          </div>
        ))}
      </div>
      <p className="mono mt-4">instructions, training, review, delivery</p>
    </div>
  );
}

export function ScopeCard() {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const rows = securityCards.slice(0, 3);
  return (
    <div ref={ref} className="glass glass-pad flex flex-col">
      <h3 className="h-card">Access stays inside the project</h3>
      <p className="copy-sm mt-3 max-w-[30rem]">Access, roles and delivery are scoped per project, and datasets leave through channels you agree on.</p>
      <p className="mono mt-8">how a project is scoped</p>
      <ul className="mt-5 divide-y divide-[var(--line)]">
        {rows.map((r, i) => (
          <li key={r.title} className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 py-4 sm:grid-cols-[minmax(0,13rem)_1fr]">
            <div>
              <p className="font-mono text-[.85rem] text-[#e5e8de]">{r.title.toLowerCase()}</p>
              <p className="mono mt-1 !normal-case">{r.description}</p>
            </div>
            <span className="relative col-span-2 h-1.5 rounded-full bg-white/[.07] sm:col-span-1">
              <span className="absolute inset-y-0 left-0 rounded-full bg-[var(--lime)] transition-[width] duration-[1200ms] ease-out" style={{ width: seen ? "100%" : "0%", transitionDelay: `${i * 160}ms`, opacity: i === 0 ? 1 : 0.55 }} />
              <span className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[var(--lime)] shadow-[0_0_14px_rgba(91,140,255,.7)] transition-[left] duration-[1200ms] ease-out" style={{ left: seen ? "calc(100% - 12px)" : "0%", transitionDelay: `${i * 160}ms` }} />
            </span>
          </li>
        ))}
      </ul>
      <p className="mono mt-auto flex items-center gap-2 pt-6"><Lock size={13} aria-hidden="true" />a project&apos;s data stays in the workflow it belongs to</p>
    </div>
  );
}

/* ---------- a project week ---------- */
const LAND = [
  [0.22, 0.3, 0.12, 0.17, -20], [0.37, 0.13, 0.04, 0.05, 0], [0.3, 0.68, 0.06, 0.15, 15], [0.52, 0.28, 0.06, 0.07, 0],
  [0.53, 0.55, 0.075, 0.16, 0], [0.7, 0.32, 0.17, 0.15, -10], [0.68, 0.48, 0.035, 0.07, 0], [0.84, 0.7, 0.06, 0.05, 0],
];
function DotMap() {
  const dots = useMemo(() => {
    const out: { x: number; y: number }[] = [];
    for (let y = 0.04; y < 0.96; y += 0.035) for (let x = 0.03; x < 0.97; x += 0.02) {
      const inside = LAND.some(([cx, cy, rx, ry, deg]) => {
        const r = (deg * Math.PI) / 180, dx = x - cx, dy = y - cy;
        const u = dx * Math.cos(r) + dy * Math.sin(r), v = -dx * Math.sin(r) + dy * Math.cos(r);
        return (u * u) / (rx * rx) + (v * v) / (ry * ry) <= 1;
      });
      if (inside) out.push({ x: x * 300, y: y * 150 });
    }
    return out;
  }, []);
  return (
    <svg viewBox="0 0 300 150" className="mt-3 w-full" aria-hidden="true">
      {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r="1.35" fill={i % 53 === 0 ? "#5B8CFF" : "#4a4e45"} />)}
    </svg>
  );
}

export function ProjectWeek() {
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const hours = ["09", "11", "13", "15"];
  const [hot, setHot] = useState<[number, number]>([1, 2]);
  const [ref, seen] = useSeen<HTMLDivElement>();
  const fill = (d: number, h: number) => (d > 4 ? 0.2 : ((d * 7 + h * 11) % 9) / 9 * 0.8 + 0.2);
  const C = 2 * Math.PI * 52;
  return (
    <div ref={ref} className="mt-14 grid gap-5 lg:grid-cols-3">
      <div className="glass glass-pad lg:col-span-2">
        <div className="flex items-center justify-between">
          <span className="mono">this week, batch by batch</span>
          <span className="chip !py-1.5"><Clock size={13} aria-hidden="true" />next review in 12 min</span>
        </div>
        <div className="mt-6 grid grid-cols-[1.75rem_repeat(7,1fr)] gap-x-2.5 gap-y-2" role="img" aria-label="Weekly activity grid, illustrative">
          {[0, 1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="contents">
              <span className="mono self-center">{row % 2 === 0 ? hours[row / 2] : ""}</span>
              {days.map((d, di) => {
                const on = hot[0] === di && hot[1] === row;
                return (
                  <button key={d} type="button" tabIndex={-1} aria-hidden="true" onMouseEnter={() => setHot([di, row])}
                    className="h-[1.05rem] rounded-[4px] transition-[background-color,opacity,box-shadow] duration-300"
                    style={{ background: on ? "#5B8CFF" : `rgba(255,255,255,${(0.04 + fill(di, row) * 0.12).toFixed(3)})`, boxShadow: on ? "0 0 22px rgba(91,140,255,.5)" : "none" }} />
                );
              })}
            </div>
          ))}
          <span />
          {days.map((d, i) => <span key={d} className={`mono text-center ${hot[0] === i ? "!text-[var(--fg)]" : ""}`}>{d}</span>)}
        </div>
      </div>

      <div className="glass glass-pad flex flex-col items-center justify-center text-center">
        <span className="mono self-start">hands off</span>
        <svg viewBox="0 0 120 120" className="mt-3 h-36 w-36" aria-hidden="true">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.09)" strokeWidth="6" />
          <circle cx="60" cy="60" r="52" fill="none" stroke="#5B8CFF" strokeWidth="6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={seen ? C * 0.18 : C} transform="rotate(-90 60 60)" style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(.2,.7,.2,1)" }} />
          <text x="60" y="68" textAnchor="middle" fill="#EEF0EA" style={{ font: "500 26px var(--font-sans)" }}>82%</text>
        </svg>
        <p className="copy-sm mt-3">of labels accepted on the first review</p>
      </div>

      <div className="glass glass-pad">
        <span className="mono">waiting on people</span>
        <div className="mt-5 flex">
          {["AK", "PR", "SM", "RJ", "NT"].map((n, i) => (
            <span key={n} className="-ml-2 grid h-11 w-11 place-items-center rounded-full border-2 border-[#0b0c08] text-[.75rem] font-medium first:ml-0" style={{ background: ["#2c3a12", "#1d2f3a", "#3a2a1d", "#2a1d3a", "#1d3a2f"][i], color: "#dfe8c8" }}>{n}</span>
          ))}
        </div>
        <p className="mt-5 text-[2.2rem] font-medium leading-none text-[var(--lime)]">3</p>
        <p className="mono mt-2">longest wait: 26 minutes, in #review</p>
      </div>
      <div className="glass glass-pad">
        <span className="mono">disagreements and resolutions</span>
        <svg viewBox="0 0 300 100" className="mt-4 w-full" fill="none" aria-hidden="true">
          <path d="M0 55 C 40 5, 80 5, 110 50 S 180 95, 220 50 S 270 10, 300 40" stroke="#5B8CFF" strokeWidth="2.2" strokeDasharray="520" strokeDashoffset={seen ? 0 : 520} style={{ transition: "stroke-dashoffset 2s ease-out" }} />
          <path d="M0 45 C 40 90, 80 90, 110 50 S 180 5, 220 50 S 270 90, 300 60" stroke="#6a6e64" strokeWidth="2" />
        </svg>
        <div className="mono mt-2 flex gap-5"><span className="flex items-center gap-2"><span className="dot" />flagged</span><span className="flex items-center gap-2"><span className="dot !bg-[#6a6e64] !shadow-none" />resolved</span></div>
      </div>
      <div className="glass glass-pad">
        <span className="mono">where contributors work</span>
        <DotMap />
      </div>
    </div>
  );
}

/* ---------- numbers ---------- */
function Count({ to, seen }: { to: number; seen: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (reduced()) { setV(to); return; }
    const t0 = performance.now(); let raf = 0;
    const tick = (t: number) => { const k = Math.min(1, (t - t0) / 1400); setV(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return <>{v}</>;
}

export function Numbers({ values }: { values: { label: string; n: number; text: string }[] }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  return (
    <div ref={ref} className="mt-16 grid gap-12 border-t border-[var(--line)] pt-10 md:grid-cols-3 md:gap-8">
      {values.map((v, i) => (
        <div key={v.label}>
          <p className="mono">{v.label}</p>
          <p className="mt-4 text-[clamp(3rem,5vw,4.2rem)] font-medium leading-none tracking-[-0.04em]"><Count to={v.n} seen={seen} /></p>
          <p className="copy-sm mt-3 max-w-[18rem]">{v.text}</p>
          <div className="mt-7 flex h-14 items-end gap-1.5" aria-hidden="true">
            {Array.from({ length: v.n }).map((_, k) => (
              <span key={k} className="w-full max-w-[1.9rem] rounded-[4px] bg-[linear-gradient(180deg,#d4ff6a,#8fbb22)] transition-[height,opacity] duration-700" style={{ height: seen ? `${i === 0 ? 38 + (k % 3) * 8 : 100 - k * (i === 1 ? 14 : 18)}%` : "6%", opacity: seen ? 1 : 0.3, transitionDelay: `${k * 70}ms` }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- pilot picker ---------- */
const MARKS = [1000, 10000, 100000, 1000000];
export function PilotPicker() {
  const [v, setV] = useState(36); // 0..100, log scale
  const items = Math.round(Math.pow(10, 3 + (v / 100) * 3) / 100) * 100;
  const tier = items < 8000 ? 0 : items < 120000 ? 1 : 2;
  const tiers = [
    { name: "Pilot", sub: "a controlled first workflow", pts: ["Define the task, data and quality bar", pilotSteps[1].description.replace(/\.$/, ""), "Review instructions and output with you", "Decide on scale from real results"], cta: "Start a pilot", href: "/contact" },
    { name: "Production", sub: "scaled once requirements are validated", pts: ["Qualified, trained contributors", "Project managers monitoring progress", "Multi-stage human review", "Delivery through agreed channels"], cta: "Start a project", href: "/contact" },
    { name: "Program", sub: "several workflows, ongoing", pts: ["Multiple data types in parallel", "Multilingual and regional teams", "Quality audits across batches", "A project manager for the program"], cta: "Talk to us", href: "/contact" },
  ];
  const fmt = (n: number) => n.toLocaleString("en-US");
  return (
    <div className="mt-14">
      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        <div className="glass glass-pad">
          <label htmlFor="size" className="text-[1.05rem]">How big is the first batch you have in mind?</label>
          <input id="size" type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} className="rng mt-10" style={{ ["--v" as string]: `${v}%` }} aria-valuetext={`${fmt(items)} items`} />
          <div className="mono relative mt-4 flex justify-between"><span>1,000</span><span>10,000</span><span>100,000</span><span>1,000,000 items</span></div>
        </div>
        <div className="glass glass-pad">
          <p className="mono">we would suggest</p>
          <p className="mt-2 text-[2.1rem] font-medium leading-none tracking-[-0.03em]">{tiers[tier].name}</p>
          <p className="mono mt-3">about {fmt(items)} items to start</p>
          <Link href="/contact" className="btn-lime mt-5 w-full">Start a project</Link>
        </div>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {tiers.map((t, i) => (
          <div key={t.name} className={`glass glass-pad flex flex-col transition-[border-color,box-shadow] duration-500 ${i === tier ? "!border-[rgba(91,140,255,.45)] shadow-[0_0_80px_-30px_rgba(91,140,255,.5)]" : ""}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="mono">{t.name.toLowerCase()}</p>
                <p className="mt-3 text-[1.55rem] font-medium leading-tight tracking-[-0.02em]">{t.sub}</p>
              </div>
              {i === tier && <span className="rounded-md bg-[var(--lime)] px-2 py-1 font-mono text-[.7rem] text-white">suggested</span>}
            </div>
            <ul className="mt-7 space-y-3 text-[.92rem] text-[#c4c8bd]">
              {t.pts.map((p) => <li key={p} className="flex gap-3"><Check size={15} className="mt-1 shrink-0 text-[#8b9086]" aria-hidden="true" />{p}</li>)}
            </ul>
            <Link href={t.href} className={`mt-9 ${i === tier ? "btn-lime" : "btn-ghost"} w-full`}>{t.cta}<ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        ))}
      </div>
    </div>
  );
}
