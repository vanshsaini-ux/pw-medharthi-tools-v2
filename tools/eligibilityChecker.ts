import { PROGRAMS, QUALIFICATION_LEVEL_RANK, getProgramBySlug } from '@/config/programs';
import { Category, ProgramProfile, QualificationLevel } from '@/types';

export type EligibilityStatus = 'eligible' | 'eligible_with_bridge' | 'not_eligible';

export interface EligibilityInput {
  qualificationLevel: QualificationLevel;
  percentage: number;
  category: Category;
  experienceYears: number;
  targetProgramSlug: string | 'suggest_best_fit';
}

export interface EligibilityResult {
  program: ProgramProfile;
  status: EligibilityStatus;
  reasons: string[];
  alternativePrograms: ProgramProfile[];
}

function checkAgainstProgram(input: EligibilityInput, program: ProgramProfile): EligibilityResult {
  const reasons: string[] = [];
  const learnerLevel = QUALIFICATION_LEVEL_RANK[input.qualificationLevel];
  const requiredLevel = QUALIFICATION_LEVEL_RANK[program.minQualificationLevel];

  const levelOk = learnerLevel >= requiredLevel;
  const percentOk = input.percentage >= program.minPercentage;
  const experienceOk = input.experienceYears >= program.minExperienceYears;

  if (!levelOk) reasons.push(`Requires at least a ${program.minQualificationLevel} qualification.`);
  if (!percentOk) reasons.push(`Requires a minimum of ${program.minPercentage}% (category relaxations may apply for SC/ST/OBC/EWS - confirm with admissions).`);
  if (!experienceOk) reasons.push(`Requires at least ${program.minExperienceYears} year(s) of work experience.`);

  let status: EligibilityStatus;
  if (levelOk && percentOk && experienceOk) {
    status = 'eligible';
  } else if (!levelOk && program.bridgeCourseAvailable && program.minQualificationLevel !== 'class12') {
    status = 'eligible_with_bridge';
    reasons.unshift('A short bridge/foundation course covers the qualification gap.');
  } else if (!percentOk && program.minPercentage - input.percentage <= 5) {
    // Close-call percentage gaps are commonly bridgeable - flagged for admissions confirmation.
    status = 'eligible_with_bridge';
    reasons.unshift('Your percentage is close to the requirement - a bridge course or admissions review may still qualify you.');
  } else {
    status = 'not_eligible';
  }

  const alternativePrograms =
    status === 'not_eligible'
      ? PROGRAMS.filter((p) => p.id !== program.id)
          .filter((p) => QUALIFICATION_LEVEL_RANK[p.minQualificationLevel] <= learnerLevel && p.minPercentage <= input.percentage + 5)
          .slice(0, 2)
      : [];

  return { program, status, reasons, alternativePrograms };
}

export function checkEligibility(input: EligibilityInput): EligibilityResult | EligibilityResult[] | null {
  if (input.targetProgramSlug === 'suggest_best_fit') {
    return PROGRAMS.map((program) => checkAgainstProgram(input, program))
      .sort((a, b) => statusRank(a.status) - statusRank(b.status))
      .slice(0, 5);
  }
  const program = getProgramBySlug(input.targetProgramSlug);
  if (!program) return null;
  return checkAgainstProgram(input, program);
}

function statusRank(status: EligibilityStatus): number {
  return status === 'eligible' ? 0 : status === 'eligible_with_bridge' ? 1 : 2;
}

export const QUALIFICATION_LEVELS: { value: QualificationLevel; label: string }[] = [
  { value: 'class12', label: 'Class 12 / Senior Secondary' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'bachelor', label: "Bachelor's Degree" },
  { value: 'master', label: "Master's Degree" }
];

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'General', label: 'General' },
  { value: 'OBC', label: 'OBC' },
  { value: 'SC', label: 'SC' },
  { value: 'ST', label: 'ST' },
  { value: 'EWS', label: 'EWS' }
];
