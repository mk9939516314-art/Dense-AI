import { Check } from "lucide-react";

type Span = { text: string; label: string; tone: "coral" | "violet" | "cyan" | "mint" | "amber"; d: string };

const Cursor = ({ fill }: { fill: string }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path d="M2 1.5 15.5 8l-5.6 1.7L8 15.5 2 1.5Z" fill={fill} stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

const labels: { name: string; tone: Span["tone"]; color: string }[] = [
  { name: "PERSON", tone: "coral", color: "var(--coral)" },
  { name: "ORG", tone: "violet", color: "var(--violet)" },
  { name: "PRODUCT", tone: "cyan", color: "var(--cyan)" },
  { name: "LOCATION", tone: "mint", color: "var(--mint)" },
  { name: "DATE", tone: "amber", color: "var(--amber)" },
];

function Mark({ s }: { s: Span }) {
  return (
    <mark className={`ws-span hl-${s.tone} text-inherit`} style={{ ["--d" as string]: s.d }}>
      {s.text}
      <span className="ws-tag tag">{s.label}</span>
    </mark>
  );
}

/**
 * A labeling task as the contributors and reviewers see it. Illustrative: it shows how human judgment
 * is captured and corrected, not client data.
 */
export default function Workspace() {
  return (
    <figure className="ws-stage m-0 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_60px_-30px_rgba(10,15,36,0.35),0_2px_0_rgba(10,15,36,0.04)]" aria-label="Illustration of a text labeling task being reviewed by people">
      <figcaption className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <span className="flex items-center gap-2.5 text-sm font-semibold text-ink">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-ink font-mono text-[0.65rem] text-white" aria-hidden="true">T</span>
          Entity labeling
        </span>
        <span className="font-mono text-[0.7rem] text-muted">sample task</span>
      </figcaption>

      <div className="grid md:grid-cols-[1fr_14.5rem]">
        <div className="px-5 pb-9 pt-10 sm:px-8 sm:pt-12">
          <p className="font-sans text-[1.12rem] leading-[2.9] text-ink sm:text-[1.3rem] sm:leading-[2.8]">
            <Mark s={{ text: "Maya Verma", label: "PERSON", tone: "coral", d: "0.5s" }} /> asked{" "}
            <Mark s={{ text: "Lumen Health", label: "ORG", tone: "violet", d: "0.9s" }} /> to send the new{" "}
            {/* The one correction: annotator says ORG, reviewer changes it to PRODUCT. */}
            <mark className="ws-flip text-inherit">
              <span className="ws-layer ws-was hl-violet" style={{ background: "var(--t)", boxShadow: "inset 0 -2px 0 var(--c)" }} aria-hidden="true" />
              <span className="ws-layer ws-now hl-cyan" style={{ background: "var(--t)", boxShadow: "inset 0 -2px 0 var(--c)" }} aria-hidden="true" />
              <span className="relative">Orion scanner</span>
              <span className="ws-tag-was tag" style={{ background: "var(--violet)" }} aria-hidden="true">ORG</span>
              <span className="ws-tag-now tag" style={{ background: "var(--cyan)", color: "#04252C" }}>PRODUCT</span>
              <span className="ws-cur ws-cur1" aria-hidden="true">
                <Cursor fill="#7C4DFF" />
                <span className="tag" style={{ background: "var(--violet)" }}>Annotator</span>
              </span>
              <span className="ws-cur ws-cur2" aria-hidden="true">
                <Cursor fill="#00B8D4" />
                <span className="tag" style={{ background: "var(--cyan)", color: "#04252C" }}>Reviewer</span>
              </span>
            </mark>{" "}
            to the <Mark s={{ text: "Pune", label: "LOCATION", tone: "mint", d: "1.7s" }} /> lab before{" "}
            <Mark s={{ text: "14 March", label: "DATE", tone: "amber", d: "2.1s" }} />.
          </p>
        </div>

        <aside className="border-t border-line bg-paper/60 px-5 py-5 md:border-l md:border-t-0">
          <h3 className="font-sans text-xs font-semibold text-muted">Labels</h3>
          <ul className="mt-3 space-y-2">
            {labels.map((l) => (
              <li key={l.name} className="flex items-center gap-2.5 text-[0.82rem] text-body">
                <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: l.color }} aria-hidden="true" />
                <span className="font-mono text-[0.72rem] text-ink">{l.name}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-6 font-sans text-xs font-semibold text-muted">Review</h3>
          <div className="mt-3 rounded-lg border border-line bg-surface p-3 ws-note">
            <p className="text-[0.78rem] leading-snug text-body">
              <span className="font-semibold text-ink">Reviewer:</span> Orion scanner is a device, not a company. Changed ORG to PRODUCT.
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 ws-ok">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/15 px-2.5 py-1 text-[0.75rem] font-semibold text-[#0B7A58]">
              <Check size={13} strokeWidth={3} aria-hidden="true" /> Accepted
            </span>
            <span className="font-mono text-[0.68rem] text-muted">after review</span>
          </div>
        </aside>
      </div>

      <div className="border-t border-line px-5 py-2.5 font-mono text-[0.68rem] text-muted sm:px-8">
        Illustrative sample. Not client data.
      </div>
    </figure>
  );
}
