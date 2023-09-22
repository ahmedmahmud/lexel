import { toMarkdown } from 'mdast-util-to-markdown';
import type { Node, Nodes, Root } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfm } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { newlineToBreak } from 'mdast-util-newline-to-break';
import { root, paragraph, text, heading, list, listItem, brk } from 'mdast-builder';

// const tree = fromMarkdown('wow\n\n\nok', {
// 	extensions: [gfm()],
// 	mdastExtensions: [gfmFromMarkdown()]
// });

// console.log('Before: %j', tree);
// newlineToBreak(tree);

// const a: Nodes = {
// 	type: 'link',
// 	url: 'example.com',
// 	children: [{ type: 'text', value: 'd' }]

// };


// const my_tree = root([
// 	paragraph(text('Hey')),
// 	paragraph(text('')),
// 	paragraph(text('There'))
// ]) as Nodes;
// console.log('Before:', my_tree);
// const my_tree_md = toMarkdown(my_tree);
// console.log(JSON.stringify(my_tree_md));

// console.log('After:', fromMarkdown(my_tree_md));


const tree = fromMarkdown('wow\nthis\n\n\n\neditor two');
console.log(tree)
newlineToBreak(tree);
console.log(tree)
