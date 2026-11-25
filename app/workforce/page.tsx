import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHead, RowList, Section } from "@/components/section";
import { workforcePillars } from "@/lib/config";

export const metadata: Metadata = { title: "Workforce — Dense AI", description: "Project-specific contributor qualification, training and managed human workflows from Dense AI." };

const lifecycle = ["Recruitment", "Qualification", "Training", "Task allocation", "Monitoring", "Quality control"];

export default function WorkforcePage() {
  return (
    <>
      <PageHead
        title="A managed human layer for AI data work."
        description="Workforce requirements can be shaped around skills, languages, qualification criteria and project-specific instructions."
      />
      <Section>
        <RowList items={workforcePillars} />
      </Section>
      <section className="border-t border-line bg-soft">
        <div className="wrap py-16 lg:py-20">
          <h2 className="display-3 max-w-xl">From qualification to delivery</h2>
          <p className="lede mt-4">Projects can use defined instructions, training, task allocation, progress monitoring and quality checks before final delivery.</p>
          <ol className="mt-10 grid gap-px overflow-hidden rounded-[10px] border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
            {lifecycle.map((l, i) => (
              <li key={l} className="bg-paper px-5 py-6">
                <span className="font-mono text-[0.78rem] text-muted">{i + 1}</span>
                <p className="mt-6 font-display text-[1.05rem] font-semibold text-ink">{l}</p>
              </li>
            ))}
          </ol>
          <Link href="/contact" className="btn btn-ink mt-10 w-fit">
            Discuss workforce requirements <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
