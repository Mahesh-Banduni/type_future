'use client';

import { useState, useMemo } from 'react';
import { useStatsStore } from '@/store/useStatsStore';
import { formatDate } from '@/utils/wpm';

type SortKey = 'timestamp' | 'wpm' | 'accuracy' | 'errors' | 'duration';
type SortOrder = 'asc' | 'desc';

export default function HistoryTable() {
  const { history, clearAllHistory, hydrated } = useStatsStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>('timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const itemsPerPage = 10;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const sortedHistory = useMemo(() => {
    const data = [...history];
    data.sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (sortKey === 'timestamp') {
        valA = a.timestamp;
        valB = b.timestamp;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [history, sortKey, sortOrder]);

  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedHistory.slice(start, start + itemsPerPage);
  }, [sortedHistory, currentPage]);

  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage);

  if (!hydrated) {
    return (
      <div className="h-[200px] w-full rounded-2xl animate-pulse" style={{ background: 'var(--color-surface)' }} />
    );
  }

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="glass p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
            Recent History
          </h3>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Your last {history.length} typing tests
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to clear your local history?')) {
              clearAllHistory();
            }
          }}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold theme-transition focus-ring"
          style={{
            background: 'color-mix(in srgb, var(--color-incorrect) 10%, transparent)',
            color: 'var(--color-incorrect)',
            border: '1px solid color-mix(in srgb, var(--color-incorrect) 20%, transparent)',
          }}
        >
          Clear History
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              {[
                { label: 'Date', key: 'timestamp' },
                { label: 'WPM', key: 'wpm' },
                { label: 'Accuracy', key: 'accuracy' },
                { label: 'Errors', key: 'errors' },
                { label: 'Duration', key: 'duration' },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key as SortKey)}
                  className="pb-3 font-semibold cursor-pointer select-none"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <div className="flex items-center gap-1 hover:text-[--color-primary] transition-colors">
                    {col.label}
                    {sortKey === col.key && (
                      <span className="text-[10px]">
                        {sortOrder === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="pb-3 font-semibold" style={{ color: 'var(--color-text-muted)' }}>Difficulty</th>
              <th className="pb-3 font-semibold text-right" style={{ color: 'var(--color-text-muted)' }}>Paragraph ID</th>
            </tr>
          </thead>
          <tbody>
            {paginatedHistory.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-[--color-surface2] theme-transition"
                style={{ borderBottom: '1px solid var(--color-border)', contentVisibility: 'auto' }}
              >
                <td className="py-3 tabular-nums" style={{ color: 'var(--color-text)' }}>
                  {formatDate(item.timestamp)}
                </td>
                <td className="py-3 font-bold tabular-nums" style={{ color: 'var(--color-primary)' }}>
                  {item.wpm}
                </td>
                <td className="py-3 font-semibold tabular-nums" style={{ color: 'var(--color-text)' }}>
                  {item.accuracy}%
                </td>
                <td className="py-3 tabular-nums" style={{ color: 'var(--color-incorrect)' }}>
                  {item.errors}
                </td>
                <td className="py-3 tabular-nums" style={{ color: 'var(--color-text)' }}>
                  {item.duration}s
                </td>
                <td className="py-3 capitalize" style={{ color: 'var(--color-text-muted)' }}>
                  {item.difficulty}
                </td>
                <td className="py-3 text-right font-mono text-xs" style={{ color: 'var(--color-text-subtle)' }}>
                  #{item.paragraphId}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 mt-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold theme-transition focus-ring disabled:opacity-40"
            style={{
              background: 'var(--color-surface2)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            Previous
          </button>
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold theme-transition focus-ring disabled:opacity-40"
            style={{
              background: 'var(--color-surface2)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
