import { calculateRoi } from '@/tools/roiCalculator';
import { PROGRAMS } from '@/config/programs';

describe('roiCalculator', () => {
  const validSlug = PROGRAMS[0]!.slug;

  it('returns null for an unknown program slug', () => {
    const result = calculateRoi({ isFresher: true, currentAnnualSalaryInr: 0, experienceYears: 0, programSlug: 'does-not-exist', workMode: 'metro' });
    expect(result).toBeNull();
  });

  it('computes a 5-point salary curve for years 1 through 5', () => {
    const result = calculateRoi({ isFresher: true, currentAnnualSalaryInr: 0, experienceYears: 0, programSlug: validSlug, workMode: 'metro' });
    expect(result?.fiveYearCurve).toHaveLength(5);
    expect(result?.fiveYearCurve.map((p) => p.year)).toEqual([1, 2, 3, 4, 5]);
  });

  it('produces a higher year-5 salary with the program than without it', () => {
    const result = calculateRoi({ isFresher: false, currentAnnualSalaryInr: 800000, experienceYears: 3, programSlug: validSlug, workMode: 'metro' });
    const year5 = result?.fiveYearCurve[4];
    expect(year5!.withProgramInr).toBeGreaterThan(year5!.withoutProgramInr);
  });

  it('never divides by zero when the salary gain is negligible', () => {
    expect(() => calculateRoi({ isFresher: true, currentAnnualSalaryInr: 0, experienceYears: 0, programSlug: validSlug, workMode: 'metro' })).not.toThrow();
  });

  it('handles a very high current salary without crashing (extreme value)', () => {
    const result = calculateRoi({ isFresher: false, currentAnnualSalaryInr: 90000000, experienceYears: 20, programSlug: validSlug, workMode: 'metro' });
    expect(result).not.toBeNull();
  });

  it('handles decimal salary input', () => {
    const result = calculateRoi({ isFresher: false, currentAnnualSalaryInr: 750500.5, experienceYears: 2.5, programSlug: validSlug, workMode: 'tier2' });
    expect(result).not.toBeNull();
    expect(Number.isFinite(result?.breakEvenMonth ?? 0)).toBe(true);
  });
});
