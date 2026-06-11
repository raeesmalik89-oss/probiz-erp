import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, total, pageSize = 20, onChange }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
      <p className="text-xs text-gray-500">
        Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        {start > 1 && <><button onClick={() => onChange(1)} className="px-3 py-1 text-xs rounded-lg hover:bg-gray-100">1</button><span className="text-gray-400 text-xs">…</span></>}
        {pages.map(p => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${p === page ? 'bg-blue-600 text-white font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            {p}
          </button>
        ))}
        {end < totalPages && <><span className="text-gray-400 text-xs">…</span><button onClick={() => onChange(totalPages)} className="px-3 py-1 text-xs rounded-lg hover:bg-gray-100">{totalPages}</button></>}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export function usePagination(data, pageSize = 20) {
  const [page, setPage] = React.useState(1);
  React.useEffect(() => setPage(1), [data]);
  const paginated = data.slice((page - 1) * pageSize, page * pageSize);
  return { page, setPage, paginated, total: data.length, pageSize };
}
