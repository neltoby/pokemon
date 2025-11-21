import React from 'react';

export const ArrowRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    role="img"
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12h16" />
    <path d="M13 5l7 7-7 7" />
  </svg>
);

