/**
 * Shared audio feedback utilities — Web Audio API tone synthesis + Vibration API.
 * Zero assets, pure generated sounds tuned for dopamine micro-rewards.
 */

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || (window as any).webkitAudioContext;
  if (!AC) return null;
  return new AC();
}

export function playTone(ctx: AudioContext, freq: number, duration: number, type: OscillatorType = "sine", volume = 0.12) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

export function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

export function ensureAudioContext(ctxRef: { current: AudioContext | null }): AudioContext | null {
  if (!ctxRef.current || ctxRef.current.state === "closed") {
    ctxRef.current = getAudioContext();
  }
  if (ctxRef.current?.state === "suspended") {
    ctxRef.current.resume();
  }
  return ctxRef.current;
}
