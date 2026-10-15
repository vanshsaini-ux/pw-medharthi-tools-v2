import { UtmParams } from '@/types';

const STORAGE_KEY = 'pwm_utm_params';

/** Captures UTM params from the current URL on first touch and persists
 * them in sessionStorage so they survive navigation between tool pages
 * within the same visit, per the "preserve UTM parameters throughout the
 * session" analytics requirement. */
export function captureAndPersistUtm(): UtmParams {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const fromUrl: UtmParams = {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    referrer: document.referrer || undefined
  };

  const hasNewUtm = fromUrl.utmSource || fromUrl.utmMedium || fromUrl.utmCampaign;
  if (hasNewUtm) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
    return fromUrl;
  }

  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as UtmParams;
    } catch {
      return fromUrl;
    }
  }
  return fromUrl;
}
