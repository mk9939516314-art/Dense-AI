import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHead, RowList, Section } from "@/components/section";
import { solutionTypes } from "@/lib/config";

export const metadata: Metadata = { title: "Solutions — Dense AI", description: "Human data solutions for training data, evaluation data, multimodal and language workflows." };

export default function SolutionsPage() {
  return (
    <>
      <PageHead
        title="Workflows around the data your AI system needs."
        description="Choose a workflow pattern and adapt it to your project's task, contributors, languages and quality requirements."
      />
      <Section>
        <RowList items={solutionTypes} />
        <div className="mt-16 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="h-sec">Need a different workflow?</h2>
            <p className="copy mt-3">Dense AI can shape a project-specific workflow instead of forcing the task into a fixed template.</p>
          </div>
          <Link href="/contact" className="btn-lime w-fit shrink-0">
            Tell us about it <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </Section>
    </>
  );
}
