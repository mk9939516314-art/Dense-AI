"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { nav } from "@/lib/config";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [raised, setRaised] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const on = () => setRaised(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const current = (href: string) => (href.startsWith("/#") || href.includes("#") ? false : path === href || path.startsWith(href + "/"));

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        raised || open ? "border-b border-line bg-paper/90 backdrop-blur-md" : "border-b border-transparent bg-paper/0"
      }`}
    >
      <div className="wrap flex h-[68px] items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Dense AI home">
          <Image src="/logo-mark.png" alt="" width={72} height={64} priority className="h-8 w-auto" />
          <span className="font-display text-[1.35rem] font-bold tracking-tight text-ink">
            Dense<span className="text-blue">AI</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current(item.href) ? "page" : undefined}
              className={`rounded-full px-3.5 py-2 text-[0.92rem] font-medium transition-colors hover:bg-ink/5 hover:text-ink ${
                current(item.href) ? "bg-ink/5 text-ink" : "text-body"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/#contact" className="btn btn-ink hidden !min-h-[2.6rem] !px-4 !py-2 !text-[0.9rem] md:inline-flex">
            Start a project <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 md:hidden"
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line bg-paper md:hidden"
      >
        <nav aria-label="Mobile" className="wrap flex flex-col py-3">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="border-b border-line py-4 font-display text-xl font-semibold text-ink last:border-0">
              {item.label}
            </Link>
          ))}
          <Link href="/#contact" className="btn btn-ink mt-4">
            Start a project <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
