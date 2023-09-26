<script lang="ts">
	import { EditorState } from '@codemirror/state';
	import { EditorView, highlightActiveLine, keymap, lineNumbers } from '@codemirror/view';
	import { defaultKeymap, indentWithTab } from '@codemirror/commands';
	import { markdown } from '@codemirror/lang-markdown';
	import { syntaxHighlighting, syntaxTree } from '@codemirror/language';
	import { headingPlugin, imagePlugin, inlinePlugin, listPlugin } from '$lib/codemirror/live';
	import { baseStyling, markdownHighlighting, transparentTheme } from '$lib/codemirror/styling';
	import { oneDark } from '@codemirror/theme-one-dark';
	import { md } from '$lib/stores';
	import { writeBinaryFile, BaseDirectory, exists } from '@tauri-apps/api/fs';

	export let text: string;
	$md = text;

	async function fileExists(path) {
		try {
			return await exists(path, { dir: BaseDirectory.Document });
		} catch (e) {
			return false;
		}
	}

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
			lineNumbers(),
			// highlightActiveLine(),

			// App
			EditorView.updateListener.of((update) => ($md = update.state.doc.toString())),
			EditorView.updateListener.of((update) => {
				if (update.docChanged) {
					console.debug('[Tree]: ', syntaxTree(update.state));
				}
			}),
			EditorView.domEventHandlers({
				paste(event, view) {
					console.debug('[Paste]: ', event.clipboardData?.files);

					const items = event.clipboardData?.items;
					if (items) {
						for (const item of items) {
							if (item.type.indexOf('image') !== -1) {
								const blob = item.getAsFile();
								if (blob) {
									// Write a binary file to the `assets` path
									let fileName = blob.name;
									let count = 1;
									// Use a Promise to wait for the fileExists function to resolve
									(async () => {
										console.log('b4')
										while (await fileExists('lexel/' + fileName)) {
											const extensionIndex = fileName.lastIndexOf('.');
											if (extensionIndex !== -1) {
												fileName = `${fileName.slice(0, extensionIndex)} ${count}${fileName.slice(
													extensionIndex
												)}`;
											} else {
												fileName = `${fileName} ${count}`;
											}
											count++;
										}
										blob.arrayBuffer().then((buffer) => {
											writeBinaryFile('lexel/' + fileName, new Uint8Array(buffer), {
												dir: BaseDirectory.Document
											});
											const encodedFileName = encodeURI(fileName)
											view.dispatch({
												changes: {
													from: view.state.selection.main.from,
													to: view.state.selection.main.to,
													insert: `![${fileName}](${encodedFileName})`
												}
											});
										});
									})();
								}
							} else if (item.type.indexOf('text') !== -1) {
								// Do nothing
							}
						}
					}
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
