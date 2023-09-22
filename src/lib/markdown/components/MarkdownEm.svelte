<script lang="ts">
	import type { Emphasis } from 'mdast';
	import { renderers } from '../markedConfiguration';

	export let token: Emphasis;
	export let highlighted: boolean;
	export let id: string;
	$: children = token.children;
</script>

<em id={id}>
	{highlighted ? '*' : ''}{#each children as token (token)}
		<svelte:component this={renderers[token.type]} {token} />{/each}{highlighted ? '*' : ''}
</em>
