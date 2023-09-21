import type { Nodes, Parent, Root } from 'mdast';
import { writable } from 'svelte/store';
import { parse } from './markdown/markedConfiguration';
import { toMarkdown } from 'mdast-util-to-markdown';

export const tokens = writable<Root>();

export const createInteractive = (token: Parent & Nodes) => {
	const raw = writable(toMarkdown(token));
	const editing = writable(false);

	const edit = () => {
		console.log('edit');
		editing.set(true);
	};

	const save = () => {
		console.log('save');
		raw.update((cur) => {
			const new_tokens = parse(cur);
			// tokens.update((ts) => {
			// 	const i = ts.findIndex((tk) => tk === token);
			// 	ts.splice(i, 1, ...new_tokens);
			// 	return ts;
			// });
			editing.set(false);
			return toMarkdown(new_tokens.children[0]);
		});
	};

	return { raw, editing, edit, save };
};
