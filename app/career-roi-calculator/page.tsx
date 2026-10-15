
import type { Metadata } from 'next';
import Link from 'next/link';
import CareerRoiCalculatorApp from './CareerRoiCalculatorApp';
import FAQAccordion from '@/components/FAQAccordion';
import RelatedTools from '@/components/RelatedTools';
import CTASection from '@/components/CTASection';
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Clock3,
  GraduationCap,
  PiggyBank,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.pwmedharthi.com';

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || 'PW Medharthi';
const PATH = '/career-roi-calculator';

export const metadata: Metadata = {
  title: 'Career ROI Calculator: Is a Degree Worth the Cost?',
  description:
    'Calculate the potential return on your education investment. Compare course fees, salary growth and estimated break-even time with this free Career ROI Calculator.',
  alternates: {
    canonical: PATH,
  },
  openGraph: {
    title: 'Free Career ROI Calculator: Estimate Your Education Payback',
    description:
      'Explore course costs, potential salary growth and estimated payback time before investing in a degree.',
    url: `${SITE_URL}${PATH}`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career ROI Calculator: Is Your Degree Worth It?',
    description:
      'Estimate education costs, potential salary growth and your break-even timeline with a free calculator.',
  },
};

const FAQ_ITEMS = [
  {
    question: 'What is a career ROI calculator?',
    answer:
      'A career ROI calculator helps you compare the cost of education with the potential financial benefits of further study. Depending on the inputs and model, it can estimate costs, salary differences and a possible break-even timeline.',
  },
  {
    question: 'How do I calculate the return on investment of a degree?',
    answer:
      'Start with the total cost of the program, including applicable tuition and other expenses. Compare that investment with the estimated additional income you may earn after completing the program. Account for the time spent studying, financing costs and other relevant expenses for a more useful comparison.',
  },
  {
    question: 'Can I use the calculator if I am a fresher?',
    answer:
      'Yes, if the calculator supports a fresher or no-current-salary option. Use a realistic estimate for your potential starting salary and remember that actual employment and salary outcomes can vary.',
  },
  {
    question: 'Does the calculation include education loans and EMI?',
    answer:
      'The result depends on the inputs and features supported by the calculator. If loan interest, EMI or financing charges are not explicitly included in your result, account for them separately when evaluating affordability.',
  },
  {
    question: 'How long does it take for a degree to pay for itself?',
    answer:
      'The estimated payback period depends on the total program cost and the additional income attributable to the qualification. A lower cost and a higher sustained income difference may shorten the estimated period. The result is a projection, not a guarantee.',
  },
  {
    question: 'Are the salary projections guaranteed?',
    answer:
      'No. Salary projections are estimates, not promises of employment or earnings. Outcomes depend on factors such as your skills, experience, location, chosen industry, employer and changing labour-market conditions.',
  },
  {
    question: 'Can I compare different courses?',
    answer:
      'You can run the calculator separately for each course if the tool supports the required inputs. Compare total costs, assumptions, estimated salary differences and payback periods on a consistent basis.',
  },
];

const benefits = [
  {
    icon: Calculator,
    title: 'Estimate your investment',
    description:
      'Start with program fees and the costs relevant to your education decision.',
    color: 'bg-violet-100 text-violet-700',
  },
  {
    icon: TrendingUp,
    title: 'Explore salary scenarios',
    description:
      'Understand how different salary assumptions can change the projected outcome.',
    color: 'bg-sky-100 text-sky-700',
  },
  {
    icon: Clock3,
    title: 'Estimate the payback period',
    description:
      'See how the cost and potential additional income affect your break-even timeline.',
    color: 'bg-orange-100 text-orange-700',
  },
];

const softwareAppLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: `${BRAND} Career ROI Calculator`,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  description:
    'A free educational investment calculator for exploring program costs, potential salary changes and estimated payback time.',
  url: `${SITE_URL}${PATH}`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Career Intelligence',
      item: SITE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Career ROI Calculator',
      item: `${SITE_URL}${PATH}`,
    },
  ],
};

