import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { PageHead, Section, tones } from "@/components/section";
import { serviceDetails } from "@/lib/config";

export function generateStaticParams() {
  return serviceDetails.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceDetails.find((item) => item.slug === slug);
  if (!service) return { title: "Service not found — Dense AI" };
  return { title: `${service.title} — Dense AI`, description: service.description };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = serviceDetails.find((item) => item.slug === slug);
  if (!service) notFound();
  const idx = serviceDetails.findIndex((s) => s.slug === slug);
  const others = serviceDetails.filter((s) => s.slug !== slug).slice(0, 4);

  return (
    <>
      <PageHead title={service.title} description={service.description} back={{ href: "/services", label: "All services" }}>
        <Link href="/contact" className="btn btn-light">
          Start a project <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </PageHead>

      <Section>
        <h2 className="display-3 max-w-2xl">How this workflow runs</h2>
        <ul className="mt-10 grid border-y border-line md:grid-cols-3">
          {service.details.map((d, i) => (
            <li key={d} className={`flex gap-4 py-8 md:px-8 ${i > 0 ? "border-t border-line md:border-l md:border-t-0" : "md:pl-0"} ${i === 2 ? "md:pr-0" : ""}`}>
              <span className="mt-[0.5rem] h-3 w-3 shrink-0 rounded-[3px]" style={{ background: tones[(idx + i) % tones.length] }} aria-hidden="true" />
              <p className="text-[1.02rem] leading-relaxed text-ink">{d}</p>
            </li>
          ))}
        </ul>
      </Section>

      <section className="border-t border-line bg-soft">
        <div className="wrap grid gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
          <div>
            <h2 className="display-3">Have a project in mind?</h2>
            <p className="lede mt-5">Share your requirements and Dense AI can discuss the workflow, qualification and quality controls appropriate to the project.</p>
            <Link href="/contact" className="btn btn-ink mt-8 w-fit">
              Start a project <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div>
            <p className="mb-3 text-[0.95rem] font-semibold text-ink">Other services</p>
            <ul className="border-b border-line">
              {others.map((o) => (
                <li key={o.slug} className="border-t border-line">
                  <Link href={`/services/${o.slug}`} className="row-link flex items-center justify-between gap-4 py-4 text-[1.02rem] font-medium text-ink">
                    {o.title}
                    <ArrowRight size={16} aria-hidden="true" className="text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
