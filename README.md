# PW Medharthi Career Intelligence — 5 AI Tools

A production-ready Next.js app with five lead-generating AI tools for PW Medharthi:
Career-Fit Finder, Career ROI & Salary Growth Calculator, Skill Gap Analyzer, AI Career
Roadmap Generator, and Eligibility & Admission Fit Checker — plus a shared lead-capture
pipeline into Google Sheets, analytics events, and SEO metadata for every page.

---

## 1. Requirements interpretation (summary)

| # | Tool | Funnel stage | Gate | Core logic |
|---|------|--------------|------|------------|
| 1 | Career-Fit Finder | TOFU / Discovery | Result-page gate | Weighted cosine-similarity match of the learner's profile against 87 real programs |
| 2 | Career ROI & Salary Growth Calculator | MOFU / Decision | Result-page gate | Break-even month = fee ÷ monthly salary delta, 5-year projected curve |
| 3 | Skill Gap Analyzer | MOFU / Decision | Light gate (email only) | Keyword/synonym skill extraction vs. a per-role skill map, weighted readiness % |
| 4 | AI Career Roadmap Generator | MOFU→BOFU | Progressive gate (2 months free) | Deterministic, grounded milestone builder; optional LLM narrative enrichment |
| 5 | Eligibility & Admission Fit Checker | BOFU / Conversion | **No result gate** — soft capture only at "Apply Now" | Rules engine against per-program qualification/percentage/experience criteria |

**Audience:** prospective learners considering an online degree/certificate — from
undecided browsers (Tool 1) to ready-to-apply visitors (Tool 5).

**Lead fields collected:** name, email, phone (required only where the brief calls for
it), city, profession — plus tool used, a summary of the user's inputs, a summary of
their result, source page, UTM source/medium/campaign, referrer, device type, consent,
and a timestamp. Google Sheets receives one row per submission (see §6).

### Assumptions made (documented, not invented facts)
- **`/config/programs.ts` now contains 87 real PW Medharthi programs** (names +
  eligibility) parsed from PW Medharthi's official programme sheet (July 2026). Fee,
  duration, salary and growth-multiplier figures are still clearly-flagged
  **placeholder data**, since that sheet didn't include them and the live listing page
  loads pricing client-side (not scrapable). **Replace these numbers with verified
  figures before launch** — see §2.
- **City/work-mode salary multiplier** (metro/tier-2/remote) in the ROI calculator is a
  reasonable modelling choice, not sourced from the brief — tune the multipliers in
  `tools/roiCalculator.ts` if you have real city-wise data.
- **Resume/LinkedIn skill extraction** uses a keyword/synonym matcher rather than a paid
  NLP/LLM API, so the tool has zero ongoing inference cost. It's most accurate when a
  resume explicitly names tools/technologies — this limitation is disclosed to users in
  the tool's own FAQ, matching the brief's guidance.
- **AI Career Roadmap Generator** always uses a deterministic, grounded engine (reads
  real skill/course data, never invents one). If you set `ANTHROPIC_API_KEY`, the
  `/api/roadmap` route additionally asks an LLM to turn the same grounded data into more
  natural prose — but milestones/skills/courses always come from the verified data, never
  from open-ended model output.
- **"Talk to Admissions" / "Talk to a Program Counsellor" links** open WhatsApp via
  `NEXT_PUBLIC_WHATSAPP_NUMBER` — set this env var to your real support number.

---

## 2. Architecture decision

**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS.
**Why:** one codebase serves SEO-friendly, server-rendered public pages *and* the API
routes needed for secure lead capture — no separate backend to host or pay for. Deploys
in one click to Vercel's free tier, which covers "low/zero ongoing infra cost."

**Lead-capture architecture:** browser → `POST /api/lead` (this app's own server route,
validates + sanitizes + rate-limits) → Google Apps Script Web App → Google Sheet. The
Apps Script URL and its shared secret live only in server-side env vars — never in
client-side code. If the network call fails, the payload is queued in `localStorage` and
retried automatically, so a flaky connection never loses the user's result (see
`lib/leadSubmit.ts`).

**Google Sheets architecture:** a single Apps Script (`google-apps-script/Code.gs`)
deployed as a Web App, checked by a shared secret sent in the POST body (Apps Script
web apps cannot read custom HTTP headers, so the secret travels in the JSON payload
instead). One row per submission; a lightweight duplicate guard skips re-inserting the
same email+tool within 2 minutes (handles double-clicks).

