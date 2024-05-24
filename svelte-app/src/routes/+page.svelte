<script lang="ts">
	import { SignIn, SignOut } from '@auth/sveltekit/components';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
</script>

<main class="mt-40 flex w-full flex-col items-center justify-start">
	<div class=" flex w-full max-w-sm flex-col items-center">
		<h1
			class="py-4 text-center text-5xl font-extrabold leading-tight tracking-tighter md:text-7xl lg:leading-[1.1]"
		>
			Smart<span class="text-primary">Stash</span>
		</h1>
		{#if $page.data.session?.user}
			<Button href="/app/dashboard" class="my-2">Go to Dashboard</Button>
			<SignOut>
				<Button slot="submitButton" variant="outline">Sign out</Button>
			</SignOut>
		{:else}
			<p class="py-2 text-muted-foreground">Sign in to continue</p>
			<SignIn
				options={{
					redirectTo: $page.data.redirectTo
						? `/${decodeURIComponent($page.data.redirectTo).slice(1)}`
						: `/app/dashboard`
				}}
			>
				<Button slot="submitButton">Sign in</Button>
			</SignIn>
		{/if}
	</div>
</main>
