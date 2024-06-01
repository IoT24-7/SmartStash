<script lang="ts">
	import type { PageData } from './$types.js';
	import type { Containers } from '../../../app';
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { db } from '$lib/firebase';
	import {
		collection,
		query,
		where,
		onSnapshot,
		updateDoc,
		doc,
		type Unsubscribe
	} from 'firebase/firestore';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let uid = $page.data.session?.user?.id;
	export let data: PageData;
	let containers: Containers[] = data.initialContainers;
	console.log('Initial Shopping List:', containers);
	let unsubscribe: Unsubscribe;
	const setupContainersListener = () => {
		const containersCollection = collection(db, 'containers');
		const q = query(containersCollection, where('userId', 'array-contains', uid));
		unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const fetchedContainers: Containers[] = snapshot.docs.map((doc) => {
					const data = doc.data();

					return {
						id: doc.id,
						currentWeight: data.currentWeight,
						foodName: data.foodName,
						threshold: data.threshold,
						checked: data.checked
					} as Containers;
				});
				containers = [...fetchedContainers].filter(
					(container) => container.currentWeight <= container.threshold
				);
				console.log('Shopping List:', containers);
			},
			(error) => {
				console.error('Error fetching containers:', error);
			}
		);
	};

	onMount(() => {
		setupContainersListener();
	});

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});
	const updateChecked = async (container: Containers) => {
		await updateDoc(doc(db, 'containers', container.id), {
			checked: container.checked
		});
	};
	onDestroy(async () => {
		for (const container of containers) {
			await updateChecked(container);
		}
	});
</script>

<div class="relative flex h-full w-full flex-col">
	<main class="flex flex-col gap-2 px-5">
		<h2 class="scroll-m-20 py-4 text-3xl font-extrabold tracking-tight sm:mt-3">Shopping List</h2>
		{#if containers.length === 0}
			<div
				class="relative flex h-full w-full flex-col items-center justify-center gap-2 py-16 text-center"
			>
				<img
					src="/undraw_complete_task_re_44tb.svg"
					alt="Empty list"
					class="sm:max-h-xs max-h-[280px] max-w-[280px] p-6 sm:max-w-xs"
				/>
				<h3 class="scroll-m-20 text-lg font-bold tracking-tight sm:text-2xl">
					Shopping list is empty.
				</h3>
				<h4 class="scroll-m-20 text-sm font-medium tracking-tight text-muted-foreground sm:text-xl">
					Hooray! You have everything you need.
				</h4>
			</div>
		{:else}
			<div class="flex flex-col gap-2 px-5">
				{#each containers as container}
					<li class="relative flex flex-row items-center justify-between">
						<div class="flex items-center space-x-2">
							<Label
								id="terms-label"
								for="terms"
								class="my-3 flex flex-row items-center gap-4 text-2xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								<Checkbox bind:checked={container.checked} />
								{#if container.checked}
									<p class="font-semibold text-primary line-through">{container.foodName}</p>
								{:else}
									<p class="font-semibold">{container.foodName}</p>
								{/if}
							</Label>
						</div>
					</li>
				{/each}
			</div>
		{/if}
	</main>
</div>