**Deployment:** Vercel (zero-config for Next.js, free Hobby tier is enough for this).
**Blog embedding:** either link directly to the deployed pages, or embed any tool page
in a responsive `<iframe>` on your existing blog/CMS (see §8).

### Project structure
```
app/                        # Pages (App Router) — one folder per tool + API routes
  career-fit-finder/         page.tsx (SEO shell) + CareerFitFinderApp.tsx (client widget)
  career-roi-calculator/     …
  skill-gap-analyzer/        …
  career-roadmap-generator/  …
  eligibility-checker/       …
  api/lead/route.ts          # Lead capture → Google Sheets
  api/roadmap/route.ts       # Roadmap engine + optional LLM enrichment
  page.tsx                   # Homepage / hub page (all 5 tools)
  career-intelligence/       # 301-redirects to "/" (see file comment)
  sitemap.ts, robots.ts, layout.tsx, globals.css
components/                  # Shared, reusable UI (Header, Footer, ToolCard, FormField,
                              # SelectField, NumberInput, StepIndicator, ConsentCheckbox,
                              # LoadingState, ErrorMessage, ResultCard, ScoreDial,
                              # RecommendationCard, ShareButton, CTASection,
                              # FAQAccordion, RelatedTools, LeadForm, SalaryCurveChart)
lib/                         # validation, sanitize, analytics, utm, device,
                              # leadSubmit (client), rateLimit (server), resumeParser
tools/                       # Pure calculation engines — one per tool, fully unit-tested
config/                      # programs.ts (87 real programs), skillMaps.ts — see §2
types/                       # Shared TypeScript types
google-apps-script/Code.gs   # Paste into Google Sheets > Extensions > Apps Script
tests/                       # Jest unit tests for every calculation engine + validation
```

