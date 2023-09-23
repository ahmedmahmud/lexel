<script lang="ts">
	import Markdown from '$lib/markdown/Markdown.svelte';
	import { tokens } from '$lib/stores';
	import { parse } from '$lib/markdown/markedConfiguration';

	const string = '# Test *Wow* Back\n';
	$tokens = parse(string);
	$: console.debug('[Internal tree]', $tokens);
</script>

<Markdown tokens={$tokens} />
