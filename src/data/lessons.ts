// ─── Finger & Key Mapping ─────────────────────────────────────────────────────

export type Finger =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'left-thumb'
  | 'right-thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export interface KeyInfo {
  key: string;
  finger: Finger;
  hand: 'left' | 'right';
}

export const KEY_FINGER_MAP: Record<string, KeyInfo> = {
  // Numbers row
  '`': { key: '`', finger: 'left-pinky', hand: 'left' },
  '1': { key: '1', finger: 'left-pinky', hand: 'left' },
  '2': { key: '2', finger: 'left-ring', hand: 'left' },
  '3': { key: '3', finger: 'left-middle', hand: 'left' },
  '4': { key: '4', finger: 'left-index', hand: 'left' },
  '5': { key: '5', finger: 'left-index', hand: 'left' },
  '6': { key: '6', finger: 'right-index', hand: 'right' },
  '7': { key: '7', finger: 'right-index', hand: 'right' },
  '8': { key: '8', finger: 'right-middle', hand: 'right' },
  '9': { key: '9', finger: 'right-ring', hand: 'right' },
  '0': { key: '0', finger: 'right-pinky', hand: 'right' },
  '-': { key: '-', finger: 'right-pinky', hand: 'right' },
  '=': { key: '=', finger: 'right-pinky', hand: 'right' },
  // Top row
  q: { key: 'q', finger: 'left-pinky', hand: 'left' },
  w: { key: 'w', finger: 'left-ring', hand: 'left' },
  e: { key: 'e', finger: 'left-middle', hand: 'left' },
  r: { key: 'r', finger: 'left-index', hand: 'left' },
  t: { key: 't', finger: 'left-index', hand: 'left' },
  y: { key: 'y', finger: 'right-index', hand: 'right' },
  u: { key: 'u', finger: 'right-index', hand: 'right' },
  i: { key: 'i', finger: 'right-middle', hand: 'right' },
  o: { key: 'o', finger: 'right-ring', hand: 'right' },
  p: { key: 'p', finger: 'right-pinky', hand: 'right' },
  '[': { key: '[', finger: 'right-pinky', hand: 'right' },
  ']': { key: ']', finger: 'right-pinky', hand: 'right' },
  // Home row
  a: { key: 'a', finger: 'left-pinky', hand: 'left' },
  s: { key: 's', finger: 'left-ring', hand: 'left' },
  d: { key: 'd', finger: 'left-middle', hand: 'left' },
  f: { key: 'f', finger: 'left-index', hand: 'left' },
  g: { key: 'g', finger: 'left-index', hand: 'left' },
  h: { key: 'h', finger: 'right-index', hand: 'right' },
  j: { key: 'j', finger: 'right-index', hand: 'right' },
  k: { key: 'k', finger: 'right-middle', hand: 'right' },
  l: { key: 'l', finger: 'right-ring', hand: 'right' },
  ';': { key: ';', finger: 'right-pinky', hand: 'right' },
  "'": { key: "'", finger: 'right-pinky', hand: 'right' },
  // Bottom row
  z: { key: 'z', finger: 'left-pinky', hand: 'left' },
  x: { key: 'x', finger: 'left-ring', hand: 'left' },
  c: { key: 'c', finger: 'left-middle', hand: 'left' },
  v: { key: 'v', finger: 'left-index', hand: 'left' },
  b: { key: 'b', finger: 'left-index', hand: 'left' },
  n: { key: 'n', finger: 'right-index', hand: 'right' },
  m: { key: 'm', finger: 'right-index', hand: 'right' },
  ',': { key: ',', finger: 'right-middle', hand: 'right' },
  '.': { key: '.', finger: 'right-ring', hand: 'right' },
  '/': { key: '/', finger: 'right-pinky', hand: 'right' },
  // Space
  ' ': { key: ' ', finger: 'right-thumb', hand: 'right' },
};

export function getKeyInfo(char: string): KeyInfo | null {
  const lower = char.toLowerCase();
  return KEY_FINGER_MAP[lower] ?? KEY_FINGER_MAP[char] ?? null;
}

// ─── Lesson Definitions ───────────────────────────────────────────────────────

export type LessonType =
  | 'single-key'
  | 'repetition'
  | 'word-practice'
  | 'sentence-practice'
  | 'timed-drill'
  | 'accuracy-drill'
  | 'paragraph-practice';

