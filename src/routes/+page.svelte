<script lang="ts">
	import { marked, type Token } from 'marked';
	import Markdown from '$lib/markdown/Markdown.svelte';
	import { tokens } from '$lib/stores';
	import { onMount } from 'svelte';
	import { parse } from '$lib/markdown/markedConfiguration';

	const string = '# Test\n';

	let cur_tokens: Token[] = [];
	tokens.subscribe((upd) => (cur_tokens = upd));

	onMount(() => {
		tokens.set(parse(string));
	});

	console.log()
</script>

<Markdown tokens={cur_tokens} />

<p style="white-space: pre-line;">
	{"wow \n crazy"}
</p>

{@html marked.parse("wow\nvery")}