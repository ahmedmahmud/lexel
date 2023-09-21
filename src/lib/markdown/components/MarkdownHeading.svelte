<script lang="ts">
	import type { Tokens } from 'marked';
	import { createInteractive } from '$lib/stores';

	export let token: Tokens.Heading;
	const { raw, editing, edit, save } = createInteractive(token);
</script>

{#if $editing}
	<textarea bind:value={$raw} autofocus on:blur={save} />
{:else}
	<svelte:element this={`h${token.depth}`} on:click={edit}>
		<slot />
	</svelte:element>
{/if}
