import React from 'react';

export default function Spinner({ size = 'md', text = '' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size];
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${s} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`} />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
}

export function PageSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" text={text} />
    </div>
  );
}
