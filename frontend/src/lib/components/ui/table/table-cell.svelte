<script lang="ts">
	import type { Snippet } from "svelte";
	let { children, colspan }: { children: Snippet; colspan?: number } = $props();
</script>

<td class="p-4 align-middle" {colspan}>{@render children()}</td>
