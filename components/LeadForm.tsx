'use client';

import { FormEvent, useEffect, useState } from 'react';
import FormField from './FormField';
import TextInput from './TextInput';
import ConsentCheckbox from './ConsentCheckbox';
import LoadingState from './LoadingState';
import ErrorMessage from './ErrorMessage';
import { submitLead } from '@/lib/leadSubmit';
import { captureAndPersistUtm } from '@/lib/utm';
import { getDeviceType } from '@/lib/device';
import { sanitizeEmail, sanitizePhone, sanitizeText } from '@/lib/sanitize';
import { trackEvent } from '@/lib/analytics';
import { ToolSlug } from '@/types';

interface LeadFormProps {
  toolUsed: ToolSlug;
  userInputsSummary: string;
  resultSummary: string;
  requirePhone?: boolean;
  submitLabel?: string;
  onSuccess: () => void;
}

export default function LeadForm({
  toolUsed,
  userInputsSummary,
  resultSummary,
  requirePhone = false,
  submitLabel = 'Unlock My Full Report',
  onSuccess
}: LeadFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [profession, setProfession] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [serverNotice, setServerNotice] = useState<string | null>(null);

  useEffect(() => {
    trackEvent('lead_form_viewed', { tool: toolUsed });
  }, [toolUsed]);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (fullName.trim().length < 2) next.fullName = 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = 'Enter a valid email address.';
    if (requirePhone && !/^\+?[0-9]{7,15}$/.test(phone.trim())) next.phone = 'Enter a valid phone number.';
    if (!consent) next.consent = 'Please accept the privacy notice to continue.';
    setErrors(next);
    if (Object.keys(next).length > 0) trackEvent('validation_error', { tool: toolUsed });
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (honeypot) return; // silently drop bot submissions
    if (!validate()) return;

    setStatus('submitting');
    const utm = captureAndPersistUtm();
    const result = await submitLead({
      fullName: sanitizeText(fullName, 100),
      email: sanitizeEmail(email),
      phone: phone ? sanitizePhone(phone) : undefined,
      city: sanitizeText(city, 80),
      profession: sanitizeText(profession, 120),
      toolUsed,
      userInputsSummary: sanitizeText(userInputsSummary, 2000),
      resultSummary: sanitizeText(resultSummary, 2000),
      sourcePage: window.location.pathname,
      utmSource: utm.utmSource,
      utmMedium: utm.utmMedium,
      utmCampaign: utm.utmCampaign,
      referrer: utm.referrer,
      deviceType: getDeviceType(),
      consent: true,
      honeypot: '',
      submittedAtIso: new Date().toISOString()
    });

    if (result.success) {
      trackEvent('lead_submitted', { tool: toolUsed });
      onSuccess();
    } else {
      // Result is never lost even if the network call failed - the
      // payload was already queued for retry inside submitLead().
      setStatus('error');
      setServerNotice(result.message);
      trackEvent('submission_error', { tool: toolUsed });
      // Still let the user see their result - don't block on a flaky network.
      onSuccess();
    }
  }

  if (status === 'submitting') return <LoadingState label="Unlocking your full report…" />;

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-xl2 border border-navy-700/10 bg-white p-6">
      {serverNotice && status === 'error' && (
        <div className="mb-4">
          <ErrorMessage message={serverNotice} />
        </div>
      )}
      <FormField label="Full name" htmlFor="fullName" error={errors.fullName} required>
        <TextInput id="fullName" name="fullName" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </FormField>
      <FormField label="Email address" htmlFor="email" error={errors.email} required>
        <TextInput id="email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormField>
      <FormField label="Phone / WhatsApp number" htmlFor="phone" error={errors.phone} required={requirePhone} hint={!requirePhone ? 'Optional' : undefined}>
        <TextInput id="phone" name="phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </FormField>
      <FormField label="City" htmlFor="city" hint="Optional">
        <TextInput id="city" name="city" autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} />
      </FormField>
      <FormField label="Current profession / role" htmlFor="profession" hint="Optional">
        <TextInput id="profession" name="profession" value={profession} onChange={(e) => setProfession(e.target.value)} />
      </FormField>

      {/* Honeypot field - hidden from real users via CSS, invisible to screen readers via aria-hidden, but bots that auto-fill every field will trip it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden">
        <label htmlFor="companyWebsite">Company website</label>
        <input id="companyWebsite" name="companyWebsite" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <ConsentCheckbox checked={consent} onChange={setConsent} error={errors.consent} />

      <button
        type="submit"
        className="btn-primary w-full"
      >
        {submitLabel}
      </button>
    </form>
  );
}