export default function CareerRoiCalculatorPage() {
  return (
    <div className="w-full bg-[#fcfbff] text-slate-900">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareAppLd).replace(/</g, '\\u003c'),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqLd).replace(/</g, '\\u003c'),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c'),
        }}
      />

      {/* Hero */}
      <section
        id="top"
        className="relative isolate overflow-hidden px-5 pb-14 pt-14 sm:px-8 sm:pb-20 sm:pt-20"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-violet-50 via-white to-sky-50" />

        <div className="pointer-events-none absolute -right-24 -top-10 -z-10 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-10 -left-24 -z-10 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/90 px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm">
            <Sparkles size={16} />
            Free Career ROI Calculator
          </span>

          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Is Your Degree Worth the Investment?
            <span className="mt-2 block bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500 bg-clip-text text-transparent">
              Calculate Your Career ROI.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Before paying for a course, explore the potential return on your
            education investment. Compare program costs, salary assumptions and
            estimated break-even time with the {BRAND} Career ROI Calculator.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="#calculator"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              Calculate My Career ROI
              <ArrowRight size={18} />
            </Link>

            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50"
            >
              How It Works
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Free to use
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Compare cost and income
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Plan with clearer assumptions
            </span>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article
                key={benefit.title}
                className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-100/60"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${benefit.color}`}
                >
                  <Icon size={23} />
                </span>

                <h2 className="mt-5 text-lg font-bold text-slate-900">
                  {benefit.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-24 border-y border-slate-100 bg-white px-5 py-16 sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">
              Understand the numbers
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Make a more informed education decision
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              Use realistic inputs to understand the potential financial
              implications of further study.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                number: '01',
                title: 'Enter your details',
                description:
                  'Provide the salary, program cost and other information requested by the calculator.',
                color: 'bg-violet-100 text-violet-700',
              },
              {
                number: '02',
                title: 'Review your estimates',
                description:
                  'Explore the projected financial outcome using the assumptions entered.',
                color: 'bg-sky-100 text-sky-700',
              },
              {
                number: '03',
                title: 'Compare your options',
                description:
                  'Consider the costs, potential income difference and estimated payback period.',
                color: 'bg-orange-100 text-orange-700',
              },
            ].map((step) => (
              <article
                key={step.number}
                className="rounded-3xl border border-slate-100 bg-[#fcfbff] p-6"
              >
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-extrabold ${step.color}`}
                >
                  {step.number}
                </span>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section
        id="calculator"
        aria-label="Career ROI Calculator"
        className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
              <GraduationCap size={17} />
              Your education investment
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Calculate Your Potential Return
            </h2>

            <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-500">
              Enter your information below to explore the projected costs and
              potential financial benefits of your education plans.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-violet-100/40 sm:p-8">
            <CareerRoiCalculatorApp />
          </div>
        </div>
      </section>

      {/* Trust and methodology */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="mx-auto max-w-5xl rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-6 sm:p-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm">
              <PiggyBank size={24} />
            </span>

            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Understand the assumptions behind your result
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Your estimate is only as useful as its inputs and assumptions.
                Review the course fees, expected income, financing costs and
                timeframe used in the calculation before comparing options.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Results are illustrative estimates, not financial advice or
                guarantees of salary, employment or investment recovery.
                Verify any data sources and current program fees before making
                a decision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="border-y border-slate-100 bg-white px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">
              Frequently asked questions
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Career ROI Calculator FAQs
            </h2>

            <p className="mt-3 text-slate-500">
              Understand the estimates before making your decision.
            </p>
          </div>

          <FAQAccordion items={FAQ_ITEMS} />
        </div>
      </section>

      {/* Related tools */}
      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <RelatedTools excludeHref={PATH} />
        </div>
      </section>

      {/* Conversion CTA */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 px-6 py-10 text-center text-white shadow-xl shadow-violet-200/50 sm:px-12 sm:py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-violet-100">
            <Sparkles size={16} />
            Plan your next move
          </span>

          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Make Your Next Education Investment With More Clarity
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-violet-100">
            Explore your numbers, review the assumptions and compare your
            options before committing to a course.
          </p>

          <Link
            href="#calculator"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-violet-700 transition hover:-translate-y-0.5 hover:bg-violet-50"
          >
            Calculate My Career ROI
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Existing counsellor CTA */}
      <section className="px-5 pb-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <CTASection
            heading="Still comparing your options?"
            subheading="Explore your estimated costs and potential outcomes before choosing a program."
            primaryLabel="Calculate My ROI"
            primaryHref="#calculator"
          />
        </div>
      </section>
    </div>
  );
}
