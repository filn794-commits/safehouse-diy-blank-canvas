/**
 * Deterministic safety-first triage for PocketPro AI.
 * No AI, no randomness: same answers always produce the same single result.
 */

export type CategoryId =
  | "water"
  | "electrical"
  | "hvac"
  | "structure"
  | "quote"
  | "unsure";

export type Category = {
  id: CategoryId;
  label: string;
  emoji: string;
  hint: string;
};

export const CATEGORIES: Category[] = [
  { id: "water", label: "Water / plumbing", emoji: "💧", hint: "Leaks, drains, toilets, water heater" },
  { id: "electrical", label: "Electricity", emoji: "⚡", hint: "Outlets, breakers, lights, wiring" },
  { id: "hvac", label: "Heating or cooling", emoji: "🌡️", hint: "Furnace, AC, thermostat, vents" },
  { id: "structure", label: "Door, wall, or window", emoji: "🚪", hint: "Doors, drywall, windows, ceilings" },
  { id: "quote", label: "Contractor quote", emoji: "🧾", hint: "Someone gave you a price to check" },
  { id: "unsure", label: "I'm not sure", emoji: "❓", hint: "Describe it and we'll guide you" },
];

export type QuestionId =
  | "gas"
  | "fire"
  | "waterElectric"
  | "sewage"
  | "structural"
  | "spreading"
  | "shutoff"
  | "worseFast"
  | "comfortable";

export type Question = {
  id: QuestionId;
  text: string;
  help?: string;
  redFlag: boolean;
  /** Only asked for these categories; empty means always asked. */
  categories?: CategoryId[];
};

/** Asked in order. Red-flag questions come first. */
export const QUESTIONS: Question[] = [
  {
    id: "gas",
    text: "Do you smell gas or fuel, or is a carbon-monoxide alarm going off?",
    help: "Rotten-egg smell, propane, or a beeping CO alarm.",
    redFlag: true,
  },
  {
    id: "fire",
    text: "Is there smoke, sparks, a burning smell, or did anyone get a shock?",
    help: "Includes scorch marks or an outlet that is hot to the touch.",
    redFlag: true,
  },
  {
    id: "waterElectric",
    text: "Is water touching an outlet, an appliance, or exposed wiring?",
    help: "Water dripping into a light, panel, or plugged-in appliance.",
    redFlag: true,
  },
  {
    id: "sewage",
    text: "Is sewage or waste water backing up into the home?",
    redFlag: true,
  },
  {
    id: "structural",
    text: "Is a ceiling bulging, or is any wall, floor, or beam moving or sagging?",
    redFlag: true,
  },
  {
    id: "spreading",
    text: "Is water spreading quickly and you cannot stop it?",
    redFlag: true,
  },
  {
    id: "shutoff",
    text: "Have you already shut off the water or power to the problem area?",
    redFlag: false,
    categories: ["water", "electrical", "hvac", "unsure"],
  },
  {
    id: "worseFast",
    text: "Is the problem getting worse day by day?",
    redFlag: false,
  },
  {
    id: "comfortable",
    text: "Do you feel comfortable using basic hand tools for a small fix?",
    redFlag: false,
  },
];

export function questionsFor(category: CategoryId): Question[] {
  return QUESTIONS.filter((q) => !q.categories || q.categories.includes(category));
}

export type Answers = Partial<Record<QuestionId, boolean>>;

export type OutcomeId = "emergency" | "pro" | "diy" | "monitor";

export type Outcome = {
  id: OutcomeId;
  title: string;
  why: string;
  nextAction: string[];
  doNot: string[];
};

const HIGH_RISK_CATEGORIES: CategoryId[] = ["electrical"];

