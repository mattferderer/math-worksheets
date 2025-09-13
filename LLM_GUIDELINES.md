# AI contribution guide (LLM)

Short, practical rules to keep changes consistent with this repo.

## Project snapshot

- Stack: SolidStart (@solidjs/start) with SolidJS + TypeScript, TailwindCSS, Playwright for e2e tests, ESM modules.
- Routing: File-based under `src/routes`. Default export a Solid component from each route file (e.g., `math-problem-generator.tsx`).
- Components: Reusable UI in `src/components`.
- Styling: Tailwind utility classes. Includes print styles (e.g., `print:hidden`).

## Coding patterns

- Use SolidJS signals (`createSignal`) and primitives, not React hooks or external state libs.
- Keep TypeScript types/interfaces for component props and domain models.
- Use ESM imports (`import … from`); avoid `require`.
- Prefer small pure helpers colocated in the same file when domain-specific (e.g., `getAnswer`, `getRandomInt`).
- Keep Unicode operator symbols for display: `+`, `−`, `×`, `÷`.
- Preserve current accessibility and semantics (labels, `for`/`id` pairs, role attributes) used by tests.

## Routes & navigation

- New pages go in `src/routes/<name>.tsx` and export a default Solid component.
- Navigation lives in `src/components/Nav.tsx`. Active link uses `useLocation()` and exact path match.
- When adding a route, add a matching `<a href="/path">` in `Nav.tsx` and keep the active class logic unchanged.

## UI & Tailwind

- Keep existing class patterns and responsive/print utilities.
- Maintain minimal, semantic markup; prefer composition via small components under `src/components`.
- Inputs use stable `id` values referenced by `<label for="…">`—don’t rename without updating tests.

## Testing expectations (Playwright)

- Tests rely on:
  - `#problemType`, `#minNumber`, `#maxNumber`, `#numProblems`, `#showAnswers` ids.
  - The submit button selector `button[type="submit"]`.
  - Error message exposed via `[role="alert"]`.
  - Problem list under `section li` and answer cells with `.text-right`.
- If you change selectors or structure, update tests accordingly. Prefer leaving selectors intact.
- Keep generated output deterministic enough for count/visibility checks but allow randomness for values.

## Error handling & UX

- Check inputs on submit and reflect inline errors using the `Error` component with `role="alert"`.
- Disable actions when inputs are invalid (e.g., submit button disabled state).

## Print-friendly pages

- Honor existing `print:*` classes so worksheets print cleanly (hide nav; grid for problems; answer key toggle).

## Quality gates before finishing

- Typecheck builds with the current toolchain.
- Run e2e tests (Playwright) and ensure selectors still work.
- Keep bundle-size friendly: no large new deps.

## Do / Don’t

- Do: follow file-based routing, SolidJS idioms, Tailwind utilities, TypeScript types.
- Do: keep or improve accessibility (`label` + `id`, roles, focus styles).
- Do: prefer small, local helpers and clear names.
- Don’t: introduce CSS frameworks other than Tailwind or global CSS resets.
- Don’t: switch to CommonJS or React-style APIs.
- Don’t: break existing ids/classes used by tests.

## Notes spotted in current code

- The Playwright test `math-problem-generator.spec.ts` computes `allPositive` but doesn’t assert it. Consider adding an expectation, e.g., `expect(allPositive).toBe(true)`.
- The division generator comment mentions integer results, but current logic doesn’t guarantee divisibility; if you later add an option that ensures divisibility and integer results, gate it behind a setting without changing defaults.

## How to verify locally (optional)

```pwsh
# dev server
npm run dev

# build
npm run build

# tests
npm run test
```
