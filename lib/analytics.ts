/**
 * Thin wrapper around GA4 (gtag.js). Works with either a direct GA4
 * measurement ID or a GTM container - point NEXT_PUBLIC_GA_MEASUREMENT_ID
 * at whichever you use. All calls are no-ops (and never throw) if
 * analytics hasn't loaded yet, e.g. under an ad blocker.
 */
export type AnalyticsEvent =
  | 'tool_page_viewed'
  | 'tool_started'
  | 'form_step_completed'
  | 'lead_form_viewed'
  | 'lead_submitted'
  | 'calculation_completed'
  | 'result_viewed'
  | 'report_downloaded'
  | 'tool_shared'
  | 'cta_clicked'
  | 'validation_error'
  | 'submission_error';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: AnalyticsEvent, params: Record<string, string | number | boolean | undefined> = {}): void {
  if (typeof window === 'undefined') return;
  try {
    window.gtag?.('event', event, params);
  } catch {
    // Never let analytics break the tool experience.
  }
}
