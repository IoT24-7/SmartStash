<script lang="ts">
	import { SignIn, SignOut } from '@auth/sveltekit/components';
	import { Button } from '$lib/components/ui/button';
    import { page } from '$app/stores';
</script>

<div>
	<p>SmartStash</p>
    {#if $page.data.session?.user}
        <p>Welcome, {$page.data.session.user.name}!</p>
        <p>Your ID is {$page.data.session.user.id}.</p>
        <SignOut>
            <Button slot="submitButton" class="buttonPrimary">Sign out</Button>
        </SignOut>
    {:else}
        <p>Sign in to continue</p>
        <SignIn>
            <Button slot="submitButton" class="buttonPrimary">Sign in</Button>
        </SignIn>
    {/if}
</div>
