import React from 'react';

// Simple shimmer placeholder. Compose with width/height utility classes.
export default function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

// A full-card skeleton used while a page's data is loading.
export function CardSkeleton({ rows = 3 }) {
  return (
    <div className="card p-5 space-y-3">
      <Skeleton className="h-5 w-1/3" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}

// A skeleton grid for KPI / stat rows.
export function StatGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-5 flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// A skeleton for table-style lists.
export function TableSkeleton({ rows = 6 }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50">
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
