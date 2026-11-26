"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/lib/config";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="glass divide-y divide-[var(--line)] overflow-hidden !rounded-[22px]">
      {faqs.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                id={`faq-button-${index}`}
                className="group flex w-full items-center justify-between gap-6 px-6 py-6 text-left sm:px-8"
              >
                <span className="text-[1.05rem] font-medium leading-snug tracking-[-0.01em] text-[var(--fg)] sm:text-[1.15rem]">
                  {item.question}
                </span>
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-300 ease-out ${isOpen ? "rotate-45 border-[var(--lime)] bg-[var(--lime)] text-[#0b0f02]" : "border-[var(--line)] text-[var(--fg)] group-hover:border-[var(--lime)]"}`}>
                  <Plus size={18} aria-hidden="true" />
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${index}`}
              role="region"
              aria-labelledby={`faq-button-${index}`}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl px-6 pb-7 text-[1rem] leading-relaxed text-[var(--mute)] sm:px-8">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
