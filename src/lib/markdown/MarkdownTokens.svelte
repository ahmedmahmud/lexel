<script lang="ts">
  import type { Token } from 'marked'
  import MarkdownToken from './MarkdownToken.svelte'
  import type { Renderers } from './markedConfiguration'

  export let tokens: Token[] | null
  export let renderers: Renderers
</script>

{#if tokens}
  {#each tokens as token}
    <MarkdownToken {token} {renderers} />
  {/each}
{/if}
