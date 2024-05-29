<script lang="ts">
	// @ts-nocheck
	export let data;
	import { mediaQuery } from 'svelte-legos';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.ts';
	import { ArrowLeft } from 'lucide-svelte';
	import { Wifi } from 'lucide-svelte';
	import { WifiOff } from 'lucide-svelte';
	import { SquarePen } from 'lucide-svelte';
	import { Trash2 } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.ts';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Label } from '$lib/components/ui/label/index.ts';
	import { Input } from '$lib/components/ui/input/index.ts';
	import { db } from '$lib/firebase';
	import { doc, onSnapshot } from 'firebase/firestore';
	
	let open = false;
	const isDesktop = mediaQuery('(min-width: 640px)');
	const containerData = data.container;
	// console.log(containerData);
	let container: Containers[] = [];
	const setupContainerListener = () => {
		const containerDoc = doc(db, 'containers', containerData);
		onSnapshot(containerDoc, (docSnapshot) => {
			if (docSnapshot.exists()) {
				const data = docSnapshot.data();
				const fetchedContainer: Containers = {
					id: docSnapshot.id,
					currentWeight: data.currentWeight,
					foodName: data.foodName,
					status: data.status,
					threshold: data.threshold,
					userId: data.userId
				};
				container = fetchedContainer;
			}
			// console.log('container:', container);
		});
	};
	setupContainerListener();
</script>

<div class="relative flex h-full w-full flex-col">
	<main class="flex flex-col items-center gap-2 px-5 py-4 sm:mt-3">
		<div class="flex w-full flex-row items-center justify-between sm:hidden">
			<Button variant="ghost" size="icon" href="/app/dashboard">
				<ArrowLeft class="h-5 w-5" />
			</Button>
		</div>
		<h2 class="scroll-m-20 text-3xl font-extrabold tracking-tight">
			{container.foodName}
		</h2>
		<div class="flex h-full w-full flex-col gap-4 p-4 sm:max-w-[480px]">
			<Card.Root class="w-full">
				<Card.Header class="pb-2">
					<Card.Title class="text-lg font-medium tracking-tight text-accent-foreground"
						>Status</Card.Title
					>
				</Card.Header>
				<Card.Content class="flex items-center gap-4">
					{#if container.status}
						<p class="text-2xl font-bold tracking-tight">Connected</p>
						<Wifi class=" h-6 w-6" />
					{:else}
						<p class="text-2xl font-bold tracking-tight">Disconnected</p>
						<WifiOff class=" h-6 w-6" />
					{/if}
				</Card.Content>
			</Card.Root>
			<Card.Root class="w-full">
				<Card.Header class="pb-2">
					<Card.Title class="text-lg font-medium tracking-tight text-accent-foreground"
						>Current Weight</Card.Title
					>
				</Card.Header>
				<Card.Content class="flex items-center gap-4">
					<p class="text-2xl font-bold tracking-tight">
						{container.currentWeight} g
					</p></Card.Content
				>
			</Card.Root>
			<Card.Root class="w-full">
				<Card.Header class="pb-2">
					<Card.Title class="text-lg font-medium tracking-tight text-accent-foreground"
						>Threshold</Card.Title
					>
				</Card.Header>
				<Card.Content class="flex items-center gap-4">
					<p class="text-2xl font-bold tracking-tight">{container.threshold} g</p></Card.Content
				>
			</Card.Root>

			{#if $isDesktop}
				<Dialog.Root bind:open>
					<!-- edit ingredient -->
					<Dialog.Trigger>
						<Button variant="outline" class="w-full">
							<SquarePen class="mx-2 h-4 w-4" /> Edit
						</Button>
					</Dialog.Trigger>
					<Dialog.Content class="max-w-xs rounded-lg sm:max-w-[425px]">
						<Dialog.Header>
							<Dialog.Title>Edit Ingredient</Dialog.Title>
							<Dialog.Description>
								Change the details of your ingredient here. Click save when you're done.
							</Dialog.Description>
						</Dialog.Header>
						<div class="grid gap-4 py-4">
							<div class="flex items-center gap-4">
								<Label for="name" class="flex-shrink-0 text-right">Ingredient Name</Label>
								<Input id="name" value={containerData.foodName} class="flex-grow" />
							</div>
						</div>
						<Dialog.Footer>
							<Button type="submit">Save</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
				<Dialog.Root>
					<!-- delete ingredient -->
					<Dialog.Trigger>
						<Button variant="outline" class="w-full text-red-500 hover:text-red-500">
							<Trash2 class="mx-2 h-4 w-4" /> Delete
						</Button>
					</Dialog.Trigger>
					<Dialog.Content class="max-w-xs rounded-lg sm:max-w-[425px]">
						<Dialog.Header>
							<Dialog.Title>Are you sure you want to delete this ingredient?</Dialog.Title>
							<Dialog.Description>
								Clicking delete removes all information of the ingredient and cannot be undone.
							</Dialog.Description>
						</Dialog.Header>
						<Dialog.Footer class="flex flex-col gap-y-4 sm:flex-row sm:gap-y-0">
							<Button variant="outline">No</Button>
							<Button variant="destructive">Yes</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			{:else}
				<Drawer.Root bind:open>
					<!-- edit ingredient -->
					<Drawer.Trigger>
						<Button variant="outline" class="w-full">
							<SquarePen class="mx-2 h-4 w-4" /> Edit
						</Button>
					</Drawer.Trigger>
					<Drawer.Content>
						<Drawer.Header class="text-left">
							<Drawer.Title>Edit Ingredient</Drawer.Title>
							<Drawer.Description>
								Change the details of your ingredient here. Click save when you're done.
							</Drawer.Description>
						</Drawer.Header>
						<form class="grid items-start gap-4 px-4">
							<div class="grid gap-2">
								<Label for="name" class="flex-shrink-0 text-left">Ingredient Name</Label>
								<Input id="name" value={containerData.foodName} class="flex-grow" />
							</div>
							<Button type="submit" variant="outline">Save</Button>
						</form>
						<Drawer.Footer class="pt-2"></Drawer.Footer>
					</Drawer.Content>
				</Drawer.Root>
				<Drawer.Root>
					<!-- delete ingredient -->
					<Drawer.Trigger>
						<Button variant="outline" class="w-full text-red-500 hover:text-red-500">
							<Trash2 class="mx-2 h-4 w-4" /> Delete
						</Button>
					</Drawer.Trigger>
					<Drawer.Content>
						<Drawer.Header class="text-left">
							<Drawer.Title>Are you sure you want to delete this ingredient?</Drawer.Title>
							<Drawer.Description>
								Clicking delete removes all information of the ingredient and cannot be undone.
							</Drawer.Description>
						</Drawer.Header>
						<Drawer.Footer class="pt-2">
							<Button variant="outline">No</Button>
							<Button variant="destructive">Yes</Button>
						</Drawer.Footer>
					</Drawer.Content>
				</Drawer.Root>
			{/if}
		</div>
	</main>
</div>
