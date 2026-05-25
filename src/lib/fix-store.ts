import { useSyncExternalStore } from "react";

export type FixData = {
  title: string;
  difficulty: number;
  estimatedTime: string;
  tools: { name: string; emoji: string }[];
  steps: string[];
};

const DEFAULT_FIX: FixData = {
  title: "Fix a Dripping Sink Drain",
  difficulty: 2,
  estimatedTime: "20 minutes",
  tools: [
    { name: "Adjustable Wrench", emoji: "🔧" },
    { name: "Bucket", emoji: "🪣" },
    { name: "Old Towel", emoji: "🧻" },
    { name: "Plumber's Tape", emoji: "🩹" },
  ],
  steps: [
    "Clear everything from under the sink and put a bucket below the pipes.",
    "Turn off the water using the valves under the sink (turn clockwise).",
    "Unscrew the slip nut on the leaking joint by hand or with the wrench.",
    "Wrap plumber's tape clockwise around the threads (3 turns).",
    "Tighten the nut back on — snug, but don't overtighten.",
    "Turn the water back on and watch for drips. You did it!",
  ],
};

export const CLOGGED_DRAIN_FIX: FixData = {
  title: "Clogged Main Kitchen Drain Line",
  difficulty: 3,
  estimatedTime: "30 minutes",
  tools: [
    { name: "Bucket", emoji: "🪣" },
    { name: "Channel Pliers", emoji: "🔧" },
    { name: "Rubber Gloves", emoji: "🧤" },
    { name: "Old Towels", emoji: "🧻" },
  ],
  steps: [
    "Locate the cleanout valve under the sink",
    "Place a bucket underneath to catch spills",
    "Slowly unscrew the P-trap to clear the debris",
  ],
};

type State = { fix: FixData; justAnalyzed: boolean };

let state: State = { fix: DEFAULT_FIX, justAnalyzed: false };
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export const fixStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get() {
    return state;
  },
  setFix(fix: FixData, justAnalyzed = true) {
    state = { fix, justAnalyzed };
    emit();
  },
  clearJustAnalyzed() {
    if (state.justAnalyzed) {
      state = { ...state, justAnalyzed: false };
      emit();
    }
  },
};

export function useFix(): State {
  return useSyncExternalStore(fixStore.subscribe, fixStore.get, fixStore.get);
}
