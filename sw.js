const CACHE_NAME = "only-the-brave-v1";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./manifest.json",
        "./icon-192.png",
        "./icon-512.png"
      ])
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  if (new URL(event.request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});



self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    data = {
      body: event.data ? event.data.text() : ""
    };
  }
  
  data = data.data || data.notification || data;
  
  const title = data.title || "🔥 Only the Brave 🔥";

  const options = {
    body: data.body || "En bokning har uppdaterats!",
    icon: "./FB_IMG_1791467647880.jpg",
    badge: "./FB_IMG_1791467647880.jpg",
    tag: "only-the-brave-booking",
    data: {
      url: data.url || "./"
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || "./",
    self.registration.scope
  );

  if (targetUrl.origin !== self.location.origin) {
    return;
  }

  event.waitUntil(
    clients.openWindow(targetUrl.href)
  );
});
