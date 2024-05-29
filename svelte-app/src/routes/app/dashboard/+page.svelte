<script lang="ts">
	import { page } from '$app/stores';
	import { db } from '$lib/firebase';
	import { collection, onSnapshot } from 'firebase/firestore';
	import type { Containers } from '../../../app';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { mediaQuery } from 'svelte-legos';
	import { Plus } from 'lucide-svelte';

	let open = false;
	const isDesktop = mediaQuery('(min-width: 640px)');

	let containers: Containers[] = [];
	const setupContainersListener = () => {
		const containersCollection = collection(db, 'containers');
		onSnapshot(
			containersCollection,
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
		<h2 class="scroll-m-20 py-4 text-3xl font-extrabold tracking-tight sm:mt-3">Dashboard</h2>
		<p>Welcome, {$page.data.session?.user?.name}!</p>
		<p class="mb-3">Your ID is {$page.data.session?.user?.id}.</p>

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

		{#if $isDesktop}
			<Dialog.Root bind:open>
				<Dialog.Trigger asChild let:builder>
					<div class="fixed bottom-7 right-7">
						<Button builders={[builder]} class="items-center p-7">
							<Plus class="mr-2 h-5 w-5" />
							<p class="text-lg font-bold">Add</p>
						</Button>
					</div>
				</Dialog.Trigger>
				<Dialog.Content class="sm:max-w-[425px]">
					<Dialog.Header>
						<Dialog.Title>Add Ingredient</Dialog.Title>
						<Dialog.Description>Enter the details of your new ingredient here.</Dialog.Description>
					</Dialog.Header>
					<form class="grid items-start gap-4">
						<!-- for setting ingredient name -->
						<div class="grid gap-2">
							<Label for="ingredient">Ingredient Name</Label>
							<Input type="name" id="ingredient_name" />
						</div>
						<Button type="submit" variant="secondary">Add</Button>
					</form>
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
						<Drawer.Title>Add Ingredient</Drawer.Title>
						<Drawer.Description>Enter the details of your new ingredient here.</Drawer.Description>
					</Drawer.Header>
					<form class="grid items-start gap-4 px-4">
						<!-- for setting ingredient name -->
						<div class="grid gap-2">
							<Label for="ingredient">Ingredient Name</Label>
							<Input type="name" id="ingredient_name" />
						</div>
						<Button type="submit" variant="secondary">Add</Button>
					</form>
					<Drawer.Footer class="pt-2">
						<Drawer.Close asChild let:builder>
							<Button variant="outline" builders={[builder]}>Cancel</Button>
						</Drawer.Close>
					</Drawer.Footer>
				</Drawer.Content>
			</Drawer.Root>
		{/if}
	</main>
</div>
