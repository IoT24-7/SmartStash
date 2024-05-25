<script lang="ts">
	import { page } from '$app/stores';
	import { db } from '$lib/firebase';
	import { collection, onSnapshot } from 'firebase/firestore';
	import type { Notifs } from '../../../app';

	let userID;
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
					<li class="rounded-2xl bg-white p-3 shadow-md">
						<form>
							<p class="text-1xl font-extrabold tracking-tight">{notification.foodItem}</p>
							<p class="notifs__content">Your {notification.foodItem} is running low.</p>
						</form>
					</li>
				{/each}
			{:else}
				<p class="text-muted-foreground">Loading...</p>
			{/if}
		</ul>
	</main>
</div>
