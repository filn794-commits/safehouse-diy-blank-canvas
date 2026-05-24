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
};

const listeners = new Set<() => void>();
let state: State = {
  xp: 350,
  goal: 500,
  unlocked: new Set<BadgeId>(["leak-stopper", "patch-pro", "nail-it"]),
  leveledUp: false,
  level: 2,
  rankName: "Apprentice Fixer",
};

function emit() {
  for (const l of listeners) l();
}

function setState(updater: (s: State) => State) {
  state = updater(state);
  emit();
}

export const progressStore = {
  subscribe(listener: () => void) {
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
};

export function useProgress(): State {
  return useSyncExternalStore(
    progressStore.subscribe,
    progressStore.get,
    progressStore.get,
  );
}
