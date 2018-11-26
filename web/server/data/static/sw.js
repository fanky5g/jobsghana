importScripts('/static/cache-polyfill.js');
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('paysenger-v1').then(function(cache) {
            return cache.addAll([
                '/',
                '/static/build/client.js',
                '/static/build/styles.css',
                '/static/images/logo.png',
                '/static/images/bg_cut_i.png',
                '/static/images/bga.jpg',
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    // console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});