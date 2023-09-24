<script lang="ts">
	import { invalidate, invalidateAll } from '$app/navigation';
	import type { File } from './+page';

	export let fs: File[];
	export let open: File | null;
</script>

<div class="w-52 p-4 bg-slate-900/70 h-full flex flex-col gap-4">
	{#each fs as file}
    <div class="text-white/60 font-bold flex items-center gap-2" on:click={() => open = file}>
			<div class="i-ph-file-bold text-lg" />
      <p class="text-sm">{file.name}</p>
			{#if open === file}
				<p>selected</p>
			{/if}
    </div>
	{/each}
	<button on:click={() => invalidateAll()}>reload</button>
</div>
