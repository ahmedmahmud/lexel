<script lang="ts">
  import type { Renderers } from '../../markedConfiguration'
  import type { Tokens } from 'marked'

  export let token: Tokens.Code
</script>

<pre><code class={`lang-${token.lang}`}>{token.text}</code></pre>
