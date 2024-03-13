import { syntaxTree } from '@codemirror/language';
import { EditorState, RangeSet, StateField, type Range } from '@codemirror/state';
import { EditorView, type DecorationSet, Decoration, WidgetType } from '@codemirror/view';

interface ImageWidgetParams {
	url: string;
}

const hide = Decoration.replace({});

class ImageWidget extends WidgetType {
	readonly url;

	constructor({ url }: ImageWidgetParams) {
		super();
		this.url = url;
	}

	eq(other: ImageWidget): boolean {
		return this.url == other.url;
	}

	toDOM(view: EditorView): HTMLElement {
		// let container = document.createElement('div');
		// container.className = 'inline';
		let img = document.createElement('img');
		img.className = 'inline';

		// documentDir().then((path) => {
		// 	join(path, 'lexel/' + this.url).then((path) => {
		// 		path = path.replaceAll('%20', ' ');

		// 		console.log(path, 'SHEHEHUE');
		// 		const assetUrl = convertFileSrc(path);
		// 		img.src = assetUrl;
		// 	});
		// });
		img.src = this.url;

		return img;
	}

	/* ignore events that happen in the widget */
	ignoreEvent() {
		return true;
	}
}

const imageDecoration = (params: ImageWidgetParams, block: boolean) =>
	Decoration.widget({
		widget: new ImageWidget(params),
		side: 1,
		block
	});

function imageMatch(state: EditorState): RangeSet<Decoration> {
	const doc = state.doc;
	let widgets: Range<Decoration>[] = [];

	const regex = /!\[.*?\]\((?<url>.*?)\)/;
	syntaxTree(state).iterate({
		enter: (node) => {
			const { from, to, type } = node;
			if (type.name === 'Image') {
				const result = regex.exec(doc.sliceString(from, to));
				if (result && result.groups && result.groups.url) {
					// after stripping line text check if its is the only text in the line
					const block_image = imageDecoration({ url: result.groups.url }, true);
					const inline_image = imageDecoration({ url: result.groups.url }, false);

					const lineText = state.doc.lineAt(from).text;
					const cursor_line = state.doc.lineAt(state.selection.main.head).number;
					const cursor_pos = state.selection.main.head;

					const alone = lineText.trim() === doc.sliceString(from, to).trim();
					if (alone) {
						if (cursor_line != state.doc.lineAt(from).number) {
							widgets.push(hide.range(from, doc.lineAt(to).to));
							widgets.push(inline_image.range(doc.lineAt(to).to));
						} else {
							widgets.push(block_image.range(doc.lineAt(to).to));
						}
					} else {
						if (cursor_pos < node.from || cursor_pos > node.to) {
							widgets.push(hide.range(from, to));
							widgets.push(inline_image.range(to));
						} else {
							widgets.push(inline_image.range(to));
						}
					}
				}
			}
		}
	});

	return RangeSet.of(widgets);
}

export const imageStateField = StateField.define<DecorationSet>({
	create(state) {
		return imageMatch(state);
	},
	update(images, tr) {
		if (tr.docChanged || tr.newSelection) return imageMatch(tr.state);
		return images.map(tr.changes);
	},
	provide: (f) => EditorView.decorations.from(f)
});
