import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  href: string;
  icon: LucideIcon;
  layerLabel: string;
  title: string;
  description: string;
  ctaLabel: string;
}

export default function ToolCard({ href, icon: Icon, layerLabel, title, description, ctaLabel }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="card group flex flex-col p-7 transition duration-200 hover:-translate-y-1 hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500"
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-amber-500 ring-1 ring-inset ring-white/10">
          <Icon size={20} aria-hidden="true" />
        </span>
        <span className="font-mono text-[0.7rem] font-medium uppercase tracking-wide text-navy-600">{layerLabel}</span>
      </div>
      <h3 className="font-display text-lg font-semibold leading-snug text-navy-900">{title}</h3>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-navy-700/80">{description}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 border-t border-navy-700/10 pt-4 text-sm font-semibold text-amber-600 transition group-hover:gap-2.5">
        {ctaLabel} →
      </span>
    </Link>
  );
}
