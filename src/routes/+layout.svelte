<script lang="ts">
  import '$lib/fylgja.css';
  import 'virtual:uno.css';
  interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();


import { reports_input, get_criteria } from '$lib/store.svelte';
</script>

<main class="mx-auto">


<pre>
reports_input: { JSON.stringify(reports_input) }
criteria: { JSON.stringify(get_criteria) }
</pre>

	{@render children?.()}
</main>

<style>
	:root {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
		Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}
</style>
