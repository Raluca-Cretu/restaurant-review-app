var cacheName = 'v1';


self.addEventListener('install', function(e) {
	console.log("[ServiceWorker] Installed");

	e.waitUntil(

		caches.open(cacheName).then(function(cache) {

			console.log("[ServiceWorker] Caching cacheFiles");
			return cache.addAll([
				'./',
				'./index.html',
				'./restaurant.html',
				'./css/styles.css',
				'./img_src/1.jpg',
				'./img_src/2.jpg',
				'./img_src/3.jpg',
				'./img_src/4.jpg',
				'./img_src/5.jpg',
				'./img_src/6.jpg',
				'./img_src/7.jpg',
				'./img_src/8.jpg',
				'./img_src/9.jpg',
				'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
				'./js/main.js',
				'./js/dbhelper.js',
				'./js/restaurant_info.js'
			]);

		})

	);

});

self.addEventListener('activate', function(e) {
	console.log("[ServiceWorker] Activated");

	e.waitUntil (
		caches.keys().then(function(cacheNames) {
			return Promise.all(cacheNames.map(function(thisCacheName) {

				if (thisCacheName !== cacheName) {

					console.log("[ServiceWorker] Removing Cahed Files from ", thisCacheName);
					return caches.delete(thisCacheName);
				}

			}));
		})
	);

});

self.addEventListener('fetch', function(e) {
	console.log('[ServiceWorker] Fetch', e.request.url);

	// e.respondWidth Responds to the fetch event
	e.respondWith(

		// Check in cache for the request being made
		caches.match(e.request)


			.then(function(response) {

				// If the request is in the cache
				if ( response ) {
					console.log("[ServiceWorker] Found in Cache", e.request.url, response);
					// Return the cached version
					return response;
				}

				// If the request is NOT in the cache, fetch and cache

				var requestClone = e.request.clone();
				return fetch(requestClone)
					.then(function(response) {

						if ( !response ) {
							console.log("[ServiceWorker] No response from fetch ");
							return response;
						}

						var responseClone = response.clone();

						//  Open the cache
						caches.open(cacheName).then(function(cache) {

							// Put the fetched response in the cache
							cache.put(e.request, responseClone);
							console.log('[ServiceWorker] New Data Cached', e.request.url);

							// Return the response
							return response;
			
				        }); // end caches.open

					})
					.catch(function(err) {
						console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
					});


			}) // end caches.match(e.request)
	); // end e.respondWith
});