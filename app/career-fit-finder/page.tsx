
import type { Metadata } from 'next';
import Link from 'next/link';
import CareerFitFinderApp from './CareerFitFinderApp';
import FAQAccordion from '@/components/FAQAccordion';
import RelatedTools from '@/components/RelatedTools';
import CTASection from '@/components/CTASection';
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  GraduationCap,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.pwmedharthi.com';

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || 'PW Medharthi';
const PATH = '/career-fit-finder';

export const metadata: Metadata = {
  title: 'Free Career Aptitude Quiz: Find the Right Degree for You',
  description:
    'Not sure which degree to choose? Take the free Career-Fit Quiz to explore programs that match your interests, qualifications and career goals.',
  alternates: {
    canonical: PATH,
  },
  openGraph: {
    title: 'Find a Degree That Fits Your Career Goals | Free Career Quiz',
    description:
      'Explore suitable degrees based on your interests, education and career goals with the free PW Medharthi Career-Fit Finder.',
    url: `${SITE_URL}${PATH}`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Which Degree Should You Choose? Take the Free Career Quiz',
    description:
      'Discover degree options that align with your interests, qualifications and future career goals.',
  },
};

const FAQ_ITEMS = [
  {
    question: 'Is the Career-Fit Finder really free?',
    answer:
      'Yes. You can use the Career-Fit Finder to explore career and degree options without paying to take the assessment. Any optional counselling or separate program services may have their own terms.',
  },
  {
    question: 'How does the Career-Fit Finder recommend a degree?',
    answer:
      'The tool evaluates your responses against its program-matching criteria to identify options that may align with your qualifications, interests and goals. Recommendations are guidance, not a guarantee of admission or career outcomes.',
  },
  {
    question: 'Who should use this career quiz?',
    answer:
      'Students exploring higher education, graduates considering further study, and working professionals planning a career change can use the quiz to explore potential learning paths.',
  },
  {
    question: 'How long does the assessment take?',
    answer:
      'The assessment is designed to be quick. The time required depends on how you complete the questions and the information requested by the tool.',
  },
  {
    question: 'Will the results guarantee a job or a particular salary?',
    answer:
      'No. Career recommendations and salary estimates cannot guarantee employment, earnings or promotion. Actual outcomes depend on your experience, skills, location, employer and market conditions.',
  },
  {
    question: 'Does a career match mean I am eligible for admission?',
    answer:
      'No. A career match indicates potential alignment with your interests and goals. Admission eligibility depends on the specific program requirements, your qualifications and the institution’s current admission rules.',
  },
];

const benefits = [
  {
    icon: Compass,
    number: '01',
    title: 'Discover your direction',
    description:
      'Explore learning paths that align with your interests and career ambitions.',
    color: 'bg-violet-100 text-violet-700',
  },
  {
    icon: Target,
    number: '02',
    title: 'Compare relevant options',
    description:
      'Use your profile to explore programs instead of choosing by guesswork alone.',
    color: 'bg-sky-100 text-sky-700',
  },
  {
    icon: TrendingUp,
    number: '03',
    title: 'Plan your next move',
    description:
      'Use your results to identify practical next steps in your education or career.',
    color: 'bg-orange-100 text-orange-700',
  },
];

const softwareAppLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: `${BRAND} Career-Fit Finder`,
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  description:
    'A free career assessment tool that helps users explore degree and program options based on their interests, qualifications and goals.',
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
      name: 'Career-Fit Finder',
      item: `${SITE_URL}${PATH}`,
    },
  ],
};

export default function CareerFitFinderPage() {
  return (
    <div className="w-full bg-[#fcfbff] text-slate-900">
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

        <div className="pointer-events-none absolute -right-24 top-0 -z-10 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />

        <div className="pointer-events-none absolute -left-24 bottom-0 -z-10 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/90 px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm">
            <Sparkles size={16} />
            Free Career-Fit Assessment
          </div>

          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Which Degree Is Right for You?
            <span className="mt-2 block bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500 bg-clip-text text-transparent">
              Find a Path That Fits Your Goals.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Not sure what to study next? Explore degree and program options
            based on your interests, qualifications and career ambitions with
            the {BRAND} Career-Fit Finder.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="#assessment"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              Find My Career Fit
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
              Personalized guidance
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Clear next steps
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
                key={benefit.number}
                className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-100/60"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${benefit.color}`}
                  >
                    <Icon size={23} />
                  </span>

                  <span className="text-sm font-bold text-slate-300">
                    {benefit.number}
                  </span>
                </div>

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
              A simpler way to choose
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              From career questions to clearer options
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              Start with your goals, explore relevant options and decide what
              to investigate next.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                number: '01',
                title: 'Share your profile',
                description:
                  'Answer the assessment questions about your background, interests and goals.',
                color: 'bg-violet-100 text-violet-700',
              },
              {
                number: '02',
                title: 'Explore your matches',
                description:
                  'Review the program recommendations generated from your responses.',
                color: 'bg-sky-100 text-sky-700',
              },
              {
                number: '03',
                title: 'Choose your next step',
                description:
                  'Compare your options and investigate the requirements that matter to you.',
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

      {/* Interactive assessment */}
      <section
        id="assessment"
        className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20"
        aria-label="Career-Fit Finder assessment"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
              <GraduationCap size={17} />
              Your career exploration starts here
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Find Programs That Fit Your Goals
            </h2>

            <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-500">
              Complete the assessment below to explore program options
              relevant to your profile.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-violet-100/40 sm:p-8">
            <CareerFitFinderApp />
          </div>
        </div>
      </section>

      {/* Trust and methodology */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="mx-auto max-w-5xl rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-6 sm:p-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm">
              <Target size={24} />
            </span>

            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Make an informed career decision
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Use your results as a starting point for comparing courses,
                career directions and learning requirements. Review each
                program&apos;s current eligibility criteria, curriculum, fees
                and available outcome data before making a decision.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Recommendations are indicative and do not guarantee admission,
                employment or salary outcomes.
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
              Everything You Need to Know
            </h2>

            <p className="mt-3 text-slate-500">
              Understand how the assessment works before you get started.
            </p>
          </div>

          <FAQAccordion items={FAQ_ITEMS} />
        </div>
      </section>

      {/* Other tools */}
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
            Take the next step
          </span>

          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Stop Guessing. Start Exploring Your Career Options.
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-violet-100">
            Use your profile to explore relevant programs and decide which
            options deserve a closer look.
          </p>

          <Link
            href="#assessment"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-violet-700 transition hover:-translate-y-0.5 hover:bg-violet-50"
          >
            Find My Career Fit
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Existing counsellor CTA */}
      <section className="px-5 pb-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <CTASection
            heading="Need help comparing your options?"
            subheading="Speak with a counsellor to understand the available programs and their requirements."
            primaryLabel="Take the Quiz"
            primaryHref="#assessment"
            secondaryLabel="Talk to a Counsellor"
            secondaryHref={`https://wa.me/${(
              process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
            ).replace(/[^0-9]/g, '')}`}
          />
        </div>
      </section>
    </div>
  );
}
