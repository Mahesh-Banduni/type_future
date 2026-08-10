'use client';

import { useEffect } from 'react';
import CosmicGame from '@/components/games/cosmic/CosmicGame';
import Navbar from '@/components/layout/Navbar';
import { useGamesStore } from '@/store/useGamesStore';
import { AchievementToast } from '@/components/games/shared/AchievementBadge';

export default function CosmicWordDefensePage() {
  const { hydrate } = useGamesStore();

  useEffect(() => { hydrate(); }, [hydrate]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div style={{ paddingTop: '64px' }}>
        <CosmicGame initialDifficulty="medium" />
      </div>
      <AchievementToast />
    </>
  );
}
