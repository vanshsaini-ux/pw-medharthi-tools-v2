
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  MapPin,
  PiggyBank,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react';

import FormField from '@/components/FormField';
import SelectField from '@/components/SelectField';
import NumberInput from '@/components/NumberInput';
import LoadingState from '@/components/LoadingState';
import ErrorMessage from '@/components/ErrorMessage';
import ResultCard from '@/components/ResultCard';
import ShareButton from '@/components/ShareButton';
import LeadForm from '@/components/LeadForm';
import SalaryCurveChart from '@/components/SalaryCurveChart';

import {
  calculateRoi,
  type RoiResult,
  WORK_MODES,
} from '@/tools/roiCalculator';

import {
  PROGRAMS,
  groupProgramsForSelect,
} from '@/config/programs';

import type { WorkMode } from '@/types';
import { trackEvent } from '@/lib/analytics';

type Stage =
  | 'form'
  | 'loading'
  | 'teaser'
  | 'gated_form'
  | 'full'
  | 'error';

type ProgramMetadata = {
  name?: string;
  title?: string;
  slug?: string;
  level?: string;
  degreeLevel?: string;
  category?: string;
  qualification?: string;
  degreeType?: string;
  programType?: string;
  type?: string;
  description?: string;
};

const ALL_PROGRAM_GROUPS = groupProgramsForSelect(PROGRAMS);

const ALL_PROGRAM_OPTIONS = ALL_PROGRAM_GROUPS.flatMap(
  (group) => group.options,
);

/**
 * Identifies undergraduate programs using the available program metadata
 * and title/slug. Adjust these rules to match config/programs.ts.
 */
