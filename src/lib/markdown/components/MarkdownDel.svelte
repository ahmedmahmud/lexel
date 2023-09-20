<script lang="ts">
  import type { Tokens } from 'marked'
  import type { Renderers } from '../markedConfiguration'

  export const token: Tokens.Del = undefined!
  export const renderers: Renderers = undefined!
</script>

<del>
  <slot />
</del>
