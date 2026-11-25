import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Eye, KeyRound, Lock, PackageCheck, Search, Settings2 } from "lucide-react";
import Workspace from "@/components/workspace";
import Scene from "@/components/scene";
import { Faq } from "@/components/faq";
import { ProjectForm } from "@/components/project-form";
import { AskAssistant } from "@/components/assistant/ask-button";
import {
  capabilities,
  founders,
  infraSteps,
  pilotSteps,
  qualityCards,
  qualitySteps,
  securityCards,
  serviceDetails,
  site,
  whyPillars,
  workforcePillars,
} from "@/lib/config";

const tones = ["coral", "violet", "cyan", "mint", "amber", "blue"] as const;
const toneVar: Record<(typeof tones)[number], string> = {
  coral: "var(--coral)",
  violet: "var(--violet)",
  cyan: "var(--cyan)",
  mint: "var(--mint)",
  amber: "var(--amber)",
  blue: "var(--blue)",
};

const securityIcons = [Lock, KeyRound, Search, PackageCheck, Settings2, Eye];

const linkedin: Record<string, string> = {
  "Anikesh Aman": "https://www.linkedin.com/in/anikesh-aman-527404210/",
  Arpita: "https://www.linkedin.com/in/arpita-dwivedi-5a21213a5",
};

const workforceLifecycle = ["Recruitment", "Qualification", "Training", "Task allocation", "Monitoring", "Quality control"];

