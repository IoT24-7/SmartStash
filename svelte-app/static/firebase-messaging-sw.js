// Give the service worker access to Firebase Messaging.
self.importScripts('https://www.gstatic.com/firebasejs/7.2.1/firebase-app.js');
self.importScripts('https://www.gstatic.com/firebasejs/7.2.1/firebase-messaging.js');

self.firebase.initializeApp({
	messagingSenderId: '985579041843'
});
const messaging = self.firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
	const notification = JSON.parse(payload.data.notification);
	const notificationTitle = notification.title;
	const notificationOptions = {
		body: notification.body
	};

	return self.registration.showNotification(notificationTitle, notificationOptions);
});
