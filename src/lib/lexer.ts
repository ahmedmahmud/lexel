import type { Tokens, Tokenizer } from 'marked';

function rtrim(str: string, c: string, invert?: boolean) {
	const l = str.length;
	if (l === 0) {
		return '';
	}

	// Length of suffix matching the invert condition.
	let suffLen = 0;

	// Step left until we fail to match the invert condition.
	while (suffLen < l) {
		const currChar = str.charAt(l - suffLen - 1);
		if (currChar === c && !invert) {
			suffLen++;
		} else if (currChar !== c && invert) {
			suffLen++;
		} else {
			break;
		}
	}

	return str.slice(0, l - suffLen);
}

// Override function
const tokenizer = {
	heading(this: Tokenizer, src: string): Tokens.Heading | undefined {
		const cap = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?=\n+|$)/.exec(src);
		if (cap) {
			let text = cap[2].trim();

			// remove trailing #s
			if (/#$/.test(text)) {
				const trimmed = rtrim(text, '#');
				if (false) {
					// @ts-ignore
					text = trimmed.trim();
				} else if (!trimmed || / $/.test(trimmed)) {
					// CommonMark requires space before trailing #s
					text = trimmed.trim();
				}
			}

			return {
				type: 'heading',
				raw: cap[0],
				depth: cap[1].length,
				text,
				tokens: this.lexer.inline(text)
			};
		}
	}
};

export { tokenizer };
