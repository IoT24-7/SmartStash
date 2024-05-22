<script lang="ts">
	import { page } from '$app/stores';
	import { SignOut } from '@auth/sveltekit/components';
	import { Button } from '$lib/components/ui/button';
</script>

<div>
	<p>Welcome, {$page.data.session?.user?.name}!</p>
	<p>Your ID is {$page.data.session?.user?.id}.</p>
	<SignOut options={{ redirectTo: '/' }}>
		<Button slot="submitButton">Sign out</Button>
	</SignOut>
</div>
