// Lifeweft Service Worker — Offline Shell & Asset Cache
const CACHE_NAME = "lifeweft-cache-v1";
const OFFLINE_URL = "/dashboard";

// Static assets to pre-cache during service worker installation
const PRECACHE_ASSETS = [
    "/",
    "/dashboard",
    "/manifest.webmanifest",
    "/icon.svg",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
    "/icons/apple-touch-icon.png",
    "/icons/icon.svg",
];

// 1. Install event: pre-cache application shell assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS).catch((err) => {
                console.warn("[Lifeweft SW] Precache assets warning:", err);
            });
        }).then(() => self.skipWaiting())
    );
});

// 2. Activate event: clean up stale legacy caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Fetch event: Stale-While-Revalidate for static assets, Network-First for API/Supabase calls
self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests and browser extensions
    if (request.method !== "GET" || !url.protocol.startsWith("http")) {
        return;
    }

    // Skip Supabase API / Auth calls from SW cache to avoid stale authentication or security tokens
    if (
        url.hostname.includes("supabase.co") ||
        url.pathname.startsWith("/api/auth") ||
        url.pathname.startsWith("/auth/")
    ) {
        return;
    }

    // Static assets & images: Stale-While-Revalidate
    if (
        url.pathname.startsWith("/_next/static") ||
        url.pathname.startsWith("/icons/") ||
        url.pathname.endsWith(".svg") ||
        url.pathname.endsWith(".png") ||
        url.pathname.endsWith(".ico") ||
        url.pathname.endsWith(".css") ||
        url.pathname.endsWith(".js")
    ) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                const fetchPromise = fetch(request)
                    .then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            const responseToCache = networkResponse.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, responseToCache);
                            });
                        }
                        return networkResponse;
                    })
                    .catch(() => cachedResponse);

                return cachedResponse || fetchPromise;
            })
        );
        return;
    }

    // Navigation / HTML pages: Network-First with Offline Fallback
    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                    return networkResponse;
                })
                .catch(async () => {
                    const cachedResponse = await caches.match(request);
                    if (cachedResponse) return cachedResponse;
                    const offlineFallback = await caches.match(OFFLINE_URL);
                    return offlineFallback || new Response("Lifeweft Offline Mode", {
                        headers: { "Content-Type": "text/html" }
                    });
                })
        );
    }
});
