
'use client';

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Clock3,
  GraduationCap,
  RotateCcw,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
  BookOpen,
} from 'lucide-react';

import LoadingState from '@/components/LoadingState';
import ErrorMessage from '@/components/ErrorMessage';
import ScoreDial from '@/components/ScoreDial';
import ShareButton from '@/components/ShareButton';
import LeadForm from '@/components/LeadForm';

import {
  CAREER_GOALS,
  INTEREST_DOMAINS,
  findTopMatches,
  formatDomain,
  formatGoal,
  type CareerFitInput,
  type CareerFitMatch,
} from '@/tools/careerFitFinder';

import type {
  CareerGoal,
  ExperienceBand,
  InterestDomain,
  StudyMode,
} from '@/types';

import { trackEvent } from '@/lib/analytics';

const EXPERIENCE_OPTIONS: { value: ExperienceBand; label: string }[] = [
  { value: '0', label: 'Fresher / No experience' },
  { value: '1-3', label: '1–3 years' },
  { value: '3-6', label: '3–6 years' },
  { value: '6+', label: '6+ years' },
];

const STUDY_MODE_OPTIONS: {
  value: StudyMode;
  label: string;
  description: string;
}[] = [
  {
    value: 'weekend',
    label: 'Weekends only',
    description: 'Study around your weekday commitments.',
  },
  {
    value: 'daily_1hr',
    label: 'About 1 hour daily',
    description: 'Build a consistent daily learning routine.',
  },
  {
    value: 'flexible',
    label: 'Flexible schedule',
    description: 'Study when it works best for you.',
  },
];

type Stage = 'form' | 'loading' | 'teaser' | 'gated_form' | 'full' | 'error';

const STEPS = [
  { title: 'Your background', description: 'Education and experience' },
  { title: 'Your interests', description: 'Interests and career goals' },
  { title: 'Your preferences', description: 'Time and study schedule' },
];

const goalOptions = CAREER_GOALS;

