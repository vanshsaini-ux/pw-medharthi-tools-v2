import { InputHTMLAttributes } from 'react';

export default function NumberInput({ className = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="number"
      inputMode="numeric"
      className={`input-field ${className}`}
      {...rest}
    />
  );
}
