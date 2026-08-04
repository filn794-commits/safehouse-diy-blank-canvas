import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { ISSUES, RISK_LABEL, riskOf, type IssueId } from "@/lib/repair-data";

export default defineTool({
  name: "check_quote",
  title: "Check a contractor quote",
  description:
    "Judge whether a contractor quote is a fair deal, worth a second opinion, or a likely scam, using Phoenix-area labor rates.",
  inputSchema: {
    issue_id: z
      .enum(["clogged-drain", "water-heater", "ac-warm"])
      .describe("Repair job id from list_common_issues."),
    quote_amount: z.number().positive().describe("The contractor's quoted price in US dollars."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ issue_id, quote_amount }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const issue = ISSUES[issue_id as IssueId];
    const risk = riskOf(quote_amount, issue);
    const result = {
      issue: issue.label,
      quote: quote_amount,
      verdict: RISK_LABEL[risk],
      risk,
      fairPriceRange: `$${issue.averageLow} - $${issue.averageHigh}`,
      scamOver: issue.dangerOver,
      breakdown: issue.breakdown,
      tips: issue.tips,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});
