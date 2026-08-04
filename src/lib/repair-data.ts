/**
 * Shared repair reference data used by both the app UI and the MCP tools.
 * Pure data — safe to import from the browser and from server/MCP code.
 */

export type IssueId = "clogged-drain" | "water-heater" | "ac-warm";

export type Issue = {
  id: IssueId;
  label: string;
  emoji: string;
  averageLow: number;
  averageHigh: number;
  dangerOver: number;
  script: string;
  tips: string[];
  breakdown: string[];
};

export const ISSUES: Record<IssueId, Issue> = {
  "clogged-drain": {
    id: "clogged-drain",
    label: "Clogged Main Drain",
    emoji: "🚿",
    averageLow: 150,
    averageHigh: 300,
    dangerOver: 350,
    script:
      "Hi, I have a standard 3-inch mainline backup. I need a straightforward mainline snake clearing. Please confirm your flat fee for this service before sending a technician.",
    tips: [
      "Refuse a 'camera inspection upsell' before the snake is even tried.",
      "Get the flat fee in writing by text before they arrive.",
    ],
    breakdown: [
      "Phoenix trip / dispatch fee: $59 - $89 (often waived with repair)",
      "Standard labor rate: $95 - $135 per hour",
      "Typical job time: 1 - 1.5 hours",
      "Snake / cable equipment: included in flat fee",
    ],
  },
  "water-heater": {
    id: "water-heater",
    label: "Leaking Water Heater",
    emoji: "🔥",
    averageLow: 220,
    averageHigh: 450,
    dangerOver: 600,
    script:
      "Hi, I have a 40-gallon water heater with a visible leak. I need a diagnostic visit with a written quote before any repair or replacement. Please confirm your diagnostic fee and that it will be credited toward the repair.",
    tips: [
      "Don't agree to full replacement without a second opinion.",
      "Ask the age of the unit — if under 8 years, repair is usually fine.",
    ],
    breakdown: [
      "Phoenix trip / diagnostic fee: $75 - $99",
      "Standard labor rate: $110 - $150 per hour",
      "Typical job time: 2 - 3 hours",
      "Common parts (T&P valve, element): $25 - $90",
    ],
  },
  "ac-warm": {
    id: "ac-warm",
    label: "AC Blowing Warm Air",
    emoji: "❄️",
    averageLow: 150,
    averageHigh: 400,
    dangerOver: 500,
    script:
      "Hi, my central AC is running but blowing warm air. I need a standard diagnostic visit with a written quote before any refrigerant is added or parts are replaced. Please confirm your diagnostic fee in writing.",
    tips: [
      "Never approve refrigerant top-off without finding the leak first.",
      "Reject 'whole system replacement' pitches on the first visit.",
    ],
    breakdown: [
      "Phoenix trip / diagnostic fee: $69 - $99 (higher in July/August)",
      "Standard labor rate: $100 - $145 per hour",
      "Typical job time: 1 - 2 hours",
      "Capacitor replacement: $150 - $250 installed",
    ],
  },
};

export const ISSUE_LIST = Object.values(ISSUES);

export type Risk = "green" | "yellow" | "red";

export function riskOf(quote: number, issue: Issue): Risk {
  if (quote <= issue.averageHigh) return "green";
  if (quote < issue.dangerOver) return "yellow";
  return "red";
}

export const RISK_LABEL: Record<Risk, string> = {
  green: "Fair Deal",
  yellow: "Get a Second Opinion",
  red: "High Scam Risk",
};

/** Beginner-friendly DIY guides surfaced in the Fix tab. */
export type Guide = {
  id: string;
  title: string;
  difficulty: number;
  estimatedTime: string;
  tools: string[];
  steps: string[];
};

export const GUIDES: Guide[] = [
  {
    id: "dripping-sink-drain",
    title: "Fix a Dripping Sink Drain",
    difficulty: 2,
    estimatedTime: "20 minutes",
    tools: ["Adjustable wrench", "Bucket", "Old towel", "Plumber's tape"],
    steps: [
      "Clear everything from under the sink and put a bucket below the pipes.",
      "Turn off the water using the valves under the sink (turn clockwise).",
      "Unscrew the slip nut on the leaking joint by hand or with the wrench.",
      "Wrap plumber's tape clockwise around the threads (3 turns).",
      "Tighten the nut back on — snug, but don't overtighten.",
      "Turn the water back on and watch for drips.",
    ],
  },
  {
    id: "clogged-kitchen-drain",
    title: "Clogged Main Kitchen Drain Line",
    difficulty: 3,
    estimatedTime: "30 minutes",
    tools: ["Bucket", "Channel pliers", "Rubber gloves", "Old towels"],
    steps: [
      "Locate the cleanout valve under the sink",
      "Place a bucket underneath to catch spills",
      "Slowly unscrew the P-trap to clear the debris",
    ],
  },
];
