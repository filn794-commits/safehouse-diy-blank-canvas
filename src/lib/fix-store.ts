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

export const LEAKY_PIPE_FIX: FixData = {
  title: "Leaking Under-Sink Supply Pipe",
  difficulty: 2,
  estimatedTime: "25 minutes",
  tools: [
    { name: "Adjustable Wrench", emoji: "🔧" },
    { name: "Plumber's Tape", emoji: "🩹" },
    { name: "Dry Towel", emoji: "🧻" },
    { name: "Flashlight", emoji: "🔦" },
  ],
  steps: [
    "Shut the supply valve under the sink (turn it clockwise until firm)",
    "Dry the pipe completely so you can see exactly where the water starts",
    "Loosen the compression nut, wrap the threads with 3 turns of plumber's tape",
    "Retighten snugly, turn the water back on, and watch the joint for 2 minutes",
  ],
};

export const RUNNING_TOILET_FIX: FixData = {
  title: "Running / Constantly Refilling Toilet",
  difficulty: 1,
  estimatedTime: "15 minutes",
  tools: [
    { name: "Rubber Gloves", emoji: "🧤" },
    { name: "Sponge", emoji: "🧽" },
    { name: "Replacement Flapper", emoji: "🚽" },
  ],
  steps: [
    "Lift the tank lid off and set it somewhere flat and safe",
    "Check whether the rubber flapper is warped or not sealing the drain hole",
    "Shut the water valve, flush to empty, and clip in the new flapper",
    "Turn the water back on and confirm the tank stops filling on its own",
  ],
};

export const WARM_AC_FIX: FixData = {
  title: "AC Blowing Warm Air",
  difficulty: 2,
  estimatedTime: "20 minutes",
  tools: [
    { name: "New Air Filter", emoji: "🌬️" },
    { name: "Garden Hose", emoji: "💧" },
    { name: "Flashlight", emoji: "🔦" },
  ],
  steps: [
    "Set the thermostat to COOL and the fan to AUTO, then wait 5 minutes",
    "Swap in a clean air filter — a clogged filter freezes the coil",
    "Check the breaker panel for a tripped AC or condenser breaker",
    "Gently rinse leaves and dust off the outdoor condenser fins",
  ],
};

type Rule = { keywords: string[]; fix: FixData };

/** Simple keyword router so the demo returns different results per description. */
const RULES: Rule[] = [
  { keywords: ["toilet", "flush", "tank", "running water"], fix: RUNNING_TOILET_FIX },
  { keywords: ["ac", "a/c", "air condition", "hvac", "warm air", "cooling"], fix: WARM_AC_FIX },
  { keywords: ["leak", "leaking", "drip", "dripping", "pipe", "wet"], fix: LEAKY_PIPE_FIX },
  {
    keywords: ["clog", "clogged", "drain", "backing up", "backup", "sink", "smelly", "slow"],
    fix: CLOGGED_DRAIN_FIX,
  },
];

export function matchFix(text: string): FixData {
  const t = text.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((k) => t.includes(k))) return rule.fix;
  }
  return CLOGGED_DRAIN_FIX;
}

type State = { fix: FixData; justAnalyzed: boolean };

const STORAGE_KEY = "pocketpro.fix.v1";

const SERVER_STATE: State = { fix: DEFAULT_FIX, justAnalyzed: false };
let state: State = SERVER_STATE;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.fix));
  } catch {
    /* storage unavailable */
  }
}

let hydrated = false;
function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const fix = JSON.parse(raw) as FixData;
    if (fix && Array.isArray(fix.steps) && fix.title) {
      state = { ...state, fix };
      emit();
    }
  } catch {
    /* ignore corrupt storage */
  }
}

export const fixStore = {
  subscribe(l: () => void) {
    hydrate();
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get() {
    return state;
  },
  getServerSnapshot() {
    return SERVER_STATE;
  },
  setFix(fix: FixData, justAnalyzed = true) {
    state = { fix, justAnalyzed };
    persist();
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
  return useSyncExternalStore(fixStore.subscribe, fixStore.get, fixStore.getServerSnapshot);
}
