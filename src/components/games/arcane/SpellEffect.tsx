'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SPELLS } from '@/data/arcaneWorld';

interface SpellEffectProps {
  spellId: string | null;
  onComplete?: () => void;
}

export default function SpellEffect({ spellId, onComplete }: SpellEffectProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!spellId) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 800);
    return () => clearTimeout(t);
  }, [spellId, onComplete]);

  const spell = spellId ? SPELLS[spellId] : null;

  return (
    <AnimatePresence>
      {visible && spell && (
        <motion.div
          key={spellId}
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: [0.2, 1.4, 1.2], opacity: [0, 1, 0] }}
          transition={{ duration: 0.7, times: [0, 0.4, 1] }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
        >
          {/* Radial burst */}
          <div
            className="absolute rounded-full"
            style={{
              width: 300, height: 300,
              background: `radial-gradient(circle, ${spell.color}44 0%, ${spell.color}11 60%, transparent 100%)`,
            }}
          />
          {/* Spell emoji */}
          <motion.div
            animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 0.5 }}
            style={{ fontSize: 80, filter: `drop-shadow(0 0 20px ${spell.color})` }}
          >
            {spell.icon}
          </motion.div>
          {/* Spell name */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-1/3 font-black text-lg tracking-widest uppercase"
            style={{ color: spell.color, textShadow: `0 0 20px ${spell.color}` }}
          >
            {spell.name}!
          </motion.p>
          {/* Particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{ background: spell.color }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: Math.cos((i / 8) * Math.PI * 2) * 120,
                y: Math.sin((i / 8) * Math.PI * 2) * 120,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.7 }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
