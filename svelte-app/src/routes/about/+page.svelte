<script lang="ts">
	// @ts-nocheck
	import { Canvas } from '@threlte/core';
	import SceneOne from '/src/routes/about/SceneOne.svelte';
	const appName = 'SmartStash';
	let title = appName;
	title = title.charAt(0).toUpperCase() + title.slice(1);
	let product = {
		name: 'SmartStash',
		description: 'The smart solution to manage your pantry.',
		// TODO: UPDATE PRICE
		price: '₱400.00',
		imageUrl: '/device_pic1.jpg',
		features: [
			'Measures remaining ingredients.',
			'Alerts when stocks are low.',
			'Keeps grocery list up-to-date.'
		]
	};
</script>

<h2 class="ml-5 scroll-m-20 py-4 text-3xl font-extrabold tracking-tight sm:mt-3">
	About {title}
</h2>
<div class=" relative flex w-screen flex-col">
	<main class="flex flex-col items-center px-5">
		<p class="p-0 text-lg">SmartStash Device 3D Model</p>
		<div class="mb-11 flex flex-col items-center justify-center space-y-5">
			<section class="p-2 pb-1 pt-0">
				<div class="canvas-wrapper h-[500px] w-[100vh] cursor-pointer">
					<Canvas>
						<SceneOne />
					</Canvas>
				</div>
				<div class="flex flex-row justify-center">
					<div class="flex flex-row">
						<p class="text-sm">Model generated using</p>
						<a
							href="https://www.tripo3d.ai"
							target="_blank"
							class="hover: ml-1 mr-1 text-sm font-extrabold text-green-500 decoration-solid hover:text-green-800 hover:underline"
						>
							Tripo3d.ai</a
						>
						<p class="text-sm">background from</p>
						<a
							href="https://polyhaven.com"
							target="_blank"
							class="hover: ml-1 text-sm font-extrabold text-green-500 decoration-solid hover:text-green-800 hover:underline"
						>
							poly haven</a
						>
					</div>
				</div>
			</section>

			<div
				class="bg-primary-13 product-container rounded-lg border-2 border-solid border-blue-800 shadow-lg"
			>
				<img
					class="h-[200px] w-[420px] rounded-t-lg object-cover object-center"
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
	</main>
</div>

<a href="/" class="bottom-0 left-0 m-20 pb-10 hover:text-blue-800 hover:underline">Back to Home</a>
