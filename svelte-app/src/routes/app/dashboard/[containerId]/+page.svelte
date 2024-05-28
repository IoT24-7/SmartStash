<script>
	// @ts-nocheck
	export let data;
	import { mediaQuery } from 'svelte-legos';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.ts';
	import { ArrowLeft } from 'lucide-svelte';
	import { EllipsisVertical } from 'lucide-svelte';
	import { Wifi } from 'lucide-svelte';
	import { WifiOff } from 'lucide-svelte';

	let open = false;
	const isDesktop = mediaQuery('(min-width: 640px)');
	const containerData = data.container;
	// console.log(containerData);
</script>

<div class="relative flex h-full w-full flex-col">
	<main class="flex flex-col items-center gap-2 px-5 py-4 sm:mt-3">
		<div class="flex w-full flex-row items-center justify-between sm:hidden">
			<Button variant="ghost" size="icon" href="/app/dashboard">
				<ArrowLeft class="h-5 w-5" />
			</Button>
			<Button variant="ghost" size="icon">
				<EllipsisVertical class="h-5 w-5" />
			</Button>
		</div>
		<h2 class="scroll-m-20 text-3xl font-extrabold tracking-tight">
			{containerData.foodName}
		</h2>
		<div class="flex h-full w-full flex-col gap-4 p-4 sm:max-w-[480px]">
			<Card.Root class="w-full">
				<Card.Header class="pb-2">
					<Card.Title class="text-accent-foreground text-lg font-medium tracking-tight"
						>Status</Card.Title
					>
				</Card.Header>
				<Card.Content class="flex items-center gap-4">
					{#if containerData.status}
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
					<Card.Title class="text-accent-foreground text-lg font-medium tracking-tight"
						>Current Weight</Card.Title
					>
				</Card.Header>
				<Card.Content class="flex items-center gap-4">
					<p class="text-2xl font-bold tracking-tight">
						{containerData.currentWeight} g
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
					<p class="text-2xl font-bold tracking-tight">{containerData.threshold} g</p></Card.Content
				>
			</Card.Root>
		</div>
	</main>
</div>
