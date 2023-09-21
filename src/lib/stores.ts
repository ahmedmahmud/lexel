import type { Token } from 'marked';
import { writable } from 'svelte/store';

export const tokens = writable<Token[]>([]);
