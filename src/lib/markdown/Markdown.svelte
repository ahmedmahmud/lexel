<script lang="ts">
	import MarkdownTokens from './MarkdownTokens.svelte';
	import { defaultRenderers, type Renderers } from './markedConfiguration';
	import { suppressWarnings } from './suppressWarnings';
	import type { Root } from 'mdast-util-from-markdown/lib';

	suppressWarnings();

	/**
	 * The markdown tokens
	 */
	export let tokens: Root;

	let actualRenderers: Renderers = defaultRenderers();
</script>

<MarkdownTokens tokens={tokens.children} />
