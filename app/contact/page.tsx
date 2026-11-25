import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHead, Section } from "@/components/section";
import { ProjectForm } from "@/components/project-form";
import { site } from "@/lib/config";

export const metadata: Metadata = { title: "Contact Dense AI", description: "Share your AI data project requirements with Dense AI." };

export default function ContactPage() {
  return (
    <>
      <PageHead
        title="Tell us what your AI team needs."
        description="Share your data type, volume, languages, timeline and quality requirements. We can discuss a workflow around the project."
      >
        <a href={`mailto:${site.email}`} className="link-u inline-flex w-fit items-center gap-1.5 text-[1.02rem] font-semibold text-white">
          {site.email} <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </PageHead>
      <Section>
        <div className="max-w-3xl">
          <ProjectForm />
        </div>
      </Section>
    </>
  );
}
