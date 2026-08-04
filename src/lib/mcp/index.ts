import { auth, defineMcp } from "@lovable.dev/mcp-js";

import checkQuoteTool from "./tools/check-quote";
import getContractorScriptTool from "./tools/get-contractor-script";
import listCommonIssuesTool from "./tools/list-common-issues";
import getRepairGuideTool from "./tools/get-repair-guide";

// The OAuth issuer must be the direct Supabase auth host. The project ref is
// inlined at build time by Vite; the sentinel only keeps the URL well-formed
// during the throwaway manifest-extract evaluation.
const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "pocketpro-ai",
  title: "PocketPro AI",
  version: "0.1.0",
  instructions:
    "Tools from PocketPro AI, a home-repair guidance app. Use `list_common_issues` to see supported repair jobs, `check_quote` to judge whether a contractor quote is fair for Phoenix-area rates, `get_contractor_script` for word-for-word phone scripts, and `get_repair_guide` for step-by-step DIY instructions.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listCommonIssuesTool,
    checkQuoteTool,
    getContractorScriptTool,
    getRepairGuideTool,
  ],
});
