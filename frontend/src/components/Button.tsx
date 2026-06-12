import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-sm flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-primary-red hover:bg-primary-red-hover text-white focus:ring-primary-red',
    secondary: 'bg-transparent border border-text-muted hover:bg-bg-hover text-text-main focus:ring-text-muted',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processando...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
