<script lang="ts">
	import { page } from '$app/stores';

	// dummy data
	const notifications = [
		// id = notification id for creation and deletion
		// userID
		// foodItem
		// TODO: Implement notification in backend

		{
			id: 1,
			userID: 1,
			foodItem: 'Rice'
		},

		{
			id: 2,
			userID: 1,
			foodItem: 'Cereal'
		},

		{
			id: 3,
			userID: 1,
			foodItem: 'Garlic'
		},

		{
			id: 4,
			userID: 1,
			foodItem: 'Onion'
		}
	];
</script>

<div class="relative flex min-h-screen w-full flex-col">
	<main class="flex flex-col gap-2 px-5">
		<h2 class="scroll-m-20 text-3xl font-extrabold tracking-tight">Notifications</h2>
		<ul class="flex flex-col gap-2">
			<!-- reversed so the latest notification at top-->
			{#each notifications.reverse() as notification (notification.id)}
				<li class="rounded-2xl bg-white p-3 shadow-md">
					<form>
						<p class="text-1xl font-extrabold tracking-tight">{notification.foodItem}</p>
						<p class="notifs__content">Your {notification.foodItem} is running low.</p>
					</form>
				</li>
			{/each}
		</ul>
	</main>
</div>
