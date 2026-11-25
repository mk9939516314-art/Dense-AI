import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/lib/config";

const more = [
  { label: "Solutions", href: "/solutions" },
  { label: "Careers", href: "/careers" },
  { label: "Contributors", href: "/contributors" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white/70">
      <div className="wrap py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/logo-mark.png" alt="" width={72} height={64} className="h-8 w-auto" />
              <span className="font-display text-2xl font-bold tracking-tight text-white">Dense<span className="text-[#6C86FF]">AI</span></span>
            </div>
            <p className="mt-4 max-w-xs text-[0.95rem] leading-relaxed text-white/60">{site.tagline}</p>
            <a href={`mailto:${site.email}`} className="link-u mt-6 inline-block text-[0.95rem] font-medium text-white">
              {site.email}
            </a>
          </div>

          <FooterList title="Company" items={nav.map((n) => ({ label: n.label, href: n.href }))} />
          <FooterList title="More" items={more} />
          <div>
            <h2 className="font-sans text-sm font-semibold text-white">Elsewhere</h2>
            <ul className="mt-4 space-y-3 text-[0.95rem]">
              <li>
                <a href="https://www.linkedin.com/company/densee-ai/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                  LinkedIn <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a href={site.contributorWhatsApp} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                  Contributor group <span aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Dense AI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="font-sans text-sm font-semibold text-white">{title}</h2>
      <ul className="mt-4 space-y-3 text-[0.95rem]">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="transition-colors hover:text-white">{i.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
