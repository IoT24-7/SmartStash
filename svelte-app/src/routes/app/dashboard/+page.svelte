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
</script>

<div class="relative flex min-h-screen w-full flex-col">
	<main class="flex flex-col gap-2 px-5">
		<h2 class="scroll-m-20 text-3xl font-extrabold tracking-tight">Dashboard</h2>
		<p>Welcome, {$page.data.session?.user?.name}!</p>
		<p>Your ID is {$page.data.session?.user?.id}.</p>
		<SignOut options={{ redirectTo: '/' }}>
			<Button slot="submitButton">Sign out</Button>
		</SignOut>

		{#if $isDesktop}
			<Dialog.Root bind:open>
				<Dialog.Trigger asChild let:builder>
					<div class = "fixed bottom-3 right-3">
						<Button builders={[builder]}>Add Ingredient</Button>
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
					<div class = "fixed bottom-3 right-3">
						<Button builders={[builder]}>Add Ingredient</Button>
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
