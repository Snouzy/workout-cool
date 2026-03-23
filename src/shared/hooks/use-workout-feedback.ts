"use client";

import { useCallback, useRef } from "react";

import { playTone, vibrate, ensureAudioContext } from "@/shared/lib/audio-feedback";

/**
 * Dopamine-tuned audio + haptic feedback for workout session interactions.
 *
 * Each sound is designed to reinforce a specific behaviour loop:
 * - finishSet  → strongest reward (Duolingo "ding!" equivalent)
 * - addSet     → light positive nudge
 * - nextExercise → forward-momentum whoosh
 * - finishWorkout → victory fanfare (pairs with confetti)
 * - deleteItem → soft descending cue
 * - tapButton  → generic subtle confirmation
 */

/** ✅ Set completed — ascending 3-note chime, the biggest dopamine hit */
function playFinishSet(ctx: AudioContext) {
  playTone(ctx, 523, 0.08, "sine", 0.12); // C5
  setTimeout(() => playTone(ctx, 659, 0.08, "sine", 0.1), 70); // E5
  setTimeout(() => playTone(ctx, 784, 0.12, "sine", 0.14), 140); // G5
}

/** ➕ Add set — quick upward pop */
function playAddSet(ctx: AudioContext) {
  playTone(ctx, 660, 0.05, "sine", 0.08);
  setTimeout(() => playTone(ctx, 880, 0.04, "sine", 0.06), 30);
}

/** ➡️ Next exercise — forward sweep */
function playNextExercise(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(500, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.12);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.18);
}

/** 🏆 Workout complete — 5-note ascending victory fanfare */
function playFinishWorkout(ctx: AudioContext) {
  const notes = [523, 587, 659, 784, 1047]; // C5 D5 E5 G5 C6
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(ctx, freq, 0.15, "sine", 0.12), i * 80);
  });
}

/** 🗑️ Delete — soft descending */
function playDeleteItem(ctx: AudioContext) {
  playTone(ctx, 500, 0.05, "sine", 0.08);
  setTimeout(() => playTone(ctx, 300, 0.08, "triangle", 0.06), 25);
}

/** 👆 Generic tap — subtle click */
function playTap(ctx: AudioContext) {
  playTone(ctx, 800, 0.03, "sine", 0.06);
}

export function useWorkoutFeedback() {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensureCtx = useCallback(() => ensureAudioContext(ctxRef), []);

  const onFinishSet = useCallback(() => {
    const ctx = ensureCtx();
    if (ctx) playFinishSet(ctx);
    vibrate([10, 5, 15]);
  }, [ensureCtx]);

  const onAddSet = useCallback(() => {
    const ctx = ensureCtx();
    if (ctx) playAddSet(ctx);
    vibrate(5);
  }, [ensureCtx]);

  const onNextExercise = useCallback(() => {
    const ctx = ensureCtx();
    if (ctx) playNextExercise(ctx);
    vibrate([5, 5, 8]);
  }, [ensureCtx]);

  const onFinishWorkout = useCallback(() => {
    const ctx = ensureCtx();
    if (ctx) playFinishWorkout(ctx);
    vibrate([10, 5, 10, 5, 20]);
  }, [ensureCtx]);

  const onDelete = useCallback(() => {
    const ctx = ensureCtx();
    if (ctx) playDeleteItem(ctx);
    vibrate(5);
  }, [ensureCtx]);

  const onTap = useCallback(() => {
    const ctx = ensureCtx();
    if (ctx) playTap(ctx);
    vibrate(3);
  }, [ensureCtx]);

  return { onFinishSet, onAddSet, onNextExercise, onFinishWorkout, onDelete, onTap };
}
