<script lang="ts">
	// @ts-nocheck
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import {
		requestNotificationsPermissions,
		saveMessagingDeviceToken,
		deleteMessagingDeviceToken
	} from '$lib/messaging';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import {} from 'firebase/messaging';

	$: uid = $page.data.session?.user?.id;

	async function enableNotifications() {
		const permission = await requestNotificationsPermissions(uid);
		if (permission === 'granted') {
			await saveMessagingDeviceToken(uid);
		}
	}

	async function disableNotifications() {
		await deleteMessagingDeviceToken(uid);
	}
</script>

<div class="relative flex h-full w-full flex-col">
	<main class="flex flex-col gap-2 px-5">
		<h2 class="scroll-m-20 py-4 text-3xl font-extrabold tracking-tight sm:mt-3">Settings</h2>
		<p>
			Welcome to the settings page! Here you can change your account settings, preferences, and
			more.
		</p>
		<div class="align-self-center flex flex-row space-x-3">
			<Switch
				id="airplane-mode"
				defaultChecked={false}
				onCheckedChange={(e) => (e ? enableNotifications() : disableNotifications())}
			/>

			<Label for="airplane-mode" class="self-center text-base text-gray-400"
				>Enable Notifications</Label
			>
		</div>
	</main>
</div>
