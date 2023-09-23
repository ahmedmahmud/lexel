import { HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';

export const markdownHighlighting = HighlightStyle.define([
	{ tag: tags.heading1, fontSize: '1.6em', fontWeight: 'bold' },
	{
		tag: tags.heading2,
		fontSize: '1.4em',
		fontWeight: 'bold'
	},
	{
		tag: tags.heading3,
		fontSize: '1.2em',
		fontWeight: 'bold'
	},
	{
		tag: tags.strong,
		fontWeight: 'bold'
	},

	{
		tag: tags.emphasis,
		fontStyle: 'italic'
	}
]);
