import React from 'react';

export const StarSolid: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    role="img"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <path d="M11.48 3.499a.75.75 0 0 1 1.04 0l2.93 2.91 4.05.59a.75.75 0 0 1 .41 1.28l-2.93 2.86.69 4.03a.75.75 0 0 1-1.09.79L12 14.77l-3.62 1.9a.75.75 0 0 1-1.09-.79l.69-4.03-2.93-2.86a.75.75 0 0 1 .41-1.28l4.05-.59 2.96-2.91Z" />
  </svg>
);

export const StarOutline: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M11.48 3.499a.75.75 0 0 1 1.04 0l2.93 2.91 4.05.59a.75.75 0 0 1 .41 1.28l-2.93 2.86.69 4.03a.75.75 0 0 1-1.09.79L12 14.77l-3.62 1.9a.75.75 0 0 1-1.09-.79l.69-4.03-2.93-2.86a.75.75 0 0 1 .41-1.28l4.05-.59 2.96-2.91Z" />
  </svg>
);

