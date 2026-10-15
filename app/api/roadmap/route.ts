import { NextRequest, NextResponse } from 'next/server';
import { buildGroundedRoadmap, buildGroundedLlmPrompt, RoadmapResult } from '@/tools/roadmapGenerator';
import { sanitizeText } from '@/lib/sanitize';

export const runtime = 'nodejs';

interface RoadmapRequestBody {
  targetRole: string;
  background: string;
  timelineMonths: 6 | 12 | 18;
}

export async function POST(req: NextRequest) {
  let body: RoadmapRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
  }

  const targetRole = sanitizeText(body.targetRole || '', 100);
  const background = sanitizeText(body.background || '', 300);
  const timelineMonths = [6, 12, 18].includes(body.timelineMonths) ? body.timelineMonths : 12;

  if (!targetRole) {
    return NextResponse.json({ success: false, message: 'Tell us the role you want to become.' }, { status: 400 });
  }

  // The grounded engine always runs first and is what the UI renders -
  // this is the tool's reliable, zero-cost default path.
  const roadmap: RoadmapResult = buildGroundedRoadmap(targetRole, background, timelineMonths as 6 | 12 | 18);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: true, roadmap, narrative: null, source: 'template' });
  }

  try {
    const prompt = buildGroundedLlmPrompt(targetRole, background, timelineMonths);
    const model = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 700,
        messages: [{ role: 'user', content: prompt }]
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.error('Anthropic API returned a non-200 status', res.status);
      return NextResponse.json({ success: true, roadmap, narrative: null, source: 'template' });
    }

    const data = await res.json();
    const narrative: string =
      data?.content?.filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('\n') || '';

    return NextResponse.json({ success: true, roadmap, narrative: narrative || null, source: narrative ? 'llm' : 'template' });
  } catch (err) {
    console.error('Roadmap LLM enrichment failed, falling back to the template roadmap', err);
    return NextResponse.json({ success: true, roadmap, narrative: null, source: 'template' });
  }
}
