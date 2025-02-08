<script lang="ts">
  import '$lib/fylgja.css';
  import 'virtual:uno.css';
  interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();


import { reports_input, layout, data } from '$lib/store.svelte';
</script>

<main class="mx-auto">


<pre>
reports_input: { JSON.stringify(reports_input) }
layout: { JSON.stringify(layout) }
data: { JSON.stringify(data) }
</pre>

	<div id="links" class="flex flex-wrap gap-10">
		<a href="/criteria">Макет</a>
		<a href="/reports">Отчёты</a>
		<a href="/generate">Генерация</a>
	</div>

	{@render children?.()}
</main>

<style>
	:root {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
		Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}

	pre {
		white-space: pre-wrap; 
		word-break: keep-all
	}

</style>
