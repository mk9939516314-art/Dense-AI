"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/lib/config";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="border-b border-line">
      {faqs.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className="border-t border-line">
            <h3>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                id={`faq-button-${index}`}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="font-display text-[1.2rem] font-semibold leading-snug tracking-tight text-ink sm:text-[1.35rem]">
                  {item.question}
                </span>
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-300 ease-out ${isOpen ? "rotate-45 border-ink bg-ink text-white" : "border-line text-ink group-hover:border-ink"}`}>
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
                <p className="max-w-2xl pb-7 text-[1rem] leading-relaxed text-body">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
