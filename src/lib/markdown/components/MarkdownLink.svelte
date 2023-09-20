<script lang="ts">
	// import { isRelative, joinUrlPaths } from '../../utils/url';
	import type { Tokens } from 'marked';

	export let token: Tokens.Link;

	// href={isRelative(token.href)
	//   ? joinUrlPaths('/', token.href)
	//   : token.href}
</script>

<a title={token.title}>
	<slot />
</a>
