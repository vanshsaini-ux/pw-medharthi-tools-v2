// ---------------------------------------------------------------------------
// Shared domain types used across all five tools, the lead form, and the
// Google Sheets lead-capture pipeline.
// ---------------------------------------------------------------------------

export type InterestDomain =
  | 'tech_ai'
  | 'business_management'
  | 'people_hr'
  | 'law_compliance'
  | 'finance_commerce'
  | 'science_research'
  | 'healthcare_pharma'
  | 'arts_communication'
  | 'social_impact';

export type CareerGoal =
  | 'higher_salary'
  | 'industry_switch'
  | 'promotion'
  | 'entrepreneurship'
  | 'skill_validation';

export type ExperienceBand = '0' | '1-3' | '3-6' | '6+';

export type StudyMode = 'weekend' | 'daily_1hr' | 'flexible';

export type WorkMode = 'metro' | 'tier2' | 'remote';

export type Category = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';

/** A single PW Medharthi program record used by every tool's engine.
 * See /config/programs.ts for what's real (names, eligibility) vs. still
 * placeholder (fees, salaries, growth multipliers, domain tags) about the
 * current 87-program catalogue, and each record's own `sourceNote`. */
export interface ProgramProfile {
  id: string;
  name: string;
  slug: string;
  primaryDomain: InterestDomain;
  interestWeights: Partial<Record<InterestDomain, number>>; // 0-1
  goalWeights: Partial<Record<CareerGoal, number>>; // 0-1
  experienceFit: Partial<Record<ExperienceBand, number>>; // 0-1
  studyModeFit: Partial<Record<StudyMode, number>>; // 0-1
  feeInr: number;
  durationMonths: number;
  jobRoles: string[];
  avgStartingSalaryInr: number; // annual, metro baseline
  fiveYearGrowthMultiplier: number; // salary at year 5 vs starting, WITH the program
  baselineGrowthMultiplier: number; // salary growth WITHOUT the program (status quo)
  minQualificationLevel: QualificationLevel;
  minPercentage: number;
  minExperienceYears: number;
  bridgeCourseAvailable: boolean;
  sourceNote: string;
}

export type QualificationLevel = 'class12' | 'diploma' | 'bachelor' | 'master';

export interface SkillRequirement {
  skill: string;
  weight: number; // relative importance 1-5
  courseModule: string;
  programSlug: string;
}

export interface RoleSkillMap {
  role: string;
  industry: string;
  requiredSkills: SkillRequirement[];
}

// ---------------------------------------------------------------------------
// Lead capture
// ---------------------------------------------------------------------------

export type ToolSlug =
  | 'career-fit-finder'
  | 'career-roi-calculator'
  | 'skill-gap-analyzer'
  | 'career-roadmap-generator'
  | 'eligibility-checker';

export interface LeadPayload {
  fullName: string;
  email: string;
  phone?: string;
  city?: string;
  profession?: string;
  toolUsed: ToolSlug;
  userInputsSummary: string;
  resultSummary: string;
  sourcePage: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  consent: boolean;
  honeypot?: string; // must stay empty - filled only by bots
  submittedAtIso: string;
}

export interface LeadApiResponse {
  success: boolean;
  message: string;
}

export interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
}