export default function CareerFitFinderApp() {
  const [step, setStep] = useState(1);
  const [stage, setStage] = useState<Stage>('form');

  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState<ExperienceBand>('0');
  const [interests, setInterests] = useState<InterestDomain[]>([]);
  const [goal, setGoal] = useState<CareerGoal>('higher_salary');
  const [weeklyHours, setWeeklyHours] = useState(5);
  const [studyMode, setStudyMode] = useState<StudyMode>('flexible');

  const [matches, setMatches] = useState<CareerFitMatch[]>([]);
  const [stepError, setStepError] = useState<string | null>(null);

  useEffect(() => {
    trackEvent('tool_page_viewed', { tool: 'career-fit-finder' });
  }, []);

  function toggleInterest(domain: InterestDomain) {
    setInterests((current) =>
      current.includes(domain)
        ? current.filter((item) => item !== domain)
        : [...current, domain],
    );

    setStepError(null);
  }

  function goNext() {
    if (step === 1 && !qualification.trim()) {
      setStepError('Enter your current qualification to continue.');
      return;
    }

    if (step === 2 && interests.length === 0) {
      setStepError('Choose at least one interest area.');
      return;
    }

    setStepError(null);

    if (step < 3) {
      setStep((current) => current + 1);

      trackEvent('form_step_completed', {
        tool: 'career-fit-finder',
        step,
      });

      return;
    }

    runCalculation();
  }

  function runCalculation() {
    setStage('loading');
    trackEvent('tool_started', { tool: 'career-fit-finder' });

    try {
      const input: CareerFitInput = {
        qualification,
        experience,
        interests,
        goal,
        weeklyHours,
        studyMode,
      };

      window.setTimeout(() => {
        try {
          const results = findTopMatches(input, 3);

          if (!results.length) {
            setStage('error');
            return;
          }

          setMatches(results);
          setStage('teaser');

          trackEvent('calculation_completed', {
            tool: 'career-fit-finder',
          });

          trackEvent('result_viewed', {
            tool: 'career-fit-finder',
          });
        } catch {
          setStage('error');
        }
      }, 450);
    } catch {
      setStage('error');
    }
  }

  function resetTool() {
    setStep(1);
    setStage('form');
    setQualification('');
    setExperience('0');
    setInterests([]);
    setGoal('higher_salary');
    setWeeklyHours(5);
    setStudyMode('flexible');
    setMatches([]);
    setStepError(null);
  }

  const top = matches[0];

  const userInputsSummary = [
    `Qualification: ${qualification}`,
    `Experience: ${experience}`,
    `Interests: ${interests.map(formatDomain).join(', ')}`,
    `Goal: ${formatGoal(goal)}`,
    `Weekly study hours: ${weeklyHours}`,
    `Study mode: ${studyMode}`,
  ].join('; ');

  const resultSummary = matches
    .map((match, index) => {
      return `${index + 1}. ${match.program.name} (${match.matchPercent}% match)`;
    })
    .join(' | ');

  const inputClass =
    'mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100';

  const labelClass = 'block text-sm font-semibold text-slate-800';

  if (stage === 'error') {
    return (
      <div className="rounded-3xl border border-rose-100 bg-rose-50/70 p-6 sm:p-8">
        <ErrorMessage
          message="We couldn't calculate your career matches. Please review your answers and try again."
          onRetry={resetTool}
        />
      </div>
    );
  }

  if (stage === 'loading') {
    return (
      <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-sky-50 px-5 py-14 text-center sm:py-20">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-100 text-violet-700">
          <Sparkles size={30} />
        </div>

        <h3 className="text-xl font-bold text-slate-900">
          Finding your career matches
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Comparing your answers with available program profiles…
        </p>

        <div className="mx-auto mt-6 h-2 max-w-xs overflow-hidden rounded-full bg-violet-100">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-violet-500 to-sky-500" />
        </div>

        <div className="hidden">
          <LoadingState label="Finding suitable career matches…" />
        </div>
      </div>
    );
  }

  if (stage === 'teaser' && top) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-violet-700 shadow-sm">
              <Sparkles size={15} />
              Your career match is ready
            </span>

            <button
              type="button"
              onClick={resetTool}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <RotateCcw size={14} />
              Start again
            </button>
          </div>

          <div className="mt-8 grid items-center gap-6 sm:grid-cols-[180px_1fr]">
            <div className="flex justify-center">
              <ScoreDial
                percent={top.matchPercent}
                label={top.program.name}
                sublabel="match"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-violet-700">
                Your top recommendation
              </p>

              <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                {top.program.name}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {top.reason}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  Based on your profile
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">
                  <Target size={14} className="text-violet-600" />
                  Personalized recommendation
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
          <h3 className="text-xl font-bold text-slate-900">
            Explore your full report
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Review your top three program matches, their reasons for matching
            your profile, and available program information.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: Target,
                title: 'Top 3 matches',
                text: 'Compare recommended programs.',
              },
              {
                icon: BookOpen,
                title: 'Program details',
                text: 'Explore duration and available fees.',
              },
              {
                icon: BriefcaseBusiness,
                title: 'Career possibilities',
                text: 'Review potential job roles.',
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl bg-slate-50 p-4"
                >
                  <Icon size={20} className="text-violet-600" />
                  <p className="mt-3 text-sm font-bold text-slate-800">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setStage('gated_form')}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-4 font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 sm:w-auto"
          >
            Get My Full Match Report
            <ArrowRight size={18} />
          </button>

          <p className="mt-3 text-xs leading-5 text-slate-400">
            Your recommendations are guidance, not a guarantee of admission,
            employment or salary outcomes.
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
            Get your full career report
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Enter your details to continue with your personalized report.
          </p>
        </div>

        <LeadForm
          toolUsed="career-fit-finder"
          userInputsSummary={userInputsSummary}
          resultSummary={resultSummary}
          onSuccess={() => setStage('full')}
        />
      </div>
    );
  }

  if (stage === 'full') {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 p-6 text-white sm:p-9">
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-violet-100">
            <CheckCircle2 size={18} />
            Your career-fit report is ready
          </div>

          <h3 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your top career matches
          </h3>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-violet-100">
            Explore the recommended programs, compare their match scores and
            review the information available for each option.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((match, index) => (
            <article
              key={match.program.id}
              className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/50 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    index === 0
                      ? 'bg-violet-100 text-violet-700'
                      : index === 1
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {index === 0 ? (
                    <Sparkles size={22} />
                  ) : index === 1 ? (
                    <TrendingUp size={22} />
                  ) : (
                    <GraduationCap size={22} />
                  )}
                </span>

                <span className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500">
                  Match #{index + 1}
                </span>
              </div>

              <h4 className="mt-5 text-xl font-bold leading-snug text-slate-900">
                {match.program.name}
              </h4>

              <div className="mt-4 flex items-center gap-2">
                <ScoreDial
                  percent={match.matchPercent}
                  label="Match"
                  accent={index === 0 ? 'amber' : 'teal'}
                />
              </div>

              <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">
                {match.reason}
              </p>

              <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                <div className="flex items-start gap-3">
                  <Wallet
                    size={17}
                    className="mt-0.5 shrink-0 text-violet-600"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-slate-400">Listed program fee</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">
                      ₹{match.program.feeInr.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock3
                    size={17}
                    className="mt-0.5 shrink-0 text-sky-600"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-slate-400">Program duration</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">
                      {match.program.durationMonths} months
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BriefcaseBusiness
                    size={17}
                    className="mt-0.5 shrink-0 text-orange-600"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-slate-400">
                      Potential job roles
                    </p>
                    <p className="mt-0.5 text-sm leading-6 text-slate-700">
                      {match.program.jobRoles.join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-400">
                Verify current fees, duration and admission criteria with the
                program provider before making a decision.
              </p>
            </article>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
          <h4 className="font-bold text-slate-900">Your next steps</h4>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Compare the recommended programs, check the admission requirements
            and confirm current fees before deciding which option to pursue.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <ShareButton
              toolSlug="career-fit-finder"
              title="My Career-Fit Result"
              text={`My top match: ${top?.program.name} (${top?.matchPercent}% match)`}
            />

            <button
              type="button"
              onClick={resetTool}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RotateCcw size={16} />
              Retake assessment
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                'I would like to discuss my Career-Fit Finder results with a program counsellor.',
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-5 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
            >
              <Share2 size={16} />
              Talk to a counsellor
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-violet-100/40">
      {/* Progress header */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50 via-white to-sky-50 p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-violet-700 shadow-sm">
            <Sparkles size={15} />
            Career-Fit Assessment
          </span>

          <span className="text-sm font-semibold text-slate-500">
            Step {step} of {STEPS.length}
          </span>
        </div>

        <div className="mt-6 flex gap-2">
          {STEPS.map((item, index) => (
            <div
              key={item.title}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                index + 1 <= step ? 'bg-violet-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        <h3 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
  {STEPS[step - 1]?.title ?? 'Your background'}
</h3>

<p className="mt-2 text-sm leading-6 text-slate-500">
  {STEPS[step - 1]?.description ?? 'Education and experience'}
</p>
      </div>

      <div className="p-5 sm:p-8">
        {step === 1 && (
          
<div>
  <label className={labelClass}>
    What is your current qualification?
    <span className="ml-1 text-rose-500">*</span>
  </label>

  <p className="mt-1 text-sm text-slate-500">
    Select the option that best describes your education.
  </p>

  <div className="mt-4 grid gap-4 sm:grid-cols-2">
    <button
      type="button"
      onClick={() => {
        setQualification('Class 12 / Undergraduate (Not Graduated)');
        setStepError(null);
      }}
      aria-pressed={
        qualification === 'Class 12 / Undergraduate (Not Graduated)'
      }
      className={`rounded-2xl border p-5 text-left transition ${
        qualification === 'Class 12 / Undergraduate (Not Graduated)'
          ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-100'
          : 'border-slate-200 bg-white hover:border-violet-300'
      }`}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="text-base font-bold text-slate-900">
          Class 12 / Undergraduate
        </span>
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
            qualification === 'Class 12 / Undergraduate (Not Graduated)'
              ? 'border-violet-600 bg-violet-600 text-white'
              : 'border-slate-300'
          }`}
        >
          {qualification === 'Class 12 / Undergraduate (Not Graduated)' && (
            <Check size={12} />
          )}
        </span>
      </span>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Currently studying for a degree or completed Class 12.
      </p>
    </button>

    <button
      type="button"
      onClick={() => {
        setQualification('Graduate / Postgraduate');
        setStepError(null);
      }}
      aria-pressed={qualification === 'Graduate / Postgraduate'}
      className={`rounded-2xl border p-5 text-left transition ${
        qualification === 'Graduate / Postgraduate'
          ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-100'
          : 'border-slate-200 bg-white hover:border-violet-300'
      }`}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="text-base font-bold text-slate-900">
          Graduate / Postgraduate
        </span>
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
            qualification === 'Graduate / Postgraduate'
              ? 'border-violet-600 bg-violet-600 text-white'
              : 'border-slate-300'
          }`}
        >
          {qualification === 'Graduate / Postgraduate' && (
            <Check size={12} />
          )}
        </span>
      </span>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Completed a bachelor’s degree or postgraduate qualification.
      </p>
    </button>
  </div>
</div>

        )}

        {step === 2 && (
          <div className="space-y-7">
            <div>
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <label className={labelClass}>
                    Which areas interest you?
                    <span className="ml-1 text-rose-500">*</span>
                  </label>

                  <p className="mt-1 text-sm text-slate-500">
                    Select every area that interests you.
                  </p>
                </div>

                <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                  {interests.length} selected
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {INTEREST_DOMAINS.map((domain, index) => {
                  const selected = interests.includes(domain.value);

                  const iconStyles = [
                    'bg-violet-100 text-violet-700',
                    'bg-sky-100 text-sky-700',
                    'bg-orange-100 text-orange-700',
                    'bg-pink-100 text-pink-700',
                    'bg-emerald-100 text-emerald-700',
                    'bg-amber-100 text-amber-700',
                  ];

                  return (
                    <button
                      key={domain.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleInterest(domain.value)}
                      className={`flex min-h-[74px] items-center gap-3 rounded-2xl border p-4 text-left transition duration-200 ${
                        selected
                          ? 'border-violet-400 bg-violet-50 ring-2 ring-violet-100'
                          : 'border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/40'
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          iconStyles[index % iconStyles.length]
                        }`}
                      >
                        {selected ? (
                          <Check size={20} />
                        ) : (
                          <Target size={20} />
                        )}
                      </span>

                      <span className="flex-1 text-sm font-semibold leading-5 text-slate-800">
                        {domain.label}
                      </span>

                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          selected
                            ? 'border-violet-600 bg-violet-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {selected && <Check size={12} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="careerGoal" className={labelClass}>
                What is your main career goal?
              </label>

              <select
                id="careerGoal"
                className={inputClass}
                value={goal}
                onChange={(event) => setGoal(event.target.value as CareerGoal)}
              >
                {goalOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-7">
            <div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="weeklyHours" className={labelClass}>
                  How many hours can you study each week?
                </label>

                <span className="rounded-xl bg-violet-100 px-3 py-2 text-sm font-bold text-violet-700">
                  {weeklyHours} hours
                </span>
              </div>

              <input
                id="weeklyHours"
                type="range"
                min={1}
                max={40}
                step={1}
                value={weeklyHours}
                onChange={(event) =>
                  setWeeklyHours(Number(event.target.value))
                }
                className="mt-6 w-full cursor-pointer accent-violet-600"
              />

              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>1 hour</span>
                <span>20 hours</span>
                <span>40 hours</span>
              </div>
            </div>

            <div>
              <label className={labelClass}>Which study schedule suits you?</label>

              <div className="mt-3 space-y-3">
                {STUDY_MODE_OPTIONS.map((option) => {
                  const selected = studyMode === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setStudyMode(option.value)}
                      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                        selected
                          ? 'border-violet-400 bg-violet-50 ring-2 ring-violet-100'
                          : 'border-slate-200 bg-white hover:border-violet-200'
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          selected
                            ? 'bg-violet-600 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Clock3 size={20} />
                      </span>

                      <span className="flex-1">
                        <span className="block text-sm font-bold text-slate-800">
                          {option.label}
                        </span>

                        <span className="mt-1 block text-xs leading-5 text-slate-500">
                          {option.description}
                        </span>
                      </span>

                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          selected
                            ? 'border-violet-600 bg-violet-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {selected && <Check size={12} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <GraduationCap
                  size={20}
                  className="mt-0.5 shrink-0 text-violet-600"
                />

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Your preferences at a glance
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {qualification} · {experience} experience · {weeklyHours}{' '}
                    study hours per week
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Goal: {formatGoal(goal)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {stepError && (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
          >
            {stepError}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                setStepError(null);
                setStep((current) => current - 1);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          ) : (
            <span className="text-xs text-slate-400">
              * Required information
            </span>
          )}

          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
          >
            {step < 3 ? 'Continue' : 'Find My Matches'}
            <ArrowRight size={17} />
          </button>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
          Your recommendations are indicative. Review program requirements and
          current details before making a decision.
        </p>
      </div>
    </div>
  );
}
