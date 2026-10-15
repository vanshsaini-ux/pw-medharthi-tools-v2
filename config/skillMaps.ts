import { RoleSkillMap } from '@/types';

/**
 * Role -> skill -> real PW Medharthi programme map.
 * `programSlug` values point at real programmes in /config/programs.ts
 * (see that file for what's real vs. placeholder about each programme).
 * The skill list and weighting per role is still a reasonable starting
 * point, not sourced from a confirmed WEF/curriculum mapping - refine
 * per role as PW Medharthi's own skill taxonomy becomes available.
 *
 * NOTE: There is currently no PW Medharthi programme for a "Compliance
 * Officer" track in the supplied catalogue, so that role was removed
 * rather than pointed at an unrelated programme.
 */
export const ROLE_SKILL_MAPS: RoleSkillMap[] = [
  {
    role: 'Data Scientist',
    industry: 'Technology',
    requiredSkills: [
      { skill: 'Python', weight: 5, courseModule: 'Python & ML Foundations', programSlug: 'iit-jammu-professional-certificate-programme-in-generative-ai-and-machine-learning' },
      { skill: 'SQL', weight: 4, courseModule: 'Data Fundamentals', programSlug: 'iit-jammu-professional-certificate-programme-in-generative-ai-and-machine-learning' },
      { skill: 'Machine Learning', weight: 5, courseModule: 'Applied Machine Learning', programSlug: 'iit-jammu-professional-certificate-programme-in-generative-ai-and-machine-learning' },
      { skill: 'Statistics', weight: 4, courseModule: 'Statistical Foundations', programSlug: 'iit-jammu-professional-certificate-programme-in-generative-ai-and-machine-learning' },
      { skill: 'Data Visualization', weight: 3, courseModule: 'Data Storytelling & Viz', programSlug: 'online-msc-data-science-chandigarh-university' },
      { skill: 'Deep Learning', weight: 3, courseModule: 'Neural Networks & Deep Learning', programSlug: 'iit-jammu-professional-certificate-programme-in-generative-ai-and-machine-learning' }
    ]
  },
  {
    role: 'Generative AI Engineer',
    industry: 'Technology',
    requiredSkills: [
      { skill: 'Python', weight: 5, courseModule: 'Python for AI Applications', programSlug: 'iit-jammu-professional-certificate-programme-in-generative-ai-and-machine-learning' },
      { skill: 'Prompt Engineering', weight: 5, courseModule: 'Applied Prompt Engineering', programSlug: 'iit-jammu-professional-certificate-programme-in-generative-ai-and-machine-learning' },
      { skill: 'LLM Fine-tuning', weight: 4, courseModule: 'Fine-tuning & RAG Systems', programSlug: 'iit-kanpur-qcml' },
      { skill: 'Vector Databases', weight: 3, courseModule: 'Retrieval-Augmented Generation', programSlug: 'iit-kanpur-qcml' },
      { skill: 'API Integration', weight: 3, courseModule: 'Building AI Products', programSlug: 'iit-bhubaneswar-advanced-certificate-programme-in-ai-driven-robotics' },
      { skill: 'MLOps', weight: 3, courseModule: 'ML Deployment & MLOps', programSlug: 'iit-kanpur-qcml' }
    ]
  },
  {
    role: 'Business Analyst',
    industry: 'Business & Management',
    requiredSkills: [
      { skill: 'Excel', weight: 4, courseModule: 'Advanced Excel for Analytics', programSlug: 'iim-visakhapatnam-post-graduate-certificate-programme-in-ai-driven-general-management' },
      { skill: 'SQL', weight: 4, courseModule: 'Data Fundamentals for Managers', programSlug: 'iim-visakhapatnam-post-graduate-certificate-programme-in-ai-driven-general-management' },
      { skill: 'Data Visualization', weight: 3, courseModule: 'Business Intelligence Tools', programSlug: 'iim-visakhapatnam-post-graduate-certificate-programme-in-ai-driven-general-management' },
      { skill: 'Stakeholder Management', weight: 4, courseModule: 'Managerial Communication', programSlug: 'master-of-management-studies' },
      { skill: 'Financial Modeling', weight: 3, courseModule: 'Business Finance Essentials', programSlug: 'master-of-management-studies' },
      { skill: 'Process Improvement', weight: 3, courseModule: 'Operations & Strategy', programSlug: 'iit-jammu-advanced-certificate-programme-in-ai-driven-supply-chain-and-industry-40' }
    ]
  },
  {
    role: 'Digital Marketing Manager',
    industry: 'Marketing & Communication',
    requiredSkills: [
      { skill: 'SEO', weight: 4, courseModule: 'Search Engine Optimisation', programSlug: 'professional-certificate-programme-in-digital-marketing-and-growth' },
      { skill: 'Performance Marketing', weight: 5, courseModule: 'Meta & Google Ads Mastery', programSlug: 'professional-certificate-programme-in-digital-marketing-and-growth' },
      { skill: 'Content Strategy', weight: 3, courseModule: 'Content & Brand Strategy', programSlug: 'professional-certificate-programme-in-digital-marketing-and-growth' },
      { skill: 'Marketing Analytics', weight: 4, courseModule: 'AI-Driven Marketing Analytics', programSlug: 'iit-jammu-professional-certificate-programme-in-generative-ai-in-digital-marketing-batch-2' },
      { skill: 'Generative AI for Marketing', weight: 4, courseModule: 'Generative AI in Digital Marketing', programSlug: 'iit-jammu-professional-certificate-programme-in-generative-ai-in-digital-marketing-batch-2' }
    ]
  },
  {
    role: 'Financial Analyst',
    industry: 'Finance',
    requiredSkills: [
      { skill: 'Financial Modeling', weight: 5, courseModule: 'Advanced Financial Modeling', programSlug: 'executive-certificate-program-in-digital-finance-and-fintech' },
      { skill: 'Excel', weight: 4, courseModule: 'Excel for Finance', programSlug: 'executive-certificate-program-in-digital-finance-and-fintech' },
      { skill: 'Valuation', weight: 4, courseModule: 'Corporate Valuation', programSlug: 'executive-certificate-program-in-digital-finance-and-fintech' },
      { skill: 'Financial Statement Analysis', weight: 4, courseModule: 'Financial Reporting & Analysis', programSlug: 'executive-certificate-program-in-digital-finance-and-fintech' },
      { skill: 'Generative AI for Markets', weight: 3, courseModule: 'Generative AI for Financial Markets', programSlug: 'iit-jammu-professional-certificate-programme-in-generative-ai-for-financial-markets' }
    ]
  },
  {
    role: 'HR Analytics Lead',
    industry: 'Human Resources',
    requiredSkills: [
      { skill: 'People Analytics', weight: 5, courseModule: 'People Analytics Foundations', programSlug: 'iim-ranchi-post-graduate-certificate-programme-in-ai-driven-human-resource-management' },
      { skill: 'Excel', weight: 3, courseModule: 'HR Data & Excel', programSlug: 'iim-ranchi-post-graduate-certificate-programme-in-ai-driven-human-resource-management' },
      { skill: 'HRIS Tools', weight: 3, courseModule: 'HR Systems & Automation', programSlug: 'iim-ranchi-post-graduate-certificate-programme-in-ai-driven-human-resource-management' },
      { skill: 'Talent Strategy', weight: 4, courseModule: 'Strategic Talent Management', programSlug: 'iim-ranchi-post-graduate-certificate-programme-in-ai-driven-human-resource-management' },
      { skill: 'AI in HR', weight: 4, courseModule: 'AI-Driven HR Management', programSlug: 'iim-ranchi-post-graduate-certificate-programme-in-ai-driven-human-resource-management' }
    ]
  }
];

export function getSkillMapForRole(role: string): RoleSkillMap | undefined {
  return ROLE_SKILL_MAPS.find((r) => r.role.toLowerCase() === role.toLowerCase());
}

export const ALL_ROLES = ROLE_SKILL_MAPS.map((r) => r.role);
