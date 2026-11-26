import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const tones = ["var(--lime)", "#7fd4ff", "#e6f26b", "#9be7c4", "#c9d6ff", "var(--lime)"];

export function Section({ id, className = "", children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`sec !pt-8 ${className}`}>
      <div className="wrap2">{children}</div>
    </section>
  );
}

export function SectionHeader({ heading, description }: { heading: string; description?: string }) {
  return (
    <div className="max-w-3xl">
      <h2 className="h-sec">{heading}</h2>
      {description && <p className="copy mt-6">{description}</p>}
    </div>
  );
}

/** Inner page opener: floats over the same ribbon backdrop as the home hero. */
export function PageHead({ title, description, back, children }: { title: string; description?: string; back?: { href: string; label: string }; children?: ReactNode }) {
  return (
    <section className="relative pb-10 pt-[168px] sm:pt-[188px]">
      <div className="wrap2">
        {back && (
          <Link href={back.href} className="mono mb-8 inline-flex items-center gap-2 transition-colors hover:!text-[var(--lime)]">
            <ArrowLeft size={14} aria-hidden="true" />{back.label}
          </Link>
        )}
        <h1 className="h-hero max-w-[16ch]">{title}</h1>
        {description && <p className="copy mt-7">{description}</p>}
        {children && <div className="mt-9 flex flex-wrap items-center gap-3">{children}</div>}
      </div>
    </section>
  );
}

export function RowList({ items }: { items: { title: string; description: string; href?: string }[] }) {
  return (
    <ul className="glass divide-y divide-[var(--line)] overflow-hidden !rounded-[24px]">
      {items.map((it, i) => {
        const inner = (
          <>
            <span className="mt-[.6rem] h-2 w-2 shrink-0 rounded-full" style={{ background: tones[i % tones.length], boxShadow: `0 0 12px ${tones[i % tones.length]}` }} aria-hidden="true" />
            <span className="grid flex-1 gap-2 md:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] md:gap-10">
              <span className="text-[1.25rem] font-medium tracking-[-0.015em]">{it.title}</span>
              <span className="copy-sm !text-[1rem]">{it.description}</span>
            </span>
          </>
        );
        return (
          <li key={it.title}>
            {it.href ? (
              <Link href={it.href} className="flex gap-5 px-6 py-7 transition-colors hover:bg-white/[.04] sm:px-8">{inner}</Link>
            ) : (
              <div className="flex gap-5 px-6 py-7 sm:px-8">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
