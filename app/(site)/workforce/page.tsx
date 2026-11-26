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
      <section className="border-t border-[var(--line)]">
        <div className="wrap2 py-16 lg:py-20">
          <h2 className="h-sec max-w-xl">From qualification to delivery</h2>
          <p className="copy mt-4">Projects can use defined instructions, training, task allocation, progress monitoring and quality checks before final delivery.</p>
          <ol className="mt-10 grid gap-px overflow-hidden rounded-[10px] border border-[var(--line)] bg-[var(--line)] sm:grid-cols-3 lg:grid-cols-6">
            {lifecycle.map((l, i) => (
              <li key={l} className="bg-white/[.03] px-5 py-6">
                <span className="font-mono text-[0.78rem] text-[var(--dim)]">{i + 1}</span>
                <p className="mt-6 text-[1.05rem] font-semibold text-[var(--fg)]">{l}</p>
              </li>
            ))}
          </ol>
          <Link href="/contact" className="btn-lime mt-10 w-fit">
            Discuss workforce requirements <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
