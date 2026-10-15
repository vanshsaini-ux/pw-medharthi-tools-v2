const PRIVACY_URL = process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL || '#';

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export default function ConsentCheckbox({ checked, onChange, error }: ConsentCheckboxProps) {
  return (
    <div className="mb-4">
      <label className="flex items-start gap-2.5 text-sm text-navy-700/90">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-navy-700/30 text-amber-600 focus:ring-2 focus:ring-amber-500/40"
        />
        <span>
          I agree to be contacted about my result and consent to the{' '}
          <a href={PRIVACY_URL} target="_blank" rel="noreferrer" className="underline hover:text-navy-900">
            Privacy Policy
          </a>
          . Your answers are used only to generate and send your result.
        </span>
      </label>
      {error && <p role="alert" className="mt-1 text-xs font-medium text-coral-500">{error}</p>}
    </div>
  );
}
