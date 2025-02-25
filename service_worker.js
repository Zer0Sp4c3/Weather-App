//Installs website to your phone
self.addEventListener("install", (event) => {
    console.log("Service Worker Installed");
});

self.addEventListener("fetch", (event) => {
    console.log("Fetching:", event.request.url);
});