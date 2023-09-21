import type { Token } from 'marked';
import { writable } from 'svelte/store';
import { parse } from './markdown/markedConfiguration';

export const tokens = writable<Token[]>([]);

export const createInteractive = (token: Token) => {
	const raw = writable(token.raw);
	const editing = writable(false);

	const edit = () => {
		console.log('edit');
		editing.set(true);
	};

	const save = () => {
		console.log('save');
		raw.update((cur) => {
			const new_tokens = parse(cur);
			tokens.update((ts) => {
				const i = ts.findIndex((tk) => tk === token);
				ts.splice(i, 1, ...new_tokens);
				return ts;
			});
			editing.set(false);
			return new_tokens[0].raw;
		});
	};

	return { raw, editing, edit, save };
};
