<script lang="ts">
	// @ts-nocheck

	import '@fontsource-variable/manrope';
	import '../app.css';
	import { page } from '$app/stores';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Home from 'lucide-svelte/icons/home';
	import Bell from 'lucide-svelte/icons/bell';
	import PanelLeft from 'lucide-svelte/icons/panel-left';
	import Settings from 'lucide-svelte/icons/settings';
	import ShoppingCart from 'lucide-svelte/icons/shopping-cart';
	import { SignOut } from '@auth/sveltekit/components';
	import { ModeWatcher } from 'mode-watcher';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import { resetMode, setMode } from 'mode-watcher';

	const appName = 'SmartStash';
	let title = appName;
	$: {
		if ($page.url.pathname.startsWith('/app')) {
			let pathParts = $page.url.pathname.split('/');
			let appIndex = pathParts.indexOf('app');
			title = pathParts[appIndex + 1];
			if (title === 'shopping-list') {
				title = 'Shopping List';
			} else {
				title = title.charAt(0).toUpperCase() + title.slice(1);
			}
		} else {
			title = 'SmartStash';
		}
	}
	const themeColors = {
		dark: '#020817',
		light: '#ffffff'
	};
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>
<ModeWatcher {themeColors} />
{#if $page.data.session?.user && $page.route.id !== '/'}
	<div class="flex min-h-screen w-full flex-col bg-muted/40">
		<aside class="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
			<nav class="flex flex-col items-start gap-2 px-2 sm:py-5">
				<div class="mb-2 flex w-full flex-row items-center justify-between">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button variant="ghost" class="h-auto items-start justify-start" builders={[builder]}>
								<div class="flex flex-row items-center gap-2">
									<Avatar.Root class="h-8 w-8">
										<Avatar.Image src={$page.data.session.user.image} alt={$page.data.session.user.name} />
										<Avatar.Fallback
											>{$page.data.session?.user?.name[0]}{$page.data.session?.user?.name
												.split(' ')
												.pop()?.[0]}</Avatar.Fallback
										>
									</Avatar.Root>
									<p class="text-lg font-bold tracking-tight">
										{$page.data.session?.user?.name.split(' ')[0]}
									</p>
								</div>
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="start" class="w-60">
							<DropdownMenu.Label
								><p>Welcome, {$page.data.session?.user?.name}!</p></DropdownMenu.Label
							>
							<DropdownMenu.Separator />
							<a href="/app/settings">
								<DropdownMenu.Item class="cursor-pointer">Settings</DropdownMenu.Item></a
							>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>
								<SignOut options={{ redirectTo: '/' }}>
									<div slot="submitButton" class="flex w-56 items-start">Sign out</div>
								</SignOut>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button builders={[builder]} variant="ghost" size="icon">
								<Sun
									class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
								/>
								<Moon
									class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
								/>
								<span class="sr-only">Toggle theme</span>
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end">
							<DropdownMenu.Item on:click={() => setMode('light')}>Light</DropdownMenu.Item>
							<DropdownMenu.Item on:click={() => setMode('dark')}>Dark</DropdownMenu.Item>
							<DropdownMenu.Item on:click={() => resetMode()}>System</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
				<a href="/app/dashboard" class="w-full">
					<div
						class="colors flex w-full justify-start rounded-lg py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground {$page.route.id?.startsWith(
							'/app/dashboard'
						)
							? 'bg-primary/15 text-primary hover:bg-primary/15 hover:text-primary'
							: ''}"
					>
						<div class="flex items-center gap-4 px-4">
							<Home class="h-5 w-5" />
							<p class="text-lg font-medium">Dashboard</p>
						</div>
					</div>
				</a>
				<a href="/app/shopping-list" class="w-full">
					<div
						class="colors flex w-full justify-start rounded-lg py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground {$page.route.id?.startsWith(
							'/app/shopping-list'
						)
							? 'bg-primary/15 text-primary hover:bg-primary/15 hover:text-primary'
							: ''}"
					>
						<div href="/app/shopping-list" class="flex items-center gap-4 px-4">
							<ShoppingCart class="h-5 w-5" />
							<p class="text-lg font-medium">Shopping List</p>
						</div>
					</div>
				</a>
				<a href="/app/notifications" class="w-full">
					<div
						class="colors flex w-full justify-start rounded-lg py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground {$page.route.id?.startsWith(
							'/app/notifications'
						)
							? 'bg-primary/15 text-primary hover:bg-primary/15 hover:text-primary'
							: ''}"
					>
						<div class="flex items-center gap-4 px-4">
							<Bell class="h-5 w-5" />
							<p class="text-lg font-medium">Notifications</p>
						</div>
					</div>
				</a>
			</nav>
			<nav class="mt-auto flex flex-col items-start gap-4 px-2 sm:py-5">
				<a href="/app/settings" class="w-full">
					<div
						class="colors flex w-full justify-start rounded-lg py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground {$page.route.id?.startsWith(
							'/app/settings'
						)
							? 'bg-primary/15 text-primary hover:bg-primary/15 hover:text-primary'
							: ''}"
					>
						<div class="flex items-center gap-4 px-4">
							<Settings class="h-5 w-5" />
							<p class="text-lg font-medium">Settings</p>
						</div>
					</div>
				</a>
			</nav>
		</aside>
		<div class="flex flex-col sm:gap-4 sm:py-14 sm:pl-64">
			<header
				class="sticky top-0 z-30 mb-2 flex h-14 items-center gap-4 border-b bg-background px-4 sm:hidden"
			>
				<Sheet.Root>
					<Sheet.Trigger asChild let:builder>
						<Button builders={[builder]} size="icon" variant="outline" class="sm:hidden">
							<PanelLeft class="h-5 w-5" />
							<span class="sr-only">Toggle Menu</span>
						</Button>
					</Sheet.Trigger>
					<Sheet.Content side="left" class="max-w-64">
						<nav class="grid gap-6 text-lg font-medium">
							<div class="flex w-full flex-row items-center justify-between">
								<DropdownMenu.Root>
									<DropdownMenu.Trigger asChild let:builder>
										<Button
											variant="ghost"
											class="h-auto items-start justify-start"
											builders={[builder]}
										>
											<div class="flex flex-row items-center gap-2">
												<Avatar.Root class="h-8 w-8">
													<Avatar.Image src={$page.data.session.user.image} />
													<Avatar.Fallback
														>{$page.data.session?.user?.name[0]}{$page.data.session?.user?.name
															.split(' ')
															.pop()?.[0]}</Avatar.Fallback
													>
												</Avatar.Root>
												<p class="text-lg font-bold tracking-tight">
													{$page.data.session?.user?.name.split(' ')[0]}
												</p>
											</div>
										</Button>
									</DropdownMenu.Trigger>
									<DropdownMenu.Content align="start" class="w-52">
										<DropdownMenu.Label
											><p>Welcome, {$page.data.session?.user?.name}!</p></DropdownMenu.Label
										>
										<DropdownMenu.Separator />
										<a href="/app/settings">
											<DropdownMenu.Item class="cursor-pointer">Settings</DropdownMenu.Item></a
										>
										<DropdownMenu.Separator />
										<DropdownMenu.Item>
											<SignOut options={{ redirectTo: '/' }}>
												<div slot="submitButton" class="flex w-56 items-start">Sign out</div>
											</SignOut>
										</DropdownMenu.Item>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</div>
							<a href="/app/dashboard" class="w-full">
								<div
									class="colors flex w-full justify-start rounded-lg py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground {$page.route.id?.startsWith(
										'/app/dashboard'
									)
										? 'bg-primary/15 text-primary hover:bg-primary/15 hover:text-primary'
										: ''}"
								>
									<div class="flex items-center gap-4 px-4">
										<Home class="h-5 w-5" />
										<p class="text-lg font-medium">Dashboard</p>
									</div>
								</div>
							</a>
							<a href="/app/shopping-list" class="w-full">
								<div
									class="colors flex w-full justify-start rounded-lg py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground {$page.route.id?.startsWith(
										'/app/shopping-list'
									)
										? 'bg-primary/15 text-primary hover:bg-primary/15 hover:text-primary'
										: ''}"
								>
									<div class="flex items-center gap-4 px-4">
										<ShoppingCart class="h-5 w-5" />
										<p class="text-lg font-medium">Shopping List</p>
									</div>
								</div>
							</a>
							<a href="/app/notifications" class="w-full">
								<div
									class="colors flex w-full justify-start rounded-lg py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground {$page.route.id?.startsWith(
										'/app/notifications'
									)
										? 'bg-primary/15 text-primary hover:bg-primary/15 hover:text-primary'
										: ''}"
								>
									<div class="flex items-center gap-4 px-4">
										<Bell class="h-5 w-5" />
										<p class="text-lg font-medium">Notifications</p>
									</div>
								</div>
							</a>
							<a href="/app/settings" class="w-full">
								<div
									class="colors flex w-full justify-start rounded-lg py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground {$page.route.id?.startsWith(
										'/app/settings'
									)
										? 'bg-primary/15 text-primary hover:bg-primary/15 hover:text-primary'
										: ''}"
								>
									<div class="flex items-center gap-4 px-4">
										<Settings class="h-5 w-5" />
										<p class="text-lg font-medium">Settings</p>
									</div>
								</div>
							</a>
						</nav>
					</Sheet.Content>
				</Sheet.Root>
				<div class="relative ml-auto flex-1 md:grow-0"></div>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button builders={[builder]} variant="outline" size="icon">
							<Sun
								class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
							/>
							<Moon
								class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
							/>
							<span class="sr-only">Toggle theme</span>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Item on:click={() => setMode('light')}>Light</DropdownMenu.Item>
						<DropdownMenu.Item on:click={() => setMode('dark')}>Dark</DropdownMenu.Item>
						<DropdownMenu.Item on:click={() => resetMode()}>System</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</header>
			<slot />
		</div>
	</div>
{:else}
	<slot />
{/if}

<style></style>