export default function Home() {
  return (
    <div id="top">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <Scene className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#070B1C_0%,rgba(7,11,28,0.88)_34%,rgba(7,11,28,0)_68%)] max-lg:bg-[linear-gradient(180deg,rgba(7,11,28,0.2)_0%,#070B1C_78%)]" />
        <div className="wrap relative flex min-h-[max(40rem,calc(100svh-68px))] flex-col justify-end pb-10 pt-24 lg:pb-12">
          <h1 className="display-1 max-w-[11ch] text-white">
            Human data, built for AI.
          </h1>
          <p className="lede mt-7 max-w-[34rem] !text-white/75">
            Dense AI helps AI and machine learning teams collect, annotate, evaluate and manage the human data required to build better AI systems.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <Link href="#contact" className="btn btn-light">
              Start a project <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href="#services" className="link-u w-fit text-[0.97rem] font-semibold text-white">
              Explore services
            </Link>
          </div>
          <div className="mt-14 flex flex-col gap-3 border-t border-white/15 pt-5">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.88rem] text-white/80">
              {capabilities.map((c, i) => (
                <li key={c} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: toneVar[tones[i % tones.length]] }} aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
            <p className="text-[0.8rem] text-white/50">Illustrative point cloud. Not client data.</p>
          </div>
        </div>
      </section>

      {/* LABEL REVIEW */}
      <section className="band border-b border-line">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <h2 className="display-2">A label is not done until a second person agrees.</h2>
            <p className="lede mt-6">Annotators label, reviewers correct, and only accepted work moves on. This is the loop every Dense AI project runs.</p>
          </div>
          <Workspace />
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="band">
        <div className="wrap grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="display-2">AI data services built around your workflow.</h2>
            <p className="lede mt-6">From raw data collection to final evaluation, Dense AI manages the human workflows behind AI development.</p>
            <Link href="/services" className="link-u mt-8 inline-flex w-fit items-center gap-2 text-[0.97rem] font-semibold text-ink">
              All services <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <ul className="border-b border-line">
            {serviceDetails.map((s, i) => (
              <li key={s.slug} className="border-t border-line">
                <Link
                  href={`/services/${s.slug}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-start gap-x-5 px-1 py-6 transition-colors duration-200 hover:bg-surface sm:px-4 sm:py-7"
                >
                  <span className="mt-2.5 h-3 w-3 rounded-[3px] transition-transform duration-300 ease-out group-hover:scale-125" style={{ background: toneVar[tones[i % tones.length]] }} aria-hidden="true" />
                  <span>
                    <span className="display-3 block">{s.title}</span>
                    <span className="mt-2 block max-w-lg text-[0.97rem] leading-relaxed text-body">{s.description}</span>
                  </span>
                  <ArrowUpRight size={22} className="mt-1.5 text-muted transition-[transform,color] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HOW A PROJECT RUNS */}
      <section className="band border-t border-line bg-surface">
        <div className="wrap">
          <div className="max-w-3xl">
            <h2 className="display-2">The operational layer behind better AI.</h2>
            <p className="lede mt-6">
              Modern AI systems depend on high-quality human data. Dense AI manages the people, processes and quality systems required to collect, annotate and evaluate that data.
            </p>
          </div>

          <ol className="relative mt-16 grid gap-10 md:grid-cols-5 md:gap-6">
            <span className="absolute left-[0.6rem] top-2 h-[calc(100%-1rem)] w-px bg-line md:left-0 md:top-[0.62rem] md:h-px md:w-full" aria-hidden="true" />
            {infraSteps.map((step, i) => (
              <li key={step.number} className="relative pl-9 md:pl-0 md:pr-4">
                <span
                  className="absolute left-0 top-1 grid h-5 w-5 place-items-center rounded-full border-2 border-surface md:static md:mb-6"
                  style={{ background: toneVar[tones[i % tones.length]] }}
                  aria-hidden="true"
                />
                <p className="font-mono text-xs text-muted">{step.number}</p>
                <h3 className="display-3 mt-1 !text-[1.3rem]">{step.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-body">{step.description}</p>
              </li>
            ))}
          </ol>

          {/* Pilot to production: the stairs are the point, so each step is taller than the last. */}
          <div className="mt-24 grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div>
              <h2 className="display-2">From pilot to production.</h2>
              <p className="lede mt-5">Start small, prove the instructions and quality controls, then scale the workforce.</p>
            </div>
            <ol className="grid grid-cols-2 items-end gap-3 sm:grid-cols-4">
              {pilotSteps.map((p, i) => (
                <li
                  key={p.number}
                  className="flex flex-col justify-end rounded-xl p-4 text-white"
                  style={{
                    minHeight: `${9 + i * 3.1}rem`,
                    background: ["#2B3350", "#1B47FF", "#6B3DF5", "#0A0F24"][i],
                  }}
                >
                  <p className="font-mono text-xs text-white/60">{p.number}</p>
                  <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-white">{p.title}</h3>
                  <p className="mt-2 text-[0.85rem] leading-snug text-white/75">{p.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* WORKFORCE */}
      <section id="workforce" className="band border-t border-line">
        <div className="wrap grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <h2 className="display-2">A scalable human workforce.</h2>
            <p className="lede mt-6">
              Large AI projects often require hundreds or thousands of human contributors. Dense AI manages contributor recruitment, qualification, training, task allocation, monitoring and quality control.
            </p>
            <dl className="mt-10 divide-y divide-line border-y border-line">
              {workforcePillars.map((p) => (
                <div key={p.title} className="grid gap-1 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
                  <dt className="font-display text-xl font-semibold tracking-tight text-ink">{p.title}</dt>
                  <dd className="text-[0.97rem] leading-relaxed text-body">{p.description}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-3 shadow-[0_24px_50px_-30px_rgba(10,15,36,0.3)] sm:p-4" role="img" aria-label="The managed workflow a contributor passes through, from recruitment to quality control">
            <ol className="space-y-2">
              {workforceLifecycle.map((step, i) => (
                <li key={step} className="flex items-center gap-4 rounded-xl bg-paper px-4 py-3.5">
                  <span className="h-3 w-3 shrink-0 rounded-[3px]" style={{ background: toneVar[tones[i % tones.length]] }} aria-hidden="true" />
                  <span className="font-display text-lg font-semibold tracking-tight text-ink">{step}</span>
                  <span className="ml-auto hidden h-1.5 w-24 overflow-hidden rounded-full bg-line sm:block" aria-hidden="true">
                    <span className="block h-full rounded-full" style={{ width: `${40 + ((i * 37) % 55)}%`, background: toneVar[tones[i % tones.length]] }} />
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* QUALITY (the one dark band) */}
      <section id="quality" className="band bg-navy text-white">
        <div className="wrap">
          <div className="max-w-3xl">
            <h2 className="display-2 !text-white">Quality is built into every workflow.</h2>
            <p className="mt-6 max-w-xl text-[1.1rem] leading-relaxed text-white/70">
              The value of AI data depends on its accuracy. Dense AI builds quality control into each stage of the workflow.
            </p>
          </div>

          <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-5">
            {qualitySteps.map((s, i) => (
              <li key={s.number} className="bg-navy p-6">
                <span className="font-mono text-xs text-white/50">{s.number}</span>
                <p className="mt-6 font-display text-xl font-semibold leading-tight tracking-tight text-white">{s.title}</p>
                <span
                  className="mt-6 block h-1 rounded-full"
                  style={{ background: i === qualitySteps.length - 1 ? "var(--mint)" : "rgba(255,255,255,0.18)", width: `${28 + i * 18}%` }}
                  aria-hidden="true"
                />
              </li>
            ))}
          </ol>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {qualityCards.map((c) => (
              <div key={c.title} className="border-t border-white/20 pt-6">
                <h3 className="font-display text-xl font-semibold tracking-tight text-white">{c.title}</h3>
                <p className="mt-3 text-[0.97rem] leading-relaxed text-white/65">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section className="band">
        <div className="wrap">
          <div className="max-w-3xl">
            <h2 className="display-2">Security designed around the project.</h2>
            <p className="lede mt-6">Project-specific access, handling, monitoring and delivery requirements can be incorporated into the workflow.</p>
          </div>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {securityCards.map((c, i) => {
              const Icon = securityIcons[i % securityIcons.length];
              return (
                <li key={c.title} className="bg-paper p-7 transition-colors duration-200 hover:bg-surface">
                  <Icon size={24} strokeWidth={1.6} className="text-ink" aria-hidden="true" />
                  <h3 className="display-3 mt-8 !text-[1.25rem]">{c.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-body">{c.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* WHY */}
      <section className="band border-t border-line bg-surface">
        <div className="wrap grid gap-12 lg:grid-cols-[0.6fr_1.4fr] lg:gap-20">
          <h2 className="display-2">Why Dense AI?</h2>
          <dl className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {whyPillars.map((p, i) => (
              <div key={p.title} className="border-t border-ink pt-5">
                <dt className="flex items-center gap-3 font-display text-2xl font-semibold tracking-tight text-ink">
                  <span className="h-3 w-3 rounded-[3px]" style={{ background: toneVar[tones[i % tones.length]] }} aria-hidden="true" />
                  {p.title}
                </dt>
                <dd className="mt-3 text-[0.97rem] leading-relaxed text-body">{p.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* FOUNDERS */}
      <section id="founders" className="band border-t border-line">
        <div className="wrap">
          <h2 className="display-2 max-w-3xl">Leadership across technology, operations and business.</h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:max-w-4xl lg:gap-14">
            {founders.map((f, i) => (
              <article key={f.name} className={i % 2 ? "sm:mt-16" : ""}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-soft">
                  <Image src={f.image} alt={`Portrait of ${f.name}`} fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 90vw" className="object-cover" />
                </div>
                <h3 className="display-3 mt-5">{f.name}</h3>
                <p className="mt-1 text-[0.97rem] font-semibold text-blue">{f.role}</p>
                <p className="mt-1 text-[0.95rem] text-body">{f.focus}</p>
                {linkedin[f.name] && (
                  <a href={linkedin[f.name]} target="_blank" rel="noopener noreferrer" className="link-u mt-3 inline-block text-[0.92rem] font-semibold text-ink">
                    LinkedIn <span aria-hidden="true">↗</span>
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="band border-t border-line bg-surface">
        <div className="wrap grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <h2 className="display-2">Frequently asked questions.</h2>
            <p className="lede mt-5">Not listed here? Ask the assistant, or talk to the team.</p>
            <AskAssistant className="btn btn-line mt-7" />
          </div>
          <Faq />
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="band border-t border-line">
        <div className="wrap grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <h2 className="display-2">Tell us what your AI team needs.</h2>
            <p className="lede mt-6">
              Share your data type, volume, languages, timeline and quality requirements. We can shape the workflow around the project.
            </p>
            <a href={`mailto:${site.email}`} className="link-u mt-8 inline-flex items-center gap-2 text-lg font-semibold text-blue">
              {site.email} <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
          <ProjectForm />
        </div>
      </section>

      {/* CONTRIBUTORS */}
      <section className="wrap pb-20 lg:pb-28">
        <div className="relative overflow-hidden rounded-3xl bg-blue px-7 py-14 text-white sm:px-14 sm:py-20">
          <div className="relative max-w-2xl">
            <h2 className="display-2 !text-white">Join the Dense AI contributor network.</h2>
            <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-white/85">
              Contributors may participate in appropriate data collection, annotation, evaluation, language and research or feedback tasks.
            </p>
            <a href={site.contributorWhatsApp} target="_blank" rel="noopener noreferrer" className="btn btn-light mt-8">
              Become a contributor <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className="pointer-events-none absolute -bottom-24 -right-16 hidden h-80 w-80 rounded-[3rem] bg-[#6B3DF5] opacity-80 sm:block" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-10 right-40 hidden h-44 w-44 rounded-full bg-coral sm:block" aria-hidden="true" />
        </div>
      </section>
    </div>
  );
}
