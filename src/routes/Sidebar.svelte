<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { invoke } from '@tauri-apps/api/tauri';
	import type { File } from './+page';
	import { md } from '$lib/stores';

	export let fs: File[];
	export let open: File | null;

	const save = () => {
		if (open) {
			invoke('save_file', { path: open.path, data: $md });
		}
	}
</script>

<div class="w-52 h-full flex flex-col gap-4">
	<div class="bg-black/10 p-2 rounded h-full flex flex-col justify-between">
		<div class="flex flex-col gap-2">
			{#each fs as file}
				<button
					class:glow={file === open}
					class="text-white/60 flex items-center gap-2 bg-black/10 rounded p-2 w-full border border-transparent"
					on:click={() => (open = file)}
				>
					<div class={`i-ph-file text-lg`} />
					<p class="text-base">{file.name}</p>
				</button>
			{/each}
		</div>
		<div class="flex gap-1">
			<button
				class="bg-zinc-900/20 text-white p-3 rounded text-center flex items-center w-full"
				on:click={() => invalidateAll()}
			>
				<div class="i-ph-arrow-clockwise-bold m-auto" />
			</button>
			<button
			class="bg-zinc-900/20 text-white p-3 rounded text-center flex items-center w-full"
			on:click={() => save()}
		>
			<div class="i-ph-floppy-disk-back-bold m-auto" />
		</button>
		</div>
	</div>
</div>

<style>
	.glow {
		box-shadow: 0px 0px 100px -10px rgba(6, 182, 212, 0.3);
		border: 1px solid rgba(6, 182, 212, 0.3);
	}
</style>
