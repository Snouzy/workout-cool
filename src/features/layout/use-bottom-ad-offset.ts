"use client";

import { useEffect } from "react";

import { bottomAdOffset, type FixedBox } from "./bottom-ad-offset";

export const BOTTOM_AD_OFFSET_VAR = "--wc-bottom-ad-offset";

const AD_FRAME_SELECTOR = "iframe[id^=google_ads_iframe], iframe[id^=aswift]";

function injectedRoots(): HTMLElement[] {
  const candidates = [...Array.from(document.documentElement.children), ...Array.from(document.body.children)];

  return candidates.filter(
    (element): element is HTMLElement => element instanceof HTMLElement && element !== document.body && element !== document.head,
  );
}

function toFixedBox(element: HTMLElement): FixedBox {
  const style = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  const adFrame = element.querySelector(AD_FRAME_SELECTOR);

  // While an interstitial is up, the network hides the anchor's shell but leaves its ad frame
  // visible: the anchor still covers the bottom of the screen, so it still counts.
  const shownElement = style.visibility === "hidden" && adFrame ? adFrame : element;

  return {
    position: style.position,
    hidden: style.display === "none" || window.getComputedStyle(shownElement).visibility === "hidden",
    width: rect.width,
    height: rect.height,
    bottom: rect.bottom,
    holdsAd: element.tagName === "INS" || adFrame !== null,
  };
}

/**
 * Publishes the height of the anchor ad docked to the bottom of the viewport as a CSS variable on
 * <html>. Zero when there is none, which is the case on every app screen.
 */
export function useBottomAdOffset() {
  useEffect(() => {
    const root = document.documentElement;
    let watched: HTMLElement[] = [];
    let frame = 0;
    let published = -1;

    const sizeObserver = new ResizeObserver(() => schedule());
    const attributeObserver = new MutationObserver(() => schedule());

    const measure = () => {
      frame = 0;

      const roots = injectedRoots();

      // An overlay can become fixed after it is appended, and the anchor changes height when its
      // creative rotates or when the visitor collapses it: watch every injected root.
      if (roots.length !== watched.length || roots.some((element, index) => element !== watched[index])) {
        sizeObserver.disconnect();
        attributeObserver.disconnect();
        roots.forEach((element) => {
          sizeObserver.observe(element);
          attributeObserver.observe(element, { attributes: true, attributeFilter: ["style", "class"] });
        });
        watched = roots;
      }

      const offset = bottomAdOffset(roots.map(toFixedBox), { width: window.innerWidth, height: window.innerHeight });
      if (offset !== published) {
        published = offset;
        root.style.setProperty(BOTTOM_AD_OFFSET_VAR, `${offset}px`);
      }
    };

    function schedule() {
      if (frame === 0) frame = window.requestAnimationFrame(measure);
    }

    // Ad scripts append their overlays next to the app, never inside it.
    const childObserver = new MutationObserver(() => schedule());
    childObserver.observe(document.documentElement, { childList: true });
    childObserver.observe(document.body, { childList: true });

    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      childObserver.disconnect();
      sizeObserver.disconnect();
      attributeObserver.disconnect();
      root.style.removeProperty(BOTTOM_AD_OFFSET_VAR);
    };
  }, []);
}
