<script lang="ts">
	import type { Nodes } from 'mdast';
	import type { Renderers } from './markedConfiguration';
	import MarkdownTokens from './MarkdownTokens.svelte';

	export let token: Nodes;
	export let renderers: Renderers;
</script>

{#if renderers[token.type]}
	<svelte:component this={renderers[token.type]} {token} {renderers}>
		{#if 'children' in token}
			<MarkdownTokens tokens={token.children} {renderers} />
		{/if}
	</svelte:component>
{/if}
