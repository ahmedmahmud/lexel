<script lang="ts">
	import { EditorState } from '@codemirror/state';
	import { EditorView, highlightActiveLine, keymap } from '@codemirror/view';
	import { defaultKeymap, indentWithTab } from '@codemirror/commands';
	import { markdown } from '@codemirror/lang-markdown';
	import { syntaxHighlighting, syntaxTree } from '@codemirror/language';
	import { headingPlugin, imagePlugin, inlinePlugin, listPlugin } from '$lib/codemirror/live';
	import { baseStyling, markdownHighlighting, transparentTheme } from '$lib/codemirror/styling';
	import { oneDark } from '@codemirror/theme-one-dark';
	import { md } from '$lib/stores';

	export let text: string;
	$md = text;

	let editor: HTMLElement;
	let startState = EditorState.create({
		doc: $md,
		extensions: [
			// Keymap
			keymap.of(defaultKeymap),
			keymap.of([indentWithTab]),

			// Language plugins
			markdown(),
			headingPlugin,
			inlinePlugin,
			listPlugin,
			imagePlugin,

			// Styling
			oneDark,
			transparentTheme,
			baseStyling,
			syntaxHighlighting(markdownHighlighting),
			EditorView.lineWrapping,
			// highlightActiveLine(),

			// App
			EditorView.updateListener.of((update) => ($md = update.state.doc.toString())),
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

<div class="h-full">
	<div bind:this={editor} style="display: contents" />
</div>