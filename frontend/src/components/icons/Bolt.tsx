import React from 'react';

export const Bolt: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    role="img"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <path d="M11 1L3 13h6l-1 10 9-14h-6l1-8Z" />
  </svg>
);

