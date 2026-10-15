import { analyzeSkillGap, extractMatchedSkillKeys } from '@/tools/skillGapAnalyzer';

describe('skillGapAnalyzer', () => {
  it('returns null for a role with no skill map on file', () => {
    expect(analyzeSkillGap('Python, SQL', 'Underwater Basket Weaver')).toBeNull();
  });

  it('detects an explicitly listed skill via its synonym', () => {
    const matched = extractMatchedSkillKeys('Experienced with Tableau dashboards and Power BI reporting.');
    expect(matched.has('data visualization')).toBe(true);
  });

  it('computes a 0-100 readiness score for a known role', () => {
    const result = analyzeSkillGap('I use Python and SQL daily, and have built machine learning models.', 'Data Scientist');
    expect(result).not.toBeNull();
    expect(result!.readinessPercent).toBeGreaterThanOrEqual(0);
    expect(result!.readinessPercent).toBeLessThanOrEqual(100);
  });

  it('returns 0% readiness for empty resume text without crashing', () => {
    const result = analyzeSkillGap('', 'Data Scientist');
    expect(result?.readinessPercent).toBe(0);
  });

  it('is case-insensitive and tolerant of unusual punctuation', () => {
    const matched = extractMatchedSkillKeys('PYTHON!!! ...pandas/numpy??');
    expect(matched.has('python')).toBe(true);
  });

  it('flags the highest-weight missing skill as the headline gap', () => {
    const result = analyzeSkillGap('I only know Excel.', 'Data Scientist');
    expect(result?.headlineGap).toContain('%');
  });
});
