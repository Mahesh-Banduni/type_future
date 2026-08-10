'use client';

import { useEffect } from 'react';
import PrecisionTrainer from '@/components/games/precision/PrecisionTrainer';
import Navbar from '@/components/layout/Navbar';
import { useGamesStore } from '@/store/useGamesStore';
import { AchievementToast } from '@/components/games/shared/AchievementBadge';

export default function PrecisionTrainerPage() {
  const { hydrate } = useGamesStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col pt-16">
        <PrecisionTrainer />
      </main>
      <AchievementToast />
    </>
  );
}
