<script>
	// @ts-nocheck

	import '@fontsource-variable/manrope';
	import '../app.css';
	import { page } from '$app/stores';
	import * as Avatar from '$lib/components/ui/avatar';
</script>

{#if $page.data.session?.user && $page.route.id !== '/'}
	<div class="flex flex-row">
		<nav class="hidden min-h-screen bg-secondary px-2 md:block md:w-64">
			<div class="flex flex-row items-center gap-2 m-3">
				<Avatar.Root class="h-8 w-8">
					<Avatar.Image src={$page.data.session.user.image} />
					<Avatar.Fallback
						>{$page.data.session?.user?.name[0]}{$page.data.session?.user?.name
							.split(' ')
							.pop()?.[0]}</Avatar.Fallback
					>
				</Avatar.Root>
				<p class="text-sm font-bold tracking-tight">
					{$page.data.session?.user?.name.split(' ')[0]}
				</p>
			</div>
			<ul class="space-y-6">
				<li><a class="text-sm" href="/dashboard">Dashboard</a></li>
				<li><a class="text-sm" href="/shopping-list">Shopping List</a></li>
				<li><a class="text-sm" href="/notifications">Notifications</a></li>
				<li><a class="text-sm" href="/settings">Settings</a></li>
			</ul>
		</nav>
		<slot />
	</div>
{:else}
	<slot />
{/if}

<style></style>
