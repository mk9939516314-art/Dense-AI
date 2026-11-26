import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function FounderCard({ name, role, focus, image, href }: { name: string; role: string; focus: string; image: string; href?: string }) {
  return (
    <figure className="glass group overflow-hidden !rounded-[24px]">
      <div className="relative aspect-[4/4.2] w-full overflow-hidden bg-[#0d0f09]">
        <Image src={image} alt={`Photo of ${name}`} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(2,0,1,.75))]" />
      </div>
      <figcaption className="p-6">
        <h3 className="text-[1.3rem] font-medium tracking-tight">{name}</h3>
        <p className="mt-1 text-[.95rem] text-[var(--lime)]">{role}</p>
        <p className="copy-sm mt-1">{focus}</p>
        {href && (
          <a href={href} target="_blank" rel="noopener noreferrer" className="mono mt-4 inline-flex items-center gap-1 underline underline-offset-4 transition-colors hover:!text-[var(--lime)]">
            linkedin <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        )}
      </figcaption>
    </figure>
  );
}
