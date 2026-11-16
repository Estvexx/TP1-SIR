<script lang="ts">
	import type { Snippet } from "svelte";
	let { children }: { children: Snippet } = $props();
</script>

<th class="h-11 px-4 text-left align-middle font-medium text-muted-foreground">{@render children()}</th>
