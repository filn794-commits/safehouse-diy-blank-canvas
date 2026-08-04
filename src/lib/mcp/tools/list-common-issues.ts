import { defineTool } from "@lovable.dev/mcp-js";

import { ISSUE_LIST } from "@/lib/repair-data";

export default defineTool({
  name: "list_common_issues",
  title: "List common repair issues",
  description:
    "List the home repair jobs PocketPro AI covers, with their fair price ranges and scam danger thresholds.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const issues = ISSUE_LIST.map((i) => ({
      id: i.id,
      label: i.label,
      fairPriceRange: `$${i.averageLow} - $${i.averageHigh}`,
      scamOver: i.dangerOver,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(issues, null, 2) }],
      structuredContent: { issues },
    };
  },
});
