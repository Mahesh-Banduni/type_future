'use client';

import { useEffect } from 'react';
import ArcaneGame from '@/components/games/arcane/ArcaneGame';
import Navbar from '@/components/layout/Navbar';
import { useGamesStore } from '@/store/useGamesStore';
import { AchievementToast } from '@/components/games/shared/AchievementBadge';

export default function ArcaneQuestPage() {
  const { hydrate } = useGamesStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col pt-16">
        <ArcaneGame />
      </main>
      <AchievementToast />
    </>
  );
}
