<script lang="ts">
  import type { marked, TokensList } from 'marked'

  import MarkdownTokens from './MarkdownTokens.svelte'
  import {
    defaultRenderers,
    parse,
    type Renderers,
  } from './markedConfiguration'
  import { suppressWarnings } from './suppressWarnings'

  suppressWarnings()

  /**
   * The markdown source
   */
  export let source: string

  let tokens: TokensList
  let actualRenderers: Renderers = defaultRenderers()

  $: {
    // May be better to split into 2
    tokens = parse(source)
  }
</script>

<MarkdownTokens {tokens} renderers={actualRenderers} />
