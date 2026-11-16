<script lang="ts">
	import type { Snippet } from "svelte";
	let { children }: { children: Snippet } = $props();
</script>

<tbody class="[&_tr:last-child]:border-0">{@render children()}</tbody>
