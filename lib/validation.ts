import { z } from 'zod';

export const emailSchema = z.string().trim().email('Enter a valid email address.');

// Loose but practical Indian/international phone check (7-15 digits, optional +).
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9]{7,15}$/, 'Enter a valid phone number.');

export const leadFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name.').max(100),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal('')),
  city: z.string().trim().max(80).optional().or(z.literal('')),
  profession: z.string().trim().max(120).optional().or(z.literal('')),
  toolUsed: z.enum([
    'career-fit-finder',
    'career-roi-calculator',
    'skill-gap-analyzer',
    'career-roadmap-generator',
    'eligibility-checker'
  ]),
  userInputsSummary: z.string().max(2000),
  resultSummary: z.string().max(2000),
  sourcePage: z.string().max(300),
  utmSource: z.string().max(100).optional().or(z.literal('')),
  utmMedium: z.string().max(100).optional().or(z.literal('')),
  utmCampaign: z.string().max(100).optional().or(z.literal('')),
  referrer: z.string().max(300).optional().or(z.literal('')),
  deviceType: z.enum(['mobile', 'tablet', 'desktop']),
  consent: z.literal(true, { errorMap: () => ({ message: 'Please accept the privacy notice to continue.' }) }),
  honeypot: z.string().max(0, 'Spam detected.').optional().or(z.literal('')),
  submittedAtIso: z.string()
});

export type LeadFormInput = z.infer<typeof leadFormSchema>;

export function validateLead(data: unknown) {
  return leadFormSchema.safeParse(data);
}

export function isPositiveNumber(value: unknown): boolean {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
