// ─── Cosmic Word Defense word lists ───────────────────────────────────────────

export const COSMIC_WORDS = {
  easy: [
    'cat','dog','run','fly','aim','hit','win','top','red','sky',
    'base','fire','jump','fast','cool','dark','star','ship','wave','beam',
    'line','grid','zone','boot','core','shot','link','data','flux','code',
    'scan','lock','mode','sync','echo','loop','node','port','risk','task',
  ],
  medium: [
    'laser','shield','turret','cannon','sector','patrol','target','vector',
    'plasma','rocket','energy','battle','weapon','defend','strike','attack',
    'system','module','deploy','engage','signal','binary','matrix','cipher',
    'sensor','radar','thrust','orbit','galaxy','nebula','photon','proton',
    'cluster','command','reactor','quantum','forward','mission','hostile',
  ],
  hard: [
    'trajectory','commander','interceptor','annihilate','bombardment',
    'hyperdrive','catastrophe','electromagnetic','supersonic','disintegrate',
    'coordinates','battlestation','reconnaissance','reinforcement','annihilation',
    'infrastructure','cybernetics','acceleration','invincibility','obliterate',
    'obliteration','disorientation','configuration','amplification','installation',
  ],
  boss: [
    'supernova','blackhole','doomsday','apocalypse','devastation','cataclysm',
    'armageddon','extinction','judgement','annihilator','megastructure',
    'hyperspace','singularity','wormhole','antimatter','gravitational',
  ],
};

// Words by length bucket (Cosmic easy/medium mix)
export function getCosmicWordForWave(wave: number): string {
  if (wave <= 2) return randomFrom(COSMIC_WORDS.easy);
  if (wave <= 5) return randomFrom([...COSMIC_WORDS.easy, ...COSMIC_WORDS.medium]);
  if (wave <= 9) return randomFrom(COSMIC_WORDS.medium);
  if (wave % 5 === 0) return randomFrom(COSMIC_WORDS.boss); // boss wave
  return randomFrom(COSMIC_WORDS.hard);
}

// ─── Arcane Typing Quest word lists ───────────────────────────────────────────

export const ARCANE_WORDS: Record<string, string[]> = {
  'mystic-forest': [
    'leaf','vine','bark','moss','dew','fern','oak','pine','root','sap',
    'thorn','grove','bower','hedge','glade','bloom','sprout','canopy','branch',
    'enchant','whisper','ancient','hidden','spirit','forest','magical','nature',
  ],
  'crystal-caverns': [
    'gem','ore','shard','quartz','amber','ruby','onyx','topaz','opal','jade',
    'crystal','mineral','prism','facet','lustre','glimmer','sparkle','bedrock',
    'stalactite','stalagmite','tunnel','cavern','echo','resonance','vibration',
  ],
  'ancient-library': [
    'tome','scroll','rune','glyph','sigil','cipher','lore','myth','tale','saga',
    'manuscript','incantation','forbidden','archives','knowledge','prophecy',
    'translation','annotation','bibliography','illuminated','parchment',
  ],
  'floating-kingdom': [
    'cloud','wind','soar','gust','drift','float','ascend','summit','peak','sky',
    'kingdom','castle','throne','noble','herald','banner','fortress','aerie',
    'stratosphere','celestial','ethereal','levitate','weightless','sovereign',
  ],
  'frozen-mountains': [
    'ice','snow','frost','blizzard','avalanche','glacier','tundra','crevasse',
    'permafrost','crystallize','hypothermia','subzero','frostbite','snowdrift',
    'mountaineer','expedition','treacherous','formidable','relentless','endure',
  ],
  'desert-ruins': [
    'sand','dune','relic','tomb','scarab','obelisk','hieroglyph','sarcophagus',
    'excavation','expedition','mirage','scorching','desolate','ancient','desert',
    'archaeology','preservation','civilization','monument','forgotten','eternal',
  ],
  'shadow-realm': [
    'dark','void','shade','wraith','specter','phantom','shadow','abyss','null',
    'corruption','malevolent','ominous','sinister','treachery','deception',
    'annihilation','oblivion','devastation','apocalyptic','catastrophic',
  ],
  'sky-temple': [
    'altar','divine','sacred','holy','celestial','radiant','blessed','ascended',
    'transcendent','enlightened','omniscient','omnipotent','eternal','infinite',
    'luminescence','magnificence','resplendent','incandescent','sovereignty',
  ],
};

