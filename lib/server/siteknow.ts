import { faqs, founders, infraSteps, pilotSteps, qualityCards, qualitySteps, securityCards, serviceDetails, site, solutionTypes, whyPillars, workforcePillars } from "@/lib/config";

/**
 * What the assistant knows about the Dense AI website. It is built from the same data the pages render,
 * so the assistant can never drift from what is published.
 */
const text = [
  `[${site.name}: ${site.tagline}]`,
  "SERVICES",
  ...serviceDetails.map((s) => `- ${s.title}: ${s.description} ${s.details.join(" ")}`),
  "",
  "HOW A PROJECT RUNS",
  ...infraSteps.map((s) => `${s.number}. ${s.title}: ${s.description}`),
  "",
  "PILOT TO PRODUCTION",
  ...pilotSteps.map((s) => `${s.number}. ${s.title}: ${s.description}`),
  "",
  "WORKFORCE",
  ...workforcePillars.map((s) => `- ${s.title}: ${s.description}`),
  "",
  "QUALITY",
  `Steps: ${qualitySteps.map((s) => s.title).join(", ")}.`,
  ...qualityCards.map((s) => `- ${s.title}: ${s.description}`),
  "",
  "SECURITY AND HANDLING",
  ...securityCards.map((s) => `- ${s.title}: ${s.description}`),
  "",
  "SOLUTIONS",
  ...solutionTypes.map((s) => `- ${s.title}: ${s.description}`),
  "",
  "WHY DENSE AI",
  ...whyPillars.map((s) => `- ${s.title}: ${s.description}`),
  "",
  "FOUNDERS",
  ...founders.map((f) => `- ${f.name}, ${f.role} (${f.focus})`),
  "",
  "FAQ",
  ...faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`),
  "",
  `CONTACT: ${site.email}. Contributors can join through the WhatsApp group on the contributors page.`,
].join("\n");

export async function siteKnowledge() {
  return text.slice(0, 9000);
}

export const siteStatus = () => ({ site: site.name, chars: text.length, at: 0 });
