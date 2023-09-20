import { tokenizer } from '$lib/lexer';
import {
	MarkdownHeading,
	MarkdownBloquote,
	MarkdownList,
	MarkdownListItem,
	MarkdownBr,
	MarkdownCode,
	MarkdownCodeSpan,
	MarkdownTable,
	MarkdownHtml,
	MarkdownParagraph,
	MarkdownLink,
	MarkdownText,
	MarkdownDfn,
	MarkdownDel,
	MarkdownEm,
	MarkdownHr,
	MarkdownStrong,
	MarkdownImage,
	MarkdownSpace
} from './components';

import { marked } from 'marked';
import type { Token } from 'marked';
import type { SvelteComponent } from 'svelte';

export function parse(src: string) {
	marked.use({
		gfm: true,
		tokenizer
	});

	const tokens = marked.lexer(src);
	console.debug('[Lexer output]', tokens);

	return tokens;
}

export type RendererType = Token['type'] | string;

// TODO: Fix this type
export type Renderers = Record<RendererType, typeof SvelteComponent<any, any, any>>;

export const defaultRenderers = (): Renderers => ({
	heading: MarkdownHeading,
	blockquote: MarkdownBloquote,
	list: MarkdownList,
	list_item: MarkdownListItem,
	br: MarkdownBr,
	code: MarkdownCode,
	codespan: MarkdownCodeSpan,
	table: MarkdownTable,
	html: MarkdownHtml,
	paragraph: MarkdownParagraph,
	link: MarkdownLink,
	text: MarkdownText,
	def: MarkdownDfn,
	del: MarkdownDel,
	em: MarkdownEm,
	hr: MarkdownHr,
	strong: MarkdownStrong,
	image: MarkdownImage,
	space: MarkdownSpace,
	escape: MarkdownSpace
});
