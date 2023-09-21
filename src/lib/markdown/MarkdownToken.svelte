<script lang="ts">
	import type { Token } from 'marked';
	import type { Renderers } from './markedConfiguration';
	import MarkdownTokens from './MarkdownTokens.svelte';

	export let token: Token;
	export let renderers: Renderers;
</script>

{#if renderers[token.type]}
	<svelte:component this={renderers[token.type]} {token} {renderers}>
		{#if 'tokens' in token && token['tokens']}
			<MarkdownTokens tokens={token['tokens']} {renderers} />
		{:else}
			{token.raw}
		{/if}
	</svelte:component>
{/if}
