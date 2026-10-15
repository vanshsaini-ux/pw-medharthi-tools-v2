import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export default function FormField({ label, htmlFor, error, hint, required, children }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-navy-900">
        {label} {required && <span className="text-coral-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-navy-700/60">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-coral-500">
          {error}
        </p>
      )}
    </div>
  );
}
