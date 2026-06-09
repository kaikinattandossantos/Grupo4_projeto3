import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      <label htmlFor={id} className="text-xs font-bold text-text-main uppercase tracking-wider">
        {label}
        {helperText && <small className="lowercase font-normal text-text-muted ml-1">({helperText})</small>}
      </label>
      <input
        id={id}
        className={`w-full px-4 py-3 rounded-lg border bg-bg-input text-text-main text-sm transition-all duration-200 outline-hidden focus:ring-2
          ${error 
            ? 'border-primary-red focus:ring-primary-red-light focus:border-primary-red' 
            : 'border-text-light focus:ring-accent-blue-light focus:border-accent-blue'
          }`}
        {...props}
      />
      {error && <span className="text-xs font-semibold text-primary-red mt-0.5">{error}</span>}
    </div>
  );
};
