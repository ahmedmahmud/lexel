<script lang="ts">
  import type { Tokens } from 'marked'
  import type { Renderers } from '../markedConfiguration'

  export const token: Tokens.Blockquote = undefined!
  export const renderers: Renderers = undefined!
</script>

<blockquote>
  <slot />
</blockquote>
