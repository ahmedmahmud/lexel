<script lang="ts">
	// import { createInteractive } from '$lib/stores';
	import type { Paragraph } from 'mdast';

	export let token: Paragraph;
	// const { raw, editing, edit, save } = createInteractive(token);
</script>
<!-- 
{#if $editing}
	<textarea bind:value={$raw} autofocus on:blur={save} />
{:else}
	<p on:click={edit}>
		<slot />
	</p>
{/if} -->
