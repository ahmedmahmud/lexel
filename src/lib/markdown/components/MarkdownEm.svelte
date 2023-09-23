<script lang="ts">
	import type { Emphasis } from 'mdast';
	import { renderers } from '../markedConfiguration';

	export let token: Emphasis;
	export let id: string;
	export let cursor_offset: number;
	$: children = token.children;
	$: show =
		cursor_offset >= token.position?.start.column! - 1 &&
		cursor_offset <= token.position?.end.column!;
	$: show, console.log('yeah', cursor_offset, show);
</script>

<em {id}>
	{show ? '*' : 'r'}{#each children as token (token)}<svelte:component this={renderers[token.type]} {token} />{/each}{show ? '*' : 'r'}{show ? '*' : 'r'}
</em>
