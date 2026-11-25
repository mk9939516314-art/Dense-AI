import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const tones = ["var(--coral)", "var(--violet)", "var(--cyan)", "var(--mint)", "var(--amber)", "var(--blue)"];

export function Section({ id, className = "", children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`band ${className}`}>
      <div className="wrap">{children}</div>
    </section>
  );
}

export function SectionHeader({ heading, description }: { heading: string; description?: string }) {
  return (
    <div className="max-w-3xl">
      <h2 className="display-2">{heading}</h2>
      {description && <p className="lede mt-6">{description}</p>}
    </div>
  );
}

/** Page opener for inner pages: the same navy as the home hero, with a dot-field that echoes the point cloud. */
export function PageHead({
  title,
  description,
  back,
  children,
}: {
  title: string;
  description?: string;
  back?: { href: string; label: string };
  children?: ReactNode;
}) {
  return (
    <section className="page-head relative overflow-hidden bg-navy text-white">
      <div className="wrap relative pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-28">
        {back && (
          <Link href={back.href} className="mb-8 inline-flex items-center gap-2 text-[0.92rem] font-medium text-white/70 transition-colors hover:text-white">
            <ArrowLeft size={16} aria-hidden="true" />
            {back.label}
          </Link>
        )}
        <h1 className="display-2 max-w-[18ch] !text-white sm:!text-[clamp(2.4rem,5.4vw,4.4rem)]">{title}</h1>
        {description && <p className="lede mt-6 !text-white/70">{description}</p>}
        {children && <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">{children}</div>}
      </div>
    </section>
  );
}

export function RowList({ items }: { items: { title: string; description: string; href?: string }[] }) {
  return (
    <ul className="border-b border-line">
      {items.map((it, i) => {
        const inner = (
          <>
            <span className="mt-[0.55rem] h-3 w-3 shrink-0 rounded-[3px]" style={{ background: tones[i % tones.length] }} aria-hidden="true" />
            <span className="grid flex-1 gap-1 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-10">
              <span className="font-display text-[1.35rem] font-semibold leading-tight tracking-tight text-ink">{it.title}</span>
              <span className="text-[1rem] leading-relaxed text-body">{it.description}</span>
            </span>
          </>
        );
        return (
          <li key={it.title} className="border-t border-line">
            {it.href ? (
              <Link href={it.href} className="row-link flex gap-5 py-7">{inner}</Link>
            ) : (
              <div className="flex gap-5 py-7">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
