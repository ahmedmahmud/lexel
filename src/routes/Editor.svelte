<script lang="ts">
	import type { File } from './+page';
	import { invoke } from '@tauri-apps/api/tauri';
	import CodeMirror from './CodeMirror.svelte';

	export let open: File | null;

	let file_contents: Promise<string> | null = null;
	// $: {
	// 	if (open) {
	// 		file_contents = invoke<string>('get_file', { path: open.path });
	// 	}
	// }
</script>

<div class="flex-grow h-full">
	<div class="bg-black/10 p-4 rounded h-full">
		<!-- {#if file_contents} -->
			<!-- {#await file_contents} -->
				<!-- <div>loading</div> -->
			<!-- {:then md} -->
				<CodeMirror text={"wow"} />
			<!-- {:catch} -->
				<!-- <div>error</div> -->
			<!-- {/await} -->
		<!-- {:else} -->
			<!-- <div>No file open</div> -->
		<!-- {/if} -->
	</div>
</div>
