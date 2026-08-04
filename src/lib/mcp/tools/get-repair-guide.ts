import { ToolError, defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { GUIDES } from "@/lib/repair-data";

export default defineTool({
  name: "get_repair_guide",
  title: "Get a step-by-step repair guide",
  description:
    "Get a beginner-friendly DIY repair guide with difficulty level, tool list, and numbered steps. Omit guide_id to list every available guide.",
  inputSchema: {
    guide_id: z
      .string()
      .optional()
      .describe("Guide id, e.g. 'clogged-kitchen-drain'. Omit to list all guides."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ guide_id }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    if (!guide_id) {
      const guides = GUIDES.map((g) => ({ id: g.id, title: g.title, difficulty: g.difficulty }));
      return {
        content: [{ type: "text", text: JSON.stringify(guides, null, 2) }],
        structuredContent: { guides },
      };
    }
    const guide = GUIDES.find((g) => g.id === guide_id);
    if (!guide) {
      throw new ToolError(`No guide with id "${guide_id}". Call get_repair_guide with no id to list them.`);
    }
    return {
      content: [{ type: "text", text: JSON.stringify(guide, null, 2) }],
      structuredContent: { guide },
    };
  },
});
