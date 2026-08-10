// ─── Arcane Typing Quest World Data ──────────────────────────────────────────

export interface ArcaneRegion {
  id: string;
  name: string;
  description: string;
  icon: string;
  colorFrom: string;
  colorTo: string;
  unlockLevel: number;
  quests: ArcaneQuest[];
  enemies: ArcaneEnemy[];
  ambient: string; // CSS background description
}

export interface ArcaneQuest {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'boss';
  wordCount: number;
  reward: { xp: number; spell?: string; title?: string };
  dialogues: Dialogue[];
}

export interface ArcaneEnemy {
  id: string;
  name: string;
  icon: string;
  hp: number;
  attack: number;
  wordLength: 'short' | 'medium' | 'long';
  xpReward: number;
  isBoss?: boolean;
}

export interface Dialogue {
  speaker: string;
  text: string;
}

export const ARCANE_REGIONS: ArcaneRegion[] = [
  {
    id: 'mystic-forest',
    name: 'Mystic Forest',
    description: 'Ancient trees whisper forgotten spells. The first step of every mage\'s journey.',
    icon: '🌲',
    colorFrom: '#1a4a2a',
    colorTo: '#2d7a4a',
    unlockLevel: 1,
    ambient: 'linear-gradient(135deg, #0d2b14 0%, #1a4a2a 50%, #0f3a20 100%)',
    enemies: [
      { id: 'sprite', name: 'Forest Sprite', icon: '🧚', hp: 30, attack: 5, wordLength: 'short', xpReward: 15 },
      { id: 'wolf', name: 'Shadow Wolf', icon: '🐺', hp: 60, attack: 10, wordLength: 'medium', xpReward: 30 },
      { id: 'treant', name: 'Ancient Treant', icon: '🌳', hp: 150, attack: 20, wordLength: 'long', xpReward: 80, isBoss: true },
    ],
    quests: [
      {
        id: 'mf-1', title: 'The Awakening', type: 'main', wordCount: 10,
        description: 'Awaken your first spell by channeling arcane energy through word-casting.',
        reward: { xp: 100, spell: 'spark', title: 'Apprentice Mage' },
        dialogues: [
          { speaker: 'Elder Maren', text: 'Young one... the forest senses your potential.' },
          { speaker: 'Elder Maren', text: 'Speak the words of power and let magic flow through you.' },
          { speaker: 'Player', text: 'I am ready to learn.' },
        ],
      },
      {
        id: 'mf-2', title: 'Wolf\'s Bane', type: 'side', wordCount: 15,
        description: 'Drive the shadow wolves from the moonlit grove.',
        reward: { xp: 150 },
        dialogues: [
          { speaker: 'Villager', text: 'Shadow wolves prowl the grove at night. Please help us!' },
        ],
      },
      {
        id: 'mf-boss', title: 'The Ancient Treant', type: 'boss', wordCount: 25,
        description: 'Confront the corrupted Treant that guards the forest heart.',
        reward: { xp: 400, spell: 'nature-bolt' },
        dialogues: [
          { speaker: 'Treant', text: 'INTRUDER... LEAVE... OR FACE... WRATH OF THE FOREST...' },
        ],
      },
    ],
  },
  {
    id: 'crystal-caverns',
    name: 'Crystal Caverns',
    description: 'Shimmering gems pulse with elemental energy deep beneath the earth.',
    icon: '💎',
    colorFrom: '#1a1a4a',
    colorTo: '#4a2a7a',
    unlockLevel: 3,
    ambient: 'linear-gradient(135deg, #0d0d2b 0%, #1a1a4a 50%, #2a0f4a 100%)',
    enemies: [
      { id: 'golem', name: 'Crystal Golem', icon: '🪨', hp: 80, attack: 15, wordLength: 'medium', xpReward: 40 },
      { id: 'bat', name: 'Gem Bat', icon: '🦇', hp: 40, attack: 12, wordLength: 'short', xpReward: 25 },
      { id: 'guardian', name: 'Crystal Guardian', icon: '💠', hp: 200, attack: 30, wordLength: 'long', xpReward: 120, isBoss: true },
    ],
    quests: [
      {
        id: 'cc-1', title: 'The Crystal Heart', type: 'main', wordCount: 18,
        description: 'Seek the Crystal Heart that amplifies magical power.',
        reward: { xp: 200, spell: 'crystal-lance' },
        dialogues: [
          { speaker: 'Gemsmith Ora', text: 'The Crystal Heart thrums with unimaginable power, traveler.' },
          { speaker: 'Gemsmith Ora', text: 'Prove your mastery of words, and it will respond to you.' },
        ],
      },
    ],
  },
  {
    id: 'ancient-library',
    name: 'Ancient Library',
    description: 'Tomes of forbidden knowledge float in dust-filled silence.',
    icon: '📚',
    colorFrom: '#3a2a0a',
    colorTo: '#5a4a1a',
    unlockLevel: 5,
    ambient: 'linear-gradient(135deg, #1a0f00 0%, #3a2a0a 50%, #2a1f05 100%)',
    enemies: [
      { id: 'tome', name: 'Haunted Tome', icon: '📖', hp: 50, attack: 18, wordLength: 'long', xpReward: 50 },
      { id: 'ink', name: 'Ink Wraith', icon: '🖋️', hp: 70, attack: 22, wordLength: 'medium', xpReward: 60 },
      { id: 'librarian', name: 'Undead Librarian', icon: '💀', hp: 250, attack: 35, wordLength: 'long', xpReward: 150, isBoss: true },
    ],
    quests: [
      {
        id: 'al-1', title: 'Forbidden Knowledge', type: 'main', wordCount: 22,
        description: 'Decipher the ancient runes to unlock forbidden spells.',
        reward: { xp: 300, spell: 'arcane-bolt' },
        dialogues: [
          { speaker: 'Tome Guardian', text: 'Only those who command words may read the forbidden pages.' },
        ],
      },
    ],
  },
  {
    id: 'floating-kingdom',
    name: 'Floating Kingdom',
    description: 'Castles drift on clouds above the mortal world, ruled by sky sorcerers.',
    icon: '🏰',
    colorFrom: '#1a3a5a',
    colorTo: '#2a5a8a',
    unlockLevel: 8,
    ambient: 'linear-gradient(135deg, #0a1a2b 0%, #1a3a5a 50%, #0f2a4a 100%)',
    enemies: [
      { id: 'knight', name: 'Sky Knight', icon: '⚔️', hp: 100, attack: 25, wordLength: 'medium', xpReward: 70 },
      { id: 'mage', name: 'Storm Mage', icon: '⚡', hp: 80, attack: 35, wordLength: 'long', xpReward: 80 },
      { id: 'king', name: 'Sky King', icon: '👑', hp: 350, attack: 50, wordLength: 'long', xpReward: 250, isBoss: true },
    ],
    quests: [
      {
        id: 'fk-1', title: 'Ascension', type: 'main', wordCount: 28,
        description: 'Claim your place among the sky sorcerers.',
        reward: { xp: 500, spell: 'lightning-storm', title: 'Sky Mage' },
        dialogues: [
          { speaker: 'Sky King', text: 'You dare challenge the Floating Kingdom? Prove your worth in words!' },
        ],
      },
    ],
  },
];

