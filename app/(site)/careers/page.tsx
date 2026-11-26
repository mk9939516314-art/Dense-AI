import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHead } from "@/components/section";
import { site } from "@/lib/config";

export const metadata: Metadata = { title: "Careers — Dense AI", description: "Contact Dense AI about opportunities to work with the team." };

export default function CareersPage() {
  return (
    <PageHead title="Build the human layer for AI." description="For team opportunities, share your background and the kind of work you want to contribute to.">
      <a href={`mailto:${site.email}`} className="btn-lime">
        Email Dense AI <ArrowRight size={17} aria-hidden="true" />
      </a>
      <Link href="/" className="btn-ghost">
        Back home
      </Link>
    </PageHead>
  );
}
