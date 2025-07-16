"use client";

import { useEffect } from "react";
import * as NProgress from "nprogress";

export type NextTopLoaderProps = {
  /**
   * Color for the TopLoader.
   * @default "#29d"
   */
  color?: string;
  /**
   * The initial position for the TopLoader in percentage, 0.08 is 8%.
   * @default 0.08
   */
  initialPosition?: number;
  /**
   * The increment delay speed in milliseconds.
   * @default 200
   */
  crawlSpeed?: number;
  /**
   * The height for the TopLoader in pixels (px).
   * @default 3
   */
  height?: number;
  /**
   * Auto increamenting behaviour for the TopLoader.
   * @default true
   */
  crawl?: boolean;
  /**
   * To show spinner or not.
   * @default true
   */
  showSpinner?: boolean;
  /**
   * Animation settings using easing (a CSS easing string).
   * @default "ease"
   */
  easing?: string;
  /**
   * Animation speed in ms for the TopLoader.
   * @default 200
   */
  speed?: number;
  /**
   * Defines a shadow for the TopLoader.
   * @default "0 0 10px ${color},0 0 5px ${color}"
   *
   * @ you can disable it by setting it to `false`
   */
  shadow?: string | false;
  /**
   * Timeout in ms before the TopLoader will appear.
   *
   * @default 0
   */
  delay?: number;
};

const isAnchorOfCurrentUrl = (currentUrl: string, newUrl: string) => {
  const currentUrlObj = new URL(currentUrl);
  const newUrlObj = new URL(newUrl);
  const currentHash = currentUrlObj.hash;
  const newHash = newUrlObj.hash;

  return (
    currentUrlObj.hostname === newUrlObj.hostname &&
    currentUrlObj.pathname === newUrlObj.pathname &&
    currentUrlObj.search === newUrlObj.search &&
    currentHash !== newHash &&
    currentUrlObj.href.replace(currentHash, "") === newUrlObj.href.replace(newHash, "")
  );
};

export const NextTopLoader = ({
  color = "#FF5722",
  height = 3,
  showSpinner = true,
  crawl = true,
  crawlSpeed = 200,
  initialPosition = 0.08,
  easing = "ease",
  speed = 200,
  shadow,
  delay = 0,
}: NextTopLoaderProps) => {
  const boxShadow =
    !shadow && shadow !== undefined ? "" : shadow ? `box-shadow:${shadow}` : `box-shadow:0 0 10px ${color},0 0 5px ${color}`;

  const styles = (
    <style>
      { }
      {`#nprogress{pointer-events:none}#nprogress .bar{background:${color};position:fixed;z-index:1031;top:0;left:0;width:100%;height:${height}px}#nprogress .peg{display:block;position:absolute;right:0;width:100px;height:100%;${boxShadow};opacity:1;-webkit-transform:rotate(3deg) translate(0px,-4px);-ms-transform:rotate(3deg) translate(0px,-4px);transform:rotate(3deg) translate(0px,-4px)}#nprogress .spinner{display:block;position:fixed;z-index:1031;top:15px;right:15px}#nprogress .spinner-icon{width:18px;height:18px;box-sizing:border-box;border:2px solid transparent;border-top-color:${color};border-left-color:${color};border-radius:50%;-webkit-animation:nprogress-spinner 400ms linear infinite;animation:nprogress-spinner 400ms linear infinite}.nprogress-custom-parent{overflow:hidden;position:relative}.nprogress-custom-parent #nprogress .bar,.nprogress-custom-parent #nprogress .spinner{position:absolute}@-webkit-keyframes nprogress-spinner{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg)}}@keyframes nprogress-spinner{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}
    </style>
  );

  useEffect(() => {
    NProgress.configure({
      showSpinner,
      trickle: crawl,
      trickleSpeed: crawlSpeed,
      minimum: initialPosition,
      easing,
      speed,
    });

    const handleNProgressStart = () => {
      let isDone = false;
      setTimeout(() => {
        if (!isDone) {
          NProgress.start();
        }
      }, 100);

      const originalPushState = window.history.pushState;
      window.history.pushState = function (...args) {
        isDone = true;
        NProgress.done();
        for (const el of Array.from(document.querySelectorAll("html"))) {
          el.classList.remove("nprogress-busy");
        }
        return originalPushState.apply(window.history, args);
      };
    };

    const handleQuickProgress = () => {
      if (delay === 0) {
        NProgress.start();
        NProgress.done();
        for (const el of Array.from(document.querySelectorAll("html"))) {
          el.classList.remove("nprogress-busy");
        }
      }
    };

    const handleClick = (event: MouseEvent) => {
      // if ctrl or cmd key is pressed, don't intercept
      if (event.ctrlKey || event.metaKey) return;

      try {
        const target = event.target as HTMLElement;
        const anchor = target.closest("a");

        if (!anchor) return;

        const currentUrl = window.location.href;
        const newUrl = anchor.href;
        const isExternalLink = anchor.target === "_blank";
        const isAnchor = isAnchorOfCurrentUrl(currentUrl, newUrl);

        if (newUrl === currentUrl || isAnchor || isExternalLink) {
          handleQuickProgress();
        } else {
          handleNProgressStart();
        }
      } catch {
        handleQuickProgress();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return styles;
};
