
'use client';

import { useEffect, useState } from 'react';
import {
  GraduationCap,
  BriefcaseBusiness,
  Percent,
  MapPin,
  CheckCircle2,
  CircleAlert,
  ArrowRight,
  RotateCcw,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

import FormField from '@/components/FormField';
import SelectField from '@/components/SelectField';
import NumberInput from '@/components/NumberInput';
import LoadingState from '@/components/LoadingState';
import ErrorMessage from '@/components/ErrorMessage';
import ResultCard from '@/components/ResultCard';
import ShareButton from '@/components/ShareButton';
import LeadForm from '@/components/LeadForm';

import {
  checkEligibility,
  EligibilityResult,
  EligibilityStatus,
  QUALIFICATION_LEVELS,
  CATEGORIES,
} from '@/tools/eligibilityChecker';

import {
  PROGRAMS,
  groupProgramsForSelect,
} from '@/config/programs';

import { Category, QualificationLevel } from '@/types';
import { trackEvent } from '@/lib/analytics';

type Stage =
  | 'form'
  | 'loading'
  | 'result'
  | 'apply_form'
  | 'applied'
  | 'error';

const SUGGEST_BEST_FIT_OPTION = [
  {
    value: 'suggest_best_fit',
    label: 'Suggest the best fit for me',
  },
];

const PROGRAM_GROUPS = groupProgramsForSelect(PROGRAMS);

const STATUS_COPY: Record<
  EligibilityStatus,
  {
    label: string;
    description: string;
    accent: 'teal' | 'amber' | 'coral';
    icon: typeof CheckCircle2;
  }
> = {
  eligible: {
    label: 'Eligible',
    description: 'Your details match the configured eligibility criteria.',
    accent: 'teal',
    icon: CheckCircle2,
  },
  eligible_with_bridge: {
    label: 'Eligible with Bridge Course',
    description: 'Additional foundation requirements may apply.',
    accent: 'amber',
    icon: CircleAlert,
  },
  not_eligible: {
    label: 'Not Eligible',
    description: 'Review the requirements and alternative options below.',
    accent: 'coral',
    icon: CircleAlert,
  },
};

function SelectionCard({
  selected,
  icon: Icon,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  icon: typeof GraduationCap;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative flex min-h-32 w-full items-start gap-4 rounded-2xl border p-5 text-left transition duration-200 sm:p-6 ${
        selected
          ? 'border-violet-400 bg-violet-50 shadow-sm ring-2 ring-violet-200'
          : 'border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/40'
      }`}
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition ${
          selected
            ? 'bg-violet-600 text-white'
            : 'bg-slate-100 text-slate-600 group-hover:bg-violet-100 group-hover:text-violet-700'
        }`}
      >
        <Icon size={23} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-base font-bold text-slate-900 sm:text-lg">
          {title}
        </span>
        <span className="mt-1 block text-sm leading-6 text-slate-500">
          {description}
        </span>
      </span>

      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
          selected
            ? 'border-violet-600 bg-violet-600 text-white'
            : 'border-slate-300 text-transparent'
        }`}
      >
        {selected && <CheckCircle2 size={16} />}
      </span>
    </button>
  );
}

function FormSection({
  icon: Icon,
  title,
  description,
  children,
  color = 'violet',
}: {
  icon: typeof GraduationCap;
  title: string;
  description: string;
  children: React.ReactNode;
  color?: 'violet' | 'blue' | 'orange';
}) {
  const iconStyles = {
    violet: 'bg-violet-100 text-violet-700',
    blue: 'bg-sky-100 text-sky-700',
    orange: 'bg-orange-100 text-orange-700',
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
      <div className="mb-5 flex items-start gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyles[color]}`}
        >
          <Icon size={21} />
        </span>

        <div className="min-w-0 pt-0.5">
          <h3 className="font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

