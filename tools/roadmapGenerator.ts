import { getSkillMapForRole } from '@/config/skillMaps';
import { getProgramBySlug, PROGRAMS } from '@/config/programs';
import { SkillRequirement } from '@/types';

export interface RoadmapMilestone {
  monthRangeLabel: string; // e.g. "Month 1-2"
  startMonth: number;
  endMonth: number;
  focus: string;
  activities: string[];
  matchedCourseModule?: string;
  matchedProgramName?: string;
  matchedProgramSlug?: string;
}

export interface RoadmapResult {
  targetRole: string;
  timelineMonths: number;
  milestones: RoadmapMilestone[];
  groundedInRole: boolean;
}

/**
 * Deterministic, fully-grounded roadmap builder. This is the tool's
 * reliable default path (works with zero external dependencies/cost).
 * If ANTHROPIC_API_KEY is configured, the API route in
 * /app/api/roadmap/route.ts additionally asks an LLM to turn this same
 * skill data into more natural prose - but the milestones/skills/courses
 * themselves always come from this grounded structure, never from
 * open-ended model output, per the brief's "grounded generative AI"
 * requirement.
 */
export function buildGroundedRoadmap(targetRole: string, background: string, timelineMonths: 6 | 12 | 18): RoadmapResult {
  const roleMap = getSkillMapForRole(targetRole);
  const skills: SkillRequirement[] = roleMap
    ? [...roleMap.requiredSkills].sort((a, b) => b.weight - a.weight)
    : [];

  const phaseCount = 4;
  const phaseLength = Math.max(1, Math.round(timelineMonths / phaseCount));
  const phases = [
    { label: 'Foundational skills', activities: (s: SkillRequirement[]) => s.slice(0, Math.ceil(s.length / 3)) },
    { label: 'Core specialisation + certifications', activities: (s: SkillRequirement[]) => s.slice(Math.ceil(s.length / 3), Math.ceil((2 * s.length) / 3)) },
    { label: 'Projects & portfolio building', activities: (s: SkillRequirement[]) => s.slice(Math.ceil((2 * s.length) / 3)) },
    { label: 'Job-search readiness', activities: () => [] as SkillRequirement[] }
  ];

  const milestones: RoadmapMilestone[] = [];
  let cursor = 1;
  phases.forEach((phase, idx) => {
    const start = cursor;
    const end = idx === phases.length - 1 ? timelineMonths : Math.min(timelineMonths, cursor + phaseLength - 1);
    cursor = end + 1;
    const phaseSkills = phase.activities(skills);
    const activities =
      phaseSkills.length > 0
        ? phaseSkills.map((s) => `Build "${s.skill}" through ${s.courseModule}`)
        : idx === phases.length - 1
        ? ['Update resume/LinkedIn with new skills and certifications', 'Apply to target roles and prep for interviews', 'Request referrals from your network']
        : [`Deepen practical experience toward ${targetRole}`, background ? `Bridge from your current background: ${background}` : 'Bridge from your current background'];

    const firstMatched = phaseSkills[0];
    const matchedProgram = firstMatched ? getProgramBySlug(firstMatched.programSlug) : undefined;

    milestones.push({
      monthRangeLabel: start === end ? `Month ${start}` : `Month ${start}-${end}`,
      startMonth: start,
      endMonth: end,
      focus: phase.label,
      activities,
      matchedCourseModule: firstMatched?.courseModule,
      matchedProgramName: matchedProgram?.name,
      matchedProgramSlug: matchedProgram?.slug
    });
  });

  return { targetRole, timelineMonths, milestones, groundedInRole: !!roleMap };
}

/** Builds a constrained LLM prompt - the model is only allowed to
 * elaborate on the grounded skill/course data below, not invent new
 * skills, certifications or salary claims. Used by /app/api/roadmap. */
export function buildGroundedLlmPrompt(targetRole: string, background: string, timelineMonths: number): string {
  const roleMap = getSkillMapForRole(targetRole);
  const skillList = roleMap
    ? roleMap.requiredSkills.map((s) => `- ${s.skill} (taught in "${s.courseModule}")`).join('\n')
    : '- No verified skill map for this role is on file; give general, clearly-labelled guidance only.';
  const courseNames = PROGRAMS.map((p) => p.name).join(', ');

  return [
    'You are a career roadmap writer for PW Medharthi, an online degree platform.',
    `Write a friendly, encouraging ${timelineMonths}-month roadmap for someone who wants to become a ${targetRole}.`,
    `Their current background: ${background || 'not specified'}.`,
    'You MUST only reference skills, certifications and courses from this verified list - do not invent any others:',
    skillList,
    `Available PW Medharthi programs (only mention one if it genuinely matches a milestone): ${courseNames}.`,
    'Structure the answer as 4 short month-range milestones. Keep it concise and concrete, no fluff, no fabricated statistics.'
  ].join('\n');
}

export const TIMELINE_OPTIONS: { value: 6 | 12 | 18; label: string }[] = [
  { value: 6, label: '6 months' },
  { value: 12, label: '12 months' },
  { value: 18, label: '18 months' }
];
