import { ReactNode } from 'react';

interface ResultCardProps {
  title: string;
  children: ReactNode;
  accent?: 'amber' | 'teal' | 'coral';
}

const ACCENT_BORDER: Record<'amber' | 'teal' | 'coral', string> = {
  amber: 'border-l-amber-500',
  teal: 'border-l-teal-500',
  coral: 'border-l-coral-500'
};

export default function ResultCard({ title, children, accent = 'amber' }: ResultCardProps) {
  return (
    <div className={`card border-l-4 p-6 ${ACCENT_BORDER[accent]}`}>
      <h3 className="font-display text-xl font-semibold text-navy-900">{title}</h3>
      <div className="mt-3 leading-relaxed text-navy-800">{children}</div>
    </div>
  );
}
