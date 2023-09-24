import type { Root } from 'mdast';
import { writable } from 'svelte/store';

export const tokens = writable<Root>();

export const md = writable<string>();
