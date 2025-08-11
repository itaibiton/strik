## Strik Frontend Code Review (by GPT‑5)

### TL;DR (Top priorities)
- Fix authentication middleware: declare public routes so anonymous users can play.
- Ensure Convex game session completes for every game end path (wrong answer and time-up).
- Tighten answer matching (avoid partial matches like "ron" ⇒ "ronaldo"); use `normalizeAnswer`.
- Remove remaining `any`, improve generics, and bump TS targets. Add `typecheck`, `format`, stricter lint.
- Respect reduced motion; gate infinite/background animations and heavy glows.
- Clean up CSS duplication and global `*` transitions that can hurt performance.

---

### Stack & structure
- **Framework**: Next.js 15 (App Router), React 19
- **Styling**: Tailwind CSS v4; theme tokens/utilities in `src/app/@theme.css` + `src/app/globals.css`
- **UI**: Radix primitives; custom `Button`, `Card`, `Input`, `Dialog`, `Progress`, `Toast` with `cva`
- **Animations**: Framer Motion with shared variants in `ui/motion-primitives.tsx`
- **State**: Zustand (persisted subset)
- **Auth**: Clerk
- **Data**: Convex (via `ConvexProviderWithClerk`)
- **TS**: strict; path alias `@/*`

What’s working well:
- Cohesive design system; components have consistent props/variants and thoughtful motion polish.
- App Router metadata present; strong separation of concerns (state vs UI).
- Convex + Clerk wiring is clear; leaderboard uses server data with good loading states.

Main opportunities: auth routing, session finalization, validation strictness, type hygiene, a11y/perf polish, and DX scripts.

---

### Auth & routing
File: `src/middleware.ts`
- Current: `export default clerkMiddleware();` with a broad matcher. This often requires auth everywhere.
- Likely intent: let guests play and view leaderboard; sign-in enhances features.

Recommendation: declare explicit public routes.

```ts
// src/middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  publicRoutes: [
    '/',
    '/game',
    '/leaderboard',
    '/api/webhooks(.*)',
  ],
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
};
```

Adjust the list to match your intended UX.

---

### Convex game session lifecycle (consistency bug)
File: `src/store/gameStore.ts`
- `endGame(convexClient?)` finalizes the session when a client is provided.
- On wrong answers and timer expiry, `endGame()` is invoked without passing the client, so sessions may not complete on the backend.
  - Wrong answer: `submitAnswer` calls `get().endGame()` without args.
  - Time-up: `Timer` triggers `onTimeUp` in `game/page.tsx` and passes the client, but `updateTimer` also calls `endGame()` without args; drift is easy here.

Recommendation (pick one):
- Thread the Convex client through store APIs and always pass it when ending:
  - `submitAnswer(answer, convexClient?)` and `updateTimer(time, convexClient?)` → call `endGame(convexClient)`.
- Or store the client inside the store on `startGame(..., convexClient)` and use `get().convexClient` in `endGame()`.

Either approach ensures server stats are updated for every end path.

---

### Answer matching strictness (avoid false positives)
File: `src/store/gameStore.ts`
- Current matching uses bidirectional substring checks, which accepts partials (e.g., "ron" → "ronaldo") and can conflate similar names.

Recommendation:
- Use strict normalized equality with your existing `normalizeAnswer` utility (`src/lib/utils.ts`).
- Optional: add small edit-distance tolerance for typos.

Example:
```ts
const normalized = normalizeAnswer(answer);
const isCorrect = question.acceptedAnswers
  .map(normalizeAnswer)
  .some(acc => acc === normalized);
```

---

### TypeScript quality & config
- Remove `any`:
  - `convexClient?: any` → use `ConvexReactClient` (from `convex/react`) or a typed mutation client interface.
- Improve generics:
  - In `LeaderboardFilters`, use a key-safe generic:
    ```ts
    function updateFilter<K extends keyof LeaderboardFilters>(key: K, value: LeaderboardFilters[K]) {
      onFiltersChange({ ...filters, [key]: value });
    }
    ```
