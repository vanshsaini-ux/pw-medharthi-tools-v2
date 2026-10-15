import { validateLead } from '@/lib/validation';
import { sanitizeText, sanitizeEmail, sanitizePhone } from '@/lib/sanitize';

const basePayload = {
  fullName: 'Priya Sharma',
  email: 'priya@example.com',
  phone: '+919876543210',
  city: 'Meerut',
  profession: 'Analyst',
  toolUsed: 'career-fit-finder' as const,
  userInputsSummary: 'summary',
  resultSummary: 'result',
  sourcePage: '/career-fit-finder',
  deviceType: 'mobile' as const,
  consent: true as const,
  submittedAtIso: new Date().toISOString()
};

describe('lead validation', () => {
  it('accepts a fully valid payload', () => {
    expect(validateLead(basePayload).success).toBe(true);
  });

  it('rejects an empty full name', () => {
    const result = validateLead({ ...basePayload, fullName: '' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = validateLead({ ...basePayload, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects consent=false', () => {
    const result = validateLead({ ...basePayload, consent: false });
    expect(result.success).toBe(false);
  });

  it('rejects a non-empty honeypot field (bot signal)', () => {
    const result = validateLead({ ...basePayload, honeypot: 'I am a bot' });
    expect(result.success).toBe(false);
  });

  it('rejects an unrecognised toolUsed value', () => {
    const result = validateLead({ ...basePayload, toolUsed: 'not-a-real-tool' });
    expect(result.success).toBe(false);
  });

  it('accepts an optional phone as an empty string', () => {
    const result = validateLead({ ...basePayload, phone: '' });
    expect(result.success).toBe(true);
  });
});

describe('sanitize helpers', () => {
  it('strips HTML tags from free text', () => {
    expect(sanitizeText('<script>alert(1)</script>Hello')).toBe('alert(1) Hello');
  });

  it('collapses excess whitespace', () => {
    expect(sanitizeText('a    b\n\nc')).toBe('a b c');
  });

  it('lowercases and trims emails', () => {
    expect(sanitizeEmail('  User@Example.com ')).toBe('user@example.com');
  });

  it('strips non-numeric characters from phone numbers except +', () => {
    expect(sanitizePhone('+91 98765-43210')).toBe('+919876543210');
  });

  it('truncates overly long input to the max length', () => {
    const longText = 'a'.repeat(3000);
    expect(sanitizeText(longText, 100)).toHaveLength(100);
  });
});
