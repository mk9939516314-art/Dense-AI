import type { Metadata } from "next";
import { PageHead, Section } from "@/components/section";
import { FounderCard } from "@/components/founder-card";
import { founders } from "@/lib/config";

export const metadata: Metadata = {
  title: "About Dense AI",
  description: "Meet the Dense AI founding team and learn how the company approaches human data infrastructure.",
};

const linkedin: Record<string, string> = {
  "Anikesh Aman": "https://www.linkedin.com/in/anikesh-aman-527404210/",
  Arpita: "https://www.linkedin.com/in/arpita-dwivedi-5a21213a5",
};

export default function AboutPage() {
  return (
    <>
      <PageHead
        title="Human operations for the data layer behind AI."
        description="Dense AI focuses on the people, workflows and quality systems required to produce useful human data for AI teams."
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-20">
          <p className="text-[1.15rem] leading-relaxed text-ink">
            The operating model is built around project-specific requirements rather than one fixed workforce or annotation recipe.
          </p>
          <p className="text-[1.15rem] leading-relaxed text-body">
            Projects can move from a controlled pilot into larger production after instructions, contributor requirements and quality checks have been validated.
          </p>
        </div>
      </Section>
      <section id="founders" className="border-t border-line bg-soft">
        <div className="wrap py-20 lg:py-28">
          <h2 className="display-2 max-w-3xl">Leadership across technology, operations and business.</h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {founders.map((f) => (
              <FounderCard key={f.name} {...f} href={linkedin[f.name] ?? "https://www.linkedin.com/in/dishaprajapat"} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
