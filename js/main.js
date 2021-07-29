// Register SW
if ('serviceWorker' in navigator) {
	// register him
	navigator.serviceWorker
		.register('/sw.js', {
			updateViaCache: 'none',
			scope: '/',
		})
		.then(() => {
			// finished registering
		})
		.catch((err) => {
			console.warn('Failed to register', err.message);
		});

	// listen for messages
	navigator.serviceWorker.addEventListener('message', ({ data }) => {
		// received a message from the service worker
		console.log(data, 'New message from your service worker.');
	});
}

// SYNC
async function registerPeriodicCheck() {
	const registration = await navigator.serviceWorker.ready;
	try {
		await registration.periodicSync.register('latest-update', {
			minInterval: 24 * 60 * 60 * 1000,
		});
	} catch {
		console.log('Periodic sync could not be registered!');
	}
}

navigator.serviceWorker.ready.then((registration) => {
	registration.periodicSync.getTags().then((tags) => {
		if (tags.includes('latest-update')) skipDownloadingLatestUpdateOnPageLoad();
	});
});

// Hamburger
if (window.innerWidth < 1024) {
	const hamburger = document.querySelector('#hamburger'),
		menu = document.querySelector('.menu'),
		icon = document.querySelector('#menu-icon'),
		body = document.querySelector('body');

	hamburger.addEventListener('click', () => {
		if (menu.style.display === 'none' || menu.style.display === '') {
			setTimeout(() => {
				menu.style.display = 'flex';
				menu.style.flexFlow = 'column nowrap';
				menu.style.justifyContent = 'center';
				menu.style.alignItems = 'center';
				menu.style.animation = 'slideIn 300ms ease-in';
			}, 1);

			body.style.overflow = 'hidden';
			icon.classList.remove('fa-bars');
			icon.classList.add('fa-times');
			icon.style.transition = 'color 300ms ease-in';
		} else {
			slideOut();
		}
	});

	menu.addEventListener('click', () => {
		slideOut();
	});

	function slideOut() {
		menu.style.animation = 'slideOut 300ms ease-in';
		setTimeout(() => {
			menu.style.display = 'none';
		}, 300);

		body.style.overflow = 'unset';
		icon.classList.remove('fa-times');
		icon.classList.add('fa-bars');
	}
}

// Initialize tobii lightbox
const fgpHome = document.querySelector('#fgp-home'),
	yamalHome = document.querySelector('#yamal-home'),
	primaHome = document.querySelector('#prima-home');

if (
	document.body === fgpHome ||
	document.body === yamalHome ||
	document.body === primaHome
) {
	const tobii = new Tobii({
		zoom: false,
	});
}

// SCROLL back to top
const home = document.querySelector('#home'),
	toggle = document.querySelector('.toggle');

// share buttons
if (document.body === home) {
	toggle.addEventListener('click', () => {
		const sharingLinks = document.querySelectorAll('.sharing-link');

		for (let i = 0; i < sharingLinks.length; i++) {
			sharingLinks[i].classList.toggle('open');
		}
	});

	window.addEventListener('scroll', () => {
		if (
			document.body.scrollTop > 1500 ||
			document.documentElement.scrollTop > 1500
		) {
			toggle.style.display = 'initial';
		} else {
			toggle.style.display = 'none';
		}
	});
}

// scrollToTop button
if (
	document.body === home ||
	document.body === fgpHome ||
	document.body === yamalHome ||
	document.body === primaHome
) {
	const scrollToTop = document.querySelector('.scrollButton');

	window.addEventListener('scroll', () => {
		if (
			document.body.scrollTop > 1000 ||
			document.documentElement.scrollTop > 1000
		) {
			scrollToTop.style.display = 'block';
		} else {
			scrollToTop.style.display = 'none';
		}
	});

	scrollToTop.addEventListener('click', () => {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
	});
}

// Textarea auto resize
const aboutHome = document.querySelector('#about-home');

if (document.body === aboutHome) {
	(function autoResize() {
		const textArea = document.querySelector('[data-autoresize]'),
			offset = textArea.offsetHeight - textArea.clientHeight;

		textArea.addEventListener('input', (e) => {
			e.target.style.height = 'auto';
			e.target.style.height = e.target.scrollHeight + offset + 'px';
		});
	})();
}

// Date
const currentYear = document.querySelector('#currentYear');
currentYear.innerText = new Date().getFullYear();