function isUndergraduateProgram(program: unknown): boolean {
  if (!program || typeof program !== 'object') {
    return false;
  }

  const item = program as ProgramMetadata;

  const metadata = [
    item.level,
    item.degreeLevel,
    item.category,
    item.qualification,
    item.degreeType,
    item.programType,
    item.type,
  ]
    .filter((value): value is string => typeof value === 'string')
    .join(' ')
    .toLowerCase();

  const nameAndDescription = [
    item.name,
    item.title,
    item.slug,
    item.description,
  ]
    .filter((value): value is string => typeof value === 'string')
    .join(' ')
    .toLowerCase()
    .replace(/[_-]+/g, ' ');

  // Explicit metadata identifying an undergraduate qualification.
  const undergraduateMetadata =
    /\b(undergraduate|undergrad|bachelor(?:'s)?|bachelors|b\.?\s?tech|b\.?\s?com|b\.?\s?sc|b\.?\s?a\b|bba|bca|b\.?\s?pharm|b\.?\s?des|b\.?\s?arch|b\.?\s?ed)\b/i;

  // Explicit program-name patterns. Avoid matching generic "degree"
  // because postgraduate programs may also contain that word.
  const undergraduateTitle =
    /\b(undergraduate|bachelor(?:'s)?|bachelors|b\.?\s?tech|b\.?\s?com|b\.?\s?sc|b\.?\s?a\b|bba|bca|b\.?\s?pharm|b\.?\s?des|b\.?\s?arch|b\.?\s?ed|b\.?\s?voc|b\.?\s?f\.?\s?a)\b/i;

  const explicitlyPostgraduate =
    /\b(postgraduate|post graduate|postgrad|master(?:'s)?|mba|mca|m\.?\s?tech|m\.?\s?com|m\.?\s?sc|m\.?\s?a\b|executive|doctoral|doctorate|phd|certificate|diploma)\b/i;

  if (undergraduateMetadata.test(metadata)) {
    return true;
  }

  // Do not include a program whose name indicates an executive,
  // postgraduate, certificate, or diploma course.
  if (explicitlyPostgraduate.test(nameAndDescription)) {
    return false;
  }

  return undergraduateTitle.test(nameAndDescription);
}

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  })}`;
}

function formatBreakEven(
  month: number | null | undefined,
): string {
  return month ? `Month ${month}` : '5+ years';
}

export default function CareerRoiCalculatorApp() {
  const [stage, setStage] = useState<Stage>('form');

  const [isFresher, setIsFresher] = useState(false);
  const [currentSalary, setCurrentSalary] = useState(600000);
  const [experienceYears, setExperienceYears] = useState(2);

  const [programSlug, setProgramSlug] = useState(
    ALL_PROGRAM_OPTIONS[0]?.value ?? '',
  );

  const [workMode, setWorkMode] = useState<WorkMode>('metro');

  const [result, setResult] = useState<RoiResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const eligibleProgramGroups = useMemo(() => {
    if (!isFresher) {
      return ALL_PROGRAM_GROUPS;
    }

    const undergraduatePrograms = PROGRAMS.filter(
      isUndergraduateProgram,
    );

    return groupProgramsForSelect(undergraduatePrograms);
  }, [isFresher]);

  const eligibleProgramOptions = useMemo(
    () =>
      eligibleProgramGroups.flatMap(
        (group) => group.options,
      ),
    [eligibleProgramGroups],
  );

  useEffect(() => {
    trackEvent('tool_page_viewed', {
      tool: 'career-roi-calculator',
    });
  }, []);

  // Keep the selected program valid whenever the employment option changes.
  useEffect(() => {
    const selectionIsValid = eligibleProgramOptions.some(
      (option) => option.value === programSlug,
    );

    if (!selectionIsValid) {
      setProgramSlug(eligibleProgramOptions[0]?.value ?? '');
    }
  }, [eligibleProgramOptions, programSlug]);

  function handleEmploymentChange(fresher: boolean) {
    setIsFresher(fresher);
    setFormError(null);
  }

  function handleCalculate() {
    if (isFresher && eligibleProgramOptions.length === 0) {
      setFormError(
        'No undergraduate programs were identified. Please check the program categories in your configuration.',
      );
      return;
    }

    if (
      !programSlug ||
      !eligibleProgramOptions.some(
        (option) => option.value === programSlug,
      )
    ) {
      setFormError(
        'Please select a program available for your selected employment status.',
      );
      return;
    }

    if (
      !isFresher &&
      (!Number.isFinite(currentSalary) ||
        currentSalary < 0 ||
        currentSalary > 100_000_000)
    ) {
      setFormError('Please enter a valid annual salary.');
      return;
    }

    if (
      !Number.isFinite(experienceYears) ||
      experienceYears < 0 ||
      experienceYears > 40
    ) {
      setFormError(
        'Enter work experience between 0 and 40 years.',
      );
      return;
    }

    setFormError(null);
    setStage('loading');

    trackEvent('tool_started', {
      tool: 'career-roi-calculator',
    });

    window.setTimeout(() => {
      try {
        const calculatedResult = calculateRoi({
          isFresher,
          currentAnnualSalaryInr: isFresher
            ? 0
            : currentSalary,
          experienceYears,
          programSlug,
          workMode,
        });

        if (!calculatedResult) {
          setStage('error');
          return;
        }

        setResult(calculatedResult);
        setStage('teaser');

        trackEvent('calculation_completed', {
          tool: 'career-roi-calculator',
        });

        trackEvent('result_viewed', {
          tool: 'career-roi-calculator',
        });
      } catch {
        setStage('error');
      }
    }, 350);
  }

  function reset() {
    setStage('form');
    setResult(null);
    setFormError(null);
  }

  const userInputsSummary = [
    `Fresher: ${isFresher}`,
    `Current annual salary: ${isFresher ? 'N/A' : currentSalary}`,
    `Experience: ${experienceYears} years`,
    `Program: ${programSlug}`,
    `Work mode: ${workMode}`,
  ].join('; ');

  const resultSummary = result
    ? `Break-even: ${formatBreakEven(result.breakEvenMonth)}; Program: ${result.program.name}`
    : '';

  const inputShell =
    'rounded-3xl border border-slate-200 bg-white p-4 transition duration-200 focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-50 sm:p-5';

  if (stage === 'error') {
    return (
      <div className="rounded-3xl border border-rose-100 bg-rose-50/60 p-5 sm:p-8">
        <ErrorMessage
          message="We couldn't calculate your estimate. Please check your inputs and try again."
          onRetry={reset}
        />
      </div>
    );
  }

  if (stage === 'loading') {
    return (
      <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-6 text-center sm:p-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-100 text-violet-700">
          <Sparkles size={30} />
        </span>

        <h3 className="mt-5 text-xl font-extrabold text-slate-900">
          Calculating your career ROI
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Preparing your estimated break-even point and salary projection.
        </p>

        <div className="mt-5">
          <LoadingState label="Calculating your projection…" />
        </div>
      </div>
    );
  }

  if (stage === 'teaser' && result) {
    return (
      <div className="space-y-5">
        <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-lg shadow-violet-100/40">
          <div className="bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 p-6 text-white sm:p-9">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-violet-100">
                <CheckCircle2 size={15} />
                Calculation complete
              </span>

              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                <RotateCcw size={14} />
                Recalculate
              </button>
            </div>

            <p className="mt-8 text-sm font-semibold text-violet-200">
              Estimated break-even point
            </p>

            <h3 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl">
              {formatBreakEven(result.breakEvenMonth)}
            </h3>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-violet-100 sm:text-base">
              {result.breakEvenMonth
                ? 'This is the estimated point at which the additional salary represented in your calculation covers the modeled program cost.'
                : 'Your estimated payback period extends beyond the five-year calculation window. Review the assumptions before deciding whether to proceed.'}
            </p>
          </div>

          <div className="grid gap-px bg-slate-100 sm:grid-cols-2">
            <div className="bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <GraduationCap size={22} />
                </span>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400">
                    Selected program
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    {result.program.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                  <Wallet size={22} />
                </span>

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Program fee used
                  </p>

                  <p className="mt-1 text-xl font-extrabold text-slate-900">
                    {formatCurrency(result.feeInr)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <TrendingUp size={22} />
            </span>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Explore your five-year projection
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Review the salary curve, estimated EMI and modeled monthly
                salary difference in your detailed report.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStage('gated_form')}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-4 font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 sm:w-auto"
          >
            Get My Full ROI Report
            <ArrowRight size={18} />
          </button>

          <p className="mt-3 text-xs leading-5 text-slate-400">
            Estimates depend on the calculation model and the information
            provided. Results do not guarantee a particular salary or
            payback period.
          </p>
        </div>
      </div>
    );
  }

  if (stage === 'gated_form') {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-4 sm:p-8">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <GraduationCap size={27} />
          </span>

          <h3 className="mt-4 text-2xl font-extrabold text-slate-950">
            Get your detailed ROI report
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Submit your details to continue to your salary projection
            and cost breakdown.
          </p>
        </div>

        <LeadForm
          toolUsed="career-roi-calculator"
          userInputsSummary={userInputsSummary}
          resultSummary={resultSummary}
          onSuccess={() => setStage('full')}
        />
      </div>
    );
  }

  if (stage === 'full' && result) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 p-6 text-white sm:p-9">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-violet-100">
              <CheckCircle2 size={15} />
              Detailed report
            </span>

            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
            >
              <RotateCcw size={14} />
              Start again
            </button>
          </div>

          <h3 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
            Your five-year salary projection
          </h3>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-violet-100">
            Review the modeled salary curve alongside the estimated cost
            and potential monthly salary difference.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <TrendingUp size={22} />
            </span>

            <div>
              <h4 className="font-bold text-slate-900">
                Salary growth projection
              </h4>

              <p className="mt-1 text-xs text-slate-500">
                Modeled five-year comparison
              </p>
            </div>
          </div>

          <SalaryCurveChart data={result.fiveYearCurve} />

          <p className="mt-4 text-xs leading-5 text-slate-400">
            Figures are projections from the current calculator model.
            Verify the underlying program data and salary assumptions
            before relying on the estimate.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <PiggyBank size={22} />
            </span>

            <div>
              <h4 className="text-xl font-extrabold text-slate-900">
                Cost and potential salary difference
              </h4>

              <p className="mt-1 text-sm text-slate-500">
                Figures calculated for your selected program
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
              <span className="text-sm text-slate-600">
                Program fee
              </span>

              <span className="text-right font-bold text-slate-900">
                {formatCurrency(result.feeInr)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
              <span className="text-sm text-slate-600">
                Estimated monthly EMI
              </span>

              <span className="text-right font-bold text-slate-900">
                {formatCurrency(result.emiEstimateInr)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl bg-emerald-50 p-4">
              <span className="text-sm text-emerald-800">
                Modeled monthly salary difference
              </span>

              <span className="text-right font-bold text-emerald-800">
                {formatCurrency(result.monthlyGainAfterCompletion)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-violet-100 bg-violet-50 p-4">
              <span className="text-sm font-medium text-violet-800">
                Estimated break-even point
              </span>

              <span className="text-right font-extrabold text-violet-800">
                {formatBreakEven(result.breakEvenMonth)}
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-400">
            Confirm whether the EMI estimate includes interest, fees
            and other borrowing costs. The modeled salary difference
            is not a guaranteed increase in take-home income.
          </p>
        </div>

        <div className="rounded-3xl border border-amber-100 bg-amber-50/70 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <BriefcaseBusiness size={20} />
            </span>

            <div>
              <h4 className="font-bold text-slate-900">
                Before you make a decision
              </h4>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Consider program fees, study time, potential lost
                earnings, loan interest and your personal career goals.
                Salary and employment outcomes vary by individual and
                market conditions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ShareButton
            toolSlug="career-roi-calculator"
            title="My Career ROI Result"
            text={`My estimated break-even point for ${result.program.name}: ${formatBreakEven(result.breakEvenMonth)}. This is an illustrative projection.`}
          />

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <RotateCcw size={16} />
            Calculate again
          </button>

          <a
            href={`https://wa.me/${(
              process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
            ).replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-5 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
          >
            <BriefcaseBusiness size={16} />
            Discuss your options
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-violet-100/40">
      <div className="border-b border-slate-100 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-5 sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-violet-700 shadow-sm">
          <Sparkles size={15} />
          Personalized ROI estimate
        </span>

        <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
          Calculate your education investment
        </h3>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
          Tell us about your current situation and the program you
          are considering to explore the projected financial outcome.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: GraduationCap,
              label: 'Choose a program',
              color: 'bg-violet-100 text-violet-700',
            },
            {
              icon: Wallet,
              label: 'Add salary details',
              color: 'bg-sky-100 text-sky-700',
            },
            {
              icon: TrendingUp,
              label: 'Review projections',
              color: 'bg-orange-100 text-orange-700',
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 p-3"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                >
                  <Icon size={18} />
                </span>

                <span className="text-xs font-semibold text-slate-600">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-8">
        {/* Employment status */}
        <div>
          <label className="block text-sm font-bold text-slate-900">
            What best describes your current situation?
          </label>

          <p className="mt-1 text-sm text-slate-500">
            Select your current employment status.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              aria-pressed={isFresher}
              onClick={() => handleEmploymentChange(true)}
              className={`rounded-2xl border p-4 text-left transition sm:p-5 ${
                isFresher
                  ? 'border-violet-400 bg-violet-50 ring-2 ring-violet-100'
                  : 'border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/30'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    isFresher
                      ? 'bg-violet-100 text-violet-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <GraduationCap size={22} />
                </span>

                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    isFresher
                      ? 'border-violet-600 bg-violet-600 text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {isFresher && <CheckCircle2 size={15} />}
                </span>
              </div>

              <p className="mt-4 font-bold text-slate-900">
                Fresher / Student
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                I do not currently earn a salary.
              </p>
            </button>

            <button
              type="button"
              aria-pressed={!isFresher}
              onClick={() => handleEmploymentChange(false)}
              className={`rounded-2xl border p-4 text-left transition sm:p-5 ${
                !isFresher
                  ? 'border-violet-400 bg-violet-50 ring-2 ring-violet-100'
                  : 'border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/30'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    !isFresher
                      ? 'bg-sky-100 text-sky-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <BriefcaseBusiness size={22} />
                </span>

                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    !isFresher
                      ? 'border-violet-600 bg-violet-600 text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {!isFresher && <CheckCircle2 size={15} />}
                </span>
              </div>

              <p className="mt-4 font-bold text-slate-900">
                Working Professional
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                I currently earn a salary.
              </p>
            </button>
          </div>
        </div>

        {/* Current salary */}
        {!isFresher && (
          <div className={inputShell}>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Wallet size={20} />
              </span>

              <div className="min-w-0 flex-1">
                <FormField
                  label="Current annual salary (₹)"
                  htmlFor="currentSalary"
                  required
                  error={formError || undefined}
                >
                  <NumberInput
                    id="currentSalary"
                    min={0}
                    step={10000}
                    value={currentSalary}
                    onChange={(event) => {
                      setCurrentSalary(Number(event.target.value));
                      setFormError(null);
                    }}
                  />
                </FormField>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Enter your current annual salary before tax.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Experience */}
        <div className={inputShell}>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
              <BriefcaseBusiness size={20} />
            </span>

            <div className="min-w-0 flex-1">
              <FormField
                label="Years of work experience"
                htmlFor="experienceYears"
                required
              >
                <NumberInput
                  id="experienceYears"
                  min={0}
                  max={40}
                  value={experienceYears}
                  onChange={(event) => {
                    setExperienceYears(Number(event.target.value));
                    setFormError(null);
                  }}
                />
              </FormField>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Enter 0 if you have not started working yet.
              </p>
            </div>
          </div>
        </div>

        {/* Program selection */}
        <div className={inputShell}>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <GraduationCap size={20} />
            </span>

            <div className="min-w-0 flex-1">
              <FormField
                label={
                  isFresher
                    ? 'Choose an undergraduate program'
                    : 'Which program are you considering?'
                }
                htmlFor="programSlug"
                required
              >
                {eligibleProgramOptions.length > 0 ? (
                  <SelectField
                    id="programSlug"
                    groups={eligibleProgramGroups}
                    value={programSlug}
                    onChange={(event) => {
                      setProgramSlug(event.target.value);
                      setFormError(null);
                    }}
                  />
                ) : (
                  <p
                    role="status"
                    className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800"
                  >
                    No undergraduate programs were identified in the
                    current program configuration. Check the program
                    metadata or undergraduate filter rules.
                  </p>
                )}
              </FormField>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                {isFresher
                  ? 'Only programs identified as undergraduate are available for this selection.'
                  : 'Choose the program you want to evaluate.'}
              </p>
            </div>
          </div>
        </div>

        {/* Work mode */}
        <div className={inputShell}>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
              <MapPin size={20} />
            </span>

            <div className="min-w-0 flex-1">
              <FormField
                label="Where do you plan to work?"
                htmlFor="workMode"
                required
              >
                <SelectField
                  id="workMode"
                  options={WORK_MODES}
                  value={workMode}
                  onChange={(event) =>
                    setWorkMode(event.target.value as WorkMode)
                  }
                />
              </FormField>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Choose the work location or mode used by the calculator.
              </p>
            </div>
          </div>
        </div>

        {formError && (
          <div
            role="alert"
            className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
          >
            {formError}
          </div>
        )}

        <div className="border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={handleCalculate}
            disabled={
              isFresher && eligibleProgramOptions.length === 0
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-4 font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600"
          >
            Calculate My Career ROI
            <ArrowRight size={19} />
          </button>

          <p className="mt-3 text-center text-xs leading-5 text-slate-400">
            Free to use. Results are estimates based on the selected
            program and the calculator&apos;s assumptions.
          </p>
        </div>
      </div>
    </div>
  );
}
