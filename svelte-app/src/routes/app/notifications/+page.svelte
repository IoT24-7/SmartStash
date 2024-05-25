<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import { db } from '$lib/firebase';
	import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
	import type { Notifs } from '../../../app';

	let userID: string | undefined = '';
	$: userID = $page.data.session?.user?.id;

	// dummy data
	// const notifications = [
	// 	// id = notification id for creation and deletion
	// 	// userID
	// 	// foodItem
	// 	// TODO: Implement notification in backend

	// 	{
	// 		id: 1,
	// 		userID: 1,
	// 		foodItem: 'Rice'
	// 	},

	// 	{
	// 		id: 2,
	// 		userID: 1,
	// 		foodItem: 'Cereal'
	// 	},

	// 	{
	// 		id: 3,
	// 		userID: 1,
	// 		foodItem: 'Garlic'
	// 	},

	// 	{
	// 		id: 4,
	// 		userID: 1,
	// 		foodItem: 'Onion'
	// 	}
	// ];

	// check app.d.ts file for notif type
	// notifications is an array of notifs

	let notifications: Notifs[] = [];

	const setupNotificationListener = (uid: string) => {
		const notifsCollection = collection(db, 'users', uid, 'notifications');
		onSnapshot(
			notifsCollection,
			(snapshot) => {
				const fetchedNotifications: Notifs[] = snapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						id: doc.id,
						userID: data.userID,
						foodItem: data.foodItem,
						timestamp: data.timestamp
					} as Notifs;
				});
				notifications = [...fetchedNotifications];
				console.log(notifications);
			},
			(error) => {
				console.error('Error fetching notifications:', error);
			}
		);
	};
	// Function to delete a notification
	const deleteNotification = async (notifId: string) => {
		if (userID) {
			try {
				const notifDoc = doc(db, 'users', userID, 'notifications', notifId);
				await deleteDoc(notifDoc);
				// console.log(`Notification with ID ${notifId} deleted successfully.`);
			} catch (error) {
				console.error('Error deleting notification:', error);
			}
		} else {
			console.warn('User ID is not defined');
		}
	};

	// Initialize userID and set up listener once
	$: {
		userID = $page.data.session?.user?.id;
		if (userID) {
			setupNotificationListener(userID);
		} else {
			console.warn('User ID is not defined');
		}
	}
</script>

<div class="relative flex min-h-screen w-full flex-col">
	<main class="flex flex-col gap-2 px-5">
		<h2 class="scroll-m-20 text-3xl font-extrabold tracking-tight">Notifications</h2>
		<ul class="flex flex-col gap-2">
			{#if notifications.length > 0}
				<!-- reversed so the latest notification at top-->
				{#each notifications.reverse() as notification (notification.id)}
					<li class="flex flex-row justify-between rounded-2xl bg-white p-3 shadow-md">
						<div class="flex-grow">
							<p class="text-1xl font-extrabold tracking-tight">{notification.foodItem}</p>
							<p class="notifs__content">Your {notification.foodItem} is running low.</p>
							<p class="text-xs text-gray-500">2 hours ago</p>
						</div>
						<button
							class="self-start rounded px-2 py-1 text-base font-bold text-gray-400 hover:text-blue-700"
							on:click={() => deleteNotification(notification.id)}>Remove</button
						>
					</li>
				{/each}
			{:else}
				<p class="text-muted-foreground">Loading...</p>
			{/if}
		</ul>
	</main>
</div>