- `tsconfig.json` improvements:
  - `target`: use `ES2022` (or `ES2020+`) to match modern Next/React.
  - Consider enabling: `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `useUnknownInCatchVariables`, `noImplicitOverride`.
  - Add `verbatimModuleSyntax: true` to align with modern ESM typing.

---

### Linting, formatting, and scripts (DX)
- ESLint: Currently `extends: next/core-web-vitals` in `.eslintrc.json` — good baseline.
  - Consider migrating to ESLint flat config later for fine-grained TS/React 19 rules when needed.
  - Add rules for a11y (`eslint-plugin-jsx-a11y`) and import hygiene (`eslint-plugin-import` sorted settings) if desired.
- Prettier: No config found.
  - Add Prettier to keep code style consistent, especially with Tailwind class sorting handled by v4 core (no plugin required now).
- Scripts (add in `package.json`):
  ```json
  {
    "scripts": {
      "typecheck": "tsc --noEmit",
      "lint:fix": "next lint --fix",
      "format": "prettier . --check",
      "format:write": "prettier . --write",
      "check": "pnpm -s typecheck && pnpm -s lint && pnpm -s format"
    }
  }
  ```

---

### Accessibility & motion
- Many components use infinite/background animations and glow effects. Provide a degraded experience when users prefer reduced motion.
  - Use `useReducedMotion()` from Framer Motion to disable animation variants and shimmer/glow effects when `true`.
  - Example pattern:
    ```ts
    const prefersReducedMotion = useReducedMotion();
    const animate = prefersReducedMotion ? {} : { opacity: 1, scale: 1 };
    ```
- Buttons with icon-only content (e.g., the hint `HelpCircle` button) should include `aria-label`.
- Ensure focus states are visible on all interactive elements (you already have strong focus rings; good).

---

### Performance opportunities
- Global transitions:
  - In `globals.css`, there is a global `* { transition-property: color, background-color, border-color, box-shadow; ... }`.
  - This can cause excessive style recalculation and jank. Scope transitions to key components or utility classes instead of `*`.
- Background/infinite animations and heavy shadows/glows are used widely. Consider:
  - Reducing the number of animated elements per page.
  - Disabling expensive effects on mobile/low-power via CSS media (e.g., `prefers-reduced-motion`) or breakpoints.
- Use `next/image` for any avatars or static images you introduce (you have domains configured already in `next.config.js`).

---

### CSS/theming hygiene
Files: `src/app/globals.css`, `src/app/@theme.css`
- Duplicated utilities:
  - `.btn-premium` appears twice in `globals.css`. Deduplicate to a single definition.
  - Animation classes like `.animate-float`/`bounce-gentle` exist in both files with different timings; unify to a single source of truth to avoid confusion.
- Consider moving large theme tokens to `@theme.css` and keeping `globals.css` for layer composition and small utilities.

---

### UI component consistency
- File naming: `Button.tsx` (PascalCase) vs `card.tsx`, `input.tsx` (lowercase). Standardize to one convention (commonly PascalCase for component files) for discoverability.
- Naming collision: You export `MotionButton` from both `ui/Button.tsx` and `ui/motion-primitives.tsx`.
  - This is confusing to consumers. Consider renaming the primitive one to `MotionButtonPrimitive` or similar, or only export motion wrappers from the UI files.

---

### Next.js metadata & SEO
- You set global `metadata` in `src/app/layout.tsx` — great.
- Consider adding:
  - OG image generation (static or dynamic route) for richer shares.
  - `robots` and `alternates` (canonical) if you plan multi-route SEO.
  - Page-specific metadata on `/leaderboard` and `/game` with succinct descriptions.

---

### State persistence and migrations
- The persisted Zustand slice includes `user` and `usedQuestionIds`.
  - `user.achievements` contain `Date` (`unlockedAt?`). JSON persistence serializes dates to strings.
  - If you plan to use that date later, add a versioned `migrate` function to parse back to `Date` or store timestamps.
- Consider adding `version` and `migrate` in `persist` options to protect against future shape changes.

---

### Testing suggestions
- Add lightweight tests where it pays off most:
  - Unit: `normalizeAnswer`, `calculateScore`, strict answer matching, and any future fuzzy matching logic (Vitest).
  - Component: key UI atoms like `Button` variants render correct classes (React Testing Library with JSDOM).
  - E2E: one happy-path flow (home → start → answer → game over) with Playwright.

---

### Small nits & quick wins
- `src/app/game/page.tsx`: you destructure `updateTimer` from the store but don’t use it. Remove from destructuring (and consider removing the action entirely if unused).
- `src/components/convex-client-provider.tsx`:
  - Throwing at module top-level if `NEXT_PUBLIC_CONVEX_URL` is missing is okay for client-only modules, but safer to guard inside the component to avoid accidental build-time exceptions. At minimum, convert to a console warning in dev and render children without Convex.
- `next.config.js`: You’ve whitelisted image domains; leverage `next/image` once avatars/images are introduced.
- `src/components/auth-header.tsx`: Consider adding `aria-label` to the left/back/close icon buttons and to any icon-only controls.

---

### Example diffs you might apply (high level)
- Auth public routes in `middleware.ts` (see snippet above).
- Tighten answer validation in `submitAnswer` to use `normalizeAnswer` and equality.
- Thread Convex client consistently to `endGame` from `submitAnswer` and timer paths.
- Deduplicate `.btn-premium` and unify `animate-*` utilities to a single file.
- Add scripts and Prettier config; optionally add a minimal `.prettierignore` (e.g., `.next`, `node_modules`).

---

### Final thoughts
You’ve built a polished, cohesive UI with a strong design system and modern Next.js stack. Addressing the few correctness gaps (session finalization and answer matching), plus a11y/perf hygiene and DX scripts, will make this production-ready and maintainable as you grow features like additional modes, avatars, and richer leaderboards.