// ─── Precision Trainer exercise patterns ──────────────────────────────────────

export const PRECISION_EXERCISES: Record<string, { name: string; words: string[]; keys: string[] }> = {
  home_row: {
    name: 'Home Row Mastery',
    keys: ['a','s','d','f','g','h','j','k','l'],
    words: [
      'ash','sad','had','gas','fad','lag','glad','dash','flask','flash',
      'clash','grass','glass','flags','shall','falls','halls','skills',
      'holds','sails','jails','fails','halls','calls','falls','galls',
    ],
  },
  top_row: {
    name: 'Top Row Precision',
    keys: ['q','w','e','r','t','y','u','i','o','p'],
    words: [
      'quit','wire','type','your','poet','tour','outer','quiet','write',
      'power','tower','water','tiger','unity','query','query','pretty',
      'poetry','twitter','require','property','equipment','priority',
    ],
  },
  bottom_row: {
    name: 'Bottom Row Control',
    keys: ['z','x','c','v','b','n','m'],
    words: [
      'zinc','exam','cave','vibrant','numb','maze','cabin','valve','maximize',
      'combine','vacuum','bronze','canvas','verbose','minimum','maximum',
      'vibrant','cabinet','mechanism','examination','navigation','combustion',
    ],
  },
  left_hand: {
    name: 'Left Hand Strength',
    keys: ['q','w','e','r','t','a','s','d','f','g','z','x','c','v','b'],
    words: [
      'vest','cart','bread','grace','water','great','after','first','refer',
      'brave','stage','trade','fever','craft','staff','straw','draft','waste',
      'sweat','craze','grave','brave','fever','stagger','gravel','scatter',
    ],
  },
  right_hand: {
    name: 'Right Hand Strength',
    keys: ['y','u','i','o','p','h','j','k','l','n','m'],
    words: [
      'hill','monk','only','pink','upon','hymn','join','milk','noun','pool',
      'loom','knoll','onion','youth','nylon','imply','nihil','plunk','union',
      'homily','employ','notify','punish','kimono','phenom','inform','jokingly',
    ],
  },
  common_digraphs: {
    name: 'Common Letter Pairs',
    keys: ['t','h','e','r','i','n','s'],
    words: [
      'the','there','their','these','then','them','they','this','that','with',
      'when','where','which','think','thing','three','other','after','often',
      'either','neither','whether','another','together','everything','something',
    ],
  },
  numbers_row: {
    name: 'Number Row',
    keys: ['1','2','3','4','5','6','7','8','9','0'],
    words: [
      'type 1', 'wave 2', 'round 3', 'level 4', 'floor 5',
      'score 100', 'wpm 75', 'accuracy 98', 'combo x5', '1000 points',
    ],
  },
  weak_fingers: {
    name: 'Pinky & Ring Strengthening',
    keys: ['q','a','z','p','l',';','/'],
    words: [
      'aqua','plaza','quasi','azure','pizza','plaque','qualm','zappers',
      'puzzle','apple','palate','pillars','peculiar','eloquent','qualifies',
    ],
  },
};

// ─── Utility ──────────────────────────────────────────────────────────────────

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomCosmicWord(difficulty: 'easy' | 'medium' | 'hard' | 'boss'): string {
  return randomFrom(COSMIC_WORDS[difficulty]);
}

export function getArcaneWords(region: string, count = 5): string[] {
  const pool = ARCANE_WORDS[region] ?? ARCANE_WORDS['mystic-forest'];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generatePrecisionExercise(
  targetKeys: string[],
  count = 20
): string {
  // Find exercise that covers the target keys
  const exercises = Object.values(PRECISION_EXERCISES);
  const best = exercises.find((e) =>
    targetKeys.some((k) => e.keys.includes(k))
  ) ?? exercises[0];
  const words = best.words.sort(() => Math.random() - 0.5).slice(0, count);
  return words.join(' ');
}
