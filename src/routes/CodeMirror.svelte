<script lang="ts">
	import { EditorState } from '@codemirror/state';
	import { EditorView, highlightActiveLine, keymap } from '@codemirror/view';
	import { defaultKeymap, indentWithTab } from '@codemirror/commands';
	import { markdown } from '@codemirror/lang-markdown';
	import { syntaxHighlighting, syntaxTree } from '@codemirror/language';
	import { headingPlugin, inlinePlugin, listPlugin } from '$lib/codemirror/live';
	import { baseStyling, markdownHighlighting, transparentTheme } from '$lib/codemirror/styling';
	import { oneDark } from '@codemirror/theme-one-dark';

	export let md: string;

	let editor: HTMLElement;
	let startState = EditorState.create({
		doc: md,
		extensions: [
			// Keymap
			keymap.of(defaultKeymap),
			keymap.of([indentWithTab]),

			// Language plugins
			markdown(),
			headingPlugin,
			inlinePlugin,
			listPlugin,

			// Styling
			oneDark,
			transparentTheme,
			baseStyling,
			syntaxHighlighting(markdownHighlighting),
			// highlightActiveLine(),

			// App
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

<div class="flex-grow">
	<div bind:this={editor} style="display: contents" />
</div>