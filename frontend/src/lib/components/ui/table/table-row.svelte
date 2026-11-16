<script lang="ts">
	import type { Snippet } from "svelte";
	let { children }: { children: Snippet } = $props();
</script>

<tr class="border-b border-border transition-colors hover:bg-muted/40">{@render children()}</tr>
