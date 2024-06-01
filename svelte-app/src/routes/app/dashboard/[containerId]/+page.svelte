<script lang="ts">
	// @ts-nocheck
	export let data;
	import { page } from '$app/stores';
	import { mediaQuery } from 'svelte-legos';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.ts';
	import { ArrowLeft } from 'lucide-svelte';
	import { Wifi } from 'lucide-svelte';
	import { WifiOff } from 'lucide-svelte';
	import { SquarePen } from 'lucide-svelte';
	import { Minus } from 'lucide-svelte';
	import { Menu } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import { CircleMinus } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.ts';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Label } from '$lib/components/ui/label/index.ts';
	import { Input } from '$lib/components/ui/input/index.ts';
	import { db } from '$lib/firebase';
	import { doc, onSnapshot, updateDoc, arrayRemove, type Unsubscribe } from 'firebase/firestore';
	import { onDestroy, onMount } from 'svelte';

	let open = false;
	const isDesktop = mediaQuery('(min-width: 640px)');
	const containerData = data.container;
	let container = data.initialContainer;
	console.log('Initial Container:', container);
	let unsubscribe: Unsubscribe;
	const setupContainerListener = () => {
		const containerDoc = doc(db, 'containers', containerData);
		unsubscribe = onSnapshot(containerDoc, (docSnapshot) => {
			if (docSnapshot.exists()) {
				const data = docSnapshot.data();
				const fetchedContainer: Containers = {
					id: docSnapshot.id,
					currentWeight: data.currentWeight,
					foodName: data.foodName,
					status: data.status,
					threshold: data.threshold,
					userId: data.userId,
					goal: data.threshold !== undefined ? data.threshold : 350,
					pricePesos: data.pricePesos,
					carbohydrates: data.carbohydrates,
					proteins: data.proteins,
					fats: data.fats
				};
				container = fetchedContainer;
			}
			console.log(container.id, ':', container);
		});
	};
	onMount(() => {
		setupContainerListener();
	});
	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});

	const removeContainer = async (container) => {
		await updateDoc(doc(db, 'containers', container.id), {
			userId: arrayRemove($page.data.session?.user?.id)
		});
	};

	let newFoodName = '';
	let newPricePesos = '';
	let newCarbohydrates = '';
	let newProteins = '';
	let newFats = '';
	const updateName = async (container) => {
		await updateDoc(doc(db, 'containers', container.id), {
			foodName: newFoodName !== '' ? newFoodName : container.foodName,
			pricePesos: newPricePesos !== '' ? newPricePesos : container.pricePesos,
			carbohydrates: newCarbohydrates !== '' ? newCarbohydrates : container.carbohydrates,
			proteins: newProteins !== '' ? newProteins : container.proteins,
			fats: newFats !== '' ? newFats : container.fats
		});
		console.log(newPricePesos);
	};
	const updateThreshold = async (container) => {
		await updateDoc(doc(db, 'containers', container.id), {
			threshold: container.goal
		});
	};
	function handleClick(adjustment: number) {
		container.goal = Math.max(100, Math.min(900, container.goal + adjustment));
	}
</script>

