<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { mediaQuery } from 'svelte-legos';
	import { Plus } from 'lucide-svelte';
	import { SquarePen } from 'lucide-svelte';
	import { Trash2 } from 'lucide-svelte';

	let open = false;
	const isDesktop = mediaQuery('(min-width: 640px)');

	export let data;
	const containers = data.containers;
</script>

<div class="relative flex h-full w-full flex-col">
	<main class="flex flex-col gap-2 px-5">
		<h2 class="scroll-m-20 py-4 text-3xl font-extrabold tracking-tight sm:mt-3">Dashboard</h2>
		<p>Welcome, {$page.data.session?.user?.name}!</p>
		<p class="mb-3">Your ID is {$page.data.session?.user?.id}.</p>

		<div class="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-lg:gap-2">
			{#each containers as container (container.id)}
				<a href="/app/dashboard/{container.id}">
					<li
						class="bg-card text-card-foreground mb-2 flex flex-row items-center justify-between rounded-lg border p-6 shadow-md"
					>
						<div>
							<p class="text-lg font-bold tracking-tight sm:text-xl">{container.foodName}</p>
							<p class="sm:text-md text-muted-foreground text-sm">{container.currentWeight} g</p>
						</div>
						<div class="relative flex flex-col sm:flex-row">
							<Dialog.Root>
								<!-- edit ingredient -->
								<Dialog.Trigger>
									<Button variant="ghost" size="icon">
										<SquarePen class="h-5 w-5" />
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
											<Input id="name" value={name} class="flex-grow" />
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
									<Button variant="ghost" size="icon">
										<Trash2 class="h-5 w-5" />
									</Button>
								</Dialog.Trigger>
								<Dialog.Content class="max-w-xs rounded-lg sm:max-w-[425px]">
									<Dialog.Header>
										<Dialog.Title>Are you sure you want to delete this ingredient?</Dialog.Title>
										<Dialog.Description>
											Clicking delete removes all information of the ingredient and cannot be
											undone.
										</Dialog.Description>
									</Dialog.Header>
									<Dialog.Footer class="flex flex-col gap-y-4 sm:flex-row sm:gap-y-0">
										<Button variant="outline">No</Button>
										<Button variant="destructive">Yes</Button>
									</Dialog.Footer>
								</Dialog.Content>
							</Dialog.Root>
						</div>
					</li>
				</a>
			{/each}
		</div>

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
