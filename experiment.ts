import { toMarkdown } from 'mdast-util-to-markdown';
import type { Node, Nodes, Root } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import log from 'log';
import { List } from 'mdast-util-from-markdown/lib';

log.info("lol")

console.log('AST: %j', (fromMarkdown('- wow\n- nice').children[0] as List).children[0]);

const tree = {
	type: 'root',
	children: [
		{
			type: 'blockquote',
			children: [
				{ type: 'thematicBreak' },
				{
					type: 'paragraph',
					children: [
						{ type: 'text', value: '- a\nb !' },
						{
							type: 'link',
							url: 'example.com',
							children: [{ type: 'text', value: 'd' }]
						}
					]
				}
			]
		}
	]
};

const p: Nodes = {
  type: "listItem",
  spread: false,
  checked: null,
  children: [
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          value: "wow",
          position: {
            start: {
              line: 1,
              column: 5,
              offset: 2
            },
            end: {
              line: 1,
              column: 8,
              offset: 5
            }
          }
        }
      ],
      position: {
        start: {
          line: 1,
          column: 5,
          offset: 2
        },
        end: {
          line: 1,
          column: 8,
          offset: 5
        }
      }
    }
  ],
  position: {
    start: {
      line: 1,
      column: 3,
      offset: 0
    },
    end: {
      line: 1,
      column: 8,
      offset: 5
    }
  }
}
const a: Nodes = {
	type: 'link',
	url: 'example.com',
	children: [{ type: 'text', value: 'd' }]
};

console.log(toMarkdown(p));
