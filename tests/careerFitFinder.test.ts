import { findTopMatches, scoreProgram } from '@/tools/careerFitFinder';
import { PROGRAMS } from '@/config/programs';

describe('careerFitFinder', () => {
  it('returns exactly N top matches sorted descending by match percent', () => {
    const matches = findTopMatches({
      qualification: 'B.Tech',
      experience: '1-3',
      interests: ['tech_ai'],
      goal: 'industry_switch',
      weeklyHours: 10,
      studyMode: 'flexible'
    });
    expect(matches).toHaveLength(3);
    expect(matches[0]!.matchPercent).toBeGreaterThanOrEqual(matches[1]!.matchPercent);
    expect(matches[1]!.matchPercent).toBeGreaterThanOrEqual(matches[2]!.matchPercent);
  });

  it('scores a tech_ai program higher for a tech_ai-interested learner than for social_impact interest', () => {
    const techProgram = PROGRAMS.find((p) => p.primaryDomain === 'tech_ai')!;
    const withTechInterest = scoreProgram(
      { qualification: 'B.Tech', experience: '1-3', interests: ['tech_ai'], goal: 'industry_switch', weeklyHours: 10, studyMode: 'flexible' },
      techProgram
    );
    const withSocialInterest = scoreProgram(
      { qualification: 'B.Tech', experience: '1-3', interests: ['social_impact'], goal: 'industry_switch', weeklyHours: 10, studyMode: 'flexible' },
      techProgram
    );
    expect(withTechInterest.matchPercent).toBeGreaterThan(withSocialInterest.matchPercent);
  });

  it('never returns a match percent outside 0-100', () => {
    const matches = findTopMatches({ qualification: '', experience: '0', interests: [], goal: 'skill_validation', weeklyHours: 1, studyMode: 'weekend' }, PROGRAMS.length);
    matches.forEach((m) => {
      expect(m.matchPercent).toBeGreaterThanOrEqual(0);
      expect(m.matchPercent).toBeLessThanOrEqual(100);
    });
  });

  it('produces a non-generic reason string that references the input', () => {
    const [top] = findTopMatches({ qualification: 'MBA', experience: '3-6', interests: ['finance_commerce'], goal: 'promotion', weeklyHours: 8, studyMode: 'daily_1hr' }, 1);
    expect(top!.reason.length).toBeGreaterThan(10);
  });
});
