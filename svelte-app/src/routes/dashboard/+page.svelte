<script lang="ts">
	import { page } from '$app/stores';
	import { SignOut } from '@auth/sveltekit/components';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="relative flex min-h-screen flex-col w-full">
	<div class="h-14"></div>
	<main class="flex flex-col gap-2 p-5">
		<h2 class="scroll-m-20 text-3xl font-extrabold tracking-tight ">Dashboard</h2>
		<p>Welcome, {$page.data.session?.user?.name}!</p>
		<p>Your ID is {$page.data.session?.user?.id}.</p>
		<SignOut options={{ redirectTo: '/' }}>
			<Button slot="submitButton">Sign out</Button>
		</SignOut>
	</main>
</div>
