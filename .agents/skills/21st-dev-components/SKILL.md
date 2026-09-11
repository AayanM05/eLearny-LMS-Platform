---
name: 21st-dev-components
description: Guide for discovering, generating, installing, and customizing high-end React UI components from 21st.dev using 21st.dev CLI and MCP server in the eLearny LMS web application.
---

# 21st.dev Component Integration Skill — eLearny LMS

This skill provides operational guidance for sourcing modern, interactive React components from **21st.dev** via the local MCP server or CLI, and adapting them to the **eLearny LMS** design system (`frontend/web`).

---

## 1. MCP Server Configuration

The 21st.dev MCP server is configured in `.agents/mcp_config.json`:

```json
{
  "mcpServers": {
    "21st-dev": {
      "command": "npx",
      "args": ["-y", "@21st-dev/cli@latest", "mcp", "serve"]
    }
  }
}
```

---

## 2. CLI Workflow & Installation

When adding a new component from 21st.dev:

```bash
# Add a component directly using 21st.dev CLI
npx @21st-dev/cli@latest add <component-slug>
```

---

## 3. Customization Standards for eLearny

When importing or copying code from 21st.dev:

1. **Color Token Alignment**: Replace default blue/purple accent classes with Terracotta Orange tokens (`bg-primary`, `text-primary`, `border-primary/30`, `#D96B43`).
2. **Typography**: Ensure headings inside 21st.dev components use `font-heading` (`Space Grotesk`) or `font-display` (`Anton`).
3. **Tailwind Utilities**: Ensure `cn()` helper from `@/lib/utils` is used for conditional class merging.
4. **GSAP Coexistence**: If the 21st.dev component uses Framer Motion, it can coexist with GSAP or be enhanced with `useGSAP` for timeline orchestration.
