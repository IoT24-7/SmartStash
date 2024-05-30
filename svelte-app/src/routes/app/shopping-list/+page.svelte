<script lang="ts">
	import { page } from '$app/stores';
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import { Label } from "$lib/components/ui/label/index.js"
	import { Separator } from "$lib/components/ui/separator/index.js"


	// dummy data
	let shopping_list = [
		{id: "asd",
		currentWeight: "100 g",
		foodName: "Sugar",
		status:"Connected",
		threshold: "50 g",
		userId: "newuser",
		checked: false },
		{id: "asd",
		currentWeight: "100 g",
		foodName: "Salt",
		status:"Connected",
		threshold: "50 g",
		userId: "newuser",
		checked: false}
	]

	

</script>

<!-- [&:nth-child(2)] -->

<div class="relative flex h-full w-full flex-col">
	<main class="flex flex-col gap-2 px-5">
		<h2 class="scroll-m-20 py-4 text-3xl font-extrabold tracking-tight sm:mt-3">Shopping List</h2>
	</main>

	<div class="relative top-5">
		{#each shopping_list as { id, foodName, checked }, i}
			<li class = "flex flex-row items-center justify-between relative left-12">
				
				<div class="flex items-center space-x-2">
					<Label
						id="terms-label"
					  	for="terms"
					  	class="text-2xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 my-3"
						>
						<Checkbox bind:checked={checked} />
						{#if checked}
						<span class="line-through text-primary mx-2"> {foodName} </span>
						{:else}
						<span class="mx-2"> {foodName} </span>
						{/if}
					</Label>
					
				  </div>

			</li>
		{/each}

		

		
	</div>

	
	
</div>
