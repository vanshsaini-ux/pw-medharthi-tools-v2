/**
 * The suite's signature element: a radial "instrument dial" used
 * everywhere a tool produces a score, percentage or match rating
 * (Career-Fit match %, Job-Readiness %, Eligibility state, ROI break-even
 * marker). Reused consistently so all five tools visually read as one
 * "AI Career Intelligence" instrument panel rather than five unrelated
 * widgets.
 */
interface ScoreDialProps {
  percent: number; // 0-100
  label: string;
  sublabel?: string;
  accent?: 'amber' | 'teal' | 'coral';
}

const ACCENT_HEX: Record<'amber' | 'teal' | 'coral', string> = {
  amber: '#E8A33D',
  teal: '#1E8C7A',
  coral: '#D8564A'
};

export default function ScoreDial({ percent, label, sublabel, accent = 'amber' }: ScoreDialProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  const color = ACCENT_HEX[accent];

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140" role="img" aria-label={`${label}: ${clamped} percent`}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#E7EAF0" strokeWidth="12" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
        />
        <text x="70" y="66" textAnchor="middle" className="font-mono" fontSize="28" fontWeight="700" fill="#152040">
          {clamped}%
        </text>
        {sublabel && (
          <text x="70" y="86" textAnchor="middle" fontSize="11" fill="#152040" opacity="0.6">
            {sublabel}
          </text>
        )}
      </svg>
      <p className="mt-2 text-center text-sm font-semibold text-navy-900">{label}</p>
    </div>
  );
}
