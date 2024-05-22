<script lang="ts">
	import { SignIn, SignOut } from '@auth/sveltekit/components';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
</script>

<main class="flex w-full h-screen justify-center flex-col items-center">
	<div class="flex w-full max-w-sm flex-col items-center mb-16">
		<h1
			class="hidden text-center text-3xl font-bold leading-tight tracking-tighter md:block md:text-6xl lg:leading-[1.1] py-4"
		>
			SmartStash
		</h1>
		{#if $page.data.session?.user}
			<Button variant="outline" href="/dashboard" class="my-2">Go to Dashboard</Button>
			<SignOut>
				<Button slot="submitButton" class="buttonPrimary">Sign out</Button>
			</SignOut>
		{:else}
			<p class="py-2">Sign in to continue</p>
			<SignIn
				options={{
					redirectTo: $page.data.redirectTo
						? `/${decodeURIComponent($page.data.redirectTo).slice(1)}`
						: `/dashboard`
				}}
			>
				<Button slot="submitButton">Sign in</Button>
			</SignIn>
		{/if}
	</div>
</main>
