# ⌨️ TypeFuture — Premium Minimalist Typing Test Platform

**TypeFuture** is a fast, beautiful, and completely client-side typing trainer built to make you a faster and more accurate typist. It combines a full **typing test engine**, a structured **10-level touch-typing course**, deep **performance analytics**, and three fully playable **typing games** — all wrapped in a highly customizable, animated interface with 20+ premium themes.

No backend, no accounts, no tracking — everything runs and persists locally in your browser.

---

## ✨ Features

### 🏁 Typing Test (`/test`)
- **300 curated paragraphs** across three difficulty levels — *Beginner*, *Medium*, and *Master* (100 each)
- **Four test durations**: 30 / 60 / 120 / 300 seconds, plus paragraph-completion mode
- **Real-time live stats**: WPM, CPM, accuracy, errors, progress bar, and time remaining
- **Per-character feedback**: correct, incorrect, extra, and missed character states with smooth animations
- **Detailed result modal**: gross/net WPM, CPM, accuracy, and full character breakdown after every test
- **Auto-start** on first keystroke, optional sound feedback on keystrokes/errors

### 🎓 Learn Mode (`/learn`)
- **Structured touch-typing curriculum**: 10 progressive levels — Home Row → Top Row → Bottom Row → Full Alphabet → Numbers → Symbols → Mixed → Paragraphs → Speed Development → Final Practice
- **Guided lessons & exercises**: single-key drills, repetition, word/sentence practice, timed drills, and accuracy gates you must pass to advance
- **Interactive virtual keyboard** with real-time key highlighting and **color-coded finger guides**
- **Hand & posture coaching** with tips on every lesson
- **Achievements, streaks, and lesson completion rewards**

