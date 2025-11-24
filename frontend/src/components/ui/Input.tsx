import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, className = '', ...props }, ref) => (
    <div className="relative w-full">
      {leftIcon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
          {leftIcon}
        </span>
      )}
      <input
        ref={ref}
        className={`w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 ${leftIcon ? 'pl-9' : ''} text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/70 ${className}`}
        {...props}
      />
    </div>
  )
);

Input.displayName = 'Input';

