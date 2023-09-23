<script lang="ts">
	import { EditorState } from '@codemirror/state';
	import { EditorView, keymap } from '@codemirror/view';
	import { defaultKeymap, indentWithTab } from '@codemirror/commands';
	import { markdown } from '@codemirror/lang-markdown';
	import { syntaxHighlighting, syntaxTree } from '@codemirror/language';
	import { headingPlugin, inlinePlugin, listPlugin } from '$lib/codemirror/live';
	import { markdownHighlighting } from '$lib/codemirror/styling';

	let editor: HTMLElement;
	let md: string = '# Hello World\n\n\n\nwow';

	let startState = EditorState.create({
		doc: md,
		extensions: [
			keymap.of(defaultKeymap),
			keymap.of([indentWithTab]),
			markdown(),
			syntaxHighlighting(markdownHighlighting),
			headingPlugin,
			inlinePlugin,
			listPlugin,
			EditorView.updateListener.of((update) => (md = update.state.doc.toString())),
			EditorView.updateListener.of((update) => {
				if (update.docChanged) {
					console.debug('[Tree]: ', syntaxTree(update.state));
				}
			})
		]
	});

	$: view = new EditorView({
		state: startState,
		parent: editor
	});
</script>

<div bind:this={editor} style="display: contents" />

<div>{md}</div>
