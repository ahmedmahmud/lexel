<script lang="ts">
	import type { Token } from 'marked';
	import MarkdownTokens from './MarkdownTokens.svelte';
	import { parse, type Renderers } from './markedConfiguration';
	import { tokens } from '$lib/stores';

	export let token: Token;
	export let renderers: Renderers;

	let mode = 0;
	let raw = token.raw;

	const edit = () => {
		console.log('click');
		mode = 1;
	};

	const save = () => {
		const new_tokens = parse(raw);
		// token = new_token[0];
		tokens.update((ts) => {
			const i = ts.findIndex((tk) => tk === token);
			ts.splice(i, 1, ...new_tokens);
			return ts;
		});
		raw = new_tokens[0].raw;
		mode = 0;
	};
</script>

{#if renderers[token.type]}
	{#if mode === 0}
		<svelte:component this={renderers[token.type]} {token} {renderers} on:click={edit}>
			{#if 'tokens' in token && token['tokens']}
				<MarkdownTokens tokens={token['tokens']} {renderers} />
			{:else}
				{token.raw}
			{/if}
		</svelte:component>
	{:else}
		<textarea bind:value={raw} on:blur={save} />
	{/if}
{/if}
