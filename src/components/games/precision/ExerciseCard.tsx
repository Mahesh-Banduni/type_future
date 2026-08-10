'use client';

import { motion } from 'framer-motion';

interface ExerciseCardProps {
  weakKeys: string[];
}

export default function ExerciseCard({ weakKeys }: ExerciseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-2xl w-full max-w-2xl text-center flex flex-col items-center gap-3"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-xl text-blue-400">
        🎯
      </div>
      <div>
        <h3 className="font-black text-lg text-white">Targeted Exercise Drill</h3>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
          This drill has been dynamically custom-built to target your weakest keys.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap items-center justify-center mt-2">
        {weakKeys.map((key) => (
          <span
            key={key}
            className="px-3 py-1.5 rounded-lg font-black font-mono text-sm uppercase"
            style={{
              background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)',
              color: 'var(--color-primary)',
            }}
          >
            {key}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
