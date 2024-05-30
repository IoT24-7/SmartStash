<script lang="ts">
	import { page } from '$app/stores';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { Containers } from '../../../app';
	import { db } from '$lib/firebase';
	import { collection, query, where, onSnapshot } from 'firebase/firestore';

	// dummy data
	let shopping_list = [
		{
			id: 'asd',
			currentWeight: '100 g',
			foodName: 'Sugar',
			status: 'Connected',
			threshold: '50 g',
			userId: 'newuser',
			checked: false
		},
		{
			id: 'asd',
			currentWeight: '100 g',
			foodName: 'Salt',
			status: 'Connected',
			threshold: '50 g',
			userId: 'newuser',
			checked: false
		}
	];
	let uid = $page.data.session?.user?.id;

	let containers: Containers[] = [];
	let containersWithChecked: Containers[] = [];
	const setupContainersListener = () => {
		const containersCollection = collection(db, 'containers');
		const q = query(containersCollection, where('userId', 'array-contains', uid));
		onSnapshot(
			q,
			(snapshot) => {
				const fetchedContainers: Containers[] = snapshot.docs.map((doc) => {
					const data = doc.data();

					return {
						id: doc.id,
						currentWeight: data.currentWeight,
						foodName: data.foodName,
						status: data.status,
						threshold: data.threshold,
						userId: data.userId
					} as Containers;
				});
				containers = [...fetchedContainers];
				console.log(containers);
				containersWithChecked = containers.map((container) => ({
					...container,
					checked: false
				}));
				containersWithChecked = containersWithChecked.filter(
					(container) => container.currentWeight <= container.threshold
				);
				console.log('containersWithChecked:', containersWithChecked);
			},
			(error) => {
				console.error('Error fetching containers:', error);
			}
		);
	};

	setupContainersListener();
</script>

<div class="relative flex h-full w-full flex-col">
	<main class="flex flex-col gap-2 px-5">
		<h2 class="scroll-m-20 py-4 text-3xl font-extrabold tracking-tight sm:mt-3">Shopping List</h2>
	</main>
	<div class="flex flex-col gap-2 px-5">
		{#each containersWithChecked as container}
			<li class="relative flex flex-row items-center justify-between">
				<div class="flex items-center space-x-2">
					<Label
						id="terms-label"
						for="terms"
						class="my-3 flex flex-row items-center gap-4 text-2xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						<Checkbox bind:checked={container.checked} />
						{#if container.checked}
							<p class="text-primary line-through">{container.foodName}</p>
						{:else}
							<p>{container.foodName}</p>
						{/if}
					</Label>
				</div>
			</li>
		{/each}
	</div>
</div>
