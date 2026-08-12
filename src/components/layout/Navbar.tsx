'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import TimerSelector from '@/components/ui/TimerSelector';
import DifficultySelector from '@/components/ui/DifficultySelector';
import { useSettingsStore } from '@/store/useSettingsStore';
import Image from 'next/image';

const NAV_LINKS = [
  { href: '/test',     label: 'Type',       id: 'nav-test' },
  { href: '/learn',    label: 'Learn', id: 'nav-learn' },
  { href: '/games',    label: 'Games',      id: 'nav-games' },
  { href: '/stats',    label: 'Stats',      id: 'nav-stats' },
  { href: '/settings', label: 'Settings',   id: 'nav-settings' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { showNavbar } = useSettingsStore();

  if (!showNavbar) return null;

  return (
    <header
      className="sticky top-0 z-50 w-full theme-transition"
      style={{
        background: 'color-mix(in srgb, var(--color-bg) 85%, transparent)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
        {/* Logo */}
        <Link href="/" id="nav-logo" className="flex items-center gap-2 flex-shrink-0 focus-ring rounded-lg p-1">
          {/* <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
          >
            TF
          </div> */}
          <Image src="/images/logo.png" alt='Type Future' width={16} height={14} className='w-16 h-14' />
          <span className="font-bold text-lg hidden sm:block" style={{ color: 'var(--color-text)' }}>
            TypeFuture
          </span>
        </Link>

        {/* Center controls — only on test page */}
        {pathname === '/test' && (
          <div className="flex items-center gap-2 flex-1 justify-center flex-wrap">
            <DifficultySelector />
            <TimerSelector />
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label, id }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  id={id}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus-ring"
                  style={{
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    background: isActive ? 'color-mix(in srgb, var(--color-primary) 12%, transparent)' : 'transparent',
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
