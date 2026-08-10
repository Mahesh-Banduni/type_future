'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SettingsModal from '@/components/settings/SettingsModal';

export default function SettingsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12">
        <SettingsModal />
      </main>
      <Footer />
    </>
  );
}
