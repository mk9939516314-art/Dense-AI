import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Hero from "@/components/home/hero";
import { DataTypes, HubCard, IsoBars, LimePanel, Numbers, PilotPicker, ProjectWeek, ReviewCard, RunTimeline, ScopeCard } from "@/components/home/parts";
import { Faq } from "@/components/faq";
import { FounderCard } from "@/components/founder-card";
import { AskAssistant } from "@/components/assistant/ask-button";
import { ProjectForm } from "@/components/project-form";
import { founders, infraSteps, serviceDetails, site, whyPillars } from "@/lib/config";

const linkedin: Record<string, string> = {
  "Anikesh Aman": "https://www.linkedin.com/in/anikesh-aman-527404210/",
  Arpita: "https://www.linkedin.com/in/arpita-dwivedi-5a21213a5",
};
const codes = ["DC", "DA", "IV", "AS", "ML", "LE", "HF", "QV"];

function Feature({ flip, title, text, children }: { flip?: boolean; title: string; text: string; children: React.ReactNode }) {
  return (
    <div className={`feat ${flip ? "flip" : ""}`}>
      <div className="rv">
        <h3 className="h-card !text-[clamp(1.5rem,2.2vw,1.9rem)]">{title}</h3>
        <p className="copy-sm mt-4 max-w-[26rem] !text-[1rem]">{text}</p>
      </div>
      <div className="rv">{children}</div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <DataTypes />

      <section id="how" className="sec">
        <div className="wrap2">
          <h2 className="h-sec rv max-w-[15ch]">Most AI data work is <span className="serif">operations.</span></h2>
          <p className="copy rv mt-6">Dense AI runs the steps between your model and the people who label, check and approve its data, and brings in a person only where judgment matters.</p>
          <div className="mt-24 space-y-28 lg:space-y-36">
            <Feature title="One workflow, every data type" text="Define the task, qualify contributors, label, review, validate. Every stage is scoped to your project, and anything that fails a check goes back for another pass.">
              <RunTimeline />
            </Feature>
            <Feature flip title="Review where it matters" text="Items below your acceptance bar go to a reviewer who has the context to fix them. Corrections feed back into the instructions, so the next batch starts better.">
              <ReviewCard />
            </Feature>
            <Feature title="Every batch is on the record" text="Instructions, labels and review decisions stay with the batch, so activity can be traced and audited against your project standards.">
              <IsoBars />
            </Feature>
          </div>
        </div>
      </section>

      <LimePanel />

      <section className="sec">
        <div className="wrap2">
          <h2 className="h-sec rv max-w-[18ch]"><span className="serif">Careful</span> in the ways that matter.</h2>
          <div className="rv mt-14 grid gap-5 lg:grid-cols-2">
            <HubCard />
            <ScopeCard />
          </div>
        </div>
      </section>

      <section id="services" className="sec !pt-10">
        <div className="wrap2">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <h2 className="h-sec rv max-w-[16ch]">Eight services, <span className="serif">scoped</span> to your task.</h2>
            <p className="copy rv lg:max-w-[24rem]">Pick one or combine several. Each is shaped around your data, languages and quality bar.</p>
          </div>
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {serviceDetails.map((s, i) => (
              <li key={s.slug} className="rv">
                <Link href={`/services/${s.slug}`} className="glass group flex h-full min-h-[15rem] flex-col p-6 transition-[border-color,transform,background-color] duration-300 hover:-translate-y-1 hover:border-[rgba(91,140,255,.4)]">
                  <span className="tile !h-10 !w-10 !rounded-[10px] !text-[.72rem] group-hover:on">{codes[i]}</span>
                  <h3 className="mt-6 text-[1.15rem] font-medium tracking-tight">{s.title}</h3>
                  <p className="copy-sm mt-2 !text-[.9rem]">{s.description}</p>
                  <ArrowUpRight size={18} className="mt-auto self-end text-[var(--dim)] transition-colors group-hover:text-[var(--lime)]" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec">
        <div className="wrap2">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="chip rv"><i aria-hidden="true" />project view</span>
              <h2 className="h-sec rv mt-5">A project week, <span className="serif">seen from Dense AI.</span></h2>
            </div>
            <p className="copy rv lg:max-w-[24rem]">The screen a project lead keeps open: what is labeled, what is in review, and who still owes an answer. Illustrative, not client data.</p>
          </div>
          <ProjectWeek />
        </div>
      </section>

      <section className="sec !pt-10">
        <div className="wrap2">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="chip rv"><i aria-hidden="true" />how we work</span>
              <h2 className="h-sec rv mt-5 max-w-[18ch]">Numbers we <span className="serif">can</span> stand behind.</h2>
            </div>
            <p className="copy rv lg:max-w-[24rem]">Counted from how projects are actually set up. No invented averages, no best-case screenshots.</p>
          </div>
          <Numbers values={[
            { label: "services", n: serviceDetails.length, text: "kinds of data and evaluation work, each scoped per project" },
            { label: "stages", n: infraSteps.length, text: "stages every project moves through, from requirements to a validated dataset" },
            { label: "to scale", n: 4, text: "steps from defining the task to scaling a validated workflow" },
          ]} />
          <div className="mt-14 grid gap-10 border-t border-[var(--line)] pt-10 md:grid-cols-3 md:gap-8">
            {whyPillars.slice(0, 3).map((w) => (
              <div key={w.title} className="rv">
                <p className="text-[1.05rem] leading-relaxed text-[#d4d8cd]">{w.description}</p>
                <p className="mt-6 text-[.92rem] font-medium">{w.title}</p>
                <p className="mono mt-1">how we work</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="founders" className="sec">
        <div className="wrap2">
          <h2 className="h-sec rv max-w-[18ch]">The team <span className="serif">behind</span> the work.</h2>
          <div className="mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
            {founders.map((f) => (
              <div key={f.name} className="rv"><FounderCard {...f} href={linkedin[f.name]} /></div>
            ))}
          </div>
        </div>
      </section>

      <section id="pilot" className="sec !pt-10">
        <div className="wrap2">
          <span className="chip rv"><i aria-hidden="true" />getting started</span>
          <h2 className="h-sec rv mt-5 max-w-[18ch]">Start with a pilot, <span className="serif">then scale.</span></h2>
          <p className="copy rv mt-5">Tell us roughly how much data you have in mind and we will suggest where to begin. Nothing to sign to find out.</p>
          <PilotPicker />
        </div>
      </section>

      <section id="faq" className="sec !pt-10">
        <div className="wrap2 grid gap-12 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20">
          <div className="rv lg:sticky lg:top-32 lg:self-start">
            <h2 className="h-sec">Questions, <span className="serif">answered plainly.</span></h2>
            <p className="copy mt-5">Cannot find yours? Ask the assistant, or write to us.</p>
            <AskAssistant className="btn-ghost mt-8" label="Ask the assistant" />
          </div>
          <div className="rv"><Faq /></div>
        </div>
      </section>

      <section id="contact" className="sec !pt-10">
        <div className="wrap2 grid gap-5 lg:grid-cols-[1fr_1.15fr]">
          <div className="lime rv relative flex flex-col justify-between overflow-hidden rounded-[28px] p-8 sm:p-10">
            <div>
              <p className="font-mono text-[.78rem] text-[#3d4a14]">what now</p>
              <h2 className="mt-5 text-[clamp(2rem,3.4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em]">Pick the dataset you <span className="serif text-[1.1em]">dread</span> most.</h2>
              <p className="mt-5 max-w-[26rem] text-[1.02rem] leading-relaxed text-[#2f3a0c]">Bring one data job nobody wants to do by hand. We will tell you how we would run it, and whether a pilot makes sense.</p>
            </div>
            <div className="mt-12">
              <a href={`mailto:${site.email}`} className="btn-dark">{site.email}</a>
              <p className="mt-4 font-mono text-[.75rem] text-[#3d4a14]">or fill in the details and we will reply by email</p>
            </div>
          </div>
          <div className="rv"><ProjectForm /></div>
        </div>
      </section>
    </>
  );
}
