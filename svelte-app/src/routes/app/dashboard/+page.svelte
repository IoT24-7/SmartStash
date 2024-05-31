<script lang="ts">
	import type { PageData } from './$types.js';
	import { page } from '$app/stores';
	import { db } from '$lib/firebase';
	import { collection, query, where, onSnapshot, type Unsubscribe } from 'firebase/firestore';
	import type { Containers } from '../../../app';
	import DashboardForm from './dashboard-form.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { mediaQuery } from 'svelte-legos';
	import { Plus } from 'lucide-svelte';
	import { onMount, onDestroy } from 'svelte';

	export let data: PageData;
	let open = false;
	const isDesktop = mediaQuery('(min-width: 640px)');
	let uid = $page.data.session?.user?.id;

	let containers: Containers[] = data.initialContainers;
	console.log('Initial Dashboard:', containers);
	let unsubscribe: Unsubscribe;

	const setupContainersListener = () => {
		const containersCollection = collection(db, 'containers');
		const q = query(containersCollection, where('userId', 'array-contains', uid));
		unsubscribe = onSnapshot(
			// Assign the unsubscribe function to a variable
			q,
			(snapshot) => {
				const fetchedContainers: Containers[] = snapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						id: doc.id,
						currentWeight: data.currentWeight,
						foodName: data.foodName
					} as Containers;
				});
				containers = [...fetchedContainers];
				console.log('Dashboard:', containers);
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
</script>

<div class="relative flex h-full w-full flex-col">
	<main class="flex flex-col gap-2 px-5">
		<h2 class="scroll-m-20 py-4 text-3xl font-extrabold tracking-tight sm:mt-3">Dashboard</h2>

		{#if containers.length === 0}
			<div
				class="relative flex h-full w-full flex-col items-center justify-center gap-2 py-16 text-center"
			>
				<img src="/undraw_people_search_re_5rre.svg" alt="Searching" class="sm:max-w-xs sm:max-h-xs max-w-[280px] max-h-[280px] p-6" />
				<h3 class="scroll-m-20 sm:text-2xl text-lg font-bold tracking-tight">No devices connected yet.</h3>
				<h4 class="scroll-m-20 sm:text-xl text-sm font-medium tracking-tight text-muted-foreground">
					Connect a SmartStash device to get started.
				</h4>
			</div>
		{:else}
			<ul class="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-lg:gap-2">
				{#each containers as container (container.id)}
					<a href="/app/dashboard/{container.id}">
						<li
							class="mb-2 flex flex-row items-center justify-between rounded-lg border bg-card p-6 text-card-foreground shadow-md"
						>
							<div>
								<p class="text-lg font-bold tracking-tight sm:text-xl">{container.foodName}</p>
								<p class="sm:text-md text-sm text-muted-foreground">{container.currentWeight} g</p>
							</div>
						</li>
					</a>
				{/each}
			</ul>
		{/if}

		<!-- Rest of your code -->

		{#if $isDesktop}
			<Dialog.Root bind:open>
				<Dialog.Trigger asChild let:builder>
					<div class="fixed bottom-7 right-7 drop-shadow-xl">
						<Button builders={[builder]} class="items-center p-7">
							<Plus class="mr-2 h-5 w-5" />
							<p class="text-lg font-bold">Add</p>
						</Button>
					</div>
				</Dialog.Trigger>
				<Dialog.Content class="sm:max-w-[425px]">
					<Dialog.Header>
						<Dialog.Title>Add Container</Dialog.Title>
						<Dialog.Description
							>Enter the details of your new SmartStash device here.</Dialog.Description
						>
					</Dialog.Header>
					<DashboardForm data={data.form} />
				</Dialog.Content>
			</Dialog.Root>
		{:else}
			<Drawer.Root bind:open>
				<Drawer.Trigger asChild let:builder>
					<div class="fixed bottom-7 right-7">
						<Button builders={[builder]} class="items-center p-7">
							<Plus class="mr-2 h-5 w-5" />
							<p class="text-lg font-bold">Add</p>
						</Button>
					</div>
				</Drawer.Trigger>
				<Drawer.Content>
					<Drawer.Header class="text-left">
						<Drawer.Title>Add Container</Drawer.Title>
						<Drawer.Description
							>Enter the details of your new SmartStash device here.</Drawer.Description
						>
						<DashboardForm data={data.form} />
					</Drawer.Header>
					<Drawer.Footer class="pt-0">
						<Drawer.Close asChild let:builder>
							<Button variant="outline" builders={[builder]}>Cancel</Button>
						</Drawer.Close>
					</Drawer.Footer>
				</Drawer.Content>
			</Drawer.Root>
		{/if}
	</main>
</div>
