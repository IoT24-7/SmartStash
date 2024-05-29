// Give the service worker access to Firebase Messaging.
self.importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
self.importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

const firebaseConfig = {
	apiKey: 'AIzaSyD3qNpR_UAi5sXHIX4Way38C-uELvnxkdk',
	authDomain: 'cs145-smartstash.firebaseapp.com',
	databaseURL: 'https://cs145-smartstash-default-rtdb.asia-southeast1.firebasedatabase.app',
	projectId: 'cs145-smartstash',
	storageBucket: 'cs145-smartstash.appspot.com',
	messagingSenderId: '985579041843',
	appId: '1:985579041843:web:82d802b451827653e99f46',
	measurementId: 'G-3HQ89HFLNS'
};

self.firebase.initializeApp(firebaseConfig);
const messaging = self.firebase.messaging();

messaging.onBackgroundMessage((payload) => {
	console.log('Received background message ', payload);

	const notificationTitle = payload.notification.title;
	const notificationOptions = {
		body: payload.notification.body
	};

	self.registration.showNotification(notificationTitle, notificationOptions);
});
