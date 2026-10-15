import { NextRequest, NextResponse } from 'next/server';
import { validateLead } from '@/lib/validation';
import { sanitizeEmail, sanitizePhone, sanitizeText } from '@/lib/sanitize';
import { isRateLimited } from '@/lib/rateLimit';
import { LeadApiResponse } from '@/types';

export const runtime = 'nodejs';

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
}

export async function POST(req: NextRequest): Promise<NextResponse<LeadApiResponse>> {
  const ip = getClientIp(req);

  if (isRateLimited(ip)) {
    return NextResponse.json({ success: false, message: 'Too many submissions. Please try again in a minute.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = validateLead(body);
  if (!parsed.success) {
    // Honeypot violations surface as a validation failure too (max length 0) -
    // respond with a generic success-looking message so bots don't learn
    // that they were caught, without ever forwarding their data.
    const honeypotHit = (body as Record<string, unknown>)?.honeypot;
    if (typeof honeypotHit === 'string' && honeypotHit.length > 0) {
      return NextResponse.json({ success: true, message: 'Thanks!' });
    }
    const firstError = parsed.error.errors[0]?.message || 'Please check your details and try again.';
    return NextResponse.json({ success: false, message: firstError }, { status: 400 });
  }

  const lead = parsed.data;
  const sanitized = {
    ...lead,
    fullName: sanitizeText(lead.fullName, 100),
    email: sanitizeEmail(lead.email),
    phone: lead.phone ? sanitizePhone(lead.phone) : '',
    city: sanitizeText(lead.city || '', 80),
    profession: sanitizeText(lead.profession || '', 120),
    userInputsSummary: sanitizeText(lead.userInputsSummary, 2000),
    resultSummary: sanitizeText(lead.resultSummary, 2000)
  };

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const sharedSecret = process.env.GOOGLE_SHEETS_SHARED_SECRET;

  if (!webhookUrl || !sharedSecret) {
    console.error('Lead capture is not configured: missing GOOGLE_SHEETS_WEBHOOK_URL or GOOGLE_SHEETS_SHARED_SECRET.');
    // Fail soft: the user's result must never be blocked by a missing
    // server config. The client-side queue will retry once it's fixed.
    return NextResponse.json({ success: false, message: "We couldn't save your details right now, but here's your result." }, { status: 200 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const sheetResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: sharedSecret, ip, ...sanitized }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!sheetResponse.ok) {
      console.error('Google Sheets webhook returned a non-200 status', sheetResponse.status);
      return NextResponse.json({ success: false, message: "We couldn't save your details right now, but here's your result." });
    }

    return NextResponse.json({ success: true, message: 'Thanks! Your full result is unlocked.' });
  } catch (err) {
    console.error('Failed to reach the Google Sheets webhook', err);
    return NextResponse.json({ success: false, message: "We couldn't save your details right now, but here's your result." });
  }
}
