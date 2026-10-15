import { InputHTMLAttributes } from 'react';

export default function TextInput({ className = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`input-field ${className}`}
      {...rest}
    />
  );
}
