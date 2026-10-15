
'use client';

import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  GraduationCap,
  RotateCcw,
  Sparkles,
  Target,
  UserRound,
} from 'lucide-react';

import FormField from '@/components/FormField';
import SelectField from '@/components/SelectField';
import TextInput from '@/components/TextInput';
import LoadingState from '@/components/LoadingState';
import ErrorMessage from '@/components/ErrorMessage';
import RoadmapPath from '@/components/RoadmapPath';
import ShareButton from '@/components/ShareButton';
import LeadForm from '@/components/LeadForm';

import {
  TIMELINE_OPTIONS,
  type RoadmapResult,
} from '@/tools/roadmapGenerator';

import { ALL_ROLES } from '@/config/skillMaps';
import { trackEvent } from '@/lib/analytics';

type Stage =
  | 'form'
  | 'loading'
  | 'preview'
  | 'gated_form'
  | 'full'
  | 'error';

const BACKGROUND_OPTIONS = [
  { value: 'school_student', label: 'Class 12 / School Student' },
  { value: 'undergraduate', label: 'Undergraduate Student' },
  { value: 'graduate_fresher', label: 'Graduate / Fresher' },
  { value: 'working_professional', label: 'Working Professional' },
  { value: 'career_switcher', label: 'Career Switcher' },
  { value: 'self_taught_freelancer', label: 'Self-Taught / Freelancer' },
  { value: 'other', label: 'Other' },
];

const EXAMPLE_ROLES = [
  'Data Scientist',
  'Business Analyst',
  'Digital Marketing Manager',
  'Financial Analyst',
  'HR Analytics Lead',
  'Generative AI Engineer',
];

const INPUT_CARD =
  'rounded-3xl border border-slate-200 bg-white p-4 transition duration-200 focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-50 sm:p-5';

