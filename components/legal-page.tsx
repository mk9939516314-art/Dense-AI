import { ReactNode } from "react";
import { PageHead } from "@/components/section";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <PageHead title={title} description={`Last updated ${updated}.`} />
      <div className="wrap py-16 lg:py-24">
        <div className="max-w-[44rem] space-y-12">{children}</div>
      </div>
    </>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-[1.45rem] font-semibold tracking-tight text-ink">{heading}</h2>
      <div className="mt-3 space-y-3 text-[1rem] leading-[1.75] text-body [&_a]:font-medium [&_a]:text-blue [&_a]:underline [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">{children}</div>
    </section>
  );
}
