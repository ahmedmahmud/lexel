import { HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { EditorView } from 'codemirror';

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

export const baseStyling = EditorView.theme({
	'.cm-line': {
		fontFamily: 'JetBrains Mono',
		fontSize: '1.5em'
	}
})

export const transparentTheme = EditorView.theme({
  '&': {
    backgroundColor: 'transparent !important',
    height: '100%'
  }
})
