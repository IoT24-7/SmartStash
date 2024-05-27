<script lang="ts">
	// added dialog, drawer, svelte-legos, svelte-radix, unovis/ts, unovis/svelte

	import { page } from '$app/stores';
	import { SignOut } from '@auth/sveltekit/components';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { mediaQuery } from 'svelte-legos';

	let open = false;
	const isDesktop = mediaQuery('(min-width: 768px)');

	import Plus from "svelte-radix/Plus.svelte";

	// for cards:
	import Pencil2 from "svelte-radix/Pencil2.svelte";
	import Trash from "svelte-radix/Trash.svelte";
	let cards = [
		{ name: 'Cereal', weight: '200 g'},
		{ name: 'Rice', weight: '800 g'},
		{ name: 'Sugar', weight: '10 g'},
		{ name: 'Nuts', weight: '150 g'}
	]
</script>

<div class="relative flex h-full w-full flex-col">
	<main class="flex flex-col gap-2 px-5">
		<h2 class="scroll-m-20 text-3xl font-extrabold tracking-tight">Dashboard</h2>
		<p>Welcome, {$page.data.session?.user?.name}!</p>
		<p>Your ID is {$page.data.session?.user?.id}.</p>
		<SignOut options={{ redirectTo: '/' }}>
			<Button slot="submitButton">Sign out</Button>
		</SignOut>

		<!-- for cards -->
		<div class="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-lg:gap-2">
			{#each cards as { name, weight }}
			<li class="flex flex-row justify-between rounded-lg border bg-card p-6 text-card-foreground shadow-md items-center mb-2">
				<div>
					<span class = "text-xl relative font-bold tracking-tight">
						{ name }
					</span>
					<br>
					<span class = "text-xs relative bottom-2 text-muted-foreground">
						{ weight }
					</span>
				</div>
				<div>
					<Dialog.Root> <!-- edit ingredient -->
						<Dialog.Trigger>
							<Button variant="ghost" size="icon">
								<Pencil2 class="h-4 w-4" />
							</Button>
						</Dialog.Trigger>
						<Dialog.Content class="sm:max-w-[425px]">
							<Dialog.Header>
							  <Dialog.Title>Edit Ingredient</Dialog.Title>
							  <Dialog.Description>
								Change the details of your ingredient here. Click save when you're done.
							  </Dialog.Description>
							</Dialog.Header>
							<div class="grid gap-4 py-4">
							  <div class="grid grid-cols-4 items-center gap-4">
								<Label for="name" class="text-right">Ingredient Name</Label>
								<Input id="name" value= {name} class="col-span-3" />
							  </div>
							</div>
							<Dialog.Footer>
							  <Button type="submit">Save</Button>
							</Dialog.Footer>
						  </Dialog.Content>
					</Dialog.Root>

					<Dialog.Root> <!-- delete ingredient -->
						<Dialog.Trigger>
							<Button variant="ghost" size="icon">
								<Trash class="h-4 w-4" />
							</Button>
						</Dialog.Trigger>
						<Dialog.Content class="sm:max-w-[425px]">
							<Dialog.Header>
							  <Dialog.Title>Are you sure you want to delete this ingredient?</Dialog.Title>
							  <Dialog.Description>
								Clicking delete removes all information of the ingredient and cannot be undone.
							  </Dialog.Description>
							</Dialog.Header>
							<Dialog.Footer>
							  <Button variant="outline">No</Button>
							  <Button variant="destructive">Yes</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Root>
				</div>
			</li>
			{/each}
		</div>



		<!-- for add ingredient -->
		{#if $isDesktop}
			<Dialog.Root bind:open>
				<Dialog.Trigger asChild let:builder>
					<div class = "fixed bottom-7 right-7">
						<Button builders={[builder]} class="h-14 px-12">
							<Plus class="mr-2 h-5 w-5" />
							<span class="font-bold text-lg">Add</span>
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
					<div class = "fixed bottom-7 right-7">
						<Button builders={[builder]} class="h-14 px-12">
							<Plus class="mr-2 h-5 w-5" />
							<span class="font-bold text-lg">Add</span>
						</Button>
					</div>
				</Drawer.Trigger>
				<Drawer.Content>
					<Drawer.Header class="text-left">
						<Drawer.Title>Add Ingredient</Drawer.Title>
						<Drawer.Description>
							Enter the details of your new ingredient here.
						</Drawer.Description>
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
