import {
	Decoration,
	EditorView,
	ViewPlugin,
	type DecorationSet,
	ViewUpdate,
	WidgetType
} from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import type { SyntaxNode, TreeBuffer } from '@lezer/common';
import type { Range } from '@codemirror/state';
import { documentDir, join } from '@tauri-apps/api/path';
import { convertFileSrc } from '@tauri-apps/api/tauri';

const hide = Decoration.replace({});

const headings = (view: EditorView) => {
	const widgets: any = [];
	for (let { from, to } of view.visibleRanges) {
		syntaxTree(view.state).iterate({
			from,
			to,
			enter: (node) => {
				const heading_regex = /ATXHeading([1-6)])/;
				const match = node.name.match(heading_regex);
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

const listToHtml = (node: SyntaxNode, view: EditorView): HTMLElement[] => {
	console.log('enter', node.name, node);
	if (node.name === 'BulletList') {
		let ul = document.createElement('ul');
		let children = node.getChildren('ListItem').flatMap((c) => listToHtml(c, view));
		ul.append(...children);
		return [ul];
	} else if (node.name === 'ListItem') {
		let res: HTMLElement[] = [];
		const p = node.getChild('Paragraph');
		if (p) {
			let li = document.createElement('li');
			li.textContent = view.state.doc.sliceString(p.from, p.to);
			res.push(li);
		}
		const ul = node.getChild('BulletList');
		if (ul) {
			let sub_list = listToHtml(ul, view);
			res = res.concat(sub_list);
		}
		return res;
	}
	return [document.createElement('span')];
};

class list_widget extends WidgetType {
	constructor(readonly node: SyntaxNode, readonly view: EditorView) {
		super();
	}

	toDOM() {
		return listToHtml(this.node, this.view)[0];
	}
}

class bullet extends WidgetType {
	toDOM(view: EditorView): HTMLElement {
		const span = document.createElement('span');
		span.textContent = '*';
		return span;
	}
}

const lists = (view: EditorView) => {
	let widgets: any = [];
	for (let { from, to } of view.visibleRanges) {
		syntaxTree(view.state).iterate({
			from,
			to,
			enter: (node) => {
				const cursor_pos = view.state.selection.main.head;

				// - lorem
				if (node.name === 'ListItem') {
					// const hide_markup = cursor_pos < node.from || cursor_pos > node.from + 1;
					if (true) {
						// let deco = Decoration.widget({
						// 	widget: new bullet()
						// });
						// widgets.push(deco.range(node.from));
					}
				}
			}
		});
	}
	return Decoration.set(widgets);
};

export const listPlugin = ViewPlugin.fromClass(
	class {
		decorations: DecorationSet;

		constructor(view: EditorView) {
			this.decorations = lists(view);
		}

		update(update: ViewUpdate) {
			if (update.docChanged || update.viewportChanged || update.selectionSet)
				this.decorations = lists(update.view);
		}
	},
	{
		decorations: (v) => v.decorations
	}
);

class image extends WidgetType {
	constructor(readonly from: number, readonly to: number) {
		super();
	}

	toDOM(view: EditorView): HTMLElement {
		const url = view.state.doc.sliceString(this.from, this.to);
		const img = document.createElement('img');
		img.className = 'object-contain';

		console.log('crearing', url)

		documentDir().then((path) => {
			join(path, 'lexel/' + url).then((path) => {
				const assetUrl = convertFileSrc(path);
				img.src = assetUrl;
			})
		})
			
		return img;
	}
}

const images = (view: EditorView) => {
	const widgets: Range<Decoration>[] = [];
	for (const { from, to } of view.visibleRanges) {
		syntaxTree(view.state).iterate({
			from,
			to,
			enter: (node) => {
				const cursor_line = view.state.doc.lineAt(view.state.selection.main.head).number;
				// console.log(node.)
				// - ![lorem](ipsum)
				if (node.name === 'Image') {
					const image_line = view.state.doc.lineAt(node.from).number;
					const hide_markup = cursor_line !== image_line;
					const x = node.node.getChild('URL');
					if (x) {
						if (hide_markup) {
							widgets.push(hide.range(node.from, node.to));
						}
						const deco = Decoration.widget({
							widget: new image(x.from, x.to)
						});
						widgets.push(deco.range(node.to));
					}
				}
			}
		});
	}
	return Decoration.set(widgets);
};

export const imagePlugin = ViewPlugin.fromClass(
	class {
		decorations: DecorationSet;

		constructor(view: EditorView) {
			this.decorations = images(view);
		}

		update(update: ViewUpdate) {
			if (update.docChanged || update.viewportChanged || update.selectionSet)
				this.decorations = images(update.view);
		}
	},
	{
		decorations: (v) => v.decorations
	}
);
