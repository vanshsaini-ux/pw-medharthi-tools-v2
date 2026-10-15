
import type { Metadata } from 'next';
import EligibilityCheckerApp from './EligibilityCheckerApp';
import FAQAccordion from '@/components/FAQAccordion';
import RelatedTools from '@/components/RelatedTools';
import CTASection from '@/components/CTASection';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.pwmedharthi.com';

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || 'PW Medharthi';
const PATH = '/eligibility-checker';

const PAGE_TITLE =
  'Free Eligibility Checker: Check Course Admission Eligibility';

const PAGE_DESCRIPTION =
  'Check your eligibility for available programmes based on your qualification and experience. Explore admission requirements and find programmes that may fit your academic background.';

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
    question: 'How can I check my course eligibility online?',
    answer:
      'Select the relevant options in the Eligibility Checker and provide the academic information requested. Review the result and verify the programme-specific admission requirements before applying.',
  },
  {
    question: 'Is the Eligibility Checker free to use?',
    answer:
      'The checker is designed to help you explore admission eligibility. Use the options available in the tool to check your result and review any additional steps presented.',
  },
  {
    question: 'What qualifications do I need to check eligibility?',
    answer:
      'The required information depends on the programme. You may need to provide your highest qualification, graduation status, marks or percentage, and relevant work experience.',
  },
  {
    question: 'What does eligible with a bridge course mean?',
    answer:
      'It indicates that an applicant may need to complete an additional foundation or bridge course before meeting the relevant programme requirements. Confirm the exact requirement with the institution before applying.',
  },
  {
    question: 'What if I am not eligible for my preferred programme?',
    answer:
      'Review the reason shown in your result and check the admission criteria. You can also explore alternative programmes that may better match your qualification and experience, where those options are available.',
  },
  {
    question: 'Does checking eligibility guarantee admission?',
    answer:
      'No. An eligibility result is an initial assessment, not an admission offer. Final admission depends on the institution’s official criteria, document verification and any additional requirements.',
  },
  {
    question: 'Can working professionals check their eligibility?',
    answer:
      'Yes. Working professionals can use the checker to review programme requirements based on their academic qualifications and any relevant work experience requested by the tool.',
  },
  {
    question: 'Should I verify eligibility before applying?',
    answer:
      'Yes. Always confirm the latest admission requirements, recognition status, required documents, deadlines and applicable conditions using the official institution or programme information.',
  },
];

export default function EligibilityCheckerPage() {
  const softwareAppLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${BRAND} Eligibility Checker`,
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
        name: 'Eligibility Checker',
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
            Your Next Step Starts With Eligibility
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
            Find Out If You Qualify for Your
            <span className="mt-2 block bg-gradient-to-r from-violet-600 via-purple-600 to-sky-500 bg-clip-text text-transparent">
              Next Course.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Check programme eligibility based on your academic
            background and experience. Understand the requirements
            before taking your next step.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#eligibility-tool"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 sm:w-auto"
            >
              Check My Eligibility
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
              Qualification-based assessment
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              Clear eligibility guidance
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              Explore your options
            </span>
          </div>
        </div>
      </section>

      {/* Eligibility tool */}
      <section id="eligibility-tool" className="scroll-mt-8">
        <div className="mb-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-violet-600">
            Your eligibility assessment
          </p>

          <h2 className="mt-2 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            Check Your Course Eligibility
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Enter the information requested by the checker to review
            the eligibility result for your intended programme.
          </p>
        </div>

        <div className="mx-auto w-full max-w-5xl">
          <EligibilityCheckerApp />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-8">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-violet-600">
            Simple steps
          </p>

          <h2 className="mt-2 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            How the Eligibility Checker Works
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            Review your academic background against the relevant
            programme requirements.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              number: '01',
              title: 'Enter Your Qualification',
              description:
                'Provide the academic details and experience requested by the checker.',
              style: 'bg-violet-100 text-violet-700',
            },
            {
              number: '02',
              title: 'Review Your Result',
              description:
                'Read the eligibility status and any conditions or additional requirements shown.',
              style: 'bg-sky-100 text-sky-700',
            },
            {
              number: '03',
              title: 'Explore Your Options',
              description:
                'Verify the official criteria and investigate alternative programmes where available.',
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

      {/* Trust and accuracy */}
      <section className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-violet-50 p-6 sm:p-8">
        <h2 className="font-display text-xl font-bold text-navy-900 sm:text-2xl">
          Verify Your Eligibility Before You Apply
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Use your result as an initial guide, then confirm the
          latest admission criteria with the relevant institution.
          Requirements can vary by programme, qualification,
          recognition status and admission cycle. A preliminary
          eligibility result is not an admission guarantee.
        </p>
      </section>

      {/* FAQs */}
      <section>
        <div className="mb-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-violet-600">
            Frequently asked questions
          </p>

          <h2 className="mt-2 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
            Eligibility Checker FAQs
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Find answers about qualifications, admission criteria and
            eligibility results.
          </p>
        </div>

        <FAQAccordion items={FAQ_ITEMS} />
      </section>

      {/* Related tools */}
      <RelatedTools excludeHref={PATH} />

      {/* CTA */}
      <CTASection
        heading="Ready to Take Your Next Step?"
        subheading="Check your eligibility and explore the programmes that may suit your academic background."
        primaryLabel="Check My Eligibility"
        primaryHref="#eligibility-tool"
      />
    </div>
  );
}
