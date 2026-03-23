"use client";

import { useCallback, useRef } from "react";
import { playTone, vibrate, ensureAudioContext } from "@/shared/lib/audio-feedback";

/** Satisfying "pick up" — high-pitched pop */
function playPickUp(ctx: AudioContext) {
  playTone(ctx, 880, 0.06, "sine", 0.1);
  setTimeout(() => playTone(ctx, 1100, 0.04, "sine", 0.06), 30);
}

/** Snappy "place" — descending thud */
function playPlace(ctx: AudioContext) {
  playTone(ctx, 600, 0.08, "sine", 0.12);
  setTimeout(() => playTone(ctx, 400, 0.1, "sine", 0.08), 40);
}

/** Tiny "tick" when crossing another item */
function playTick(ctx: AudioContext) {
  playTone(ctx, 700, 0.025, "sine", 0.05);
}

/** Shuffle whoosh — quick frequency sweep */
function playShuffle(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
}

/** Soft delete pop */
function playDelete(ctx: AudioContext) {
  playTone(ctx, 500, 0.05, "sine", 0.08);
  setTimeout(() => playTone(ctx, 300, 0.08, "triangle", 0.06), 25);
}

export function useDragFeedback() {
  const ctxRef = useRef<AudioContext | null>(null);
  const lastOverIdRef = useRef<string | null>(null);

  const ensureCtx = useCallback(() => ensureAudioContext(ctxRef), []);

  const onPickUp = useCallback(() => {
    const ctx = ensureCtx();
    if (ctx) playPickUp(ctx);
    vibrate(8);
    lastOverIdRef.current = null;
  }, [ensureCtx]);

  const onPlace = useCallback(() => {
    const ctx = ensureCtx();
    if (ctx) playPlace(ctx);
    vibrate([5, 5, 10]);
    lastOverIdRef.current = null;
  }, [ensureCtx]);

  const onCrossItem = useCallback(
    (overId: string | null) => {
      if (!overId || overId === lastOverIdRef.current) return;
      lastOverIdRef.current = overId;
      const ctx = ensureCtx();
      if (ctx) playTick(ctx);
      vibrate(3);
    },
    [ensureCtx],
  );

  const onShuffle = useCallback(() => {
    const ctx = ensureCtx();
    if (ctx) playShuffle(ctx);
    vibrate([3, 3, 6]);
  }, [ensureCtx]);

  const onDelete = useCallback(() => {
    const ctx = ensureCtx();
    if (ctx) playDelete(ctx);
    vibrate(5);
  }, [ensureCtx]);

  return { onPickUp, onPlace, onCrossItem, onShuffle, onDelete };
}
