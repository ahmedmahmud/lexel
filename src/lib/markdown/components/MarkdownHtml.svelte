<script lang="ts">
  import type { Tokens } from 'marked'

  export let token: Tokens.HTML
</script>

{@html token.text}