### 📊 Statistics (`/stats`)
- **Dashboard**: total tests, average/best/lowest WPM, average accuracy, daily streak, total time typed
- **Progress graphs** (powered by [Recharts](https://recharts.org)) tracking WPM and accuracy over time
- **Full history table** with sorting, pagination, and one-click clearing

### 🎮 Arcade Games (`/games`)
A unified games hub with shared XP, levels, achievements, local leaderboards, and save data:

| Game | Description |
|---|---|
| 🚀 **Cosmic Word Defense** | Defend your space station from waves of descending enemy ships by typing words before they cross your defense line. Combos, power-ups, and escalating waves. |
| 🧙 **Arcane Typing Quest** | A turn-based typing RPG — explore regions on a world map, complete quests, cast elemental spells by typing, battle monsters and bosses, and level up. |
| ⌨️ **Precision Trainer** | An adaptive coach that measures speed and accuracy **per key** and visualizes weak spots on an interactive keyboard heatmap. |

### 🎨 Deep Customization (`/settings`)
- **20+ hand-crafted themes** — dark, light, cyberpunk, dracula, solarized, midnight, ocean, forest, sunset, sepia, paper, pastel light variants, high contrast, and more
- **Typography controls**: font family (including a dyslexia-friendly option), font size/weight, letter/word spacing, line height, text width & alignment
- **Caret styles**: line, block, underline — with custom color, thickness, and blink speed
- **Sound effects** for keystrokes, errors, and completions
- **Accessibility options**: reduced motion, high contrast mode, animation toggles
- **UI toggles**: show/hide navbar, footer, live stat elements, and more

### ⌨️ Keyboard Shortcuts
| Shortcut | Action |
|---|---|
| *(any key)* | Auto-start the test |
| `Tab` + `Enter` | Restart test |
| `Esc` | Finish / cancel current test |
| `Ctrl` + `R` | New random paragraph |
| `Ctrl` + `T` | Cycle through themes |
| `Ctrl` + `1` / `2` / `3` | Switch difficulty (Beginner / Medium / Master) |

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI Library | [React 19](https://react.dev) |
| Language | [TypeScript 5](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| State Management | [Zustand 5](https://zustand.docs.pmnd.rs) |
| Animations | [Framer Motion](https://motion.dev) |
| Charts | [Recharts](https://recharts.org) |
| Icons | [Lucide React](https://lucide.dev) + [React Icons](https://react-icons.github.io/react-icons/) |
| Persistence | Browser `localStorage` (no server required) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 20+**
- npm (comes bundled with Node)

### Installation

```bash
# Clone the repository
git clone https://github.com/Mahesh-Banduni/type_future
cd type_future

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Pages hot-reload as you edit.

### Production

```bash
# Build for production
npm run build

# Start the production server
npm start
```

### Linting

```bash
npm run lint
```


---

## 📁 Project Structure

```
type_future/
└── src/
    ├── app/                     # Next.js App Router pages
    │   ├── page.tsx                 # Landing page (/)
    │   ├── test/                    # Typing test
    │   ├── learn/                   # Touch-typing course
    │   ├── stats/                   # Statistics dashboard
    │   ├── settings/                # Settings page
    │   └── games/                   # Games hub + 3 game routes
    ├── components/
    │   ├── typing/                  # TypingArea, LiveStats, ProgressBar
    │   ├── learn/                   # Dashboard, VirtualKeyboard, HandGuide
    │   ├── stats/                   # StatsDashboard, ProgressGraphs, HistoryTable
    │   ├── games/
    │   │   ├── cosmic/              # Cosmic Word Defense components
    │   │   ├── arcane/              # Arcane Typing Quest components
    │   │   ├── precision/           # Precision Trainer components
    │   │   └── shared/              # Leaderboards, XP bars, pause menus
    │   ├── layout/                  # Navbar, Footer
    │   ├── settings/                # SettingsModal & sections
    │   ├── results/                 # ResultModal
    │   └── ui/                      # Theme switcher, selectors, spinners
    ├── hooks/                       # Core logic hooks
    │   ├── useTypingEngine.ts           # Keystroke processing & live stats
    │   ├── useParagraphEngine.ts        # Paragraph loading/shuffling
    │   ├── useTimer.ts                  # Test timer
    │   ├── useSoundEngine.ts            # Sound feedback engine
    │   ├── useKeyboardShortcuts.ts      # Global shortcuts
    │   ├── useCosmicGame.ts             # Cosmic Word Defense state machine
    │   ├── useArcaneGame.ts             # Arcane Quest RPG logic
    │   └── usePrecisionTrainer.ts       # Per-key analytics
    ├── store/                       # Zustand stores
    │   ├── useTypingStore.ts            # Active test state
    │   ├── useStatsStore.ts             # Lifetime stats & history
    │   ├── useSettingsStore.ts          # User preferences & theme
    │   ├── useLearnStore.ts             # Lesson progress
    │   └── useGamesStore.ts             # Game saves, XP, achievements
    ├── data/                        # Static content
    │   ├── beginner.json                # 100 beginner paragraphs
    │   ├── medium.json                  # 100 medium paragraphs
    │   ├── master.json                  # 100 master paragraphs
    │   ├── lessons.ts                   # 10-level curriculum & achievements
    │   ├── arcaneWorld.ts               # Regions, quests, enemies, spells
    │   └── gameWords.ts                 # Word pools for games
    ├── styles/themes.ts             # Theme color definitions
    ├── context/AppProvider.tsx      # Global hydration & theme application
    ├── types/index.ts               # Shared TypeScript types
    └── utils/                       # storage.ts, wpm.ts, charState.ts
```

---

## 💾 Data & Persistence

All data is stored **locally in your browser** via `localStorage` — no server or account required:

| Key | Contents |
|---|---|
| `typefuture_stats` | Aggregate statistics (tests, WPM, streaks) |
| `typefuture_history` | Individual test results |
| `typefuture_settings` | Theme, typography, sound & UI preferences |
| `typefuture_learn` | Lesson progress, best scores, achievements |

Clearing your browser data resets everything. Data does not sync between devices or browsers.

---

## 🧠 How It Works

1. **Typing Engine** — every keystroke is diffed against the target text to produce per-character states (`correct`, `incorrect`, `extra`, `missed`), which drive rendering and metrics.
2. **Metrics** — WPM is computed from correct characters ÷ 5 per minute; accuracy from correct characters over total typed characters.
3. **Stores** — five Zustand stores own the app state; `AppProvider` hydrates them from `localStorage` on mount and applies the active theme.
4. **Games** — each game is driven by its own hook-based state machine, feeding scores into the shared `useGamesStore` for XP, achievements, and leaderboards.

---

## 🗺️ Roadmap Ideas

- [ ] Cloud sync / optional accounts
- [ ] Multiplayer races
- [ ] Additional languages & keyboard layouts
- [ ] Export/import of stats as JSON
- [ ] More games in the arcade

---

## 📄 License

This project is private and intended for personal/educational use.

---

Made with ❤️ by the TypeFuture Team. Happy typing! ⌨️✨


