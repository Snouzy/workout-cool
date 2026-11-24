/**
 * Height taken at the bottom of the viewport by an anchor ad, so the bottom navigation can sit
 * above it instead of under it.
 *
 * The ad network injects the anchor by itself, as a direct child of <html> or <body>, and names it
 * as it pleases. It is recognised by its shape rather than by its id: a fixed, nearly full-width
 * box docked to the bottom edge that holds an ad frame.
 */
export interface FixedBox {
  position: string;
  hidden: boolean;
  width: number;
  height: number;
  bottom: number;
  holdsAd: boolean;
}

export interface Viewport {
  width: number;
  height: number;
}

const MIN_HEIGHT = 30;
const MIN_WIDTH_RATIO = 0.8;
// A taller box is an interstitial or a modal, not an anchor: the navigation stays where it is.
const MAX_HEIGHT_RATIO = 0.5;
const DOCK_TOLERANCE = 2;

export function bottomAdOffset(boxes: FixedBox[], viewport: Viewport): number {
  let offset = 0;

  for (const box of boxes) {
    if (box.position !== "fixed" || box.hidden || !box.holdsAd) continue;
    if (box.width < viewport.width * MIN_WIDTH_RATIO) continue;
    if (box.height < MIN_HEIGHT || box.height > viewport.height * MAX_HEIGHT_RATIO) continue;
    if (Math.abs(box.bottom - viewport.height) > DOCK_TOLERANCE) continue;

    offset = Math.max(offset, Math.round(box.height));
  }

  return offset;
}
