<script lang="ts">
	import type { Token } from 'marked';
	import Markdown from '$lib/markdown/Markdown.svelte';
	import { tokens } from '$lib/stores';
	import { onMount } from 'svelte';
	import { parse } from '$lib/markdown/markedConfiguration';

	const string = '# Test\n';
	$tokens = parse(string);
	// let cur_tokens: Token[] = $tokens;
	$: console.debug('[Internal tree]', $tokens);
</script>

<Markdown tokens={$tokens} />
