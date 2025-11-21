import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
}

export const Toggle: React.FC<ToggleProps> = React.memo(
  ({ checked, onChange, label }) => {
    return (
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="flex items-center gap-2"
      >
        <span
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            checked ? 'bg-primary' : 'bg-slate-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              checked ? 'translate-x-4' : 'translate-x-1'
            }`}
          />
        </span>
        {label && (
          <span className="text-xs text-slate-300 select-none">
            {label}
          </span>
        )}
      </button>
    );
  }
);
