import { redirect } from 'next/navigation';

// The brief names /career-intelligence as the hub page URL. To avoid two
// pages competing for the same "5 AI career tools" search intent, the
// homepage IS the hub page (see app/page.tsx) and this URL 301-redirects
// to it. If you'd rather keep the hub at this URL instead of "/", swap
// the redirect direction and move app/page.tsx's content here.
export default function CareerIntelligenceRedirect() {
  redirect('/');
}
