import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

const variantClasses = {
  primary: 'bg-[var(--button-bg)] hover:bg-[var(--button-bg-hover)] text-[var(--text-color)]',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  outline: 'border border-[var(--text-color)] text-[var(--text-color)] hover:bg-[var(--button-bg)]',
};

const Button = forwardRef(function Button(
  {
    as = 'button',
    to,
    href,
    variant = 'primary',
    className = '',
    children,
    iconStart,
    iconEnd,
    loading = false,
    disabled = false,
    ...props
  },
  ref
) {
  const Component = to ? Link : href ? 'a' : as;
  const isDisabled = loading || disabled;

  return (
    <Component
      ref={ref}
      to={to}
      href={href}
      className={twMerge(
        'inline-flex items-center justify-center gap-2 px-4 py-2 rounded transition text-sm font-medium',
        variantClasses[variant],
        isDisabled && 'opacity-50 pointer-events-none cursor-not-allowed',
        className
      )}
      aria-disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {!loading && iconStart && <span className="mr-1">{iconStart}</span>}
      {children}
      {!loading && iconEnd && <span className="ml-1">{iconEnd}</span>}
    </Component>
  );
});

export default Button;
