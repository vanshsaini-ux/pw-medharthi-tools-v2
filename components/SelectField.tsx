import { SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

interface OptionGroup {
  label: string;
  options: Option[];
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: Option[];
  groups?: OptionGroup[];
  placeholder?: string;
}

/** Supports either a flat `options` list or grouped `groups` (rendered as
 * native <optgroup> - the browser's own scrollable, searchable-by-typing
 * UI, which is what a plain <select> needs once there are 80+ items). */
export default function SelectField({ options, groups, placeholder, className = '', ...rest }: SelectFieldProps) {
  return (
    <select
      className={`input-field ${className}`}
      {...rest}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
      {groups?.map((group) => (
        <optgroup key={group.label} label={group.label}>
          {group.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
