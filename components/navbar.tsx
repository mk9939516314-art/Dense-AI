"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { nav } from "@/lib/config";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [raised, setRaised] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const on = () => setRaised(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [open]);

  const current = (href: string) => !href.includes("#") && (path === href || path.startsWith(href + "/"));

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-300 ${raised || open ? "bg-[#020001]/85 backdrop-blur-xl" : "bg-transparent"}`}>
      <div className="wrap2 flex h-[88px] items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Dense AI home">
          <Image src="/logo-mark.png" alt="" width={72} height={64} priority className="h-8 w-auto" />
          <span className="whitespace-nowrap text-[1.15rem] font-semibold tracking-tight text-[var(--fg)]">Dense AI</span>
        </Link>

        <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} aria-current={current(item.href) ? "page" : undefined} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="chip hidden lg:inline-flex"><i aria-hidden="true" />taking new projects</span>
          <Link href="/contact" className="btn-lime btn-sm hidden sm:inline-flex">Start a project</Link>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line)] bg-white/5 md:hidden">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div id="mobile-nav" hidden={!open} className="h-[calc(100dvh-88px)] overflow-y-auto border-t border-[var(--line)] bg-[#020001]/95 md:hidden">
        <nav aria-label="Mobile" className="wrap2 flex flex-col py-6">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="border-b border-[var(--line)] py-5 text-[1.6rem] font-medium tracking-tight">{item.label}</Link>
          ))}
          <Link href="/contact" className="btn-lime mt-8">Start a project</Link>
        </nav>
      </div>
    </header>
  );
}
