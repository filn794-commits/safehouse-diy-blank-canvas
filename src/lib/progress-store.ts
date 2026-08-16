import { useSyncExternalStore } from "react";

export type BadgeId =
  | "leak-stopper"
  | "patch-pro"
  | "nail-it"
  | "spark-safe"
  | "lockmaster"
  | "helper"
  | "master-plumber";

type State = {
  xp: number;
  goal: number;
  unlocked: Set<BadgeId>;
  leveledUp: boolean; // overlay visible
  level: number;
  rankName: string;
  /** Bumped every time XP is awarded — lets the UI flash a "+XP" indicator. */
  lastGain: { amount: number; id: number } | null;
};

const STORAGE_KEY = "pocketpro.progress.v1";

const INITIAL: State = {
  xp: 350,
  goal: 500,
  unlocked: new Set<BadgeId>(["leak-stopper", "patch-pro", "nail-it"]),
  leveledUp: false,
  level: 2,
  rankName: "Apprentice Fixer",
  lastGain: null,
};

const listeners = new Set<() => void>();
let state: State = INITIAL;

function persist(s: State) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        xp: s.xp,
        goal: s.goal,
        unlocked: [...s.unlocked],
        level: s.level,
        rankName: s.rankName,
      }),
    );
  } catch {
    /* storage unavailable — keep in-memory state */
  }
}

let hydrated = false;
function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const p = JSON.parse(raw) as Partial<{
      xp: number;
      goal: number;
      unlocked: BadgeId[];
      level: number;
      rankName: string;
    }>;
    state = {
      ...state,
      xp: typeof p.xp === "number" ? p.xp : state.xp,
      goal: typeof p.goal === "number" ? p.goal : state.goal,
      unlocked: new Set<BadgeId>(p.unlocked ?? [...state.unlocked]),
      level: typeof p.level === "number" ? p.level : state.level,
      rankName: p.rankName ?? state.rankName,
    };
    emit();
  } catch {
    /* ignore corrupt storage */
  }
}

function emit() {
  for (const l of listeners) l();
}

function setState(updater: (s: State) => State) {
  state = updater(state);
  persist(state);
  emit();
}

let gainId = 0;

export const progressStore = {
  subscribe(listener: () => void) {
    hydrate();
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  get() {
    return state;
  },
  addXp(amount: number) {
    setState((s) => {
      const newXp = Math.min(s.goal, s.xp + amount);
      const leveled = newXp >= s.goal && s.xp < s.goal;
      return {
        ...s,
        xp: newXp,
        leveledUp: leveled || s.leveledUp,
        level: leveled ? s.level + 1 : s.level,
        rankName: leveled ? "Home Captain" : s.rankName,
        lastGain: { amount, id: ++gainId },
      };
    });
  },
  removeXp(amount: number) {
    setState((s) => ({ ...s, xp: Math.max(0, s.xp - amount) }));
  },
  dismissLevelUp() {
    setState((s) => {
      const unlocked = new Set(s.unlocked);
      unlocked.add("master-plumber");
      return { ...s, leveledUp: false, unlocked };
    });
  },
  unlockBadge(id: BadgeId) {
    setState((s) => {
      const unlocked = new Set(s.unlocked);
      unlocked.add(id);
      return { ...s, unlocked };
    });
  },
  reset() {
    setState(() => ({ ...INITIAL, unlocked: new Set(INITIAL.unlocked) }));
  },
};

export function useProgress(): State {
  return useSyncExternalStore(
    progressStore.subscribe,
    progressStore.get,
    () => INITIAL,
  );
}
