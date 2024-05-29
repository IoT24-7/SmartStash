import { db, messaging } from './firebase';
import { doc, setDoc, deleteField, updateDoc } from 'firebase/firestore';
import { getToken, onMessage, deleteToken, getMessaging } from 'firebase/messaging';

export const FCM_TOKEN_COLLECTION = 'fcmTokens';
export const FCM_TOKEN_KEY = 'fcmToken'; // key for storing FCM token in Firestore

const VAPID_KEY =
	'BBwJ6NGYKb_FDm76PfYYx8r-GTOvV5eFRsK3-GnjlpnQcqjtW-7iop28yoqYti0ThrPgPxW43T2HO9lmBv042Bc';

// Requests permissions to show notifications.
export async function requestNotificationsPermissions(uid: string) {
	console.log('Requesting notifications permission...');
	const permission = await Notification.requestPermission();

	if (permission === 'granted') {
		console.log('Notification permission granted.');
		// Notification permission granted.
		await saveMessagingDeviceToken(uid);
	} else {
		console.log('Unable to get permission to notify.');
	}
}

// Saves the messaging device token to Cloud Firestore.
export async function saveMessagingDeviceToken(uid: string) {
	console.log('save msg device token');

	try {
		const msg = await messaging();
		// @ts-expect-error isSupported() is not null
		const fcmToken = await getToken(msg, { vapidKey: VAPID_KEY });
		if (fcmToken) {
			console.log('Got FCM device token:', fcmToken);
			// Save device token to Firestore
			const tokenRef = doc(db, FCM_TOKEN_COLLECTION, uid);
			await setDoc(tokenRef, { fcmToken });
			// @ts-expect-error message is not null
			onMessage(msg, (message) => {
				console.log('New foreground notification from Firebase Messaging!', message.notification);
				// @ts-expect-error Notification is not null
				new Notification(message.notification.title, { body: message.notification.body });
			});
		} else {
			// Need to request permissions to show notifications.
			requestNotificationsPermissions(uid);
		}
	} catch (error) {
		console.error('Unable to get messaging token.', error);
	}
}

export async function deleteMessagingDeviceToken(uid: string) {
	console.log('trying to delete device FCM token');
	try {
		const messaging = getMessaging();
		await deleteToken(messaging);
		try {
			const tokenRef = doc(db, FCM_TOKEN_COLLECTION, uid);
			await updateDoc(tokenRef, {
				fcmToken: deleteField()
			});

			console.log(`deleted successfully.`);
		} catch (error) {
			console.error('Error deleting token', error);
		}
	} catch (error) {
		console.error('Error deleting token:', error);
	}
}
