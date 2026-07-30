/**
 * Shared class fragments for the calculator widget.
 *
 * `MONO` exists because this project's Tailwind config replaces `fontFamily` wholesale and
 * ships no `mono` family — `font-mono` compiles to nothing here. Geist Mono is already
 * loaded by the root layout as a CSS variable, so an arbitrary family utility is the way to
 * reach it without changing the global config (46 other `font-mono` usages across the tools
 * pages would start rendering differently the day that key is added).
 *
 * Same reason for the greys: DaisyUI's `base-*` colours are plain CSS variables, so
 * `text-base-content/60` and friends compile to nothing. Muted text therefore comes from the
 * Tailwind palette, which the design tokens map onto exactly (`gray-700` is the `#6B7280`
 * of the handoff).
 */
export const MONO = "font-[family-name:var(--font-geist-mono)]";

/** Secondary copy: hints, captions, units, tile keys. */
export const MUTED = "text-gray-700 dark:text-gray-600";