<div class="relative flex h-full w-full flex-col">
	<main class="flex flex-col items-center gap-2 px-5 py-4 sm:mt-3">
		<div class="flex w-full flex-row items-center justify-between p-0.5">
			<Button variant="ghost" size="icon" href="/app/dashboard">
				<ArrowLeft class="h-5 w-5" />
			</Button>
		</div>
		<h2 class="scroll-m-20 text-3xl font-extrabold tracking-tight">
			{container.foodName}
		</h2>
		<div class="flex h-full w-full flex-col gap-4 p-4 sm:max-w-[480px]">
			<!-- <Card.Root class="w-full">
				<Card.Header class="pb-2">
					<Card.Title class="text-accent-foreground text-lg font-medium tracking-tight"
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
			</Card.Root> -->
			<Card.Root class="w-full">
				<Card.Header class="pb-2">
					<Card.Title class="text-accent-foreground text-lg font-medium tracking-tight"
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
					<Card.Title class="text-accent-foreground text-lg font-medium tracking-tight"
						>Threshold</Card.Title
					>
				</Card.Header>
				<Card.Content class="flex items-center gap-4">
					<div class="flex w-full flex-row items-center justify-between">
						<p
							class={`text-2xl font-bold tracking-tight ${container.threshold === undefined ? 'text-muted-foreground' : ''}`}
						>
							{container.threshold === undefined ? 'Not yet set' : `${container.threshold} g`}
						</p>
						<Drawer.Root>
							<Drawer.Trigger asChild let:builder>
								<Button builders={[builder]}
									>{container.threshold === undefined ? 'Set' : 'Change'}</Button
								>
							</Drawer.Trigger>
							<Drawer.Content>
								<div class="mx-auto w-full max-w-sm">
									<Drawer.Header>
										<Drawer.Title>Threshold Level</Drawer.Title>
										<Drawer.Description
											>Set your threshold level. We will notify you once you reached your limit.</Drawer.Description
										>
									</Drawer.Header>
									<div class="p-4 pb-0">
										<div class="flex items-center justify-center space-x-2">
											<Button
												variant="outline"
												size="icon"
												class="h-8 w-8 shrink-0 rounded-full"
												on:click={() => handleClick(-10)}
												disabled={container.goal <= 100}
											>
												<Minus class="h-4 w-4" />
												<span class="sr-only">Decrease</span>
											</Button>
											
											<div class="flex-1 text-center">
												<div class="text-7xl font-bold tracking-tighter">
													<input type="number" class = "bg-transparent text-center w-3/4 [&::-webkit-inner-spin-button]:appearance-none" bind:value = {container.goal}>
												</div>
												<div class="text-muted-foreground text-[0.70rem] uppercase">grams</div>
											</div>
											<Button
												variant="outline"
												size="icon"
												class="h-8 w-8 shrink-0 rounded-full"
												on:click={() => handleClick(10)}
											>
												<Plus class="h-4 w-4" />
												<span class="sr-only">Increase</span>
											</Button>
										</div>
									</div>
									<Drawer.Footer>
										<Drawer.Close asChild let:builder>
											<Button builders={[builder]} on:click={() => updateThreshold(container)}
												>Set Threshold</Button
											>
											<Button builders={[builder]} variant="outline">Cancel</Button>
										</Drawer.Close>
									</Drawer.Footer>
								</div>
							</Drawer.Content>
						</Drawer.Root>
					</div>
				</Card.Content>
			</Card.Root>

			{#if $isDesktop}
				<Dialog.Root>
					<!-- edit ingredient -->
					<Dialog.Trigger>
						<Button variant="outline" class="w-full">
							<Menu class="mx-2 h-4 w-4" /> Additional Information
						</Button>
					</Dialog.Trigger>
					<Dialog.Content class="max-w-xs rounded-lg sm:max-w-[425px]">
						<Dialog.Header>
							<Dialog.Title>Additional Information</Dialog.Title>
							<Dialog.Description>
								See additional information (nutritional info and price) about your ingredient here.
							</Dialog.Description>
						</Dialog.Header>
						<div class="grid gap-4 py-4">
							<div class="flex items-center gap-4">
								<p>
									<Label for="name" class="flex-shrink-0 text-right"
										>Ingredient Name: {container.foodName}
									</Label>
								</p>
							</div>
							<div class="flex items-center gap-4">
								<p>
									<Label for="name" class="flex-shrink-0 text-right"
										>Price (per serving): {container.pricePesos === '' ||
										container.pricePesos === undefined
											? 'No information available'
											: `Php ${container.pricePesos}`}
									</Label>
								</p>
							</div>
							<div class="flex items-center gap-4">
								<p>
									<Label for="name" class="flex-shrink-0 text-right"
										>Carbohydrates (per serving): {container.carbohydrates === '' ||
										container.carbohydrates === undefined
											? 'No information available'
											: `${container.carbohydrates} g`}
									</Label>
								</p>
							</div>
							<div class="flex items-center gap-4">
								<p>
									<Label for="name" class="flex-shrink-0 text-right"
										>Proteins (per serving): {container.proteins === '' ||
										container.proteins === undefined
											? 'No information available'
											: `${container.proteins} g`}
									</Label>
								</p>
							</div>
							<div class="flex items-center gap-4">
								<p>
									<Label for="name" class="flex-shrink-0 text-right"
										>Fats (per serving): {container.fats === '' || container.fats === undefined
											? 'No information available'
											: `${container.fats} g`}
									</Label>
								</p>
							</div>
						</div>
						<!-- Save Button: should update database when clicked -->
						<Dialog.Footer></Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
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
							<div class="grid grid-cols-5 items-center gap-4">
								<Label for="name" class="col-span-2 flex-shrink-0 text-right leading-4"
									>Ingredient Name</Label
								>
								<Input
									id="current_input_name"
									type="text"
									placeholder={container.foodName}
									class="col-span-3 flex-grow"
									bind:value={newFoodName}
								/>
							</div>
							<div class="grid grid-cols-5 items-center gap-4">
								<Label for="name" class="col-span-2 flex-shrink-0 text-right leading-4"
									>Price (per serving)</Label
								>
								<Input
									id="current_input_price"
									type="float"
									placeholder={container.pricePesos}
									class="col-span-3 flex-grow"
									bind:value={newPricePesos}
								/>
							</div>
							<div class="grid grid-cols-5 items-center gap-4">
								<Label for="name" class="col-span-2 flex-shrink-0 text-right leading-4"
									>Carbohydrates (per serving)</Label
								>
								<Input
									id="current_input_carbs"
									type="float"
									placeholder={container.carbohydrates}
									class="col-span-3 flex-grow"
									bind:value={newCarbohydrates}
								/>
							</div>
							<div class="grid grid-cols-5 items-center gap-4">
								<Label for="name" class="col-span-2 flex-shrink-0 text-right leading-4"
									>Proteins (per serving)</Label
								>
								<Input
									id="current_input_proteins"
									type="float"
									placeholder={container.proteins}
									class="col-span-3 flex-grow"
									bind:value={newProteins}
								/>
							</div>
							<div class="grid grid-cols-5 items-center gap-4">
								<Label for="name" class="col-span-2 flex-shrink-0 text-right leading-4"
									>Fats (per serving)</Label
								>
								<Input
									id="current_input_fats"
									type="float"
									placeholder={container.fats}
									class="col-span-3 flex-grow"
									bind:value={newFats}
								/>
							</div>
						</div>
						<!-- Save Button: should update database when clicked -->
						<Dialog.Footer>
							<Dialog.Close>
								<Button type="submit" on:click={() => updateName(container)}>Save</Button>
							</Dialog.Close>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
				<Dialog.Root>
					<!-- delete ingredient -->
					<Dialog.Trigger>
						<Button variant="outline" class="w-full text-red-500 hover:text-red-500">
							<CircleMinus class="mx-2 h-4 w-4" />Remove
						</Button>
					</Dialog.Trigger>
					<Dialog.Content class="max-w-xs rounded-lg sm:max-w-[425px]">
						<Dialog.Header>
							<Dialog.Title>Are you sure you want to unlink from this container?</Dialog.Title>
							<Dialog.Description>
								Clicking remove disconnects you from the device. This cannot be undone.
							</Dialog.Description>
						</Dialog.Header>
						<Dialog.Footer class="flex flex-col gap-y-4 sm:flex-row sm:gap-y-0">
							<Dialog.Close>
								<Button variant="outline">No</Button>
							</Dialog.Close>
							<!-- DELETE BUTTON FOUND HERE -->
							<a href="/app/dashboard">
								<Button variant="destructive" on:click={() => removeContainer(container)}>
									Yes
								</Button>
							</a>
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
								<Input
									id="current_input_name"
									placeholder={container.foodName}
									class="flex-grow"
									bind:value={newFoodName}
								/>
							</div>
							<Dialog.Close>
								<Button class="w-full" type="submit" on:click={() => updateName(container)}
									>Save</Button
								>
							</Dialog.Close>
						</form>
						<Drawer.Footer class="pt-2"></Drawer.Footer>
					</Drawer.Content>
				</Drawer.Root>
				<Drawer.Root>
					<!-- delete ingredient -->
					<Drawer.Trigger>
						<Button variant="outline" class="w-full text-red-500 hover:text-red-500">
							<CircleMinus class="mx-2 h-4 w-4" />Remove
						</Button>
					</Drawer.Trigger>
					<Drawer.Content>
						<Drawer.Header class="text-left">
							<Drawer.Title>Are you sure you want to unlink from this container?</Drawer.Title>
							<Drawer.Description>
								Clicking remove disconnects you from the device. This cannot be undone.
							</Drawer.Description>
						</Drawer.Header>
						<Drawer.Footer class="pt-2">
							<Button variant="outline" class="max-sm:hidden">No</Button>
							<!-- DELETE BUTTON FOUND HERE -->
							<a href="/app/dashboard">
								<Button
									variant="destructive"
									class="w-full"
									on:click={() => removeContainer(container)}
								>
									Yes
								</Button>
							</a>
						</Drawer.Footer>
					</Drawer.Content>
				</Drawer.Root>
			{/if}
		</div>
	</main>
</div>
