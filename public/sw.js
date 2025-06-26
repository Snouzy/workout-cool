const CACHE_NAME = "1.2.4";
const urlsToCache = [
  "/",
  "/manifest.json",
  "/images/favicon-32x32.png",
  "/images/favicon-16x16.png",
  "/apple-touch-icon.png",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/logo.png",
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  self.skipWaiting(); // 🔥 force install
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

// Fetch event - network first with cache fallback
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip OAuth/auth related URLs
  const url = new URL(event.request.url);
  if (
    url.pathname.startsWith("/api/auth") ||
    url.pathname.startsWith("/auth") ||
    url.hostname !== self.location.hostname ||
    url.pathname.startsWith("/api/stripe") ||
    url.protocol === "chrome-extension:"
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If no cache available, return a custom offline page or error
          if (event.request.destination === "document") {
            return new Response("Application offline - Please check your internet connection", {
              status: 503,
              statusText: "Service Unavailable",
              headers: new Headers({
                "Content-Type": "text/html; charset=utf-8",
              }),
            });
          }
        });
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );

  self.clients.claim();
});
