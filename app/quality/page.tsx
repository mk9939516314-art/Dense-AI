import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHead, RowList, Section } from "@/components/section";
import { qualityCards, qualitySteps } from "@/lib/config";

export const metadata: Metadata = { title: "Quality & Validation — Dense AI", description: "Project-specific quality control and validation workflows for AI data projects." };

export default function QualityPage() {
  return (
    <>
      <PageHead
        title="Quality is built into the workflow."
        description="Quality controls can be designed around the task, acceptance criteria and delivery requirements of each project."
      />
      <Section>
        <ol className="grid gap-px overflow-hidden rounded-[10px] border border-line bg-line sm:grid-cols-5">
          {qualitySteps.map((step) => (
            <li key={step.number} className="bg-paper px-5 py-6">
              <span className="font-mono text-[0.78rem] text-muted">{step.number}</span>
              <p className="mt-6 font-display text-[1.05rem] font-semibold leading-snug text-ink">{step.title}</p>
            </li>
          ))}
        </ol>
        <div className="mt-16">
          <RowList items={qualityCards} />
        </div>
        <Link href="/contact" className="btn btn-ink mt-12 w-fit">
          Discuss quality requirements <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </Section>
    </>
  );
}
