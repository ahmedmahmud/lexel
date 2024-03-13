<script lang="ts">
	import '../app.css';
	
	// import 'uno.css';
	// import '@unocss/reset/tailwind.css';
	onMount(async () => {
		await import('uno.css');
		await import('@unocss/reset/tailwind.css');
	});

	import Editor from './Editor.svelte';
	import Sidebar from './Sidebar.svelte';
	import type { PageData } from './$types';
	import type { File } from './+page';

	import { documentDir, join } from '@tauri-apps/api/path';
	import { convertFileSrc } from '@tauri-apps/api/tauri';
	import { onMount } from 'svelte';

	export let data: PageData;
	let open: File | null = null;

	let img: HTMLImageElement;

	$: {
		if (img) {
			(async () => {
				const appDataDirPath = await documentDir();
				const filePath = await join(appDataDirPath, 'lexel/singleframe.png');
				const assetUrl = convertFileSrc(filePath);

				img.src = assetUrl;
			})();
		}
	}
</script>

<!-- <img bind:this={img} alt="wow" class="w-10" /> -->
<div class="flex items-stretch h-screen p-4 gap-4 pt-2 text-white">
	<Sidebar fs={data.fs} bind:open />
	<Editor {open} />
</div>
