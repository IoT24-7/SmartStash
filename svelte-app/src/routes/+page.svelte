<script lang="ts">
	import { SignIn, SignOut } from '@auth/sveltekit/components';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import { Canvas } from '@threlte/core';
	import SceneOne from './SceneOne.svelte';
	const appName = 'SmartStash';
	let title = appName;
	title = title.charAt(0).toUpperCase() + title.slice(1);
	let product = {
		name: 'SmartStash',
		description: 'The smart solution to manage your pantry.',
		// TODO: UPDATE PRICE
		price: '₱1499.00',
		imageUrl: '/device_pic1.jpg',
		features: [
			'Measures remaining ingredients.',
			'Alerts when stocks are low.',
			'Keeps grocery list up-to-date.'
		]
	};
</script>

{#if $page.data.session?.user}
	<main class="mt-40 flex w-full flex-col items-center justify-start">
		<div class=" flex w-full max-w-sm flex-col items-center">
			<h1
				class="py-4 text-center text-5xl font-extrabold leading-tight tracking-tighter md:text-7xl lg:leading-[1.1]"
			>
				Smart<span class="text-primary">Stash</span>
			</h1>
			<Button href="/app/dashboard" class="my-2">Go to Dashboard</Button>
			<SignOut>
				<Button slot="submitButton" variant="outline">Sign out</Button>
			</SignOut>
		</div>
	</main>
{:else}
	<main class="flex w-full flex-col items-center justify-start">
		<header
			class=" bg-background border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 mb-2 flex h-14 w-full items-center justify-between gap-4 border-b px-4 backdrop-blur"
		>
			<div class="relatiive flex flex-row items-center justify-start gap-2">
				<img src="/ms-icon-310x310.png" alt="SmartStash Logo" class="h-10" />
				<h3 class="text-xl font-bold">Smart<span class="text-primary">Stash</span></h3>
			</div>
			<SignIn
				options={{
					redirectTo: $page.data.redirectTo
						? `/${decodeURIComponent($page.data.redirectTo).slice(1)}`
						: `/app/dashboard`
				}}
			>
				<Button slot="submitButton">Sign in</Button>
			</SignIn>
		</header>
		<div class=" mb-80 mt-40 flex h-full w-full max-w-md flex-col items-center md:max-w-4xl">
			<h1
				class="mx-auto py-4 text-center text-7xl font-extrabold leading-tight tracking-tighter md:text-9xl lg:leading-[1.1]"
			>
				Smart<span class="text-primary">Stash</span>
			</h1>
			<h3
				class="text-accent-foreground mx-auto text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]"
			>
				Your smart pantry management solution
			</h3>
		</div>
		<section
			class="bg-primary mx-auto flex h-screen w-full flex-col items-center justify-center gap-2 py-20 text-center"
		>
			<h3
				class="text-background z-20 mx-16 max-w-[850px] text-2xl font-medium leading-tight drop-shadow-2xl md:text-3xl [&:not(:first-child)]:mt-6"
			>
				SmartStash revolutionizes the way we approach grocery shopping and pantry management. This
				IoT product is designed to cater to the <span class="font-bold hover:underline"
					>makakalimuting anak</span
				>
				and <span class="font-bold hover:underline">nagtitipid na nanay</span>, offering a seamless,
				tech-driven solution for pantry inventory and shopping needs.
			</h3>
		</section>
		<section
			class=" mx-auto flex h-screen w-full flex-col items-center justify-center gap-2 text-center"
		>
			<div class="canvas-wrapper h-full w-full cursor-pointer rounded-xl drop-shadow-2xl">
				<Canvas>
					<SceneOne />
				</Canvas>
			</div>
		</section>
		<section
			class="mx-auto flex h-full max-w-6xl grid-cols-2 flex-col items-center gap-8 px-4 py-20 md:grid md:h-screen md:gap-16"
		>
			<div>
				<h1 class="text-7xl font-bold tracking-tight drop-shadow-lg">Get your SmartStash today!</h1>
				<p class="mt-6 text-lg">
					SmartStash is the perfect solution for your pantry management needs. Get yours today and
					experience the convenience of a smart pantry.
				</p>
			</div>
			<div class="relative flex h-full items-center justify-center">
				<div
					class="bg-primary-13 product-container h-3/5 w-3/5 transform justify-center rounded-lg border-2 border-solid border-blue-800 shadow-lg transition-transform duration-200 hover:scale-110 hover:shadow-2xl"
				>
					<img
						class=" rounded-t-lg object-cover object-center"
						src={product.imageUrl}
						alt={product.name}
					/>
					<div class="mt-0 px-6 pb-3 pt-3">
						<h2 class="mb-1 text-2xl font-semibold">{product.name}</h2>
						<p class="mb-2 text-gray-400">{product.description}</p>
						<ul class="mb-5 list-disc pl-5 text-gray-400">
							{#each product.features as feature}
								<li>{feature}</li>
							{/each}
						</ul>
						<span class="text-xl font-bold text-green-500">{product.price}</span>
					</div>
				</div>
			</div>
		</section>
	</main>
{/if}
