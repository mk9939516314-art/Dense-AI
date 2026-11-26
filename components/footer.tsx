import Image from "next/image";
import Link from "next/link";
import { site, serviceDetails } from "@/lib/config";

const cols = [
  { title: "services", links: serviceDetails.slice(0, 5).map((s) => ({ label: s.title, href: `/services/${s.slug}` })) },
  { title: "learn", links: [{ label: "Workforce", href: "/workforce" }, { label: "Quality", href: "/quality" }, { label: "Solutions", href: "/solutions" }, { label: "FAQ", href: "/#faq" }] },
  { title: "company", links: [{ label: "About", href: "/about" }, { label: "Careers", href: "/careers" }, { label: "Contributors", href: "/contributors" }, { label: "Contact", href: "/contact" }] },
  { title: "legal", links: [{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }] },
];

export default function Footer() {
  return (
    <footer className="wrap2 pb-10 pt-6">
      <ul className="flex flex-col gap-3 border-b border-[var(--line)] pb-8 sm:flex-row sm:justify-between">
        {["pilot first, then scale", "human review on every batch", "workflows built around your task"].map((t) => (
          <li key={t} className="mono flex items-center gap-2"><span className="dot" aria-hidden="true" />{t}</li>
        ))}
      </ul>
      <div className="grid gap-12 py-14 lg:grid-cols-[1.1fr_2fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5" aria-label="Dense AI home">
            <Image src="/logo-mark.png" alt="" width={72} height={64} className="h-7 w-auto" />
            <span className="text-[1.05rem] font-semibold tracking-tight">Dense AI</span>
          </Link>
          <p className="copy-sm mt-5 max-w-[22rem]">{site.tagline} Collection, annotation, evaluation and quality workflows for AI teams.</p>
          <a href={`mailto:${site.email}`} className="mono mt-5 inline-block !text-[var(--mute)] hover:!text-[var(--lime)]">{site.email}</a>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {cols.map((c) => (
            <div key={c.title}>
              <p className="mono">{c.title}</p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.href}><Link href={l.href} className="text-[.9rem] text-[#aeb3a9] transition-colors hover:text-[var(--lime)]">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mono flex flex-col gap-2 border-t border-[var(--line)] pt-6 sm:flex-row sm:justify-between">
        <span>{new Date().getFullYear()}, all rights reserved</span>
        <span>human data infrastructure for ai</span>
      </div>
    </footer>
  );
}
