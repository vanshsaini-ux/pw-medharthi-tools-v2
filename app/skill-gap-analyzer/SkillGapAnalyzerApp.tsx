
'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  GraduationCap,
  Link2,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  X,
} from 'lucide-react';

import FormField from '@/components/FormField';
import SelectField from '@/components/SelectField';
import TextInput from '@/components/TextInput';
import LoadingState from '@/components/LoadingState';
import ErrorMessage from '@/components/ErrorMessage';
import ResultCard from '@/components/ResultCard';
import ScoreDial from '@/components/ScoreDial';
import ShareButton from '@/components/ShareButton';
import LeadForm from '@/components/LeadForm';

import {
  analyzeSkillGap,
  type SkillGapResult,
} from '@/tools/skillGapAnalyzer';

import { ALL_ROLES } from '@/config/skillMaps';

import {
  extractTextFromFile,
  ACCEPTED_RESUME_EXTENSIONS,
  MAX_RESUME_FILE_SIZE_BYTES,
} from '@/lib/resumeParser';

import { getProgramBySlug } from '@/config/programs';
import { EXPLORE_PROGRAMS_URL } from '@/lib/links';
import { trackEvent } from '@/lib/analytics';

type Stage =
  | 'form'
  | 'loading'
  | 'teaser'
  | 'gated_form'
  | 'full'
  | 'error';

const ROLE_OPTIONS = ALL_ROLES.map((role) => ({
  value: role,
  label: role,
}));

function isValidLinkedInUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return (
      url.protocol === 'https:' &&
      (url.hostname === 'linkedin.com' ||
        url.hostname === 'www.linkedin.com') &&
      url.pathname.startsWith('/in/')
    );
  } catch {
    return false;
  }
}