### Data status - what's real vs. placeholder (updated July 2026)
`config/programs.ts` now ships with **87 real PW Medharthi programs** (names +
eligibility), parsed from PW Medharthi's official programme/eligibility sheet. What's
still placeholder, per each record's `sourceNote`:
- **Real**: `name`, `minQualificationLevel`, `minPercentage`, `minExperienceYears`,
  `bridgeCourseAvailable` for the 8 IIT/IIM certificate programs (verbatim from the
  sheet's eligibility text). The other ~79 programs use the sheet's own general rule
  (UG programme -> Class 12, PG programme -> Bachelor's), inferred from each program's
  name (e.g. "BBA ..." -> UG).
- **Still placeholder**: `feeInr`, `durationMonths`, `avgStartingSalaryInr`, growth
  multipliers, and the Career-Fit Finder interest-domain tag (inferred from the course
  title, not confirmed against a curriculum). **Do not display fee or salary figures
  publicly until these are replaced** with confirmed numbers from PW Medharthi - ask
  finance/program-ops for a fee & starting-salary sheet per program, then swap the
  numbers in directly. The engines in `/tools` don't need to change - they just read
  this data.

`config/skillMaps.ts` now points every skill at a real, matching PW Medharthi program
(e.g. HR Analytics Lead -> the real IIM Ranchi AI-HR program). There's no PW Medharthi
compliance-track program in the current catalogue, so "Compliance Officer" was removed
rather than pointed at an unrelated program - re-add it if/when that changes.

---

## 3. Local setup guide (from an empty computer)

**1. Required software:** Node.js 20 LTS, npm (bundled with Node), Git (optional).
Check: `node -v` should print v20.x or later.

**2. Get the code**
```bash
cd pw-medharthi-career-intelligence   # the folder you downloaded/unzipped
npm install
```

**3. Environment variables**
```bash
cp .env.example .env.local
```
Open `.env.local` and fill in at minimum `NEXT_PUBLIC_SITE_URL` and, once you've done §6,
`GOOGLE_SHEETS_WEBHOOK_URL` + `GOOGLE_SHEETS_SHARED_SECRET`. Everything else has a
working default or is optional (see comments in `.env.example`).

**4. Run it locally**
```bash
npm run dev
```
Open http://localhost:3000 — you should see the homepage with all five tool cards.

**5. Run the tests**
```bash
npm test
```
All calculation-engine and validation tests should pass (see §9 for the full scenario list).

**6. Production build (verifies the whole app compiles)**
```bash
npm run build
npm start
```

**7. Verify all five tools manually**
Visit each URL and complete a full run (fill the form → see the teaser/result → submit
the lead form where applicable → see the full result):
`/career-fit-finder`, `/career-roi-calculator`, `/skill-gap-analyzer`,
`/career-roadmap-generator`, `/eligibility-checker`.

---

## 4. Google Sheets setup

**Step 1 — Create the sheet**
1. Create a new Google Sheet (any name, e.g. "PW Medharthi Career Intelligence Leads").
2. You don't need to create columns manually — the Apps Script creates a `Leads` tab
   with headers automatically on the first submission.

**Step 2 — Add the Apps Script**
1. In the Sheet: **Extensions → Apps Script**.
2. Delete the default `Code.gs` content and paste in the full contents of
   `google-apps-script/Code.gs` from this repo.
3. **Project Settings** (gear icon) → **Script properties** → **Add script property**:
   - Property: `SHARED_SECRET`
   - Value: a long random string (e.g. generate one with `openssl rand -hex 32`)
4. Save the project.

**Step 3 — Deploy as a Web App**
1. **Deploy → New deployment**.
2. Type: **Web app**.
3. Execute as: **Me**.
4. Who has access: **Anyone** (this is what allows your server to call it — the shared
   secret is what keeps it locked down, not the access setting).
5. Click **Deploy**, authorize the requested permissions, and copy the **Web app URL**
   (ends in `/exec`).

**Step 4 — Connect it to the app**
In `.env.local` (and in your hosting provider's environment variables — see §5):
```
GOOGLE_SHEETS_WEBHOOK_URL=<the /exec URL you copied>
GOOGLE_SHEETS_SHARED_SECRET=<the same string you put in SHARED_SECRET>
```

**Step 5 — Test it**
1. In the Apps Script editor, select the `testSetup` function and click **Run** once —
   it should log that `SHARED_SECRET is set.`
2. Run the app locally (`npm run dev`), complete any tool's lead form, and check that a
   new row appears in the `Leads` tab within a few seconds.
3. To test failure handling, temporarily set an incorrect `GOOGLE_SHEETS_SHARED_SECRET`
   in `.env.local`, restart the dev server, submit a lead — you should still see your
   tool result (never blocked), and the app console should log an "Unauthorized" error.

**Recommended columns** (created automatically): Timestamp, Full Name, Email, Phone,
City, Profession, Tool Used, User Inputs, Result Summary, Source Page, UTM Source, UTM
Medium, UTM Campaign, Referrer, Device Type, Consent, Submission Date, Submission Time,
IP (partial, masked).

**Common errors:**
- *"Unauthorized" in the response* → `SHARED_SECRET` in Apps Script doesn't match
  `GOOGLE_SHEETS_SHARED_SECRET` in your env vars. Redeploy after fixing (Apps Script
  needs a **new deployment version** — editing the code alone doesn't update `/exec`
  unless you use "Manage deployments → Edit → New version").
- *Nothing appears in the sheet, no error either* → check the Apps Script **Executions**
  log (left sidebar) for thrown errors.
- *CORS-looking errors in the browser console* → this shouldn't happen since the browser
  only ever calls your own `/api/lead` route, never the Apps Script URL directly. If you
  see this, double-check no client code is calling the Apps Script URL directly.

**Hardening rate limiting:** the built-in limiter in `lib/rateLimit.ts` is in-memory and
per-serverless-instance — fine as a basic deterrent, but for stricter protection at
scale, swap it for a shared store (a few lines using e.g. Upstash Redis's REST API).

---

## 5. Deployment guide (Vercel)

1. Push this project to a GitHub/GitLab/Bitbucket repo (or use `vercel` CLI to deploy
   directly from your machine — `npm i -g vercel && vercel`).
2. Go to https://vercel.com → **Add New → Project** → import your repo.
3. Framework preset: **Next.js** (auto-detected). Leave build settings default.
4. **Environment Variables**: add every variable from `.env.example` with your real
   values (at minimum `NEXT_PUBLIC_SITE_URL`, `GOOGLE_SHEETS_WEBHOOK_URL`,
   `GOOGLE_SHEETS_SHARED_SECRET`).
5. Click **Deploy**. Your tools are live at `<project>.vercel.app`.
6. **Custom domain/subdomain**: Project → **Settings → Domains** → add
   `tools.yourdomain.com` (or your root domain) → follow the DNS instructions Vercel
   shows (usually a `CNAME` record to `cname.vercel-dns.com`). HTTPS is issued
   automatically once DNS verifies — no extra steps.
7. **Verify API routes**: visit `https://your-domain/api/lead` in a browser — a GET
   request should return a 405 (Method Not Allowed), confirming the route is deployed
   (the route only accepts POST).
8. **Test a real submission** end-to-end on the live URL and confirm a row appears in
   your Google Sheet.
9. **Redeploying after updates**: push to your connected branch (or run `vercel --prod`)
   — Vercel redeploys automatically.
10. **Rolling back**: Project → **Deployments** → find the last good deployment → **⋯ →
    Promote to Production**. Instant, no rebuild needed.

---

## 6. Blog integration guide

### Option A — Direct links (simplest)
Add buttons/links from your blog straight to `https://tools.yourdomain.com/<tool-slug>`.
No embedding needed, full SEO value stays on the tools domain, zero layout risk.

### Option B — Responsive iframe embed
```html
<div style="position:relative;width:100%;padding-bottom:140%;max-width:720px;margin:0 auto;">
  <iframe
    src="https://tools.yourdomain.com/career-fit-finder"
    style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;border-radius:12px;"
    loading="lazy"
    title="PW Medharthi Career-Fit Finder">
  </iframe>
</div>
```
Adjust `padding-bottom` per tool if content height differs (140% works well for the
multi-step tools; simpler tools like the Eligibility Checker can use ~110%).

**WordPress:** paste the snippet above into a **Custom HTML block** (block editor) or
a **Text widget/HTML widget** in the classic editor. Most WordPress themes strip
`<script>` and inline styles inside the visual editor — use the **Code editor** view
(the `</>` icon) or a plugin like "Insert Headers and Footers" if your theme sanitizes
iframes.

**Custom HTML site:** paste the snippet directly into your page template.

**Webflow / similar builders:** add an **Embed** element, paste the same HTML snippet
into it. Webflow renders custom embeds inside a sandboxed iframe already, so no extra
config is needed.

**Avoiding scrollbars:** the app has no fixed page height, but iframed content can still
scroll if the parent's `height` is too small — prefer a % `padding-bottom` trick (shown
above) over a fixed pixel height, or use a small `postMessage`-based auto-resize script
if you need pixel-perfect height (not included by default to keep the embed dependency-free).

**Cross-domain restrictions:** this app's `next.config.mjs` sends
`Content-Security-Policy: frame-ancestors 'self' *` so it can be embedded anywhere by
default. **Before launch, tighten this to your exact blog domain** (e.g.
`frame-ancestors 'self' https://www.pwmedharthi.com`) to stop other sites from embedding
your tools without permission.

**Tracking embedded usage:** GA4 events fire the same way whether the page loads
standalone or inside an iframe — no extra config needed. If you want to distinguish
embedded traffic in GA4, append `?utm_source=blog&utm_medium=embed` to the iframe `src`.

**Avoiding duplicate SEO content / canonical URLs:** each tool page already declares
`<link rel="canonical">` pointing at its own `tools.yourdomain.com` URL (see each page's
`metadata.alternates.canonical`). An iframed tool doesn't create duplicate content for
Google because the iframe's content isn't crawled as part of the parent blog page — but
avoid also copy-pasting the tool's marketing copy as static text on the blog post itself,
since *that* text could genuinely duplicate the tool page's SEO content.

---

## 7. Testing

```bash
npm test          # run all unit tests once
npm run test:watch  # watch mode while developing
```

**What's covered:** every calculation engine (`tools/*.ts`) and the lead validation/
sanitization logic (`lib/validation.ts`, `lib/sanitize.ts`), including:
valid submission · invalid/empty required fields · extreme values (e.g. ₹9 crore salary)
· decimal inputs · unexpected characters/HTML injection attempts · honeypot (bot) hits ·
unrecognised tool slugs · divide-by-zero guards · unknown program/role lookups.

**What to test manually (not automatable without a browser/device lab):**
- *Duplicate clicks*: click "Calculate"/"Submit" rapidly — the loading state disables
  re-submission, and the Apps Script's duplicate guard also catches same-email/same-tool
  resubmits within 2 minutes.
- *Slow network*: throttle to "Slow 3G" in Chrome DevTools → confirm the loading state
  shows and the result still eventually renders (or the queued-retry message appears).
- *Google Sheets failure*: temporarily break `GOOGLE_SHEETS_WEBHOOK_URL` → confirm the
  user still sees their result (see §4 test steps).
- *Mobile / tablet / desktop*: resize the browser or use DevTools device emulation at
  375px, 768px, and 1280px+ widths — forms should stay single-column and full-width on
  mobile.
- *Result sharing*: click "Share" on any result on a mobile browser (native share sheet)
  and on desktop (falls back to copy-link).
- *UTM capture*: visit a tool URL with `?utm_source=test&utm_medium=test` and confirm
  (via the Sheet row after submitting) that both values were captured.
- *Reset*: complete a tool, click "Retake/Calculate again/Analyze again" and confirm the
  form returns to its initial empty state.

---

## 8. Final QA checklist

- [ ] All 5 tools load with no console errors
- [ ] Every button performs a real action (no dead buttons)
- [ ] Every required field shows a clear validation message when left empty
- [ ] Extreme/decimal/malformed inputs never crash a calculation
- [ ] Lead form → Google Sheet round-trip verified for each tool
- [ ] Tool result is never lost if the Sheets webhook is unreachable
- [ ] Mobile (375px), tablet (768px), desktop (1280px+) all look correct
- [ ] Keyboard-only navigation reaches every interactive element with a visible focus ring
- [ ] Every image/icon has appropriate `aria-label`/`alt` text; no color-only status indicators
- [ ] `npm run build` completes with zero errors
- [ ] Sitemap (`/sitemap.xml`) and `robots.txt` are reachable and correct
- [ ] Each tool page has a unique title, meta description, and canonical URL
- [ ] JSON-LD (SoftwareApplication, FAQPage, BreadcrumbList) validates in Google's Rich Results Test
- [ ] GA4 events fire for page view, tool start, lead form view, submission, and result view
- [ ] Deployed URL served over HTTPS with a valid certificate
- [ ] iframe embed renders cleanly with no scrollbars on the target blog
- [ ] `frame-ancestors` CSP tightened to your real blog domain before public launch
- [ ] Placeholder program/skill data replaced with verified figures (§1, §2)

---

## 9. Troubleshooting

| Problem | Likely cause / fix |
|---|---|
| Sheet data not appearing | Wrong/old Apps Script deployment URL, or `SHARED_SECRET` mismatch — redeploy a **new version** after any script edit (§4) |
| "Unauthorized" from the webhook | `GOOGLE_SHEETS_SHARED_SECRET` env var doesn't match the Apps Script property |
| Apps Script "CORS" errors in console | Shouldn't occur — the browser only calls `/api/lead`, never the Apps Script URL. Check no client code bypasses the API route |
| "Invalid endpoint" / 404 on `/api/lead` | Confirm the route deployed (check Vercel's Functions tab) and that you're calling `/api/lead`, not the Apps Script URL, from the browser |
| Env vars not loading locally | File must be named `.env.local` (not `.env.example`) and you must restart `next dev` after editing it |
| Failed production build | Run `npm run build` locally to see the exact TypeScript/lint error; most common cause is a missing env var accessed without a fallback |
| iframe height issue / inner scrollbar | Use the % `padding-bottom` wrapper in §6 instead of a fixed height; increase the percentage for longer tools |
| iframe blocked by security headers | Your blog's own CSP may block iframes from other origins — check the blog's own `frame-src`/CSP, not this app's headers |
| Mobile layout overflow | File a note with the exact device/width; all components use `w-full`/responsive Tailwind classes, so this usually means a very long unbroken string (e.g. a pasted URL) — wrap with `break-words` |
| Duplicate submissions in the sheet | The 2-minute same-email/same-tool guard in `Code.gs` only catches near-simultaneous duplicates; widen the `120000`ms window if you see more spread-out dupes |
| Slow loading | Check `NEXT_PUBLIC_GA_MEASUREMENT_ID` isn't pointing at a broken tag; the PDF resume parser (`pdfjs-dist`) only loads on demand, so it shouldn't affect initial load |
| Missing analytics events | Confirm `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set in the deployed environment (not just locally) and that no ad-blocker is active while testing |
| Form submission failure with no error shown | Check the browser Network tab for the `/api/lead` response body — `lib/leadSubmit.ts` always queues failed submissions for retry, so the user's result still displays |
| Incorrect calculations | Verify you've replaced the placeholder data in `config/programs.ts`/`config/skillMaps.ts` — all engines are unit-tested (`npm test`) but only as correct as their input data |

---

## 10. Security & privacy notes

- Google Sheets credentials/URL and the LLM API key are **server-only** env vars, never
  exposed to the browser.
- All free-text input (resume text, names, roadmap background) is HTML-stripped and
  length-capped before storage or rendering (`lib/sanitize.ts`).
- A honeypot field plus basic per-IP rate limiting deter the most common bot spam;
  see §4 for hardening notes at scale.
- **This project does not constitute legal advice.** Have your privacy policy, consent
  language, and data-retention policy reviewed by a qualified professional before
  collecting real user data in production.
