// src/shared/lib/get-youtube-embed-url.ts

interface YouTubeEmbedOptions {
  autoplay?: boolean;
  // Add other embed options if needed (e.g., controls, loop, start)
  // controls?: boolean;
  // loop?: boolean;
  // start?: number; // Start time in seconds
}

/**
 * Converts various YouTube URL formats into a standard embeddable URL.
 * Handles regular videos, shorts, youtu.be links, and playlists.
 * Returns null if the URL is invalid or the ID cannot be extracted.
 *
 * @param url The original YouTube URL string.
 * @param options Optional configuration for the embed (e.g., autoplay).
 * @returns The embeddable YouTube URL string or null.
 */
export function getYouTubeEmbedUrl(url: string, options: YouTubeEmbedOptions = {}): string | null {
  if (!url) {
    return null;
  }

  let videoId: string | null = null;
  let playlistId: string | null = null;

  try {
    const urlObject = new URL(url);
    const hostname = urlObject.hostname;
    const pathname = urlObject.pathname;
    const searchParams = urlObject.searchParams;

    // 1. Check for standard video URLs (youtube.com/watch?v=...)
    if (hostname.includes("youtube.com") && pathname === "/watch") {
      videoId = searchParams.get("v");
      // Check if it's also part of a playlist
      if (searchParams.get("list")) {
        playlistId = searchParams.get("list");
      }
    }
    // 2. Check for short URLs (youtu.be/...)
    else if (hostname === "youtu.be") {
      videoId = pathname.substring(1); // Remove leading '/'
    }
    // 3. Check for embed URLs (/embed/...)
    else if (hostname.includes("youtube.com") && pathname.startsWith("/embed/")) {
      videoId = pathname.substring("/embed/".length);
    }
    // 4. Check for shorts URLs (/shorts/...)
    else if (hostname.includes("youtube.com") && pathname.startsWith("/shorts/")) {
      videoId = pathname.substring("/shorts/".length);
    }
    // 5. Check for playlist URLs (youtube.com/playlist?list=...)
    else if (hostname.includes("youtube.com") && pathname === "/playlist") {
      playlistId = searchParams.get("list");
    }
    // Note: Channel URLs (/channel/..., /c/..., /@handle) are not directly embeddable in the same way.
    // You usually embed a specific video or playlist from a channel.
  } catch (error) {
    // If URL parsing fails, maybe it's just an ID/handle? We don't handle that here for embeds.
    console.warn("Could not parse as URL for embed:", url, error);
    // For embeds, we need a video or playlist ID extracted from a valid URL structure.
    return null;
  }

  // --- Construct Embed URL ---

  const baseEmbedUrl = "https://www.youtube-nocookie.com/embed/";
  const queryParams = new URLSearchParams();

  if (options.autoplay) {
    queryParams.set("autoplay", "1");
  }

  // Maximum `YouTube` branding removal
  queryParams.set("modestbranding", "1");
  queryParams.set("rel", "0");
  queryParams.set("showinfo", "0");
  queryParams.set("mute", "1");
  queryParams.set("controls", "1");
  queryParams.set("iv_load_policy", "3"); // Hide annotations
  queryParams.set("cc_load_policy", "0"); // Hide captions by default
  queryParams.set("fs", "0"); // Disable fullscreen button
  queryParams.set("disablekb", "1"); // Disable keyboard controls
  queryParams.set("playsinline", "1"); // Mobile optimization
  queryParams.set("origin", typeof window !== "undefined" ? window.location.origin : "");

  // Prioritize playlist embed if playlistId is found
  if (playlistId) {
    // For playlist embed, use videoseries?list=...
    queryParams.set("list", playlistId);
    // If a videoId was also found, it becomes the first video in the playlist context
    const path = videoId ? videoId : "videoseries";
    return `${baseEmbedUrl}${path}?${queryParams.toString()}`;
  }
  // Otherwise, embed the single video if videoId is found
  else if (videoId) {
    // If looping a single video, playlist param needs to be the videoId itself
    // if (options.loop) queryParams.set('playlist', videoId);
    return `${baseEmbedUrl}${videoId}?${queryParams.toString()}`;
  }

  // If neither videoId nor playlistId could be extracted
  return null;
}
