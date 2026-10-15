import { checkEligibility } from '@/tools/eligibilityChecker';
import { PROGRAMS } from '@/config/programs';

describe('eligibilityChecker', () => {
  it('returns null for an unknown target program', () => {
    const result = checkEligibility({ qualificationLevel: 'bachelor', percentage: 60, category: 'General', experienceYears: 0, targetProgramSlug: 'unknown-slug' });
    expect(result).toBeNull();
  });

  it('marks a well-qualified learner as eligible', () => {
    const program = PROGRAMS.find((p) => p.minQualificationLevel === 'bachelor')!;
    const result = checkEligibility({ qualificationLevel: 'master', percentage: 90, category: 'General', experienceYears: 10, targetProgramSlug: program.slug });
    expect(Array.isArray(result)).toBe(false);
    expect((result as any).status).toBe('eligible');
  });

  it('marks an under-qualified learner as not eligible or bridge-eligible, never a crash', () => {
    const program = PROGRAMS.find((p) => p.minQualificationLevel === 'bachelor')!;
    const result = checkEligibility({ qualificationLevel: 'class12', percentage: 30, category: 'General', experienceYears: 0, targetProgramSlug: program.slug });
    expect(['not_eligible', 'eligible_with_bridge']).toContain((result as any).status);
  });

  it('suggests up to 2 alternative programs when not eligible', () => {
    const program = PROGRAMS.find((p) => p.minQualificationLevel === 'bachelor' && !p.bridgeCourseAvailable)!;
    const result = checkEligibility({ qualificationLevel: 'class12', percentage: 20, category: 'General', experienceYears: 0, targetProgramSlug: program.slug }) as any;
    expect(result.alternativePrograms.length).toBeLessThanOrEqual(2);
  });

  it("suggest_best_fit returns a ranked array, not a single object", () => {
    const result = checkEligibility({ qualificationLevel: 'bachelor', percentage: 55, category: 'OBC', experienceYears: 1, targetProgramSlug: 'suggest_best_fit' });
    expect(Array.isArray(result)).toBe(true);
    expect((result as any[]).length).toBeGreaterThan(0);
  });
});
