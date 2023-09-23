<script lang="ts">
	import { EditorState } from '@codemirror/state';
	import {
		Decoration,
		EditorView,
		ViewPlugin,
		WidgetType,
		keymap,
		type DecorationSet,
		ViewUpdate
	} from '@codemirror/view';
	import { defaultKeymap } from '@codemirror/commands';
	import { markdown } from '@codemirror/lang-markdown';
	import { tags } from '@lezer/highlight';
	import { syntaxHighlighting, HighlightStyle, syntaxTree } from '@codemirror/language';

	let editor: HTMLElement;

	const markdownHighlighting = HighlightStyle.define([
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

	function headings(view: EditorView) {
		let widgets: any = [];
		for (let { from, to } of view.visibleRanges) {
			syntaxTree(view.state).iterate({
				from,
				to,
				enter: (node) => {
					const node_line = view.state.doc.lineAt(node.from).number;
					const cursor_line = view.state.doc.lineAt(view.state.selection.main.head).number;
					const show_markup = node_line === cursor_line;
					if (node.name == 'ATXHeading1' && !show_markup) {
						let deco = Decoration.replace({});
						widgets.push(deco.range(node.from, node.from + 2));
					}
				}
			});
		}
		return Decoration.set(widgets);
	}

	const headingPlugin = ViewPlugin.fromClass(
		class {
			decorations: DecorationSet;

			constructor(view: EditorView) {
				this.decorations = headings(view);
			}

			update(update: ViewUpdate) {
				if (update.docChanged || update.viewportChanged || update.selectionSet)
					this.decorations = headings(update.view);
			}
		},
		{
			decorations: (v) => v.decorations
		}
	);

	function inlines(view: EditorView) {
		let widgets: any = [];
		for (let { from, to } of view.visibleRanges) {
			syntaxTree(view.state).iterate({
				from,
				to,
				enter: (node) => {
					const cursor_pos = view.state.selection.main.head;
					const hide_markup = cursor_pos < node.from || cursor_pos > node.to;
					let deco = Decoration.replace({});

					if (hide_markup) {
						// *lorem*
						if (node.name == 'Emphasis') {
							widgets.push(deco.range(node.from, node.from + 1));
							widgets.push(deco.range(node.to - 1, node.to));
						}

						// **lorem**
						if (node.name == 'StrongEmphasis') {
							widgets.push(deco.range(node.from, node.from + 2));
							widgets.push(deco.range(node.to - 2, node.to));
						}
					}
				}
			});
		}
		return Decoration.set(widgets);
	}

	const inlinePlugin = ViewPlugin.fromClass(
		class {
			decorations: DecorationSet;

			constructor(view: EditorView) {
				this.decorations = inlines(view);
			}

			update(update: ViewUpdate) {
				if (update.docChanged || update.viewportChanged || update.selectionSet)
					this.decorations = inlines(update.view);
			}
		},
		{
			decorations: (v) => v.decorations
		}
	);

	let startState = EditorState.create({
		doc: '# Hello World',
		extensions: [
			keymap.of(defaultKeymap),
			markdown(),
			syntaxHighlighting(markdownHighlighting),
			headingPlugin,
			inlinePlugin
		]
	});

	$: view = new EditorView({
		state: startState,
		parent: editor
	});
</script>

<div bind:this={editor} style="display: contents" />
