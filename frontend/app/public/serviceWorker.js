const STATIC_CACHE_NAME = "digest-static-v1";


self.addEventListener('install', event => {
	console.log("Installing SW");
	event.waitUntil(
		caches.open(STATIC_CACHE_NAME).then(cache => {
			return cache.addAll([
				'/assets/back.svg',
				'/assets/bookmark.svg',
				'/assets/check.svg',
				'/assets/circle_closed.svg',
				'/assets/circle_open.svg',
				'/assets/down_arrow.svg',
				'/assets/games.svg',
				'/assets/list.svg',
				'/assets/logo.svg',
				'/assets/logout.svg',
				'/assets/move.svg',
				'/assets/movies.svg',
				'/assets/music.svg',
				'/assets/pencil.svg',
				'/assets/plus.svg',
				'/assets/search.svg',
				'/assets/up_arrow.svg',
				'/assets/user.svg',
				'/assets/x.svg',
				'/offline.html'
			])
		})
	);
});

self.addEventListener('activate', event => {
	console.log("Activating SW");
	event.waitUntil(caches.keys().then(cacheNames => {
		return Promise.all(
			cacheNames.filter(cacheName => {
				return cacheName.startsWith('digest-') && cacheName != STATIC_CACHE_NAME;
			}).map(cacheName => {
				return caches.delete(cacheName);
			})
		)
	}));
});

self.addEventListener('fetch', event => {
	const requestUrl = new URL(event.request.url);
	if (requestUrl.origin === location.origin && requestUrl.pathname.startsWith('/api')) {
		if (event.request.method === "GET") {
			event.respondWith(networkFirst(event.request));
		}
	} else {
		event.respondWith(networkFirst(event.request));
	}
})

function networkFirst(request) {
	return fetchAndCache(request)
	.catch(error => {
		const match = caches.match(request).then(cache => {
			return cache || caches.match('/offline.html');
		});
		return match;
	})
	.catch(error => {
		return caches.match('/offline.html');
	})
}

function fetchAndCache(request) {
	return fetch(request).then(response => {
		const requestUrl = new URL(request.url);
		if (response.ok && request.method == "GET" && !requestUrl.protocol.startsWith('chrome-extension')) {
			caches.open(STATIC_CACHE_NAME).then(cache => {
				cache.put(request, response);
			})
		}

		return response.clone();
	})
}