export default function SkillGapAnalyzerApp() {
  const [stage, setStage] = useState<Stage>('form');

  const [resumeText, setResumeText] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [targetRole, setTargetRole] = useState(
    ROLE_OPTIONS[0]?.value ?? '',
  );

  const [fileName, setFileName] = useState('');
  const [isReadingFile, setIsReadingFile] = useState(false);

  const [fileError, setFileError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [result, setResult] = useState<SkillGapResult | null>(null);

  useEffect(() => {
    trackEvent('tool_page_viewed', {
      tool: 'skill-gap-analyzer',
    });
  }, []);

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setFileError(null);
    setFormError(null);

    if (file.size > MAX_RESUME_FILE_SIZE_BYTES) {
      setFileError(
        'This file exceeds the 5 MB limit. Choose a smaller file or paste your resume text.',
      );
      event.target.value = '';
      return;
    }

    if (file.size === 0) {
      setFileError('This file is empty. Please choose another file.');
      event.target.value = '';
      return;
    }

    setIsReadingFile(true);

    try {
      const extractedText = await extractTextFromFile(file);

      if (!extractedText.trim()) {
        setFileError(
          'No readable text was found. Try another file or paste your resume text.',
        );
        return;
      }

      setResumeText(extractedText);
      setFileName(file.name);
    } catch (error) {
      setFileError(
        error instanceof Error
          ? error.message
          : 'Could not read this file. Please paste your resume text instead.',
      );
    } finally {
      setIsReadingFile(false);
      event.target.value = '';
    }
  }

  function removeResume() {
    setResumeText('');
    setFileName('');
    setFileError(null);
    setFormError(null);
  }

  function handleAnalyze() {
    const hasResumeText = resumeText.trim().length >= 30;
    const hasLinkedInUrl = linkedinUrl.trim().length > 0;

    if (!targetRole) {
      setFormError('Please select your target job role.');
      return;
    }

    if (!hasResumeText && !hasLinkedInUrl) {
      setFormError(
        'Upload your resume, paste your resume text, or enter a LinkedIn profile URL.',
      );
      return;
    }

    if (!hasResumeText && hasLinkedInUrl) {
      if (!isValidLinkedInUrl(linkedinUrl.trim())) {
        setFormError(
          'Enter a valid LinkedIn profile URL, such as https://www.linkedin.com/in/your-profile/.',
        );
        return;
      }

      setFormError(
        'A LinkedIn URL alone does not provide your profile contents. Paste your profile experience and skills into the resume text field, then analyze again.',
      );
      return;
    }

    setFormError(null);
    setStage('loading');

    trackEvent('tool_started', {
      tool: 'skill-gap-analyzer',
    });

    window.setTimeout(() => {
      try {
        const analysis = analyzeSkillGap(
          resumeText.trim(),
          targetRole,
        );

        if (!analysis) {
          setStage('error');
          return;
        }

        setResult(analysis);
        setStage('teaser');

        trackEvent('calculation_completed', {
          tool: 'skill-gap-analyzer',
        });

        trackEvent('result_viewed', {
          tool: 'skill-gap-analyzer',
        });
      } catch {
        setStage('error');
      }
    }, 350);
  }

  function reset() {
    setStage('form');
    setResumeText('');
    setLinkedinUrl('');
    setFileName('');
    setResult(null);
    setFileError(null);
    setFormError(null);
    setIsReadingFile(false);
  }

  const userInputsSummary = [
    `Target role: ${targetRole}`,
    `Resume length: ${resumeText.length} characters`,
    `LinkedIn URL provided: ${linkedinUrl ? 'Yes' : 'No'}`,
  ].join('; ');

  const resultSummary = result
    ? `${result.readinessPercent}% readiness score for ${result.role}`
    : '';

  const inputShell =
    'rounded-3xl border border-slate-200 bg-white p-4 transition duration-200 focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-50 sm:p-5';

  if (stage === 'error') {
    return (
      <div className="rounded-3xl border border-rose-100 bg-rose-50/60 p-5 sm:p-8">
        <ErrorMessage
          message="We couldn't analyze your resume. Please check the text and try again."
          onRetry={() => {
            setStage('form');
            setResult(null);
          }}
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
          Analyzing your skills
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Comparing the skills in your resume with the selected role.
        </p>

        <div className="mt-5">
          <LoadingState label="Analyzing your professional profile…" />
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
                Assessment complete
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

            <h3 className="mt-7 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Your Job-Readiness Score
            </h3>

            <p className="mt-2 text-sm text-violet-100">
              Target role: {result.role}
            </p>

            <div className="mt-6 rounded-3xl bg-white p-5 text-slate-900 sm:p-7">
              <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
                <ScoreDial
                  percent={result.readinessPercent}
                  label={result.role}
                  sublabel="ready"
                />

                <div className="max-w-md flex-1 text-center sm:text-left">
                  <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
                    Your assessment
                  </p>

                  <p className="mt-3 text-base font-semibold leading-7 text-slate-800">
                    {result.headlineGap}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Use this score as a guide to understand your current
                    alignment with the skills evaluated for this role.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-px bg-slate-100 sm:grid-cols-2">
            <div className="bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 size={22} />
                </span>

                <div>
                  <p className="text-xs text-slate-400">
                    Matched skills
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-slate-900">
                    {result.matchedSkills.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <Target size={22} />
                </span>

                <div>
                  <p className="text-xs text-slate-400">
                    Potential skill gaps
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-slate-900">
                    {result.missingSkills.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <TrendingUp size={22} />
            </span>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Your next career step
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Review your matched skills, identify potential gaps,
                and decide which skills to develop first.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStage('gated_form')}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-4 font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 sm:w-auto"
          >
            View My Full Skill Gap Report
            <ArrowRight size={18} />
          </button>

          <p className="mt-3 text-xs leading-5 text-slate-400">
            Your score reflects the matching rules and role requirements
            implemented in this tool. It does not guarantee employment.
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
            <FileText size={27} />
          </span>

          <h3 className="mt-4 text-2xl font-extrabold text-slate-950">
            Get your detailed skill gap report
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Continue to review your matched skills and potential areas
            for improvement.
          </p>
        </div>

        <LeadForm
          toolUsed="skill-gap-analyzer"
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
              Detailed skill report
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
            Your skills breakdown
          </h3>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-violet-100">
            Review the skills matched to your target role and the
            additional skills identified by the analyzer.
          </p>

          <div className="mt-6 rounded-3xl bg-white p-5 text-slate-900 sm:p-7">
            <ScoreDial
              percent={result.readinessPercent}
              label={result.role}
              sublabel="ready"
            />

            <p className="mt-4 text-center text-sm leading-6 text-slate-600">
              {result.headlineGap}
            </p>
          </div>
        </div>

        <ResultCard title="Skills you already have" accent="teal">
          {result.matchedSkills.length === 0 ? (
            <p className="text-sm leading-6 text-slate-500">
              No listed skills matched yet. Add relevant tools,
              technologies and skills explicitly to your resume, then
              analyze it again.
            </p>
          ) : (
            <ul className="space-y-2">
              {result.matchedSkills.map((skill) => (
                <li
                  key={skill.skill}
                  className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3"
                >
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <span className="text-sm font-medium text-slate-800">
                    {skill.skill}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </ResultCard>

        <ResultCard title="Skills to develop next" accent="coral">
          {result.missingSkills.length === 0 ? (
            <p className="text-sm leading-6 text-slate-500">
              No additional gaps were identified by the current matching
              rules. Continue practicing your skills and review the
              requirements of specific job vacancies.
            </p>
          ) : (
            <ul className="space-y-3">
              {result.missingSkills.map((skill) => {
                const program = getProgramBySlug(skill.programSlug);

                return (
                  <li
                    key={skill.skill}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                        <Target size={18} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900">
                          {skill.skill}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          Learning area: {skill.courseModule}
                        </p>

                        {program && (
                          <a
                            href={EXPLORE_PROGRAMS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-violet-700 hover:text-violet-900"
                          >
                            Explore {program.name}
                            <ArrowRight size={15} />
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </ResultCard>

        <div className="rounded-3xl border border-sky-100 bg-sky-50/70 p-5 sm:p-6">
          <h4 className="font-bold text-slate-900">
            How to use this report
          </h4>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Prioritize the skills most relevant to your target role.
            Practice them through projects, document your experience,
            and update your resume when you can demonstrate the skills.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ShareButton
            toolSlug="skill-gap-analyzer"
            title="My Job-Readiness Score"
            text={`My skill assessment score is ${result.readinessPercent}% for a ${result.role} role. This is an indicative result from the PW Medharthi Skill Gap Analyzer.`}
          />

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <RotateCcw size={16} />
            Analyze again
          </button>
        </div>
      </div>
    );
  }

  return (
<div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-violet-100/40">      {/* Form header */}
<div className="border-b border-slate-100 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-6 sm:p-10">        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-violet-700 shadow-sm">
          <Sparkles size={15} />
          Free skill assessment
        </span>

        <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
          Check Your Job Readiness
        </h3>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
          Share your resume and select a target role to see which
          skills match and where you may need further development.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: FileText,
              label: 'Share your resume',
              color: 'bg-violet-100 text-violet-700',
            },
            {
              icon: Target,
              label: 'Choose your target role',
              color: 'bg-sky-100 text-sky-700',
            },
            {
              icon: TrendingUp,
              label: 'Review your skill gaps',
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
        {/* Resume upload */}
        <div className={inputShell}>
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <Upload size={21} />
            </span>

            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-slate-900">
                Upload your resume
              </h4>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Upload a supported file to extract your skills and
                professional experience.
              </p>
            </div>
          </div>

          <label
            htmlFor="resumeFile"
            className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/50 px-4 py-8 text-center transition hover:border-violet-400 hover:bg-violet-50"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm">
              <FileText size={24} />
            </span>

            <span className="mt-3 text-sm font-bold text-slate-800">
              {isReadingFile
                ? 'Reading your resume…'
                : 'Click to choose a resume'}
            </span>

            <span className="mt-1 text-xs leading-5 text-slate-500">
              PDF, DOCX or TXT · Maximum 5 MB
            </span>

            <input
              id="resumeFile"
              type="file"
              accept={ACCEPTED_RESUME_EXTENSIONS}
              onChange={handleFileChange}
              disabled={isReadingFile}
              className="sr-only"
            />
          </label>

          {fileName && (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <CheckCircle2
                  size={20}
                  className="shrink-0 text-emerald-600"
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {fileName}
                  </p>

                  <p className="text-xs text-emerald-700">
                    Resume text extracted
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={removeResume}
                aria-label="Remove uploaded resume"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white hover:text-rose-600"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {fileError && (
            <p role="alert" className="mt-3 text-sm text-rose-600">
              {fileError}
            </p>
          )}
        </div>

        {/* Resume text */}
        <div className={inputShell}>
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <FileText size={21} />
            </span>

            <div className="min-w-0 flex-1">
              <FormField
                label="Paste your resume or profile text"
                htmlFor="resumeText"
                hint="Include skills, tools, projects and work experience for a more useful assessment."
              >
                <textarea
                  id="resumeText"
                  rows={7}
                  value={resumeText}
                  onChange={(event) => {
                    setResumeText(event.target.value);
                    setFormError(null);
                  }}
                  placeholder="Paste your professional summary, skills, work experience, projects and qualifications here…"
                  className="input-field resize-y text-sm leading-6"
                />
              </FormField>

              <p className="mt-2 text-right text-xs text-slate-400">
                {resumeText.length} characters
              </p>
            </div>
          </div>
        </div>

        {/* LinkedIn URL */}
        <div className={inputShell}>
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <Link2 size={21} />
            </span>

            <div className="min-w-0 flex-1">
              <FormField
                label="LinkedIn profile URL"
                htmlFor="linkedinUrl"
                hint="Optional. A URL alone does not import your profile. Paste the profile text above to analyze it."
              >
                <TextInput
                  id="linkedinUrl"
                  placeholder="https://www.linkedin.com/in/your-profile/"
                  value={linkedinUrl}
                  onChange={(event) => {
                    setLinkedinUrl(event.target.value);
                    setFormError(null);
                  }}
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Target role */}
        <div className={inputShell}>
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <BriefcaseBusiness size={21} />
            </span>

            <div className="min-w-0 flex-1">
              <FormField
                label="Which job role are you targeting?"
                htmlFor="targetRole"
                required
              >
                <SelectField
                  id="targetRole"
                  options={ROLE_OPTIONS}
                  value={targetRole}
                  onChange={(event) => {
                    setTargetRole(event.target.value);
                    setFormError(null);
                  }}
                />
              </FormField>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Choose the role whose skills you want to evaluate.
              </p>
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

        <div className="border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isReadingFile || !targetRole}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-4 font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600"
          >
            Analyze My Skills
            <ArrowRight size={19} />
          </button>

          <p className="mt-3 text-center text-xs leading-5 text-slate-400">
            Results depend on the resume information and role-matching
            rules used by the analyzer.
          </p>
        </div>
      </div>
    </div>
  );
}
