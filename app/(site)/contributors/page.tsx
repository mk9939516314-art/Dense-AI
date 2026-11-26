import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHead, Section } from "@/components/section";
import { site } from "@/lib/config";

export const metadata: Metadata = { title: "Contributors — Dense AI", description: "Join the Dense AI contributor network for appropriate data collection, annotation, evaluation and feedback tasks." };

export default function ContributorsPage() {
  return (
    <>
      <PageHead
        title="Contribute to human data projects for AI."
        description="Contributors may participate in appropriate data collection, annotation, evaluation, language and research or feedback tasks."
      >
        <a href={site.contributorWhatsApp} target="_blank" rel="noopener noreferrer" className="btn-lime">
          Become a Contributor <ArrowRight size={17} aria-hidden="true" />
        </a>
      </PageHead>
      <Section>
        <p className="max-w-xl border-l-[3px] border-[var(--lime)] pl-5 text-[1rem] leading-relaxed text-[var(--fg)]">
          Only join through an official Dense AI invitation link. Never share passwords, payment credentials or sensitive personal information in a contributor application.
        </p>
      </Section>
    </>
  );
}
