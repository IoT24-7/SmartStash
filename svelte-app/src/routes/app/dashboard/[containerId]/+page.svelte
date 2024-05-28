<script>
// @ts-nocheck

	export let data;
	console.log(data);
	const containerData = data.container;

	import { mediaQuery } from 'svelte-legos';
	let open = false;
	const isDesktop = mediaQuery('(min-width: 640px)');
</script>

<div class="relative flex h-full w-full flex-col">
	<main class="flex flex-col gap-2 px-5">
		<h2 class="scroll-m-20 py-4 text-3xl font-extrabold tracking-tight sm:mt-3">
			{containerData.foodName}
		</h2>
	</main>
</div>
