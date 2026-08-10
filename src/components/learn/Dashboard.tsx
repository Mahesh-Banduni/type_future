'use client';

import { useLearnStore } from '@/store/useLearnStore';
import { LEVELS, ACHIEVEMENTS, Level, Lesson } from '@/data/lessons';
import { motion } from 'framer-motion';

interface DashboardProps {
  onStartLesson: (level: number, lesson: Lesson) => void;
}

function AchievementBadge({ id, unlocked }: { id: string; unlocked: boolean }) {
  const def = ACHIEVEMENTS.find(a => a.id === id);
  if (!def) return null;
  return (
    <div
      className="flex flex-col items-center gap-1 p-3 rounded-xl text-center"
      style={{
        background: unlocked
          ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)'
          : 'var(--color-surface2)',
        border: `1px solid ${unlocked ? 'color-mix(in srgb, var(--color-accent) 30%, transparent)' : 'var(--color-border)'}`,
        opacity: unlocked ? 1 : 0.45,
        filter: unlocked ? undefined : 'grayscale(1)',
      }}
    >
      <span className="text-2xl">{def.icon}</span>
      <span
        className="text-[10px] font-bold"
        style={{ color: unlocked ? 'var(--color-accent)' : 'var(--color-text-subtle)' }}
      >
        {def.title}
      </span>
    </div>
  );
}

function LevelCard({
  level,
  locked,
  completed,
  onStart,
}: {
  level: Level;
  locked: boolean;
  completed: boolean;
  onStart: () => void;
}) {
  return (
    <motion.div
      whileHover={!locked ? { scale: 1.02 } : undefined}
      className="glass p-5 flex flex-col gap-3 relative"
      style={{ opacity: locked ? 0.55 : 1 }}
    >
      {/* Color accent strip */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ background: locked ? 'var(--color-border)' : level.color }}
      />

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{level.icon}</span>
          <div>
            <div className="font-black text-sm" style={{ color: 'var(--color-text)' }}>
              Level {level.id} — {level.title}
            </div>
            <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
              {level.subtitle}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 text-lg">
          {locked ? '🔒' : completed ? '✅' : '▶'}
        </div>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
        {level.description}
      </p>

      {/* Lessons */}
      <div className="flex flex-col gap-1.5">
        {level.lessons.map(lesson => (
          <div
            key={lesson.id}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs"
            style={{ background: 'var(--color-surface2)', border: '1px solid var(--color-border)' }}
          >
            <span style={{ color: 'var(--color-text)' }}>{lesson.title}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>
              {lesson.exercises.length} exercises
            </span>
          </div>
        ))}
      </div>

      {!locked && (
        <button
          onClick={onStart}
          className="w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-105 focus-ring"
          style={{
            background: completed
              ? 'linear-gradient(135deg, var(--color-correct), #059669)'
              : `linear-gradient(135deg, ${level.color}, ${level.color}bb)`,
          }}
        >
          {completed ? '🔁 Replay' : '▶ Start Level'}
        </button>
      )}
      {locked && (
        <div
          className="w-full py-2.5 rounded-xl font-bold text-sm text-center"
          style={{ background: 'var(--color-surface2)', color: 'var(--color-text-subtle)' }}
        >
          🔒 Complete previous level to unlock
        </div>
      )}
    </motion.div>
  );
}

export default function Dashboard({ onStartLesson }: DashboardProps) {
  const {
    completedLessons, highestUnlockedLevel, bestScores, practiceStreak,
    unlockedAchievements,
  } = useLearnStore();

  // Compute stats
  const totalLessons = LEVELS.reduce((s, l) => s + l.lessons.length, 0);
  const completedCount = completedLessons.length;
  const allWpm = Object.values(bestScores).map(s => s.wpm);
  const bestWpm = allWpm.length > 0 ? Math.max(...allWpm) : 0;
  const allAcc = Object.values(bestScores).map(s => s.accuracy);
  const bestAcc = allAcc.length > 0 ? Math.max(...allAcc) : 0;

  const handleStartLevel = (level: Level) => {
    // Start first lesson of this level
    if (level.lessons.length > 0) {
      onStartLesson(level.id, level.lessons[0]);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold w-fit"
          style={{
            background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
            color: 'var(--color-primary)',
            border: '1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)',
          }}
        >
          🎓 Beginner Learning Path
        </div>
        <h1 className="text-3xl font-black" style={{ color: 'var(--color-text)' }}>
          Learn to <span className="gradient-text">Touch Type</span>
        </h1>
        <p className="text-sm max-w-xl" style={{ color: 'var(--color-text-muted)' }}>
          Progress through 10 structured levels, from home row fundamentals to
          full speed typing. Each level unlocks as you complete the previous one.
        </p>
      </div>

      {/* Progress stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Lessons Done', value: `${completedCount}/${totalLessons}`, icon: '📚', color: 'var(--color-primary)' },
          { label: 'Best WPM', value: bestWpm, icon: '⚡', color: 'var(--color-accent)' },
          { label: 'Best Accuracy', value: `${bestAcc}%`, icon: '🎯', color: 'var(--color-correct)' },
          { label: 'Practice Streak', value: `${practiceStreak} days`, icon: '🔥', color: '#fb923c' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="glass p-4 flex flex-col items-center gap-1 text-center">
            <span className="text-xl">{icon}</span>
            <span className="text-xl font-black tabular-nums" style={{ color }}>{value}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Level grid */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>
          Learning Levels
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LEVELS.map(level => {
            const locked = level.id > highestUnlockedLevel;
            const allDone = level.lessons.every(l => completedLessons.includes(l.id));
            return (
              <LevelCard
                key={level.id}
                level={level}
                locked={locked}
                completed={allDone}
                onStart={() => handleStartLevel(level)}
              />
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>
          Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {ACHIEVEMENTS.map(a => (
            <AchievementBadge
              key={a.id}
              id={a.id}
              unlocked={unlockedAchievements.includes(a.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
