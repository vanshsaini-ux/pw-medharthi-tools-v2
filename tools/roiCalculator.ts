import { getProgramBySlug } from '@/config/programs';
import { ProgramProfile, WorkMode } from '@/types';

export interface RoiInput {
  isFresher: boolean;
  currentAnnualSalaryInr: number; // 0 if fresher
  experienceYears: number;
  programSlug: string;
  workMode: WorkMode;
}

export interface RoiYearPoint {
  year: number;
  withProgramInr: number;
  withoutProgramInr: number;
}

export interface RoiResult {
  program: ProgramProfile;
  breakEvenMonth: number | null; // null = not reached within 5 years
  fiveYearCurve: RoiYearPoint[];
  monthlyGainAfterCompletion: number;
  feeInr: number;
  emiEstimateInr: number; // simple 12-month, 0-processing-fee illustrative EMI
}

// Reasonable, documented city-mode adjustment - not from the source doc.
const WORK_MODE_MULTIPLIER: Record<WorkMode, number> = {
  metro: 1.15,
  tier2: 0.9,
  remote: 1.0
};

export function calculateRoi(input: RoiInput): RoiResult | null {
  const program = getProgramBySlug(input.programSlug);
  if (!program) return null;

  const modeMultiplier = WORK_MODE_MULTIPLIER[input.workMode];
  const baseSalary = input.isFresher
    ? program.avgStartingSalaryInr * modeMultiplier
    : Math.max(input.currentAnnualSalaryInr, program.avgStartingSalaryInr * 0.6) * modeMultiplier;

  const withoutProgramYear5 = baseSalary * program.baselineGrowthMultiplier;
  const withProgramYear5 = baseSalary * program.fiveYearGrowthMultiplier;

  const fiveYearCurve: RoiYearPoint[] = [1, 2, 3, 4, 5].map((year) => {
    const withoutFactor = 1 + ((program.baselineGrowthMultiplier - 1) * year) / 5;
    const withFactor = 1 + ((program.fiveYearGrowthMultiplier - 1) * year) / 5;
    return {
      year,
      withoutProgramInr: Math.round(baseSalary * withoutFactor),
      withProgramInr: Math.round(baseSalary * withFactor)
    };
  });

  const monthlyGainAfterCompletion = Math.round((withProgramYear5 - withoutProgramYear5) / 12 / 5) || 1;
  const rawBreakEvenMonths = program.feeInr / Math.max(monthlyGainAfterCompletion, 1);
  const breakEvenMonth = rawBreakEvenMonths <= 60 ? Math.ceil(rawBreakEvenMonths) : null;

  const emiEstimateInr = Math.round(program.feeInr / 12);

  return {
    program,
    breakEvenMonth,
    fiveYearCurve,
    monthlyGainAfterCompletion,
    feeInr: program.feeInr,
    emiEstimateInr
  };
}

export const WORK_MODES: { value: WorkMode; label: string }[] = [
  { value: 'metro', label: 'Metro city' },
  { value: 'tier2', label: 'Tier-2 city' },
  { value: 'remote', label: 'Remote' }
];
