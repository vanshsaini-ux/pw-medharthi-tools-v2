import { getSkillMapForRole } from '@/config/skillMaps';
import { SkillRequirement } from '@/types';

export interface SkillGapResult {
  role: string;
  readinessPercent: number;
  matchedSkills: SkillRequirement[];
  missingSkills: SkillRequirement[];
  headlineGap: string | null;
}

/**
 * Lightweight keyword/synonym-based extractor. This intentionally avoids
 * a heavyweight NLP/ML pipeline so the tool has zero ongoing inference
 * cost and no external API dependency - it reads the resume/LinkedIn text
 * the user provides and checks, per required skill, whether that skill (or
 * a common synonym) appears. This is accurate for skills that are
 * explicitly named (tools, certifications, technologies) which is exactly
 * the guidance the tool's copy gives users ("most accurate when your
 * resume explicitly lists tools and technologies").
 */
const SYNONYMS: Record<string, string[]> = {
  python: ['python', 'pandas', 'numpy'],
  sql: ['sql', 'mysql', 'postgres', 'postgresql', 'bigquery'],
  'machine learning': ['machine learning', 'ml model', 'scikit-learn', 'sklearn'],
  statistics: ['statistics', 'statistical analysis', 'hypothesis testing'],
  'data visualization': ['data visualization', 'tableau', 'power bi', 'looker'],
  mlops: ['mlops', 'model deployment', 'ci/cd for ml'],
  'deep learning': ['deep learning', 'tensorflow', 'pytorch', 'neural network'],
  'prompt engineering': ['prompt engineering', 'prompt design'],
  'llm fine-tuning': ['fine-tuning', 'fine tune', 'llm training'],
  'vector databases': ['vector database', 'pinecone', 'weaviate', 'faiss'],
  'api integration': ['api integration', 'rest api', 'api development'],
  excel: ['excel', 'spreadsheets', 'vlookup', 'pivot table'],
  'stakeholder management': ['stakeholder management', 'cross-functional'],
  'financial modeling': ['financial modeling', 'financial model', 'valuation model'],
  'process improvement': ['process improvement', 'lean six sigma', 'process optimisation'],
  seo: ['seo', 'search engine optimisation', 'search engine optimization'],
  'performance marketing': ['performance marketing', 'meta ads', 'google ads', 'ppc'],
  'content strategy': ['content strategy', 'content calendar', 'content planning'],
  'marketing analytics': ['marketing analytics', 'ga4', 'google analytics', 'attribution'],
  'crm tools': ['crm', 'hubspot', 'salesforce', 'zoho'],
  valuation: ['valuation', 'dcf', 'discounted cash flow'],
  'financial statement analysis': ['financial statement', 'p&l analysis', 'balance sheet analysis'],
  'risk management': ['risk management', 'risk assessment'],
  'people analytics': ['people analytics', 'hr analytics', 'workforce analytics'],
  'hris tools': ['hris', 'workday', 'successfactors', 'darwinbox'],
  'talent strategy': ['talent strategy', 'talent management'],
  'regulatory frameworks': ['regulatory', 'compliance framework', 'sebi', 'rbi guidelines'],
  'contract drafting': ['contract drafting', 'contract review', 'legal drafting'],
  'risk assessment': ['risk assessment', 'due diligence'],
  'data privacy law': ['data privacy', 'gdpr', 'dpdp act'],
  'audit reporting': ['audit', 'internal audit', 'compliance audit']
};

function normalise(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9+.# ]/g, ' ');
}

export function extractMatchedSkillKeys(resumeText: string): Set<string> {
  const text = normalise(resumeText);
  const matched = new Set<string>();
  for (const [skillKey, terms] of Object.entries(SYNONYMS)) {
    if (terms.some((term) => text.includes(term))) matched.add(skillKey);
  }
  return matched;
}

export function analyzeSkillGap(resumeText: string, targetRole: string): SkillGapResult | null {
  const roleMap = getSkillMapForRole(targetRole);
  if (!roleMap) return null;

  const matchedKeys = extractMatchedSkillKeys(resumeText);
  const matchedSkills: SkillRequirement[] = [];
  const missingSkills: SkillRequirement[] = [];

  for (const req of roleMap.requiredSkills) {
    const key = req.skill.toLowerCase();
    if (matchedKeys.has(key)) matchedSkills.push(req);
    else missingSkills.push(req);
  }

  const totalWeight = roleMap.requiredSkills.reduce((s, r) => s + r.weight, 0) || 1;
  const matchedWeight = matchedSkills.reduce((s, r) => s + r.weight, 0);
  const readinessPercent = Math.round((matchedWeight / totalWeight) * 100);

  const biggestGap = [...missingSkills].sort((a, b) => b.weight - a.weight)[0];
  const headlineGap = biggestGap
    ? `You're ${readinessPercent}% ready for a ${targetRole} role — your biggest gap is ${biggestGap.skill}.`
    : `You're ${readinessPercent}% ready for a ${targetRole} role — no major gaps detected.`;

  return { role: targetRole, readinessPercent, matchedSkills, missingSkills, headlineGap };
}
