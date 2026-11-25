import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function FounderCard({ name, role, focus, image, href }: { name: string; role: string; focus: string; image: string; href?: string }) {
  return (
    <figure>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px] bg-line">
        <Image src={image} alt={`Photo of ${name}`} fill className="object-cover" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" />
      </div>
      <figcaption className="mt-5">
        <h3 className="font-display text-[1.3rem] font-semibold tracking-tight text-ink">{name}</h3>
        <p className="mt-1 text-[0.97rem] font-medium text-blue">{role}</p>
        <p className="mt-1 text-[0.95rem] leading-relaxed text-body">{focus}</p>
        {href && (
          <a href={href} target="_blank" rel="noopener noreferrer" className="link-u mt-3 inline-flex items-center gap-1 text-[0.92rem] font-semibold text-ink">
            LinkedIn <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        )}
      </figcaption>
    </figure>
  );
}
