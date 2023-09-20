<script>
	import Markdown from '$lib/markdown/Markdown.svelte';
	const string = '- wow\n\t- i love this\n';
</script>

<Markdown source={string} />
