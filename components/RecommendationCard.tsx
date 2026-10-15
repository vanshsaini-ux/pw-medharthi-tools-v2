interface RecommendationCardProps {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export default function RecommendationCard({ title, description, ctaLabel, ctaHref }: RecommendationCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-navy-700/10 bg-white p-4">
      <div>
        <p className="font-semibold text-navy-900">{title}</p>
        <p className="mt-1 text-sm text-navy-700/80">{description}</p>
      </div>
      <a href={ctaHref} className="mt-3 inline-block text-sm font-semibold text-amber-600 hover:underline">
        {ctaLabel} →
      </a>
    </div>
  );
}