export function getRegionById(id: string): ArcaneRegion | undefined {
  return ARCANE_REGIONS.find((r) => r.id === id);
}

export function getQuestById(questId: string): { region: ArcaneRegion; quest: ArcaneQuest } | undefined {
  for (const region of ARCANE_REGIONS) {
    const quest = region.quests.find((q) => q.id === questId);
    if (quest) return { region, quest };
  }
  return undefined;
}

// Spells catalog
export const SPELLS: Record<string, { name: string; icon: string; color: string; description: string }> = {
  spark: { name: 'Spark', icon: '✨', color: '#fbbf24', description: 'A basic magical spark. Your first spell.' },
  fireball: { name: 'Fireball', icon: '🔥', color: '#f97316', description: 'A blazing ball of fire launched at enemies.' },
  'crystal-lance': { name: 'Crystal Lance', icon: '💎', color: '#a5b4fc', description: 'A sharp crystal projectile.' },
  'arcane-bolt': { name: 'Arcane Bolt', icon: '⚡', color: '#c084fc', description: 'Pure arcane energy condensed into a bolt.' },
  'nature-bolt': { name: 'Nature Bolt', icon: '🌿', color: '#4ade80', description: 'Channeled nature energy strikes the foe.' },
  'lightning-storm': { name: 'Lightning Storm', icon: '🌩️', color: '#60a5fa', description: 'A devastating storm of lightning bolts.' },
};
