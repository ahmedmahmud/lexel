<script lang="ts">
	import { EditorState } from '@codemirror/state';
	import { EditorView, keymap } from '@codemirror/view';
	import { defaultKeymap } from '@codemirror/commands';
	import { markdown } from '@codemirror/lang-markdown';
	import { syntaxHighlighting } from '@codemirror/language';
	import { headingPlugin, inlinePlugin } from '$lib/codemirror/live';
	import { markdownHighlighting } from '$lib/codemirror/styling';

	let editor: HTMLElement;
	let md: string = '# Hello World\n\n\n\nwow';

	let startState = EditorState.create({
		doc: md,
		extensions: [
			keymap.of(defaultKeymap),
			markdown(),
			syntaxHighlighting(markdownHighlighting),
			headingPlugin,
			inlinePlugin,
			EditorView.updateListener.of((update) => (md = update.state.doc.toString()))
		]
	});

	$: view = new EditorView({
		state: startState,
		parent: editor
	});

</script>

<div bind:this={editor} style="display: contents" />

<div>{md}</div>
