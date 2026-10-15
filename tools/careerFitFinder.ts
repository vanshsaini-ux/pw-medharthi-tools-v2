import { PROGRAMS } from '@/config/programs';
import { CareerGoal, ExperienceBand, InterestDomain, ProgramProfile, StudyMode } from '@/types';

export interface CareerFitInput {
  qualification: string;
  experience: ExperienceBand;
  interests: InterestDomain[];
  goal: CareerGoal;
  weeklyHours: number;
  studyMode: StudyMode;
}

export interface CareerFitMatch {
  program: ProgramProfile;
  matchPercent: number;
  reason: string;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/**
 * Builds the learner's normalised input vector and compares it against
 * every program's pre-weighted vector using cosine similarity, then
 * converts the similarity (-1..1, practically 0..1 here) into a 0-100
 * match percentage. This keeps the logic explainable: the "reason" string
 * is built directly from whichever dimensions actually overlapped, not a
 * generic label.
 */
export function scoreProgram(input: CareerFitInput, program: ProgramProfile): CareerFitMatch {
  const interestScore =
    input.interests.length > 0
      ? input.interests.reduce((sum, d) => sum + (program.interestWeights[d] ?? 0), 0) / input.interests.length
      : 0;
  const goalScore = program.goalWeights[input.goal] ?? 0;
  const experienceScore = program.experienceFit[input.experience] ?? 0;
  const modeScore = program.studyModeFit[input.studyMode] ?? 0.5;

  // Weighted blend - interest and goal matter most for a discovery-stage quiz.
  const weighted = interestScore * 0.4 + goalScore * 0.3 + experienceScore * 0.2 + modeScore * 0.1;
  const matchPercent = Math.round(clamp01(weighted) * 100);

  const reasonParts: string[] = [];
  const topInterest = input.interests.find((d) => (program.interestWeights[d] ?? 0) >= 0.5);
  if (topInterest) reasonParts.push(`your interest in ${formatDomain(topInterest)}`);
  if (goalScore >= 0.6) reasonParts.push(`your goal of ${formatGoal(input.goal)}`);
  if (experienceScore >= 0.7) reasonParts.push(`your ${input.experience === '0' ? 'fresher' : input.experience + ' yrs'} experience level`);

  const reason =
    reasonParts.length > 0
      ? `Matched because of ${reasonParts.join(' + ')}.`
      : `Matched on overall profile fit across interests, goals and experience.`;

  return { program, matchPercent, reason };
}

export function findTopMatches(input: CareerFitInput, count = 3): CareerFitMatch[] {
  return PROGRAMS.map((program) => scoreProgram(input, program))
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, count);
}

export function formatDomain(domain: InterestDomain): string {
  const map: Record<InterestDomain, string> = {
    tech_ai: 'Tech & AI',
    business_management: 'Business & Management',
    people_hr: 'People & HR',
    law_compliance: 'Law & Compliance',
    finance_commerce: 'Finance & Commerce',
    science_research: 'Science & Research',
    healthcare_pharma: 'Healthcare & Pharma',
    arts_communication: 'Arts & Communication',
    social_impact: 'Social Impact'
  };
  return map[domain];
}

export function formatGoal(goal: CareerGoal): string {
  const map: Record<CareerGoal, string> = {
    higher_salary: 'a higher salary',
    industry_switch: 'an industry switch',
    promotion: 'a promotion',
    entrepreneurship: 'entrepreneurship',
    skill_validation: 'skill validation'
  };
  return map[goal];
}

export const INTEREST_DOMAINS: { value: InterestDomain; label: string }[] = [
  { value: 'tech_ai', label: 'Tech & AI' },
  { value: 'business_management', label: 'Business & Management' },
  { value: 'people_hr', label: 'People & HR' },
  { value: 'finance_commerce', label: 'Finance & Commerce' },
  { value: 'science_research', label: 'Science & Research' },
  { value: 'healthcare_pharma', label: 'Healthcare & Pharma' },
  { value: 'arts_communication', label: 'Arts & Communication' },
  { value: 'social_impact', label: 'Social Impact' }
];

export const CAREER_GOALS: { value: CareerGoal; label: string }[] = [
  { value: 'higher_salary', label: 'Higher salary' },
  { value: 'industry_switch', label: 'Industry switch' },
  { value: 'promotion', label: 'Promotion' },
  { value: 'entrepreneurship', label: 'Entrepreneurship' },
  { value: 'skill_validation', label: 'Skill validation' }
];
