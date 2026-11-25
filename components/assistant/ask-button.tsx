"use client";

import { MessageCircle } from "lucide-react";

export function AskAssistant({ className = "", label = "Ask the assistant" }: { className?: string; label?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("dense-assistant-open"))}>
      <MessageCircle size={17} aria-hidden="true" /> {label}
    </button>
  );
}
