import { create } from 'zustand';

// ─── Vocabulary Data ─────────────────────────────────────────────────────────

export type Category = 'colors' | 'animals' | 'fruits' | 'classroom' | 'body' | 'actions';

export interface VocabWord {
  id: string;
  word: string;
  emoji: string;
  category: Category;
  color: string; // accent color for the card
}

export const VOCABULARY: Record<Category, VocabWord[]> = {
  colors: [
    { id: 'red', word: 'Red', emoji: '🔴', category: 'colors', color: '#EF4444' },
    { id: 'blue', word: 'Blue', emoji: '🔵', category: 'colors', color: '#3B82F6' },
    { id: 'green', word: 'Green', emoji: '🟢', category: 'colors', color: '#22C55E' },
    { id: 'yellow', word: 'Yellow', emoji: '🟡', category: 'colors', color: '#EAB308' },
  ],
  animals: [
    { id: 'dog', word: 'Dog', emoji: '🐶', category: 'animals', color: '#F97316' },
    { id: 'cat', word: 'Cat', emoji: '🐱', category: 'animals', color: '#A855F7' },
    { id: 'bird', word: 'Bird', emoji: '🐦', category: 'animals', color: '#06B6D4' },
    { id: 'monkey', word: 'Monkey', emoji: '🐵', category: 'animals', color: '#D97706' },
  ],
  fruits: [
    { id: 'apple', word: 'Apple', emoji: '🍎', category: 'fruits', color: '#EF4444' },
    { id: 'banana', word: 'Banana', emoji: '🍌', category: 'fruits', color: '#EAB308' },
    { id: 'orange', word: 'Orange', emoji: '🍊', category: 'fruits', color: '#F97316' },
  ],
  classroom: [
    { id: 'pencil', word: 'Pencil', emoji: '✏️', category: 'classroom', color: '#EAB308' },
    { id: 'book', word: 'Book', emoji: '📚', category: 'classroom', color: '#3B82F6' },
    { id: 'chair', word: 'Chair', emoji: '🪑', category: 'classroom', color: '#8B5CF6' },
  ],
  body: [
    { id: 'head', word: 'Head', emoji: '👤', category: 'body', color: '#F97316' },
    { id: 'hands', word: 'Hands', emoji: '👐', category: 'body', color: '#EC4899' },
    { id: 'feet', word: 'Feet', emoji: '🦶', category: 'body', color: '#14B8A6' },
  ],
  actions: [
    { id: 'jump', word: 'Jump', emoji: '🤸', category: 'actions', color: '#EF4444' },
    { id: 'run', word: 'Run', emoji: '🏃', category: 'actions', color: '#22C55E' },
    { id: 'clap', word: 'Clap', emoji: '👏', category: 'actions', color: '#A855F7' },
  ],
};

export const CATEGORIES_ORDER: Category[] = [
  'colors', 'animals', 'fruits', 'classroom', 'body', 'actions',
];

export const CATEGORY_LABELS: Record<Category, string> = {
  colors: 'Colors 🎨',
  animals: 'Animals 🐾',
  fruits: 'Fruits 🍎',
  classroom: 'Classroom 📚',
  body: 'Body Parts 🙌',
  actions: 'Actions 🏃',
};

export const CATEGORY_BG: Record<Category, string> = {
  colors: '#FEF3C7',
  animals: '#FEE2E2',
  fruits: '#DCFCE7',
  classroom: '#DBEAFE',
  body: '#F3E8FF',
  actions: '#FCE7F3',
};

// ─── Badge / Reward Types ─────────────────────────────────────────────────────

export interface Badge {
  id: string;
  label: string;
  emoji: string;
  unlocked: boolean;
}

const INITIAL_BADGES: Badge[] = [
  { id: 'explorer', label: 'Explorer', emoji: '🧭', unlocked: false },
  { id: 'speaker', label: 'Speaker', emoji: '🎤', unlocked: false },
  { id: 'matcher', label: 'Matcher', emoji: '🔗', unlocked: false },
  { id: 'builder', label: 'Builder', emoji: '🏗️', unlocked: false },
  { id: 'hero', label: 'Mission Hero', emoji: '🦸', unlocked: false },
  { id: 'champion', label: 'Champion', emoji: '🏆', unlocked: false },
];

// ─── Evaluation / Analytics ───────────────────────────────────────────────────

export interface EvalRecord {
  wordId: string;
  category: Category;
  level: number;
  correct: boolean;
  attempts: number;
  timestamp: number;
}

// ─── Game Store ───────────────────────────────────────────────────────────────

export type GameScreen =
  | 'splash'
  | 'home'
  | 'category_select'
  | 'level_intro'
  | 'level1'
  | 'level2'
  | 'level3'
  | 'level4'
  | 'level5'
  | 'celebration'
  | 'teacher_panel';

export interface GameState {
  // Navigation
  screen: GameScreen;
  setScreen: (s: GameScreen) => void;

  // Game progress
  activeCategory: Category;
  setCategory: (c: Category) => void;
  currentLevel: number;
  setLevel: (l: number) => void;

  // Scoring
  points: number;
  addPoints: (n: number) => void;
  streak: number;
  incrementStreak: () => void;
  resetStreak: () => void;

  // Badges
  badges: Badge[];
  unlockBadge: (id: string) => void;

  // Mode
  mode: 'individual' | 'cooperative';
  setMode: (m: 'individual' | 'cooperative') => void;

  // Current word in play
  currentWordIndex: number;
  setWordIndex: (i: number) => void;

  // Feedback state
  lastAnswerCorrect: boolean | null;
  setLastAnswer: (v: boolean | null) => void;

  // Evaluation records
  evalRecords: EvalRecord[];
  addEvalRecord: (r: EvalRecord) => void;

  // Session stats
  correctThisSession: number;
  incorrectThisSession: number;

  // Guide messages
  guideMessage: string;
  setGuideMessage: (msg: string) => void;

  // Reset
  resetSession: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  screen: 'splash',
  setScreen: (screen) => set({ screen }),

  activeCategory: 'colors',
  setCategory: (activeCategory) => set({ activeCategory, currentWordIndex: 0 }),
  currentLevel: 1,
  setLevel: (currentLevel) => set({ currentLevel }),

  points: 0,
  addPoints: (n) => set((s) => ({ points: s.points + n })),
  streak: 0,
  incrementStreak: () => set((s) => ({ streak: s.streak + 1 })),
  resetStreak: () => set({ streak: 0 }),

  badges: INITIAL_BADGES,
  unlockBadge: (id) =>
    set((s) => ({
      badges: s.badges.map((b) => (b.id === id ? { ...b, unlocked: true } : b)),
    })),

  mode: 'individual',
  setMode: (mode) => set({ mode }),

  currentWordIndex: 0,
  setWordIndex: (currentWordIndex) => set({ currentWordIndex }),

  lastAnswerCorrect: null,
  setLastAnswer: (lastAnswerCorrect) => set({ lastAnswerCorrect }),

  evalRecords: [],
  addEvalRecord: (r) => set((s) => ({ evalRecords: [...s.evalRecords, r] })),

  correctThisSession: 0,
  incorrectThisSession: 0,

  guideMessage: "Let's explore the Magic English Island! 🏝️",
  setGuideMessage: (guideMessage) => set({ guideMessage }),

  resetSession: () =>
    set({
      points: 0,
      streak: 0,
      currentWordIndex: 0,
      lastAnswerCorrect: null,
      correctThisSession: 0,
      incorrectThisSession: 0,
    }),
}));
