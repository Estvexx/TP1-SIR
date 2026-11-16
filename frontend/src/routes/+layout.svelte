<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import * as Sidebar from "#lib/components/ui/sidebar/index.js";
	import AppSidebar from "#lib/components/app-sidebar.svelte";
	import { Toaster } from "#lib/components/ui/sonner/index.js";
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header class="flex h-16 items-center border-b border-border px-5">
			<Sidebar.Trigger aria-label="Abrir ou fechar menu" />
		</header>
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>
<Toaster position="top-right" richColors />
