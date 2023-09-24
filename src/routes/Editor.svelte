<script lang="ts">
	import { EditorState } from '@codemirror/state';
	import { EditorView, highlightActiveLine, keymap } from '@codemirror/view';
	import { defaultKeymap, indentWithTab } from '@codemirror/commands';
	import { markdown } from '@codemirror/lang-markdown';
	import { syntaxHighlighting, syntaxTree } from '@codemirror/language';
	import { headingPlugin, inlinePlugin, listPlugin } from '$lib/codemirror/live';
	import { baseStyling, markdownHighlighting, transparentTheme } from '$lib/codemirror/styling';
	import { oneDark } from '@codemirror/theme-one-dark';
	import type { File } from './+page';
	import { invoke } from '@tauri-apps/api/tauri';
	import CodeMirror from './CodeMirror.svelte';

	export let open: File | null;

	let editor: HTMLElement;
	let file_contents: Promise<string> | null = null;
	$: {
		if (open) {
			file_contents = invoke<string>('get_file', { path: open.path })
		}
	}
</script>

<div class="flex-grow">
	{#if file_contents}
		{#await file_contents}
			<div>loading</div>
		{:then md}
			<CodeMirror md={md} />
		{:catch}
			<div>error</div>
		{/await}
	{:else}
		<div>No file open</div>
	{/if}
</div>
