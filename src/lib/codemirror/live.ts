import {
	Decoration,
	EditorView,
	ViewPlugin,
	type DecorationSet,
	ViewUpdate
} from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';

const hide = Decoration.replace({});

const headings = (view: EditorView) => {
	let widgets: any = [];
	for (let { from, to } of view.visibleRanges) {
		syntaxTree(view.state).iterate({
			from,
			to,
			enter: (node) => {
				const heading_regex = /ATXHeading([1-6)])/;
				const match = node.name.match(heading_regex);
        console.log(match);
				if (match) {
					const depth = parseInt(match[1]);
					const node_line = view.state.doc.lineAt(node.from).number;
					const cursor_line = view.state.doc.lineAt(view.state.selection.main.head).number;
					const hide_markup = node_line !== cursor_line;
					if (hide_markup) {
						widgets.push(hide.range(node.from, node.from + depth + 1));
					}
				}
			}
		});
	}
	return Decoration.set(widgets);
};

export const headingPlugin = ViewPlugin.fromClass(
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

const inlines = (view: EditorView) => {
	let widgets: any = [];
	for (let { from, to } of view.visibleRanges) {
		syntaxTree(view.state).iterate({
			from,
			to,
			enter: (node) => {
				const cursor_pos = view.state.selection.main.head;
				const hide_markup = cursor_pos < node.from || cursor_pos > node.to;

				if (hide_markup) {
					// *lorem*
					if (node.name == 'Emphasis') {
						widgets.push(hide.range(node.from, node.from + 1));
						widgets.push(hide.range(node.to - 1, node.to));
					}

					// **lorem**
					if (node.name == 'StrongEmphasis') {
						widgets.push(hide.range(node.from, node.from + 2));
						widgets.push(hide.range(node.to - 2, node.to));
					}
				}
			}
		});
	}
	return Decoration.set(widgets);
};

export const inlinePlugin = ViewPlugin.fromClass(
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
