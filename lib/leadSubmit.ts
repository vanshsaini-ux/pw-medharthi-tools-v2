import { LeadApiResponse, LeadPayload } from '@/types';

const QUEUE_KEY = 'pwm_pending_leads';

/** Submits a lead to our own /api/lead route (never directly to Google
 * from the browser, so no credentials are ever exposed client-side). If
 * the network call fails, the payload is queued in localStorage and
 * retried on the next successful submission or page load, so a flaky
 * connection never loses the user's result. */
export async function submitLead(payload: LeadPayload): Promise<LeadApiResponse> {
  await flushQueue();
  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = (await res.json()) as LeadApiResponse;
    if (!res.ok || !data.success) {
      queueLead(payload);
      return data.message ? data : { success: false, message: 'Submission failed. Saved for retry.' };
    }
    return data;
  } catch {
    queueLead(payload);
    return { success: false, message: "You're saved. We'll retry sending your details automatically." };
  }
}

function queueLead(payload: LeadPayload): void {
  if (typeof window === 'undefined') return;
  const existing = readQueue();
  existing.push(payload);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(existing));
}

function readQueue(): LeadPayload[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as LeadPayload[]) : [];
  } catch {
    return [];
  }
}

export async function flushQueue(): Promise<void> {
  if (typeof window === 'undefined') return;
  const queue = readQueue();
  if (queue.length === 0) return;
  const remaining: LeadPayload[] = [];
  for (const item of queue) {
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!res.ok) remaining.push(item);
    } catch {
      remaining.push(item);
    }
  }
  localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
}
