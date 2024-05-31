<script lang="ts">
	import type { PageData } from './$types.js';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import { db } from '$lib/firebase';
	import {
		collection,
		onSnapshot,
		deleteDoc,
		doc,
		addDoc,
		type Unsubscribe
	} from 'firebase/firestore';
	import type { Notifs } from '../../../app';
	import { Trash2 } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import { onMount, onDestroy } from 'svelte';

	export let data: PageData;
	let userID = $page.data.session?.user?.id;
	let unsubscribe: Unsubscribe;
	let notifications = data.initialNotifications;
	console.log('Initial Notifications:', notifications);

	const generateUniqueID = () => {
		return Math.random().toString(36).substr(2, 9);
	};

	const generateTimestamp = () => {
		return new Date().getTime();
	};

	const setupNotificationListener = (uid: string) => {
		const notifsCollection = collection(db, 'users', uid, 'notifications');
		unsubscribe = onSnapshot(
			notifsCollection,
			(snapshot) => {
				const fetchedNotifications: Notifs[] = snapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						id: doc.id,
						userID: data.userID,
						foodItem: data.foodItem,
						timestamp: data.timestamp // convert to milliseconds
					} as Notifs;
				});
				notifications = [...fetchedNotifications].sort((a, b) => b.timestamp - a.timestamp);
				console.log('Notifications:', notifications);
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

	// create dummy notification
	const createNotification = async () => {
		if (userID) {
			try {
				console.log(generateTimestamp());
				const notifDoc = await addDoc(collection(db, 'users', userID, 'notifications'), {
					id: generateUniqueID(),
					userID: generateUniqueID(),
					foodItem: 'test',
					timestamp: new Date().getTime()
				});
				console.log('New notification created successfully');
			} catch (error) {
				console.error('Error creating notification:', error);
			}
		} else {
			console.warn('User ID is not defined');
		}
	};

	const formatTimestamp = (timestamp: number) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // difference in seconds

		if (diff < 2) {
			return 'Just now';
		} else if (diff < 60) {
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
	onMount(() => {
		if (userID) {
			setupNotificationListener(userID);
		}
	});

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});
</script>

<div class="relative flex h-full w-full flex-col">
	<main class="flex flex-col gap-2 px-5">
		<h2 class="scroll-m-20 py-4 text-3xl font-extrabold tracking-tight sm:mt-3">Notifications</h2>
		<ul class="flex flex-col gap-2">
			{#if notifications.length > 0}
				<!-- reversed so the latest notification at top-->

				{#each notifications.sort((a, b) => b.timestamp - a.timestamp) as notification (notification.timestamp)}
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
			{:else}
				<div
					class="relative flex h-full w-full flex-col items-center justify-center gap-2 py-16 text-center"
				>
					<img
						src="/undraw_happy_news_re_tsbd.svg"
						alt="Happy news"
						class="sm:max-h-xs max-h-[280px] max-w-[280px] p-6 sm:max-w-xs"
					/>
					<h3 class="scroll-m-20 text-lg font-bold tracking-tight sm:text-2xl">
						You have no notifications.
					</h3>
					<h4
						class="scroll-m-20 text-sm font-medium tracking-tight text-muted-foreground sm:text-xl"
					>
						You're all caught up!
					</h4>
				</div>
			{/if}
		</ul>
		<div class="fixed bottom-7 right-7">
			<Button class="items-center p-7" on:click={() => createNotification()}>
				<Plus class="mr-2 h-5 w-5" />
				<p class="text-lg font-bold">Add</p>
			</Button>
		</div>
	</main>
</div>