export function triage(category: CategoryId, answers: Answers): Outcome {
  const redFlags = QUESTIONS.filter((q) => q.redFlag && answers[q.id] === true);

  if (redFlags.length > 0) {
    return {
      id: "emergency",
      title: "Get safe first",
      why: `You told us: ${redFlags.map((q) => redFlagSummary(q.id)).join("; ")}. That is an immediate safety risk, not a repair task.`,
      nextAction: [
        "Get everyone, including pets, out of the affected area now.",
        "From outside or a safe room, call 911 or your gas/utility emergency line.",
        "Only if it is safe to reach, shut off the main water or main breaker on your way out.",
      ],
      doNot: [
        "Do not stay inside to take photos or videos.",
        "Do not flip switches, light a flame, or plug anything in.",
        "Do not try to repair, patch, or clean it yourself.",
      ],
    };
  }

  if (category === "quote") {
    return {
      id: "pro",
      title: "Call a qualified professional soon",
      why: "You are checking a contractor's price, so a licensed pro is already involved. The goal now is a fair, written scope.",
      nextAction: [
        "Ask for the quote in writing with parts and labor listed separately.",
        "Get a second quote from a licensed, insured contractor.",
        "Confirm the flat fee before anyone is dispatched.",
      ],
      doNot: [
        "Do not pay in full up front or in cash.",
        "Do not approve extra work verbally on the spot.",
      ],
    };
  }

  const worse = answers.worseFast === true;
  const comfortable = answers.comfortable === true;
  const contained = answers.shutoff === true;
  const highRisk = HIGH_RISK_CATEGORIES.includes(category);

  if (highRisk || (worse && !comfortable)) {
    return {
      id: "pro",
      title: "Call a qualified professional soon",
      why: highRisk
        ? "Electrical work sits behind walls and inside panels, so even a small mistake can start a fire. This is licensed-pro work."
        : "The problem is getting worse and you are not comfortable doing the repair, so waiting will likely cost more.",
      nextAction: [
        "Book a licensed, insured pro in the next day or two.",
        contained
          ? "Keep the water or power to that area off until they arrive."
          : "Find and label the shutoff for that area so you can stop it fast.",
        "Photograph the area from a safe distance for your records and insurance.",
      ],
      doNot: [
        "Do not open panels, walls, or sealed equipment yourself.",
        "Do not let anyone start work without a written price.",
      ],
    };
  }

  if (comfortable && !worse) {
    return {
      id: "diy",
      title: "Safe DIY candidate",
      why: "No red flags, the problem is stable, and you are comfortable with basic hand tools. This is the kind of small fix a beginner can do safely.",
      nextAction: [
        "Shut off the water or power to that fixture before you touch anything.",
        "Lay down a bucket and towels, then work one step at a time.",
        "Stop and call a pro if you see wiring, gas lines, or water that will not stop.",
      ],
      doNot: [
        "Do not force a stuck fitting or over-tighten a nut.",
        "Do not work on anything still connected to power or pressure.",
      ],
    };
  }

  return {
    id: "monitor",
    title: "Monitor and plan",
    why: worse
      ? "There are no red flags, but the problem is slowly getting worse, so it needs a plan rather than an emergency call."
      : "There are no red flags and the problem is stable, so you have time to watch it and plan the repair.",
    nextAction: [
      "Take a dated photo today and again in a few days to compare.",
      "Put a towel, tray, or bucket under it to catch drips.",
      "Get a quote this week so you are not deciding under pressure.",
    ],
    doNot: [
      "Do not ignore it for months — small leaks become ceiling damage.",
      "Do not paint or cover over a damp or stained area.",
    ],
  };
}

function redFlagSummary(id: QuestionId): string {
  switch (id) {
    case "gas":
      return "a gas/fuel smell or CO alarm";
    case "fire":
      return "smoke, sparks, burning smell, or a shock";
    case "waterElectric":
      return "water touching electricity";
    case "sewage":
      return "sewage backing up";
    case "structural":
      return "a bulging ceiling or structural movement";
    case "spreading":
      return "water spreading rapidly";
    default:
      return "a safety risk";
  }
}
