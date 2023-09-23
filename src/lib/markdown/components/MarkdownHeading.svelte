<script lang="ts">
	import { tokens } from '$lib/stores';
	import type { Heading } from 'mdast';
	import { gfmToMarkdown } from 'mdast-util-gfm';
	import { toMarkdown } from 'mdast-util-to-markdown';
	import { parse, renderers } from '../markedConfiguration';
	import { modifyChildren } from 'unist-util-modify-children';
	import { is } from 'unist-util-is';

	export let token: Heading;
	$: children = token.children;

	let input: HTMLElement;
	let raw: string = toMarkdown(token, { extensions: [gfmToMarkdown()] }).trim();
	let editing = false;
	let cursor_offset = 0;

	const edit = () => {
		console.log('edit');

		var sel = document.getSelection()!;
		sel.modify('extend', 'backward', 'paragraphboundary');
		var pos = sel.toString().length;
		if (sel.anchorNode != undefined) sel.collapseToEnd();
		cursor_offset = pos + token.depth + 1; // account for heading md

		// input.textContent = raw;
		editing = true;
	};

	const save = () => {
		console.log('save');

		const { children } = parse(raw);
		const [new_node] = children;

		const modify = modifyChildren((node, index, parent) => {
			if (is(node, token)) {
				parent.children.splice(index, 1, new_node);
				return index + 1;
			}
		});
		modify($tokens);
		$tokens = $tokens;

		editing = false;
		raw = toMarkdown(new_node, { extensions: [gfmToMarkdown()] }).trim();
	};

	const update = (e: KeyboardEvent) => {
		switch (e.key) {
			case 'ArrowLeft':
			case 'ArrowRight':
				var sel = document.getSelection()!;
				sel.modify('extend', 'backward', 'paragraphboundary');
				var pos = sel.toString().length;
				if (sel.anchorNode != undefined) sel.collapseToEnd();
				cursor_offset = pos + token.depth + 1; // account for heading md
				break;

			case 'Control':
				var sel = document.getSelection()!;
				sel.modify('extend', 'backward', 'paragraphboundary');
				var pos = sel.toString().length;
				if (sel.anchorNode != undefined) sel.collapseToEnd();
				console.log('debug', pos)
				e.stopPropagation()
				e.preventDefault()
				return false;

			default:
				break;
		}
	};

	// const test = (e: KeyboardEvent) => {
	// 	switch (e.key) {
	// 		case 'ArrowLeft':
	// 			var sel = document.getSelection()!;
	// 			sel.modify('extend', 'backward', 'paragraphboundary');
	// 			var pos = sel.toString().length;
	// 			if (sel.anchorNode != undefined) sel.collapseToEnd();
	// 			cursor_offset = pos + token.depth + 1; // account for heading md
	// 			break;

	// 		default:
	// 			break;
	// 	}
	// };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
	this={`h${token.depth}`}
	bind:this={input}
	on:click={edit}
	on:blur={save}
	on:keyup={update}
	contenteditable
>
	{#each children as token, i (token)}
		<svelte:component this={renderers[token.type]} {token} id={i} {cursor_offset} />
	{/each}
</svelte:element>
