import React from 'react';

export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none';
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg'
  };
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50',
    neutral: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    danger: 'bg-danger text-white hover:brightness-90'
  };

  const classes = [base, sizes[size] || sizes.md, variants[variant] || variants.primary, className].filter(Boolean).join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
