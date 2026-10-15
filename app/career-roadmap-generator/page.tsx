
import type { Metadata } from 'next';
import CareerRoadmapGeneratorApp from './CareerRoadmapGeneratorApp';
import FAQAccordion from '@/components/FAQAccordion';
import RelatedTools from '@/components/RelatedTools';
import CTASection from '@/components/CTASection';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.pwmedharthi.com';

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || 'PW Medharthi';
const PATH = '/career-roadmap-generator';

const PAGE_TITLE =
  'Free AI Career Roadmap Generator: Build Your Career Plan';

const PAGE_DESCRIPTION =
  'Create a personalized career roadmap with skills to learn, projects to build and milestones to follow. Plan your next career move with the free Career Roadmap Generator.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PATH,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    siteName: BRAND,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

const FAQ_ITEMS = [
  {
    question: 'What is an AI career roadmap generator?',
    answer:
      'A career roadmap generator helps you turn a career goal into a structured plan. Depending on the information and options supported by the tool, your roadmap can outline learning priorities, skills, projects and milestones.',
  },
  {
    question: 'Is the Career Roadmap Generator free?',
    answer:
      'The generator is designed to help you plan your career using the available tool features. Follow the instructions shown in the application to see which results and additional features are available without charge.',
  },
  {
    question: 'Can I create a roadmap for a career change?',
    answer:
      'Yes. Describe your target career and provide your current background, experience and timeline where requested. Use the generated roadmap to identify skills and experience you may need to develop.',
  },
  {
    question: 'Can I create a roadmap for a job role that is not listed?',
    answer:
      'If the generator provides a custom-role field, enter your target job title and describe your goal. The usefulness of the result will depend on the role information and matching logic supported by the tool.',
  },
  {
    question: 'How long does it take to follow a career roadmap?',
    answer:
      'The timeline depends on your starting skills, target role, available study time and the experience required. Treat the suggested schedule as a planning guide and adjust it as you progress.',
  },
  {
    question: 'Does a career roadmap guarantee a job?',
    answer:
      'No. A roadmap can help organize your learning and career preparation, but it cannot guarantee employment, a particular salary or a promotion. Outcomes also depend on your skills, experience and employer requirements.',
  },
  {
    question: 'Can students and fresh graduates use this tool?',
    answer:
      'Yes. Students and fresh graduates can use a career roadmap to identify relevant skills, plan projects, explore entry-level roles and organize their preparation for the job market.',
  },
  {
    question: 'How should I use my career roadmap?',
    answer:
      'Start with the first milestone, set realistic weekly goals, practice the recommended skills, build demonstrable projects and review your progress regularly. Update the plan when your goals or circumstances change.',
  },
];

