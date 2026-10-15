interface CTASectionProps {
  heading: string;
  subheading?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function CTASection({ heading, subheading, primaryLabel, primaryHref, secondaryLabel, secondaryHref }: CTASectionProps) {
  return (
    <section className="relative overflow-hidden rounded-xl2 bg-navy-900 px-6 py-12 text-center text-white sm:py-14">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(232,163,61,0.18),transparent_60%)]"
      />
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">{heading}</h2>
      {subheading && <p className="mx-auto mt-2.5 max-w-xl text-white/70">{subheading}</p>}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <a href={primaryHref} className="btn-primary">
          {primaryLabel}
        </a>
        {secondaryLabel && secondaryHref && (
          <a href={secondaryHref} className="btn-ghost-on-dark">
            {secondaryLabel}
          </a>
        )}
      </div>
    </section>
  );
}
