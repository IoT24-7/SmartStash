<script lang="ts">
	// added dialog, drawer, svelte-legos, svelte-radix, unovis/ts, unovis/svelte

	import { page } from '$app/stores';
	import { SignOut } from '@auth/sveltekit/components';
	import { Button } from '$lib/components/ui/button';

	import { mediaQuery } from "svelte-legos";
  	import * as Dialog from "$lib/components/ui/dialog/index.js";
  	import * as Drawer from "$lib/components/ui/drawer/index.js";
  	import { Input } from "$lib/components/ui/input/index.js";
  	import { Label } from "$lib/components/ui/label/index.js";

	import Minus from "svelte-radix/Minus.svelte";
  	import Plus from "svelte-radix/Plus.svelte";
  	import { VisGroupedBar, VisXYContainer } from "@unovis/svelte";
 
  	let open = false;
  	const isDesktop = mediaQuery("(min-width: 768px)");

	// for threshold setting
	const data = [
		{
      id: 13,
      goal: 349
    	}
	];
	const x = (d: { goal: number; id: number }) => d.id;
	const y = (d: { goal: number; id: number }) => d.goal;
	let goal = 100;
	function setThreshold(adjustment: number) {
    	goal = Math.max(0, Math.min(1000, goal + adjustment));
  	}

</script>

<div class="relative flex min-h-screen flex-col w-full">
	<main class="flex flex-col gap-2 px-5">
		<h2 class="scroll-m-20 text-3xl font-extrabold tracking-tight ">Dashboard</h2>
		<p>Welcome, {$page.data.session?.user?.name}!</p>
		<p>Your ID is {$page.data.session?.user?.id}.</p>
		<SignOut options={{ redirectTo: '/' }}>
			<Button slot="submitButton">Sign out</Button>
		</SignOut>

		{#if $isDesktop}
		<Dialog.Root bind:open>
			<Dialog.Trigger asChild let:builder>
			<Button builders={[builder]}>Add Ingredient</Button>
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>Add Ingredient</Dialog.Title>
					<Dialog.Description>
					Enter the details of your new ingredient here.
					</Dialog.Description>
				</Dialog.Header>
				<form class="grid items-start gap-4">
					<!-- for setting ingredient name -->
					<div class="grid gap-2">
					<Label for="ingredient">Ingredient Name</Label>
					<Input type="name" id="ingredient_name"/>
					</div>
					<!-- for setting initial threshold -->
					<div class="grid gap-2">
						<Drawer.Root>
							<Drawer.Trigger> <Button variant = "outline">Set Threshold</Button> </Drawer.Trigger>
							<Drawer.Content>
							<Drawer.Header>
								<Drawer.Title>Threshold</Drawer.Title>
								<Drawer.Description>Set the threshold of your ingredient here.</Drawer.Description>
								<div class="grid w-full max-w-sm items-center gap-1.5">
									<div class="p-4 pb-0">
										<div class="flex items-center justify-center space-x-2">
										<Button
											variant="outline"
											size="icon"
											class="h-8 w-8 shrink-0 rounded-full"
											on:click={() => setThreshold(-10)}
											disabled={goal <= 0}
										>
											<Minus class="h-4 w-4" />
											<span class="sr-only">Decrease</span>
										</Button>
										<div class="flex-1 text-center">
											<div class="text-7xl font-bold tracking-tighter">
											{goal}
											</div>
											<div class="text-[0.70rem] uppercase text-muted-foreground">
											Grams
											</div>
										</div>
										<Button
											variant="outline"
											size="icon"
											class="h-8 w-8 shrink-0 rounded-full"
											on:click={() => setThreshold(10)}
										>
											<Plus class="h-4 w-4" />
											<span class="sr-only">Increase</span>
										</Button>
										</div>
										<div class="mt-3 h-[120px]">
										<VisXYContainer {data} height={60}>
											<VisGroupedBar {x} {y} color="hsl(var(--primary) / 0.2)" />
										</VisXYContainer>
										</div>
									</div>
								</div>
							</Drawer.Header>
							<Drawer.Footer>
								<Button variant="outline">Set Threshold</Button>
								<Drawer.Close>Cancel</Drawer.Close>
							</Drawer.Footer>
							</Drawer.Content>
						</Drawer.Root>
					</div>
					<Button type="submit" variant="secondary">Add</Button>
				</form>
			</Dialog.Content>
		</Dialog.Root>
		{:else}
		<Drawer.Root bind:open>
			<Drawer.Trigger asChild let:builder>
			<Button variant="outline" builders={[builder]}>Edit Profile</Button>
			</Drawer.Trigger>
			<Drawer.Content>
			<Drawer.Header class="text-left">
				<Drawer.Title>Edit profile</Drawer.Title>
				<Drawer.Description>
				Make changes to your profile here. Click save when you're done.
				</Drawer.Description>
			</Drawer.Header>
			<form class="grid items-start gap-4 px-4">
				<div class="grid gap-2">
				<Label for="email">Email</Label>
				<Input type="email" id="email" value="shadcn@example.com" />
				</div>
				<div class="grid gap-2">
				<Label for="username">Username</Label>
				<Input id="username" value="@shadcn" />
				</div>
				<Button type="submit">Save changes</Button>
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
