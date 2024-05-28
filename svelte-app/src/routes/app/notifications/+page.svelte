<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import { db } from '$lib/firebase';
	import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
	import type { Notifs } from '../../../app';
	import { Trash2 } from 'lucide-svelte';

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
						timestamp: data.timestamp.toMillis ? data.timestamp.toMillis() : data.timestamp // convert to milliseconds
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

	const formatTimestamp = (timestamp: Date) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // difference in seconds

		if (diff < 60) {
			return `${diff} seconds ago`;
		} else if (diff < 3600) {
			return `${Math.floor(diff / 60)} minutes ago`;
		} else if (diff < 86400) {
			return `${Math.floor(diff / 3600)} hours ago`;
		} else {
			return `${Math.floor(diff / 86400)} days ago`;
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

<div class="relative flex h-full w-full flex-col">
	<main class="flex flex-col gap-2 px-5">
		<h2 class="scroll-m-20 sm:mt-3 py-4 text-3xl font-extrabold tracking-tight">Notifications</h2>
		<ul class="flex flex-col gap-2">
			{#if notifications.length > 0}
				<!-- reversed so the latest notification at top-->
				{#each notifications as notification (notification.id)}
					<li
						class="mb-2 flex flex-row items-center justify-between rounded-lg border bg-card p-6 text-card-foreground shadow-md"
					>
						<div class="flex-grow">
							<p class="text-xl font-bold tracking-tight">{notification.foodItem}</p>
							<p class="leading-7">You're running low on {notification.foodItem}.</p>
							<p class="text-xs text-muted-foreground">{formatTimestamp(notification.timestamp)}</p>
						</div>
						<Button
							variant="ghost"
							size="icon"
							class="group"
							on:click={() => deleteNotification(notification.id)}
						>
							<Trash2 class="h-5 w-5 text-gray-500 group-hover:text-red-500" />
							<span class="sr-only">Delete</span>
						</Button>
					</li>
				{/each}
			{:else if notifications.length === 0}
				<p>Nice work! You're all caught up.</p>
			{:else}
				<p class="text-muted-foreground">Loading...</p>
			{/if}
		</ul>
	</main>
</div>
