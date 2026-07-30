import type { Transition } from "framer-motion";

/**
 * Motion vocabulary for the peptide calculator widget.
 *
 * Springs, not fixed-duration keyframes, for anything a user can touch:
 * framer-motion's `bounce` + `duration` map onto Apple's damping + response.
 * `bounce: 0` is critically damped — it settles without overshoot, which is
 * what a value readout wants. Nothing on this page is a flick or a drag, so
 * no gesture here carries momentum and no animation is given bounce.
 */
export const SPRING: Transition = { type: "spring", bounce: 0, duration: 0.35 };

/**
 * Same spring, longer response. Reserved for the vial liquid level, which is a
 * large slow-moving mass rather than a control responding to a press.
 */
export const SPRING_SLOW: Transition = { type: "spring", bounce: 0, duration: 0.55 };

/** Press feedback: fires on pointer-down, ~100 ms, deliberately not a spring. */
export const PRESS: Transition = { duration: 0.1, ease: "easeOut" };
export const PRESS_SCALE = 0.97;

/** `prefers-reduced-motion` fallback: a short opacity cross-fade, no transform, no spring. */
export const FADE: Transition = { duration: 0.15, ease: "linear" };

/** Instant, for values that must still be positioned correctly under reduced motion. */
export const INSTANT: Transition = { duration: 0 };

/** Seconds for one full loop of the ambient vial label marquee. Slow on purpose. */
export const MARQUEE_SECONDS = 24;
