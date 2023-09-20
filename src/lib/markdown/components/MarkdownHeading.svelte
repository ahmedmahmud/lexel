<script lang="ts">
  // import { generatePathSegment } from '$lib/utils/url'

  import type { Tokens } from 'marked'

  export let token: Tokens.Heading

  let id: string | undefined
  // $: id = generatePathSegment(token.text, options.slugger)
</script>

<svelte:element this={`h${token.depth}`} {id}>
  <slot />
</svelte:element>
