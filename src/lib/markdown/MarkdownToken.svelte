<script lang="ts">
  import type { Token } from 'marked'
  import MarkdownTokens from './MarkdownTokens.svelte'
  import type { Renderers } from './markedConfiguration'

  export let token: Token
  export let renderers: Renderers
</script>

{#if renderers[token.type]}
  <svelte:component this={renderers[token.type]} {token} {renderers}>
    {#if 'tokens' in token && token['tokens']}
      <MarkdownTokens tokens={token['tokens']} {renderers} />
    {:else}
      {token.raw}
    {/if}
  </svelte:component>
{/if}
