<script lang="ts">
  import type { Renderers } from '../../markedConfiguration'
  import type { Tokens } from 'marked'
  import MarkdownToken from '$lib/markdown/MarkdownToken.svelte'

  export let token: Tokens.List
  export let renderers: Renderers

  let component: 'ol' | 'ul'
  $: component = token.ordered ? 'ol' : 'ul'
</script>

<svelte:element this={component} start={token.start || 1}>
  {#each token.items as item}
    <MarkdownToken token={{ ...item }} {renderers} />
  {/each}
</svelte:element>
