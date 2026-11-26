import { ReactNode } from "react";
import { PageHead } from "@/components/section";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <PageHead title={title} description={`Last updated ${updated}.`} />
      <div className="wrap2 pb-28 pt-6">
        <div className="glass glass-pad prose-d max-w-[46rem] !p-8 sm:!p-10">{children}</div>
      </div>
    </>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2>{heading}</h2>
      {children}
    </section>
  );
}
