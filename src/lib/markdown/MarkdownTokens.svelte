<script lang="ts">
	import type {  RootContent } from 'mdast';
	import { renderers } from './markedConfiguration';

	export let tokens: RootContent[];
</script>

{#each tokens as token (token)}
	<svelte:component this={renderers[token.type]} {token} />
{/each}
