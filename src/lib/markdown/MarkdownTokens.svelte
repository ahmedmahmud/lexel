<script lang="ts">
	import type {  RootContent } from 'mdast';
	import type { Renderers } from './markedConfiguration';
	import MarkdownToken from './MarkdownToken.svelte';

	export let tokens: RootContent[];
	export let renderers: Renderers;
</script>

{#each tokens as token (token)}
	<MarkdownToken {token} {renderers} />
{/each}