export interface Exercise {
  id: string;
  title: string;
  instruction: string;
  text: string;
  targetChars: string[];
  type: LessonType;
  minAccuracy: number; // 0-100, required to pass
  minWpm?: number;     // optional WPM gate
  timeLimitSeconds?: number;
}

export interface Lesson {
  id: string;
  levelId: number;
  order: number;
  title: string;
  description: string;
  objective: string;
  targetChars: string[];
  exercises: Exercise[];
  tips: string[];
  postureTips?: string[];
}

export interface Level {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  lessons: Lesson[];
  color: string;
}

// ─── Level Data ───────────────────────────────────────────────────────────────

export const LEVELS: Level[] = [
  {
    id: 1,
    title: 'Home Row',
    subtitle: 'The Foundation',
    icon: '🏠',
    description: 'Learn the most important row — where your fingers naturally rest. Mastering home row is the first step to touch typing.',
    color: '#6c8ef7',
    lessons: [
      {
        id: 'l1-intro',
        levelId: 1,
        order: 1,
        title: 'Introduction & Posture',
        description: 'Learn proper sitting posture and hand placement before touching the keyboard.',
        objective: 'Understand correct posture and finger positioning.',
        targetChars: ['f', 'j'],
        tips: [
          'Sit up straight with your feet flat on the floor.',
          'Keep your wrists slightly elevated, not resting on the desk.',
          'Place your left index finger on F and right index on J — feel the bumps!',
          'Relax your hands — tension leads to mistakes.',
        ],
        postureTips: [
          'Screen at eye level, 50–70cm away.',
          'Elbows at 90° angle.',
          'Shoulders relaxed, not hunched.',
        ],
        exercises: [
          {
            id: 'l1-e1',
            title: 'F and J Alternation',
            instruction: 'Press F with your left index finger and J with your right index finger.',
            text: 'fjfjfjfjfjfjfjfj fj fj fj fj fj fj fj fj',
            targetChars: ['f', 'j'],
            type: 'single-key',
            minAccuracy: 90,
          },
          {
            id: 'l1-e2',
            title: 'Home Row Left — A S D F',
            instruction: 'Use your left pinky on A, ring on S, middle on D, index on F.',
            text: 'asdf asdf fdsa fdsa asdf fdsa asdf fdsa dfas',
            targetChars: ['a', 's', 'd', 'f'],
            type: 'repetition',
            minAccuracy: 88,
          },
          {
            id: 'l1-e3',
            title: 'Home Row Right — J K L ;',
            instruction: 'Use your right index on J, middle on K, ring on L, pinky on ;.',
            text: 'jkl; jkl; ;lkj ;lkj jkl; ;lkj klj; j;lk',
            targetChars: ['j', 'k', 'l', ';'],
            type: 'repetition',
            minAccuracy: 88,
          },
          {
            id: 'l1-e4',
            title: 'Full Home Row',
            instruction: 'Combine all home row keys. Keep your fingers on home position!',
            text: 'asdfjkl; asdfjkl; ;lkjfdsa fjdk aslk fjdk asdf jkl; asdf jkl;',
            targetChars: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
            type: 'repetition',
            minAccuracy: 85,
          },
          {
            id: 'l1-e5',
            title: 'Home Row Words',
            instruction: 'Type these common words using only home row keys.',
            text: 'flask fall lass ask dad sad fad lad add all fall shall skal',
            targetChars: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
            type: 'word-practice',
            minAccuracy: 85,
          },
          {
            id: 'l1-e6',
            title: 'Timed Home Row Drill',
            instruction: 'Type as fast and accurately as you can!',
            text: 'asdf jkl; fj dk sl aj fk dl sj ak fl dj sk al fj asdf jkl; fads lass fall flask ask lad',
            targetChars: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
            type: 'timed-drill',
            minAccuracy: 85,
            timeLimitSeconds: 60,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Top Row',
    subtitle: 'Q W E R T — Y U I O P',
    icon: '🔝',
    description: 'Extend your reach to the top row. These keys are typed with upward finger movements from home position.',
    color: '#a855f7',
    lessons: [
      {
        id: 'l2-left',
        levelId: 2,
        order: 1,
        title: 'Left Top Row: Q W E R T',
        description: 'Train your left hand to reach Q, W, E, R, T from home position.',
        objective: 'Type Q W E R T without looking at the keyboard.',
        targetChars: ['q', 'w', 'e', 'r', 't'],
        tips: [
          'Reach up from home position — do not lift your whole hand.',
          'Return to home row after each keystroke.',
          'Q is your left pinky, W ring, E middle, R index, T index.',
        ],
        exercises: [
          {
            id: 'l2-e1',
            title: 'Q W E R T Intro',
            instruction: 'Practice each key one at a time, returning to home row each time.',
            text: 'qwert qwert trewq qwert trewq rewq qwer wert ewrt',
            targetChars: ['q', 'w', 'e', 'r', 't'],
            type: 'repetition',
            minAccuracy: 85,
          },
          {
            id: 'l2-e2',
            title: 'Top + Home Row Left',
            instruction: 'Mix home and top row for the left hand.',
            text: 'qaf was dew fer ast qsd ewrf qwert asdf trewq qwer wert',
            targetChars: ['q', 'w', 'e', 'r', 't', 'a', 's', 'd', 'f'],
            type: 'word-practice',
            minAccuracy: 83,
          },
        ],
      },
      {
        id: 'l2-right',
        levelId: 2,
        order: 2,
        title: 'Right Top Row: Y U I O P',
        description: 'Train your right hand to reach Y, U, I, O, P.',
        objective: 'Type Y U I O P fluently from home position.',
        targetChars: ['y', 'u', 'i', 'o', 'p'],
        tips: [
          'Y and U are your right index finger.',
          'I is middle, O is ring, P is pinky.',
          'Reach up and snap back to home!',
        ],
        exercises: [
          {
            id: 'l2-e3',
            title: 'Y U I O P Intro',
            instruction: 'Practice each key with deliberate finger movements.',
            text: 'yuiop yuiop poiuy poiuy yuio uiop iopy poiu oyui',
            targetChars: ['y', 'u', 'i', 'o', 'p'],
            type: 'repetition',
            minAccuracy: 85,
          },
          {
            id: 'l2-e4',
            title: 'Full Top Row',
            instruction: 'Type the complete top row with both hands.',
            text: 'qwerty uiop qwerty uiop poiuytrewq qwerty yuiop type your words here',
            targetChars: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            type: 'word-practice',
            minAccuracy: 82,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Bottom Row',
    subtitle: 'Z X C V B — N M , . /',
    icon: '⬇️',
    description: 'The bottom row requires downward finger curling. These keys are used less frequently but are essential for a full typing vocabulary.',
    color: '#22c55e',
    lessons: [
      {
        id: 'l3-intro',
        levelId: 3,
        order: 1,
        title: 'Bottom Row Keys',
        description: 'Learn to reach Z X C V B N M , . / from home position.',
        objective: 'Type bottom row keys without looking at the keyboard.',
        targetChars: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
        tips: [
          'Curl your fingers downward to reach bottom row keys.',
          'Z is left pinky, X ring, C middle, V and B index.',
          'N and M are right index, , is middle, . ring, / pinky.',
          'Keep wrists elevated for comfortable reaching.',
        ],
        exercises: [
          {
            id: 'l3-e1',
            title: 'Left Bottom: Z X C V B',
            instruction: 'Practice left bottom row keys.',
            text: 'zxcvb zxcvb bvcxz zxcv xcvb cvbz vbzx bzcv zxcvb',
            targetChars: ['z', 'x', 'c', 'v', 'b'],
            type: 'repetition',
            minAccuracy: 83,
          },
          {
            id: 'l3-e2',
            title: 'Right Bottom: N M , . /',
            instruction: 'Practice right bottom row keys.',
            text: 'nm., nm., .,mn nm,. n,m. ,nm. m,n. ./nm nm,./',
            targetChars: ['n', 'm', ',', '.', '/'],
            type: 'repetition',
            minAccuracy: 83,
          },
          {
            id: 'l3-e3',
            title: 'Mixed Bottom Row Words',
            instruction: 'Type these words using bottom row keys mixed with others.',
            text: 'can vim box zinc mix cab back neck verb zinc box can mix',
            targetChars: ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
            type: 'word-practice',
            minAccuracy: 82,
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Full Alphabet',
    subtitle: 'All 26 Letters',
    icon: '🔤',
    description: 'Bring all three rows together and practice the complete alphabet with common words and basic sentences.',
    color: '#f97316',
    lessons: [
      {
        id: 'l4-words',
        levelId: 4,
        order: 1,
        title: 'Common Words Practice',
        description: 'Practice high-frequency English words using all letters.',
        objective: 'Type common words fluently using all keyboard rows.',
        targetChars: 'abcdefghijklmnopqrstuvwxyz'.split(''),
        tips: [
          'Focus on accuracy first, speed will come naturally.',
          'Try to keep your eyes on the screen, not the keyboard.',
          'Take short breaks if your hands feel tense.',
        ],
        exercises: [
          {
            id: 'l4-e1',
            title: 'Most Common 50 Words',
            instruction: 'Type these high-frequency English words.',
            text: 'the and for you are but not all can her was one our out day get has him his how its may new now old see two way who',
            targetChars: 'abcdefghijklmnopqrstuvwxyz'.split(''),
            type: 'word-practice',
            minAccuracy: 85,
          },
          {
            id: 'l4-e2',
            title: 'Basic Sentences',
            instruction: 'Type simple sentences using the full alphabet.',
            text: 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.',
            targetChars: 'abcdefghijklmnopqrstuvwxyz'.split(''),
            type: 'sentence-practice',
            minAccuracy: 85,
          },
        ],
      },
    ],
  },
  {
    id: 5,
    title: 'Numbers',
    subtitle: 'The Number Row',
    icon: '🔢',
    description: 'Master the number row at the top of the keyboard. Each digit is typed by stretching upward from the top letter row.',
    color: '#eab308',
    lessons: [
      {
        id: 'l5-numbers',
        levelId: 5,
        order: 1,
        title: 'Number Row 1–5',
        description: 'Learn numbers 1, 2, 3, 4, 5 typed with the left hand.',
        objective: 'Type numbers 1-5 without looking.',
        targetChars: ['1', '2', '3', '4', '5'],
        tips: [
          '1 = left pinky, 2 = ring, 3 = middle, 4 and 5 = index.',
          'Stretch your fingers upward from the top letter row.',
          'Practice number sequences before mixing with letters.',
        ],
        exercises: [
          {
            id: 'l5-e1',
            title: 'Numbers 1 to 5',
            instruction: 'Type number sequences for the left hand.',
            text: '12345 54321 12345 12334 21345 31245 41235 51234 12345',
            targetChars: ['1', '2', '3', '4', '5'],
            type: 'repetition',
            minAccuracy: 85,
          },
          {
            id: 'l5-e2',
            title: 'Numbers 6 to 0',
            instruction: 'Practice numbers for the right hand.',
            text: '67890 09876 67890 76890 86790 96780 06789 67890 09876',
            targetChars: ['6', '7', '8', '9', '0'],
            type: 'repetition',
            minAccuracy: 85,
          },
          {
            id: 'l5-e3',
            title: 'Full Number Row',
            instruction: 'Type all numbers in various sequences.',
            text: '1234567890 9876543210 1357924680 2468013579 1029384756 5647382910',
            targetChars: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            type: 'timed-drill',
            minAccuracy: 83,
            timeLimitSeconds: 60,
          },
        ],
      },
    ],
  },
  {
    id: 6,
    title: 'Symbols & Punctuation',
    subtitle: 'Beyond the Alphabet',
    icon: '!@#',
    description: 'Learn to type punctuation and common symbols fluently. These are essential for writing real text.',
    color: '#ec4899',
    lessons: [
      {
        id: 'l6-punct',
        levelId: 6,
        order: 1,
        title: 'Core Punctuation',
        description: 'Master period, comma, colon, semicolon, question mark, and exclamation mark.',
        objective: 'Use punctuation naturally within sentences.',
        targetChars: ['.', ',', ':', ';', '?', '!'],
        tips: [
          'Comma and period are right middle and ring fingers.',
          'Semicolon is your right pinky on the home row.',
          'Shift + semicolon = colon; Shift + / = question mark.',
          'Shift + 1 = exclamation mark.',
        ],
        exercises: [
          {
            id: 'l6-e1',
            title: 'Comma and Period',
            instruction: 'Type sentences focusing on comma and period placement.',
            text: 'Hello, world. Good morning, everyone. The cat sat, rested, and slept. Done.',
            targetChars: [',', '.'],
            type: 'sentence-practice',
            minAccuracy: 85,
          },
          {
            id: 'l6-e2',
            title: 'Question and Exclamation',
            instruction: 'Practice ending sentences with ? and !',
            text: 'Are you ready? Let us go! How are you? Great! Is this fun? Yes it is!',
            targetChars: ['?', '!'],
            type: 'sentence-practice',
            minAccuracy: 83,
          },
        ],
      },
    ],
  },
  {
    id: 7,
    title: 'Mixed Typing',
    subtitle: 'Letters, Numbers & Symbols',
    icon: '🔀',
    description: 'Combine everything learned so far — letters, numbers, and symbols — for realistic typing practice.',
    color: '#00b4d8',
    lessons: [
      {
        id: 'l7-mixed',
        levelId: 7,
        order: 1,
        title: 'Real World Mixed Text',
        description: 'Type mixed content typical of everyday writing.',
        objective: 'Switch fluidly between letters, numbers, and symbols.',
        targetChars: [],
        tips: [
          'Anticipate what type of character comes next.',
          'For numbers and symbols, brace your hand for a reach.',
          'Keep your speed steady — do not rush symbols.',
        ],
        exercises: [
          {
            id: 'l7-e1',
            title: 'Mixed Sequences',
            instruction: 'Type this mixed content accurately.',
            text: 'My order is: 3 apples, 2 bananas, and 1 mango. Total: $6.50. Thanks!',
            targetChars: [],
            type: 'sentence-practice',
            minAccuracy: 82,
          },
          {
            id: 'l7-e2',
            title: 'Code-Like Text',
            instruction: 'Type this code-inspired mixed text.',
            text: 'for (let i = 0; i < 10; i++) { console.log(i + 1); } // prints 1 to 10',
            targetChars: [],
            type: 'sentence-practice',
            minAccuracy: 78,
          },
        ],
      },
    ],
  },
  {
    id: 8,
    title: 'Paragraph Practice',
    subtitle: 'Rhythm & Muscle Memory',
    icon: '📝',
    description: 'Type short, structured paragraphs to build rhythm, muscle memory, and sustained focus.',
    color: '#52b788',
    lessons: [
      {
        id: 'l8-para',
        levelId: 8,
        order: 1,
        title: 'Short Paragraphs',
        description: 'Practice flowing paragraphs with natural rhythm.',
        objective: 'Maintain consistent accuracy through a full paragraph.',
        targetChars: [],
        tips: [
          'Read a few words ahead as you type.',
          'Do not stop at mistakes — keep your rhythm.',
          'Focus on the flow, not individual characters.',
        ],
        exercises: [
          {
            id: 'l8-e1',
            title: 'Nature Paragraph',
            instruction: 'Type this short paragraph with steady rhythm.',
            text: 'The morning sun rose slowly over the hills, painting the sky in shades of orange and pink. Birds began to sing, and the world slowly woke up. A gentle breeze rustled the leaves in the old oak tree by the path.',
            targetChars: [],
            type: 'paragraph-practice',
            minAccuracy: 88,
          },
          {
            id: 'l8-e2',
            title: 'Tech Paragraph',
            instruction: 'Type this paragraph about technology.',
            text: 'Computers have changed the way we live and work. Every day, millions of people use them to write, create, and communicate. Learning to type quickly and accurately is one of the most valuable skills in the modern world.',
            targetChars: [],
            type: 'paragraph-practice',
            minAccuracy: 88,
          },
        ],
      },
    ],
  },
  {
    id: 9,
    title: 'Speed Development',
    subtitle: 'Faster, Sharper, Stronger',
    icon: '⚡',
    description: 'Push your speed while maintaining accuracy. Timed drills will reveal your weak spots and help you improve.',
    color: '#fb923c',
    lessons: [
      {
        id: 'l9-speed',
        levelId: 9,
        order: 1,
        title: 'Speed Drills',
        description: 'Timed exercises designed to push your WPM higher.',
        objective: 'Achieve 30+ WPM with 90%+ accuracy.',
        targetChars: [],
        tips: [
          'Speed comes from consistency, not rushing.',
          'Practice the same passage multiple times to build muscle memory.',
          'If accuracy drops below 85%, slow down a little.',
        ],
        exercises: [
          {
            id: 'l9-e1',
            title: '30 Second Burst',
            instruction: 'Type as fast and accurately as possible in 30 seconds.',
            text: 'the quick brown fox jumped over the lazy dog as the sun set behind the misty hills and the stars began to appear one by one in the clear dark sky above',
            targetChars: [],
            type: 'timed-drill',
            minAccuracy: 88,
            minWpm: 20,
            timeLimitSeconds: 30,
          },
          {
            id: 'l9-e2',
            title: '60 Second Challenge',
            instruction: 'Sustain your best speed for a full minute.',
            text: 'she sells seashells by the seashore and the shells she sells are surely seashells I am sure for if she sells shells on the seashore then I am sure she sells seashore shells',
            targetChars: [],
            type: 'timed-drill',
            minAccuracy: 88,
            minWpm: 25,
            timeLimitSeconds: 60,
          },
        ],
      },
    ],
  },
  {
    id: 10,
    title: 'Final Practice',
    subtitle: 'Graduate to the Real Test',
    icon: '🏆',
    description: 'Complete the beginner journey with full typing exercises matching the standard test. You are ready!',
    color: '#f59e0b',
    lessons: [
      {
        id: 'l10-final',
        levelId: 10,
        order: 1,
        title: 'Full Test Simulation',
        description: 'A complete typing exercise simulating the real TypeFuture test.',
        objective: 'Complete a full typing exercise with 90%+ accuracy at 30+ WPM.',
        targetChars: [],
        tips: [
          'You have come a long way! Trust your fingers.',
          'Stay relaxed, breathe normally.',
          'After completing this, try the real test at /test!',
        ],
        exercises: [
          {
            id: 'l10-e1',
            title: 'Final Graduation Exercise',
            instruction: 'Type this full paragraph — your graduation exercise!',
            text: 'Practice is the foundation of all skill. Every great typist started exactly where you are now — uncertain fingers, searching eyes, and slow words. Through repetition and patience, the keys become an extension of thought. Today you type words; tomorrow you will type ideas without a second thought. The keyboard is yours now. Go type your future.',
            targetChars: [],
            type: 'paragraph-practice',
            minAccuracy: 88,
            minWpm: 25,
          },
        ],
      },
    ],
  },
];

// ─── Achievement Definitions ──────────────────────────────────────────────────

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: {
    completedLessons: string[];
    highestAccuracy?: number;
    highestWpm?: number;
    highestLevel?: number;
  }) => boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first-lesson',
    title: 'First Step',
    description: 'Completed your very first lesson.',
    icon: '👶',
    condition: ({ completedLessons }) => completedLessons.length >= 1,
  },
  {
    id: 'home-row-master',
    title: 'Home Row Master',
    description: 'Completed all Level 1 – Home Row lessons.',
    icon: '🏠',
    condition: ({ highestLevel }) => (highestLevel ?? 0) >= 2,
  },
  {
    id: 'top-row-unlocked',
    title: 'Reaching Higher',
    description: 'Unlocked the Top Row level.',
    icon: '🔝',
    condition: ({ highestLevel }) => (highestLevel ?? 0) >= 3,
  },
  {
    id: 'accuracy-star',
    title: 'Accuracy Star',
    description: 'Achieved 95% or higher accuracy in a lesson.',
    icon: '🎯',
    condition: ({ highestAccuracy }) => (highestAccuracy ?? 0) >= 95,
  },
  {
    id: 'speed-racer',
    title: 'Speed Racer',
    description: 'Typed at 50 WPM or higher in a lesson.',
    icon: '⚡',
    condition: ({ highestWpm }) => (highestWpm ?? 0) >= 50,
  },
  {
    id: 'halfway-there',
    title: 'Halfway There',
    description: 'Completed 5 levels.',
    icon: '⭐',
    condition: ({ highestLevel }) => (highestLevel ?? 0) >= 6,
  },
  {
    id: 'graduate',
    title: 'TypeFuture Graduate',
    description: 'Completed all 10 beginner levels!',
    icon: '🏆',
    condition: ({ highestLevel }) => (highestLevel ?? 0) >= 10,
  },
  {
    id: 'first-paragraph',
    title: 'Full Story',
    description: 'Completed your first paragraph practice.',
    icon: '📖',
    condition: ({ completedLessons }) => completedLessons.some(id => id.startsWith('l8')),
  },
];
