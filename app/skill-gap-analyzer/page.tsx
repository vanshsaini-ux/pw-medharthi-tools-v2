
import type { Metadata } from 'next';
import SkillGapAnalyzerApp from './SkillGapAnalyzerApp';
import FAQAccordion from '@/components/FAQAccordion';
import RelatedTools from '@/components/RelatedTools';
import CTASection from '@/components/CTASection';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.pwmedharthi.com';

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || 'PW Medharthi';
const PATH = '/skill-gap-analyzer';

const PAGE_TITLE =
  'Free Skill Gap Analyzer: Check Your Job Readiness | PW Medharthi';

const PAGE_DESCRIPTION =
  'Find out which skills you need for your target career. Analyze your resume, identify potential skill gaps, and discover what to learn next with the free Skill Gap Analyzer.';

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
    question: 'What is a skill gap analyzer?',
    answer:
      'A skill gap analyzer helps you compare the skills in your resume or profile with the skills expected for a target role. It can help identify areas to improve and prioritize your learning.',
  },
  {
    question: 'Is the Skill Gap Analyzer free?',
    answer:
      'You can use the Skill Gap Analyzer to evaluate your skills using the options available in the tool. Check the results and any additional steps shown in the interface for the current access conditions.',
  },
  {
    question: 'Can I analyze my resume?',
    answer:
      'Use the resume upload option if it is available in the tool. You can also use any supported text-entry option to provide your professional background and skills.',
  },
  {
    question: 'Can I use this tool without work experience?',
    answer:
      'Yes. Students, fresh graduates, career changers and working professionals can use a skill assessment to identify relevant skills to develop for their target roles.',
  },
  {
    question: 'How does the analyzer identify missing skills?',
    answer:
      'The analyzer evaluates the information you provide against the role requirements and matching rules implemented in the tool. Results depend on the quality of your input and the data used for comparison.',
  },
  {
    question: 'Does a high score guarantee a job?',
    answer:
      'No. A skill match is an indication of alignment with the criteria used by the analyzer. Hiring decisions also depend on experience, interviews, qualifications, communication and employer requirements.',
  },
  {
    question: 'What should I do after finding my skill gaps?',
    answer:
      'Prioritize the gaps most relevant to your target role. Build a learning plan, practice the required skills, complete relevant projects and update your resume as you gain demonstrable experience.',
  },
  {
    question: 'Is my resume information shared?',
    answer:
      'Review the tool and website privacy policy for details about how submitted information is processed, stored and shared. Do not upload sensitive personal information that is not necessary for your assessment.',
  },
];

export default function SkillGapAnalyzerPage() {
  const softwareAppLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${BRAND} Skill Gap Analyzer`,
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
        name: 'Skill Gap Analyzer',
        item: `${SITE_URL}${PATH}`,
      },
    ],
  };

  return (
<div
  id="top"
  className="mx-auto w-full max-w-6xl space-y-12 px-4 py-8 sm:space-y-16 sm:px-6 sm:py-12 lg:px-8"
>      {/* Structured data */}
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
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-violet-200/30 blur-3xl"
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
            Free Career Skills Assessment
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
            Are You Ready for Your Dream Job?
            <span className="mt-2 block bg-gradient-to-r from-violet-600 via-purple-600 to-sky-500 bg-clip-text text-transparent">
              Find Your Skill Gaps.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Discover which skills you already have, identify areas to
            improve, and understand what to learn next for your target
            career. Start with your resume or the input options available
            in the tool.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#skill-gap-tool"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 sm:w-auto"
            >
              Analyze My Skills
              <span aria-hidden="true">→</span>
            </a>

            <a
              href="#how-it-works"
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 sm:w-auto"
            >
              How It Works
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs font-medium text-slate-500 sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              Skill assessment
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              Career-focused insights
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              Actionable next steps
            </span>
          </div>
        </div>
      </section>

      {/* Tool */}
      <section id="skill-gap-tool" className="scroll-mt-8">
        <div className="mb-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-violet-600">
            Your career assessment
          </p>

          <h2 className="mt-2 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            Find the Skills You Need to Grow
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Provide your professional background and target role to
            explore your skills and potential areas for improvement.
          </p>
        </div>

        <SkillGapAnalyzerApp />
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-8">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-violet-600">
            Simple three-step process
          </p>

          <h2 className="mt-2 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            From Skill Gaps to a Clear Learning Plan
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            Use your assessment to understand where you stand and
            decide what to improve next.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              number: '01',
              title: 'Share Your Skills',
              description:
                'Provide your resume or professional information using the input options supported by the analyzer.',
              style: 'bg-violet-100 text-violet-700',
            },
            {
              number: '02',
              title: 'Review Your Skill Gaps',
              description:
                'Compare your current skills with the requirements used by the analyzer for your target career.',
              style: 'bg-sky-100 text-sky-700',
            },
            {
              number: '03',
              title: 'Plan Your Next Steps',
              description:
                'Use the results to prioritize learning, practice relevant skills and strengthen your career profile.',
              style: 'bg-orange-100 text-orange-700',
            },
          ].map((step) => (
            <div
              key={step.number}
              className="rounded-3xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-extrabold ${step.style}`}
                >
                  {step.number}
                </span>
              </div>

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
              Why assess your skills?
            </p>

            <h2 className="mt-3 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
              Make Your Next Career Move With More Clarity
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              A job title alone does not tell you whether your skills
              match a role. Reviewing specific skill requirements can
              help you make your learning more focused.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                title: 'Identify priorities',
                description:
                  'Focus on skills relevant to your target role.',
                style: 'bg-violet-100 text-violet-700',
              },
              {
                title: 'Improve your profile',
                description:
                  'Identify skills to demonstrate in your resume.',
                style: 'bg-sky-100 text-sky-700',
              },
              {
                title: 'Plan learning',
                description:
                  'Build a practical plan around your skill gaps.',
                style: 'bg-orange-100 text-orange-700',
              },
              {
                title: 'Track progress',
                description:
                  'Reassess your skills as your experience grows.',
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
          Understand Your Results
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Your results depend on the information you provide and the
          role requirements and matching rules used by the tool. Use
          them as a guide for learning and career planning, not as a
          guarantee of employment or a substitute for an employer&apos;s
          assessment.
        </p>
      </section>

      {/* FAQ */}
      <section>
        <div className="mb-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-violet-600">
            Frequently asked questions
          </p>

          <h2 className="mt-2 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            Skill Gap Analyzer FAQs
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Learn how skill assessments work and how to use your results.
          </p>
        </div>

        <FAQAccordion items={FAQ_ITEMS} />
      </section>

      {/* Related tools */}
      <RelatedTools excludeHref={PATH} />

      {/* CTA */}
      <CTASection
        heading="Ready to Close Your Skill Gaps?"
        subheading="Assess your current skills, identify learning priorities, and take the next step toward your career goals."
        primaryLabel="Analyze My Skills"
        primaryHref="#skill-gap-tool"
      />
    </div>
  );
}
