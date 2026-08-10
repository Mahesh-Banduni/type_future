'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialogue } from '@/data/arcaneWorld';

interface DialogueBoxProps {
  dialogues: Dialogue[];
  currentIdx: number;
  onAdvance: () => void;
}

export default function DialogueBox({ dialogues, currentIdx, onAdvance }: DialogueBoxProps) {
  const dialogue = dialogues[currentIdx];
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < dialogue.text.length) {
        setDisplayedText(dialogue.text.slice(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [currentIdx, dialogue.text]);

  const handleClick = () => {
    if (!isComplete) {
      setDisplayedText(dialogue.text);
      setIsComplete(true);
    } else {
      onAdvance();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-0 left-0 right-0 p-4 cursor-pointer z-20"
        onClick={handleClick}
      >
        <div
          className="rounded-2xl p-5 relative"
          style={{
            background: 'rgba(10,5,20,0.92)',
            border: '1px solid rgba(167,139,250,0.3)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 -4px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* Speaker name */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
            style={{
              background: 'linear-gradient(135deg, rgba(108,142,247,0.3), rgba(167,139,250,0.3))',
              border: '1px solid rgba(167,139,250,0.4)',
              color: '#c4b5fd',
            }}
          >
            💬 {dialogue.speaker}
          </div>

          {/* Text */}
          <p className="text-sm leading-relaxed font-medium" style={{ color: '#e2e8f0', minHeight: '2.5em' }}>
            {displayedText}
            {!isComplete && (
              <span className="inline-block w-0.5 h-4 ml-0.5 bg-purple-400 animate-pulse" style={{ verticalAlign: 'middle' }} />
            )}
          </p>

          {/* Advance hint */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-end gap-1 mt-3"
            >
              <span className="text-xs" style={{ color: 'rgba(167,139,250,0.6)' }}>
                {currentIdx + 1 < dialogues.length ? 'Click to continue' : 'Click to begin combat'}
              </span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                style={{ color: '#a78bfa' }}
              >
                ›
              </motion.span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
