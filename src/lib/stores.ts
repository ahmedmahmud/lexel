import type { Node, Nodes, Parent, Root } from 'mdast';
import { writable } from 'svelte/store';
import { parse } from './markdown/markedConfiguration';
import { toMarkdown } from 'mdast-util-to-markdown';
import { modifyChildren } from 'unist-util-modify-children';
import { is } from 'unist-util-is';
import { gfmToMarkdown } from 'mdast-util-gfm';

export const tokens = writable<Root>();

// export const createInteractive = (token: Parent & Nodes) => {
// 	const raw = writable(toMarkdown(token, {extensions: [gfmToMarkdown()]}).trim());
// 	const editing = writable(false);

// 	const edit = (input: HTMLInputElement, raw: string) => {
// 		console.log('edit');
// 		const { selectionStart, selectionEnd } = input
// 		console.log(selectionStart, selectionEnd);
// 		input.textContent = raw
// 		editing.set(true);
// 		input.setSelectionRange(selectionStart, selectionEnd);
// 	};

// 	const save = (orig_node: Node) => {
// 		console.log('save');
// 		raw.update((cur) => {
// 			const { children } = parse(cur);
// 			const [new_node] = children;

// 			tokens.update((ts) => {
// 				const modify = modifyChildren((node, index, parent) => {
// 					if (is(node, orig_node)) {
// 						parent.children.splice(index, 1, new_node);
// 						return index + 1;
// 					}
// 				});

// 				modify(ts);
// 				console.log("hi", ts)
// 				return ts;
// 			});

// 			editing.set(false);
// 			return toMarkdown(new_node, {extensions: [gfmToMarkdown()]}).trim();
// 		});
// 	};

// 	return { raw, editing, edit, save };
// };