export default function EligibilityCheckerApp() {
  const [stage, setStage] = useState<Stage>('form');

  const [qualificationLevel, setQualificationLevel] =
    useState<QualificationLevel>('bachelor');

  const [percentage, setPercentage] = useState(60);
  const [category, setCategory] = useState<Category>('General');
  const [experienceYears, setExperienceYears] = useState(0);

  const [targetProgramSlug, setTargetProgramSlug] =
    useState('suggest_best_fit');

  const [results, setResults] = useState<EligibilityResult[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    trackEvent('tool_page_viewed', {
      tool: 'eligibility-checker',
    });
  }, []);

  function handleCheck() {
    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
      setFormError(
        'Enter a percentage or CGPA-equivalent between 0 and 100.'
      );
      return;
    }

    if (
      !Number.isFinite(experienceYears) ||
      experienceYears < 0 ||
      experienceYears > 40
    ) {
      setFormError('Enter work experience between 0 and 40 years.');
      return;
    }

    setFormError(null);
    setStage('loading');

    trackEvent('tool_started', {
      tool: 'eligibility-checker',
    });

    window.setTimeout(() => {
      try {
        const response = checkEligibility({
          qualificationLevel,
          percentage,
          category,
          experienceYears,
          targetProgramSlug,
        });

        if (!response) {
          setStage('error');
          return;
        }

        const nextResults = Array.isArray(response)
          ? response
          : [response];

        setResults(nextResults);
        setStage('result');

        trackEvent('calculation_completed', {
          tool: 'eligibility-checker',
        });

        trackEvent('result_viewed', {
          tool: 'eligibility-checker',
        });
      } catch {
        setStage('error');
      }
    }, 350);
  }

  function reset() {
    setStage('form');
    setResults([]);
    setFormError(null);
  }

  const userInputsSummary =
    `Qualification: ${qualificationLevel}; ` +
    `Percentage: ${percentage}; Category: ${category}; ` +
    `Experience: ${experienceYears} years; ` +
    `Target: ${targetProgramSlug}`;

  const resultSummary = results
    .map((result) => `${result.program.name}: ${result.status}`)
    .join(' | ');

  const whatsappNumber = (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
  ).replace(/[^0-9]/g, '');

  if (stage === 'error') {
    return (
      <ErrorMessage
        message="We couldn't check eligibility for those details. Please review your inputs and try again."
        onRetry={reset}
      />
    );
  }

  if (stage === 'loading') {
    return (
      <div className="rounded-3xl border border-violet-100 bg-white p-8 sm:p-12">
        <LoadingState label="Reviewing your details against the configured programme criteria…" />
      </div>
    );
  }

  if (
    stage === 'result' ||
    stage === 'apply_form' ||
    stage === 'applied'
  ) {
    return (
      <div className="space-y-6">
        <section className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200">
              <Sparkles size={23} />
            </span>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-violet-700">
                Assessment complete
              </p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Your Eligibility Results
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Review your results and the reasons behind each
                programme assessment.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {results.map((result) => {
              const status = STATUS_COPY[result.status];
              const StatusIcon = status.icon;

              const statusStyles = {
                teal: {
                  border: 'border-emerald-200',
                  bg: 'bg-emerald-50',
                  text: 'text-emerald-800',
                  icon: 'bg-emerald-100 text-emerald-700',
                },
                amber: {
                  border: 'border-amber-200',
                  bg: 'bg-amber-50',
                  text: 'text-amber-800',
                  icon: 'bg-amber-100 text-amber-700',
                },
                coral: {
                  border: 'border-rose-200',
                  bg: 'bg-rose-50',
                  text: 'text-rose-800',
                  icon: 'bg-rose-100 text-rose-700',
                },
              }[status.accent];

              return (
                <article
                  key={result.program.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-bold leading-6 text-slate-900">
                      {result.program.name}
                    </h3>

                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${statusStyles.icon}`}
                    >
                      <StatusIcon size={20} />
                    </span>
                  </div>

                  <div
                    className={`mt-4 inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${statusStyles.border} ${statusStyles.bg} ${statusStyles.text}`}
                  >
                    {status.label}
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {status.description}
                  </p>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Assessment details
                    </p>

                    <ul className="space-y-2">
                      {result.reasons.map((reason) => (
                        <li
                          key={reason}
                          className="flex items-start gap-2 text-sm leading-6 text-slate-600"
                        >
                          <CheckCircle2
                            size={16}
                            className="mt-1 shrink-0 text-violet-600"
                          />
                          <span>{reason}</span>
                        </li>
                      ))}

                      {result.reasons.length === 0 && (
                        <li className="text-sm leading-6 text-slate-600">
                          No additional explanation was returned by the
                          current eligibility rules.
                        </li>
                      )}
                    </ul>
                  </div>

                  {result.alternativePrograms.length > 0 && (
                    <div className="mt-5 rounded-xl bg-sky-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-sky-800">
                        Alternative programmes
                      </p>

                      <ul className="mt-2 space-y-2">
                        {result.alternativePrograms.map((alternative) => (
                          <li
                            key={alternative.id}
                            className="flex items-start gap-2 text-sm font-medium text-slate-700"
                          >
                            <BookOpen
                              size={16}
                              className="mt-0.5 shrink-0 text-sky-600"
                            />
                            {alternative.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <p className="mt-5 text-xs leading-5 text-slate-500">
            This is an initial assessment based on the configured
            eligibility rules. Confirm current admission requirements
            with the relevant institution before applying.
          </p>
        </section>

        {stage === 'result' && (
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => setStage('apply_form')}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              Continue to Application
              <ArrowRight size={17} />
            </button>

            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
              >
                <MessageCircle size={17} />
                Talk to Admissions
              </a>
            )}

            <ShareButton
              toolSlug="eligibility-checker"
              title="My Eligibility Result"
              text={`My eligibility result: ${resultSummary}`}
            />

            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <RotateCcw size={16} />
              Check Again
            </button>
          </div>
        )}

        {stage === 'apply_form' && (
          <LeadForm
            toolUsed="eligibility-checker"
            userInputsSummary={userInputsSummary}
            resultSummary={resultSummary}
            requirePhone
            submitLabel="Request Admission Guidance"
            onSuccess={() => setStage('applied')}
          />
        )}

        {stage === 'applied' && (
          <ResultCard title="Request submitted" accent="teal">
            <p>
              Your request has been submitted. Follow the next steps
              provided by the application process.
            </p>
          </ResultCard>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
      <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50 via-white to-sky-50 px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200">
            <ShieldCheck size={24} />
          </span>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-700">
              Free eligibility assessment
            </p>

            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Find the Programme That Fits You
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Share your academic background and preferences to
              explore available programme options.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:space-y-6 sm:p-8">
        <FormSection
          icon={GraduationCap}
          title="Your academic background"
          description="Select your highest qualification."
        >
          <FormField
            label="Highest qualification"
            htmlFor="qualificationLevel"
            required
          >
            <SelectField
              id="qualificationLevel"
              options={QUALIFICATION_LEVELS}
              value={qualificationLevel}
              onChange={(event) =>
                setQualificationLevel(
                  event.target.value as QualificationLevel
                )
              }
            />
          </FormField>

          <FormField
            label="Percentage / CGPA equivalent"
            htmlFor="percentage"
            required
            error={formError || undefined}
            hint="Enter a value between 0 and 100."
          >
            <NumberInput
              id="percentage"
              min={0}
              max={100}
              step={0.1}
              value={percentage}
              onChange={(event) =>
                setPercentage(Number(event.target.value))
              }
            />
          </FormField>
        </FormSection>

        <FormSection
          icon={Percent}
          title="Additional details"
          description="These details help evaluate the configured criteria."
          color="blue"
        >
          <FormField
            label="Category"
            htmlFor="category"
            required
            hint="Use the category applicable to your situation."
          >
            <SelectField
              id="category"
              options={CATEGORIES}
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as Category)
              }
            />
          </FormField>

          <FormField
            label="Work experience (years)"
            htmlFor="experienceYears"
            required
            hint="Enter 0 if you have no work experience."
          >
            <NumberInput
              id="experienceYears"
              min={0}
              max={40}
              step={1}
              value={experienceYears}
              onChange={(event) =>
                setExperienceYears(Number(event.target.value))
              }
            />
          </FormField>
        </FormSection>

        <FormSection
          icon={MapPin}
          title="Your preferred programme"
          description="Choose a programme or let the checker suggest an option."
          color="orange"
        >
          <FormField
            label="Target programme"
            htmlFor="targetProgramSlug"
            required
          >
            <SelectField
              id="targetProgramSlug"
              options={SUGGEST_BEST_FIT_OPTION}
              groups={PROGRAM_GROUPS}
              value={targetProgramSlug}
              onChange={(event) =>
                setTargetProgramSlug(event.target.value)
              }
            />
          </FormField>
        </FormSection>

        <div className="rounded-2xl bg-slate-50 p-4 sm:p-5">
          <p className="text-sm leading-6 text-slate-600">
            <span className="font-bold text-slate-800">
              Before you continue:
            </span>{' '}
            Your result is an initial assessment, not an admission
            guarantee. Verify the programme&apos;s official requirements.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCheck}
          className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200"
        >
          Check My Eligibility
          <ArrowRight size={19} />
        </button>

        <p className="text-center text-xs text-slate-400">
          Review your result before deciding to apply.
        </p>
      </div>
    </div>
  );
}
