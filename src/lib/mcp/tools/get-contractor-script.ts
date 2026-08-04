import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { ISSUES, type IssueId } from "@/lib/repair-data";

export default defineTool({
  name: "get_contractor_script",
  title: "Get a contractor phone script",
  description:
    "Get the word-for-word script to read to a contractor or dispatcher for a given repair job, plus anti-upsell tips.",
  inputSchema: {
    issue_id: z
      .enum(["clogged-drain", "water-heater", "ac-warm"])
      .describe("Repair job id from list_common_issues."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ issue_id }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const issue = ISSUES[issue_id as IssueId];
    const result = { issue: issue.label, script: issue.script, tips: issue.tips };
    return {
      content: [{ type: "text", text: `${result.script}\n\nTips:\n- ${issue.tips.join("\n- ")}` }],
      structuredContent: result,
    };
  },
});
