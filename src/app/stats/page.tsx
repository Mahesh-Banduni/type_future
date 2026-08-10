'use client';

import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StatsDashboard from '@/components/stats/StatsDashboard';
import ProgressGraphs from '@/components/stats/ProgressGraphs';
import HistoryTable from '@/components/stats/HistoryTable';
import { useStatsStore } from '@/store/useStatsStore';

export default function StatsPage() {
  const { hydrate } = useStatsStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 flex flex-col gap-10">
        <div>
          <h1 className="text-3xl font-black gradient-text">Performance Analytics</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Track your typing speed progress, lifetime stats, and history. All data is saved locally.
          </p>
        </div>

        {/* Dashboard Grid */}
        <section aria-label="Lifetime statistics">
          <StatsDashboard />
        </section>

        {/* Trends & Graphs */}
        <section aria-label="Performance graphs">
          <ProgressGraphs />
        </section>

        {/* Detailed History Table */}
        <section aria-label="Keystroke test history">
          <HistoryTable />
        </section>
      </main>
      <Footer />
    </>
  );
}
