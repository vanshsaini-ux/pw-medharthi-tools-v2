interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export default function StepIndicator({ currentStep, totalSteps, stepLabels }: StepIndicatorProps) {
  return (
    <div className="mb-6" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < currentStep ? 'bg-amber-500' : 'bg-navy-700/15'}`}
          />
        ))}
      </div>
      {stepLabels?.[currentStep - 1] && (
        <p className="mt-2.5 font-mono text-xs font-medium uppercase tracking-wide text-navy-700/60">
          Step {currentStep} of {totalSteps} · {stepLabels[currentStep - 1]}
        </p>
      )}
    </div>
  );
}
