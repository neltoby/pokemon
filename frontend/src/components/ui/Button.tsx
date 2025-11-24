import React from 'react';

type Variant = 'primary' | 'ghost' | 'subtle';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-to-b from-primary to-primary-600 text-white hover:from-primary-400 hover:to-primary-600 focus:ring-primary/60',
  ghost:
    'bg-transparent text-slate-200 hover:bg-slate-800/60 border border-slate-800 focus:ring-primary/40',
  subtle:
    'bg-slate-800/60 text-slate-100 hover:bg-slate-700/60 border border-slate-700 focus:ring-primary/40',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-sm',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => (
  <button className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props} />
);

