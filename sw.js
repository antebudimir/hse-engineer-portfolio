const version = 1;
const preCacheName = `static-${version}`;
const precache = [
	'/',
	'/fonts/Montserrat-Regular.woff',
	'/fonts/Montserrat-SemiBold.woff',
	'/index.html',
	'/fgp-tengiz.html',
	'/yamal-lng.html',
	'/protecta-horvat.html',
	'/prima-furniture.html',
	'/about.html',
	'/thank-you.html',
	'/404.html',
	'/img/showcase.jpg',
	'/img/showcase-mobile.png',
];
//if you add '/404.html' to the precache, the file must exist or the install event will fail

self.addEventListener('install', (e) => {
	//installed
	e.waitUntil(
		caches
			.open(preCacheName)
			.then((cache) => {
				console.log('caching the static files');
				cache.addAll(precache);
			})
			.catch(console.warn),
	);
	//load pre-cache
});

self.addEventListener('activate', (e) => {
	//activating
	e.waitUntil(
		caches
			.keys()
			.then((keys) => {
				return Promise.all(
					keys
						.filter((key) => key !== preCacheName)
						.map((key) => caches.delete(key)),
				);
			})
			.catch(console.warn),
	);
	//delete old caches
});

self.addEventListener('fetch', (e) => {
	//fetch request received
	//send back a response from cache or fetch
	e.respondWith(
		caches.match(e.request).then((cacheRes) => {
			return (
				cacheRes ||
				fetch(e.request).then(
					(response) => {
						return response;
					},
					(err) => {
						// added by me
						console.log(
							'[Service Worker] Fetch failed; returning offline page instead.',
							err,
						);

						return precache;
						//in case of network failure, send precache
					},
				)
			);
		}),
	);
});

self.addEventListener('message', (e) => {
	//message received
	//do things based on message props
	let data = e.data;
	console.log('SW received', data);
});

const sendMessage = async (msg) => {
	let allClients = await clients.matchAll({ includeUncontrolled: true });
	return Promise.all(
		allClients.map((client) => {
			let channel = new MessageChannel();
			return client.postMessage(msg);
		}),
	);
};

// PERIODIC SYNC
self.addEventListener('periodicsync', (e) => {
	if (e.tag == 'latest-update') {
		e.waitUntil(fetchAndCacheLatestUpdate());
	}
});
