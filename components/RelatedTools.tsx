import Link from 'next/link';

const ALL_TOOLS = [
  { href: '/career-fit-finder', label: 'Career-Fit Finder' },
  { href: '/career-roi-calculator', label: 'Career ROI & Salary Growth Calculator' },
  { href: '/skill-gap-analyzer', label: 'Skill Gap Analyzer' },
  { href: '/career-roadmap-generator', label: 'AI Career Roadmap Generator' },
  { href: '/eligibility-checker', label: 'Eligibility & Admission Fit Checker' }
];

export default function RelatedTools({ excludeHref }: { excludeHref: string }) {
  const others = ALL_TOOLS.filter((t) => t.href !== excludeHref);
  return (
    <section className="mt-4">
      <h2 className="font-display text-lg font-semibold text-navy-900">Explore the other Career Intelligence tools</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {others.map((t) => (
          <li key={t.href}>
            <Link href={t.href} className="text-sm font-medium text-amber-600 hover:underline">
              {t.label} →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
