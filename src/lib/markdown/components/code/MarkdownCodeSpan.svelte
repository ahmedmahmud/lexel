<script lang="ts">
  import type { Renderers } from '../../markedConfiguration'
  import type { Tokens } from 'marked'

  export let token: Tokens.Codespan
</script>

<code>{token.raw.slice(1, token.raw.length - 1)}</code>
