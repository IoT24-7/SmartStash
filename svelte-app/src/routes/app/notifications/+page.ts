import type { PageLoad } from './$types';
import { db } from '$lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { Notifs } from '../../../app';
import { auth } from '$lib/authStore.js';
import { get } from 'svelte/store';

export const load: PageLoad = async () => {
	const uid = get(auth);
	let notifications: Notifs[] = [];
	const notifsSnapshot = await getDocs(collection(db, 'users', uid.uid, 'notifications'));

	notifications = notifsSnapshot.docs.map((doc) => ({
		id: doc.id,
		userID: doc.data().userID,
		foodItem: doc.data().foodItem,
		timestamp: doc.data().timestamp
	})) as Notifs[];

	notifications.sort((a, b) => b.timestamp - a.timestamp);

	return {
		initialNotifications: notifications
	};
};