export default function CareerRoadmapGeneratorApp() {
  const [stage, setStage] = useState<Stage>('form');

  const [targetRole, setTargetRole] = useState('');
  const [backgroundType, setBackgroundType] = useState('');
  const [background, setBackground] = useState('');
  const [timelineMonths, setTimelineMonths] = useState<6 | 12 | 18>(12);

  const [roadmap, setRoadmap] = useState<RoadmapResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    trackEvent('tool_page_viewed', {
      tool: 'career-roadmap-generator',
    });
  }, []);

  function getBackgroundLabel(value: string) {
    return (
      BACKGROUND_OPTIONS.find((option) => option.value === value)?.label ||
      ''
    );
  }

  function selectRole(role: string) {
    setTargetRole(role);
    setFormError(null);
  }

  async function handleGenerate() {
    if (targetRole.trim().length < 2) {
      setFormError('Enter the career or job role you want to pursue.');
      return;
    }

    if (!backgroundType) {
      setFormError('Select your current background to continue.');
      return;
    }

    if (backgroundType === 'other' && background.trim().length < 2) {
      setFormError('Please describe your current background.');
      return;
    }

    setFormError(null);
    setStage('loading');

    trackEvent('tool_started', {
      tool: 'career-roadmap-generator',
    });

    const backgroundSummary = [
      getBackgroundLabel(backgroundType),
      background.trim(),
    ]
      .filter(Boolean)
      .join(': ');

    try {
      const response = await fetch('/api/roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetRole: targetRole.trim(),
          background: backgroundSummary,
          timelineMonths,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.roadmap) {
        setStage('error');
        return;
      }

      setRoadmap(data.roadmap as RoadmapResult);
      setStage('preview');

      trackEvent('calculation_completed', {
        tool: 'career-roadmap-generator',
      });

      trackEvent('result_viewed', {
        tool: 'career-roadmap-generator',
      });
    } catch {
      setStage('error');
    }
  }

  function reset() {
    setStage('form');
    setRoadmap(null);
    setTargetRole('');
    setBackgroundType('');
    setBackground('');
    setTimelineMonths(12);
    setFormError(null);
  }

  const userInputsSummary = [
    `Target role: ${targetRole}`,
    `Background type: ${getBackgroundLabel(backgroundType)}`,
    `Additional details: ${background || 'Not provided'}`,
    `Timeline: ${timelineMonths} months`,
  ].join('; ');

  const resultSummary = roadmap
    ? `${roadmap.milestones.length}-milestone roadmap toward ${roadmap.targetRole}`
    : '';

  if (stage === 'error') {
    return (
      <div className="rounded-3xl border border-rose-100 bg-rose-50/60 p-5 sm:p-8">
        <ErrorMessage
          message="We couldn't build your career roadmap. Please check your connection and try again."
          onRetry={() => setStage('form')}
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
          Building Your Career Roadmap
        </h3>

        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
          Preparing your career milestones based on your goal, current
          background and chosen timeline.
        </p>

        <div className="mt-5">
          <LoadingState label="Creating your personalized career plan…" />
        </div>
      </div>
    );
  }

  if (
    (stage === 'preview' ||
      stage === 'gated_form' ||
      stage === 'full') &&
    roadmap
  ) {
    const showAll = stage === 'full';

    return (
      <div className="mx-auto w-full max-w-5xl space-y-5">
        <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-xl shadow-violet-100/40">
          <div className="bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 p-6 text-white sm:p-9">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-violet-100">
                <CheckCircle2 size={15} />
                Your roadmap is ready
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

            <p className="mt-7 text-xs font-bold uppercase tracking-widest text-violet-200">
              Your career destination
            </p>

            <h3 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              {roadmap.targetRole}
            </h3>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-violet-100">
              Your career plan is organized around your selected timeline.
              Follow the milestones and adapt your plan as you learn.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <Clock3 size={20} />
                  </span>

                  <div>
                    <p className="text-xs text-violet-200">
                      Target timeline
                    </p>
                    <p className="mt-1 text-lg font-extrabold">
                      {timelineMonths} months
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <Target size={20} />
                  </span>

                  <div>
                    <p className="text-xs text-violet-200">
                      Roadmap milestones
                    </p>
                    <p className="mt-1 text-lg font-extrabold">
                      {roadmap.milestones.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-7">
            {!roadmap.groundedInRole && (
              <div
                role="status"
                className="rounded-2xl border border-amber-200 bg-amber-50 p-4"
              >
                <p className="font-bold text-amber-900">
                  General career roadmap
                </p>

                <p className="mt-2 text-sm leading-6 text-amber-800">
                  A verified skill map is not currently available for this
                  role. The roadmap uses general milestones rather than
                  verified role-specific course matches.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-7">
          <div className="mb-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-violet-600">
              Your action plan
            </p>

            <h3 className="mt-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
              Your Career Milestones
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Follow your milestones in sequence and review your progress
              as you work toward your career goal.
            </p>
          </div>

          <RoadmapPath
            roadmap={roadmap}
            showAll={showAll}
            onUnlock={() => setStage('gated_form')}
          />
        </div>

        {stage === 'gated_form' && (
          <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-4 sm:p-8">
            <div className="mb-6 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <GraduationCap size={27} />
              </span>

              <h3 className="mt-4 text-2xl font-extrabold text-slate-950">
                Continue With Your Career Roadmap
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Complete the next step to access the additional roadmap
                details available through this tool.
              </p>
            </div>

            <LeadForm
              toolUsed="career-roadmap-generator"
              userInputsSummary={userInputsSummary}
              resultSummary={resultSummary}
              onSuccess={() => setStage('full')}
            />
          </div>
        )}

        {showAll && (
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-5 sm:p-7">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 size={22} />
              </span>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Your roadmap is ready to use
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Save or share your plan using the available options and
                  revisit your milestones as you progress.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <ShareButton
                toolSlug="career-roadmap-generator"
                title="My Career Roadmap"
                text={`My ${timelineMonths}-month roadmap to becoming a ${roadmap.targetRole}.`}
              />

              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <RotateCcw size={16} />
                Build another roadmap
              </button>

              <a
                href={`https://wa.me/${(
                  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
                ).replace(/[^0-9]/g, '')}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
              >
                Discuss My Roadmap
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-violet-100/40">
      {/* Form introduction */}
      <div className="border-b border-slate-100 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-6 sm:p-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-2 text-xs font-bold text-violet-700 shadow-sm">
          <Sparkles size={15} />
          Personalized Career Planning
        </span>

        <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
          Build Your Career Roadmap
        </h3>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
          Tell us where you want to go, your current background and how
          much time you have. We&apos;ll help you organize your next
          career steps.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: Target,
              title: 'Choose your goal',
              color: 'bg-violet-100 text-violet-700',
            },
            {
              icon: UserRound,
              title: 'Share your background',
              color: 'bg-sky-100 text-sky-700',
            },
            {
              icon: Clock3,
              title: 'Set your timeline',
              color: 'bg-orange-100 text-orange-700',
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 p-3"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                >
                  <Icon size={19} />
                </span>

                <span className="text-xs font-semibold text-slate-600 sm:text-sm">
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form fields */}
      <div className="space-y-5 p-5 sm:p-8">
        {/* Target role */}
        <div className={INPUT_CARD}>
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <BriefcaseBusiness size={21} />
            </span>

            <div className="min-w-0 flex-1">
              <FormField
                label="What do you want to become?"
                htmlFor="targetRole"
                required
                error={formError || undefined}
                hint="Enter your target job title or career."
              >
                <TextInput
                  id="targetRole"
                  placeholder="e.g. Data Scientist, Product Manager"
                  list="role-suggestions"
                  value={targetRole}
                  onChange={(event) => selectRole(event.target.value)}
                />

                <datalist id="role-suggestions">
                  {ALL_ROLES.map((role) => (
                    <option key={role} value={role} />
                  ))}
                </datalist>
              </FormField>
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-3 text-xs font-semibold text-slate-500">
              Popular career goals
            </p>

            <div className="flex flex-wrap gap-2">
              {EXAMPLE_ROLES.map((role) => {
                const selected = targetRole === role;

                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => selectRole(role)}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold transition sm:text-sm ${
                      selected
                        ? 'border-violet-500 bg-violet-50 text-violet-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50'
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Background category */}
        <div className={INPUT_CARD}>
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <GraduationCap size={21} />
            </span>

            <div className="min-w-0 flex-1">
              <FormField
                label="What best describes your current background?"
                htmlFor="backgroundType"
                required
                hint="Choose the option that best matches your current situation."
              >
                <SelectField
                  id="backgroundType"
                  options={BACKGROUND_OPTIONS}
                  value={backgroundType}
                  onChange={(event) => {
                    setBackgroundType(event.target.value);
                    setFormError(null);

                    if (event.target.value !== 'other') {
                      setBackground('');
                    }
                  }}
                />
              </FormField>

              {backgroundType && (
                <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                  <p className="text-sm font-bold text-slate-800">
                    {getBackgroundLabel(backgroundType)}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {backgroundType === 'school_student' &&
                      'Plan your next steps from school to higher education and your future career.'}

                    {backgroundType === 'undergraduate' &&
                      'Explore the skills, projects and experience relevant to your intended career.'}

                    {backgroundType === 'graduate_fresher' &&
                      'Plan your transition from education to job-ready skills and entry-level opportunities.'}

                    {backgroundType === 'working_professional' &&
                      'Build on your existing experience and identify skills relevant to your target role.'}

                    {backgroundType === 'career_switcher' &&
                      'Identify transferable skills and plan your transition into a different career.'}

                    {backgroundType === 'self_taught_freelancer' &&
                      'Organize your existing skills and identify ways to demonstrate your expertise.'}

                    {backgroundType === 'other' &&
                      'Describe your current education, experience or career situation below.'}
                  </p>
                </div>
              )}

              {backgroundType !== 'other' && (
                <div className="mt-4">
                  <FormField
                    label="Additional details (optional)"
                    htmlFor="background"
                    hint="Add your degree, current role or experience to personalize your roadmap."
                  >
                    <TextInput
                      id="background"
                      placeholder="e.g. B.Com graduate, 1 year in sales"
                      value={background}
                      onChange={(event) => setBackground(event.target.value)}
                    />
                  </FormField>
                </div>
              )}

              {backgroundType === 'other' && (
                <div className="mt-4">
                  <FormField
                    label="Tell us about your background"
                    htmlFor="background"
                    required
                    error={
                      formError &&
                      background.trim().length < 2
                        ? formError
                        : undefined
                    }
                    hint="Describe your education, work experience or current situation."
                  >
                    <TextInput
                      id="background"
                      placeholder="Describe your current background"
                      value={background}
                      onChange={(event) => {
                        setBackground(event.target.value);
                        setFormError(null);
                      }}
                    />
                  </FormField>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className={INPUT_CARD}>
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <Clock3 size={21} />
            </span>

            <div className="min-w-0 flex-1">
              <FormField
                label="What is your target timeline?"
                htmlFor="timeline"
                required
                hint="Choose the period for your career plan."
              >
                <SelectField
                  id="timeline"
                  options={TIMELINE_OPTIONS.map((option) => ({
                    value: String(option.value),
                    label: option.label,
                  }))}
                  value={String(timelineMonths)}
                  onChange={(event) =>
                    setTimelineMonths(
                      Number(event.target.value) as 6 | 12 | 18,
                    )
                  }
                />
              </FormField>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {([6, 12, 18] as const).map((months) => {
                  const selected = timelineMonths === months;

                  return (
                    <button
                      key={months}
                      type="button"
                      onClick={() => setTimelineMonths(months)}
                      className={`rounded-2xl border p-3 text-center transition ${
                        selected
                          ? 'border-violet-400 bg-violet-50 text-violet-800 ring-2 ring-violet-100'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300'
                      }`}
                    >
                      <span className="block text-lg font-extrabold">
                        {months}
                      </span>

                      <span className="text-xs font-medium">months</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {formError && (
          <div
            role="alert"
            className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700"
          >
            {formError}
          </div>
        )}

        {/* Generate roadmap */}
        <div className="border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-4 font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600 sm:w-auto"
          >
            Build My Career Roadmap
            <ArrowRight size={19} />
          </button>

          <p className="mt-3 text-xs leading-5 text-slate-400">
            Your roadmap is a planning guide, not a guarantee of employment
            or a particular salary.
          </p>
        </div>
      </div>
    </div>
  );
}
