<script lang="ts">
	import type { Token } from 'marked';

	import MarkdownTokens from './MarkdownTokens.svelte';
	import { defaultRenderers, type Renderers } from './markedConfiguration';
	import { suppressWarnings } from './suppressWarnings';

	suppressWarnings();

	/**
	 * The markdown tokens
	 */
	export let tokens: Token[];

	let actualRenderers: Renderers = defaultRenderers();
</script>

<MarkdownTokens {tokens} renderers={actualRenderers} />
