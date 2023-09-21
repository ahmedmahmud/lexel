import { tokenizer } from '$lib/lexer';
import { fromMarkdown } from 'mdast-util-from-markdown';
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

import type { SvelteComponent } from 'svelte';
import type { Nodes } from 'mdast';

export function parse(src: string) {
	const tokens = fromMarkdown(src);

	console.debug('[Lexer output]', tokens);

	return tokens;
}

export type RendererType = Nodes['type'] | string;

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
