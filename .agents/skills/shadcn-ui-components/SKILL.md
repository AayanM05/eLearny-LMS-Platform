---
name: shadcn-ui-components
description: Guide for adding, configuring, and extending Shadcn UI primitives (Radix UI + Tailwind CSS) using the Shadcn MCP server and CLI for eLearny LMS.
---

# Shadcn UI Components Skill — eLearny LMS

This skill provides workflow guidelines for installing, customizing, and extending **Shadcn UI** component primitives in `frontend/web/src/components/ui/`.

---

## 1. MCP Server & CLI Configuration

The Shadcn MCP server is registered in `.agents/mcp_config.json`:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@latest", "mcp", "serve"]
    }
  }
}
```

---

## 2. Component Installation & CLI Execution

To install new primitives into `frontend/web/src/components/ui/`:

```bash
# Execute within frontend/web
npx shadcn@latest add button dialog dropdown-menu tabs avatar card badge sheet toast form
```

---

## 3. Customization & Theme Rules

1. **Theme Tokens**: All Shadcn components derive styles from `src/app/globals.css`. Ensure primary buttons and active tabs use `--primary: 17 66% 56%`.
2. **Component File Location**: Standard primitives reside in `@/components/ui/<component-name>.tsx`.
3. **Compound Components**: Combine Shadcn primitives (`Button`, `Card`, `Badge`) with GSAP `useGSAP` or `<BrandLogo>` for feature sections.
4. **Radix Accessibility**: Retain Radix UI accessibility attributes (`aria-*`, keyboard focus management) intact when adding GSAP refs or custom wrapper wrappers.
