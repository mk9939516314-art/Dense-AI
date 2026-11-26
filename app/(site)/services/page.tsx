import type { Metadata } from "next";
import { PageHead, RowList, Section } from "@/components/section";
import { serviceDetails } from "@/lib/config";

export const metadata: Metadata = { title: "AI Data Services — Dense AI", description: "Human data collection, annotation, multimodal, multilingual and AI evaluation workflows from Dense AI." };

export default function ServicesPage() {
  return (
    <>
      <PageHead
        title="Human data workflows for AI teams."
        description="Dense AI can design project-specific collection, annotation, evaluation and validation workflows around your requirements."
      />
      <Section>
        <RowList items={serviceDetails.map((s) => ({ title: s.title, description: s.description, href: `/services/${s.slug}` }))} />
      </Section>
    </>
  );
}
