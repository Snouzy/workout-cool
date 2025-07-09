# AGENTS.md - Development Guide for AI Coding Agents

## Build/Test Commands

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production bundle
- `pnpm lint` - Run ESLint (no test framework detected)
- `pnpm db:seed` - Seed database with sample data
- `tsx scripts/[script-name].ts` - Run TypeScript scripts directly

## Architecture & Structure

- **Next.js 15** with App Router, **Feature-Sliced Design (FSD)**
- Structure: `features/[feature]/[model|schema|ui|lib]/` for business logic
- `src/components/ui/` for reusable UI, `src/shared/` for cross-cutting concerns
- Use **Server Components** by default, `'use client'` only when needed

## Code Style & Conventions

- **TypeScript** with strict mode, functional programming patterns
- **Named exports only** (no default exports for components)
- **kebab-case** for directories, **camelCase** for variables, **PascalCase** for components
- Use `interface` over `type`, avoid `enum` (use `as const` objects)
- Double quotes (`"`) enforced, 140 char line limit, no trailing commas

## Import Organization (enforced by ESLint)

```typescript
// External libraries (alphabetical desc)
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Internal modules
import { useI18n } from "locales/client";
import { Button } from "@/components/ui/button";
import { paths } from "@/shared/constants/paths";
```

## Key Patterns

- **Zod schemas** for validation in `schema/` directories
- **React Hook Form** with zodResolver for forms
- **next-safe-action** for server actions with typed errors
- **@tanstack/react-query** for client state management
- **Shadcn UI + Radix + Tailwind** for styling (mobile-first)
- Abstract external deps in `shared/lib/` (no direct fetch, Date, localStorage)