export default function CareerRoadmapGeneratorPage() {
  const softwareAppLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${BRAND} Career Roadmap Generator`,
    description: PAGE_DESCRIPTION,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
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
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
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
        name: 'Career Roadmap Generator',
        item: `${SITE_URL}${PATH}`,
      },
    ],
  };

  return (
    <div
      id="top"
      className="mx-auto w-full max-w-6xl space-y-12 px-4 py-8 sm:space-y-16 sm:px-6 sm:py-12 lg:px-8"
    >
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareAppLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-sky-50 px-5 py-12 text-center sm:px-10 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-violet-200/40 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl"
        />

        <div className="relative mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/90 px-4 py-2 text-xs font-bold text-violet-700 shadow-sm sm:text-sm">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-violet-500"
            />
            Your Career. Your Plan. Your Next Step.
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
            Turn Your Career Goal Into a
            <span className="mt-2 block bg-gradient-to-r from-violet-600 via-purple-600 to-sky-500 bg-clip-text text-transparent">
              Step-by-Step Roadmap.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Know what to learn, which skills to build and what to work
            on next. Create a career plan around your target role,
            starting point and goals.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#career-roadmap-tool"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 sm:w-auto"
            >
              Build My Career Roadmap
              <span aria-hidden="true">→</span>
            </a>

            <a
              href="#how-it-works"
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 sm:w-auto"
            >
              See How It Works
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs font-medium text-slate-500 sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              Skills to develop
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              Career milestones
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              Actionable next steps
            </span>
          </div>
        </div>
      </section>

      {/* Generator */}
      <section id="career-roadmap-tool" className="scroll-mt-8">
        <div className="mb-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-violet-600">
            Your personalized career plan
          </p>

          <h2 className="mt-2 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            Build a Roadmap for Your Dream Career
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Tell the generator what you want to achieve and use the
            resulting plan to organize your learning and career
            preparation.
          </p>
        </div>

        <div className="mx-auto w-full max-w-5xl">
          <CareerRoadmapGeneratorApp />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-8">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-violet-600">
            A clearer path forward
          </p>

          <h2 className="mt-2 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            From Career Goal to Action Plan
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            Break a big career ambition into manageable learning and
            development milestones.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              number: '01',
              title: 'Define Your Goal',
              description:
                'Choose or describe the role you want and provide the background information requested by the generator.',
              style: 'bg-violet-100 text-violet-700',
            },
            {
              number: '02',
              title: 'Generate Your Roadmap',
              description:
                'Review the suggested learning priorities, skills, projects and milestones produced by the tool.',
              style: 'bg-sky-100 text-sky-700',
            },
            {
              number: '03',
              title: 'Take the Next Step',
              description:
                'Follow the plan, practice relevant skills, track your progress and adapt your milestones as you learn.',
              style: 'bg-orange-100 text-orange-700',
            },
          ].map((step) => (
            <div
              key={step.number}
              className="rounded-3xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-extrabold ${step.style}`}
              >
                {step.number}
              </span>

              <h3 className="mt-5 text-lg font-bold text-navy-900">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-9">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-violet-600">
              Plan with purpose
            </p>

            <h2 className="mt-3 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
              Know What to Learn and What to Do Next
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              A clear career plan helps you organize your priorities
              instead of trying to learn everything at once. Use your
              roadmap as a starting point for building relevant skills
              and experience.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                title: 'Skill priorities',
                description:
                  'Identify areas to focus on for your target role.',
                style: 'bg-violet-100 text-violet-700',
              },
              {
                title: 'Learning direction',
                description:
                  'Organize your learning around specific goals.',
                style: 'bg-sky-100 text-sky-700',
              },
              {
                title: 'Practical projects',
                description:
                  'Explore ways to demonstrate your developing skills.',
                style: 'bg-orange-100 text-orange-700',
              },
              {
                title: 'Progress milestones',
                description:
                  'Break your longer-term goal into smaller steps.',
                style: 'bg-emerald-100 text-emerald-700',
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
              >
                <span
                  className={`inline-flex rounded-xl px-3 py-1.5 text-xs font-bold ${benefit.style}`}
                >
                  {benefit.title}
                </span>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust and limitations */}
      <section className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-violet-50 p-6 sm:p-8">
        <h2 className="font-display text-xl font-bold text-navy-900 sm:text-2xl">
          Make Your Roadmap Work for You
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Your roadmap is a planning aid, not a guaranteed career
          outcome. Review the suggested milestones against actual job
          descriptions, your existing skills and the time you can
          realistically commit. Update your plan as your experience and
          career goals evolve.
        </p>
      </section>

      {/* FAQ */}
      <section>
        <div className="mb-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-violet-600">
            Frequently asked questions
          </p>

          <h2 className="mt-2 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            Career Roadmap Generator FAQs
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Learn how to create and use a roadmap for your career goals.
          </p>
        </div>

        <FAQAccordion items={FAQ_ITEMS} />
      </section>

      {/* Related tools */}
      <RelatedTools excludeHref={PATH} />

      {/* CTA */}
      <CTASection
        heading="Your Next Career Move Starts Here"
        subheading="Turn your ambition into a practical plan with clear learning priorities and milestones."
        primaryLabel="Build My Career Roadmap"
        primaryHref="#career-roadmap-tool"
      />
    </div>
  );
}
