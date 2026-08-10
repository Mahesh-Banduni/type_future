'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useStatsStore } from '@/store/useStatsStore';
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const { stats, hydrate } = useStatsStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6">
        {/* Hero Section */}
        <div className="max-w-4xl w-full text-center flex flex-col items-center gap-6 mb-16 animate-fade-in-up">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
              color: 'var(--color-primary)',
              border: '1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)',
            }}
          >
            🚀 Future of Typing Practice
          </motion.div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none" style={{ color: 'var(--color-text)' }}>
            Elevate Your Typing Speed with{' '}
            <span className="gradient-text glow-text">TypeFuture</span>
          </h1>

          <p className="text-lg max-w-2xl" style={{ color: 'var(--color-text-muted)' }}>
            A minimalist, feature-rich typing test platform designed to help you analyze, optimize,
            and supercharge your words-per-minute (WPM) speed. Zero distractions, 14 premium themes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <Link
              href="/test"
              id="hero-start-btn"
              className="flex h-12 items-center justify-center px-8 rounded-full font-bold text-white transition-all duration-200 hover:scale-105 shadow-lg focus-ring animate-pulse-glow"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              }}
            >
              Start Typing Now
            </Link>
            <Link
              href="/stats"
              id="hero-stats-btn"
              className="flex h-12 items-center justify-center px-8 rounded-full font-bold border transition-all duration-200 hover:scale-105 focus-ring"
              style={{
                background: 'var(--color-surface2)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              View Analytics
            </Link>
          </div>
        </div>

        {/* Real-time stats preview if they have any stats */}
        {stats.totalTests > 0 && (
          <div className="max-w-4xl w-full mb-16 animate-fade-in">
            <h2 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--color-text)' }}>
              Your Recent Performance
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Highest Speed', value: `${stats.bestScore} WPM`, emoji: '🏆' },
                { label: 'Average Accuracy', value: `${stats.averageAccuracy}%`, emoji: '🎯' },
                { label: 'Total Words Typed', value: stats.totalWordsTyped, emoji: '📝' },
                { label: 'Current Streak', value: `${stats.currentStreak} Days`, emoji: '🔥' },
              ].map(({ label, value, emoji }) => (
                <div
                  key={label}
                  className="glass p-5 flex flex-col items-center justify-center text-center gap-1.5"
                >
                  <span className="text-xl">{emoji}</span>
                  <span className="text-2xl font-black tabular-nums" style={{ color: 'var(--color-primary)' }}>
                    {value}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feature Cards Grid */}
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: 'Real-time Calculations',
              desc: 'Get instant feedback on WPM, accuracy, character states, CPM, and exact keystroke mistakes as you type.',
              icon: '⚡',
            },
            {
              title: '300 Custom Paragraphs',
              desc: 'Tailored vocabulary across Beginner, Medium, and Master difficulty levels, loaded dynamically with a smart shuffle algorithm.',
              icon: '📚',
            },
            {
              title: 'Ultimate Customization',
              desc: 'Select from 14 premium handcrafted themes, custom font sizes, carets, error sounds, and visual effects.',
              icon: '🎨',
            },
          ].map((f, i) => (
            <div key={i} className="glass p-6 flex flex-col gap-3">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                {f.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Theme Showcase Section */}
        <div
          className="max-w-4xl w-full rounded-3xl p-8 sm:p-12 text-center flex flex-col gap-6"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <h2 className="text-2xl font-black" style={{ color: 'var(--color-text)' }}>
            Match Your Aesthetic
          </h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--color-text-muted)' }}>
            Switch instantly between dark and light themes, Dracula, Solarized, Sunset, Cyberpunk, Midnight,
            and many more. Fully responsive transitions that adapt immediately.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            {[
              { name: 'Dracula', bg: '#282a36', primary: '#bd93f9' },
              { name: 'Cyberpunk', bg: '#0a0010', primary: '#ff00ff' },
              { name: 'Solarized', bg: '#002b36', primary: '#268bd2' },
              { name: 'Sunset', bg: '#0f0510', primary: '#f472b6' },
              { name: 'Midnight', bg: '#010409', primary: '#58a6ff' },
            ].map((t) => (
              <div
                key={t.name}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: 'var(--color-surface2)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.primary }} />
                <span style={{ color: 'var(--color-text)' }}>{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
