
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  BarChart3,
  CheckCircle2,
  Compass,
  GraduationCap,
  Sparkles,
  Target,
  TrendingUp,
  WandSparkles,
} from "lucide-react";

const tools = [
  {
    number: "01",
    title: "Career Fit Finder",
    description:
      "Discover career paths and programs that align with your interests and goals.",
    href: "/career-fit-finder",
    icon: Compass,
    color: "violet",
    tag: "Find your direction",
  },
  {
    number: "02",
    title: "Career ROI Calculator",
    description:
      "Explore course costs, potential salary growth, and estimated payback periods.",
    href: "/career-roi-calculator",
    icon: BarChart3,
    color: "blue",
    tag: "Plan your future",
  },
  {
    number: "03",
    title: "Skill Gap Analyzer",
    description:
      "Identify the skills you have and the ones you need for your target role.",
    href: "/skill-gap-analyzer",
    icon: Target,
    color: "orange",
    tag: "Know your strengths",
  },
  {
    number: "04",
    title: "AI Career Roadmap",
    description:
      "Turn your career ambitions into a structured, actionable learning plan.",
    href: "/career-roadmap-generator",
    icon: WandSparkles,
    color: "pink",
    tag: "Build your roadmap",
  },
  {
    number: "05",
    title: "Eligibility Checker",
    description:
      "Check how your qualifications compare with program admission requirements.",
    href: "/eligibility-checker",
    icon: GraduationCap,
    color: "green",
    tag: "Check eligibility",
  },
];

const colors: Record<string, string> = {
  violet: "bg-violet-100 text-violet-700",
  blue: "bg-sky-100 text-sky-700",
  orange: "bg-orange-100 text-orange-700",
  pink: "bg-pink-100 text-pink-700",
  green: "bg-emerald-100 text-emerald-700",
};

const accents: Record<string, string> = {
  violet: "group-hover:border-violet-300",
  blue: "group-hover:border-sky-300",
  orange: "group-hover:border-orange-300",
  pink: "group-hover:border-pink-300",
  green: "group-hover:border-emerald-300",
};

export default function HomePage() {
  return (
    <main className="min-h-screen w-full overflow-hidden bg-[#fcfbff] text-slate-900">
      {/* Hero */}
      <section className="relative px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[430px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-200/40 via-pink-100/50 to-sky-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm">
            <Sparkles size={16} />
            Your future, better planned
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-black leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
            Your career journey
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500 bg-clip-text text-transparent">
              starts with clarity.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Make smarter career decisions with tools that help you explore
            opportunities, understand your skills, plan your learning, and
            check your eligibility.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="#tools"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 sm:w-auto"
            >
              Explore career tools <ArrowRight size={18} />
            </Link>
            <Link
              href="/career-fit-finder"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 sm:w-auto"
            >
              Find your career fit <Compass size={18} />
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-emerald-500" />
              Five career tools
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-emerald-500" />
              Actionable insights
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-emerald-500" />
              Student-friendly
            </span>
          </div>
        </div>

        {/* Decorative feature strip */}
        <div className="relative mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-3xl border border-violet-100 bg-white/80 p-5 shadow-sm">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <Compass size={23} />
            </span>
            <p className="font-bold">Find your direction</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Explore careers that match your interests.
            </p>
          </div>

          <div className="rounded-3xl border border-sky-100 bg-white/80 p-5 shadow-sm">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <TrendingUp size={23} />
            </span>
            <p className="font-bold">Understand your growth</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Compare learning goals and career possibilities.
            </p>
          </div>

          <div className="rounded-3xl border border-pink-100 bg-white/80 p-5 shadow-sm">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-100 text-pink-700">
              <Sparkles size={23} />
            </span>
            <p className="font-bold">Take the next step</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Turn your ambitions into a practical plan.
            </p>
          </div>
        </div>
      </section>

      {/* Career tools */}
      <section id="tools" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">
                Your career toolkit
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                One goal. Five ways to get there.
              </h2>
              <p className="mt-3 max-w-xl leading-7 text-slate-500">
                Start wherever you are. Use the tools individually or combine
                their insights to plan your next move.
              </p>
            </div>
            <span className="text-sm font-medium text-slate-500">
              05 tools to explore
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => {
              const Icon = tool.icon;

              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`group flex min-h-[270px] flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100/60 ${accents[tool.color]}`}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colors[tool.color]}`}
                    >
                      <Icon size={24} />
                    </span>
                    <span className="text-sm font-bold text-slate-300">
                      {tool.number}
                    </span>
                  </div>

                  <span className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-400">
                    {tool.tag}
                  </span>

                  <h3 className="mt-2 text-xl font-bold tracking-tight">
                    {tool.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
                    {tool.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-sm font-semibold text-slate-700 transition group-hover:text-violet-700">
                      Explore tool
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 transition group-hover:bg-violet-600 group-hover:text-white">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </Link>
              );
            })}

            <div className="flex min-h-[270px] flex-col justify-between rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 text-white shadow-lg shadow-violet-200/70">
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <BriefcaseBusiness size={24} />
                </span>
                <h3 className="mt-6 text-2xl font-bold">
                  Your next chapter starts here.
                </h3>
                <p className="mt-3 text-sm leading-6 text-violet-100">
                  Choose a tool, understand your options, and take your next
                  career step with greater clarity.
                </p>
              </div>
              <Link
                href="/career-fit-finder"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-violet-700 transition hover:bg-violet-50"
              >
                Start exploring <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-24 border-y border-slate-100 bg-white px-5 py-20 sm:px-8 sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">
              Simple by design
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              From questions to your next step.
            </h2>
            <p className="mt-4 leading-7 text-slate-500">
              A simple way to turn career questions into a clearer action plan.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Understand yourself",
                desc: "Explore your interests, qualifications, skills, and goals.",
              },
              {
                n: "02",
                title: "Explore your options",
                desc: "Use the tools to compare paths, identify gaps, and check requirements.",
              },
              {
                n: "03",
                title: "Plan your next move",
                desc: "Use your results to decide which steps to take next.",
              },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-sky-100 text-lg font-extrabold text-violet-700">
                  {step.n}
                </div>
                <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-violet-600/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-10 h-64 w-64 rounded-full bg-sky-500/30 blur-3xl" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-violet-200">
              <Sparkles size={16} /> Your journey, your pace
            </span>
            <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Make your next career decision a confident one.
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-300">
              Start with one tool. Explore your possibilities. Build a plan
              that works for you.
            </p>
            <Link
              href="#tools"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-slate-900 transition hover:bg-violet-100"
            >
              Explore all tools <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <Link href="/" className="font-bold tracking-tight">
            PW Medharthi
            <span className="ml-2 font-medium text-slate-400">
              Career Intelligence
            </span>
          </Link>
          <p className="text-sm text-slate-500">
            Explore your potential. Plan your future.
          </p>
        </div>
      </footer>
    </main>
  );
}
