<script lang="ts">
  import '$lib/fylgja.css';
  import 'virtual:uno.css';
  interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();


import { reports_input, layout, data, output } from '$lib/store.svelte';
import SaveLoad from '$lib/components/SaveLoad.svelte';

const output_data = $derived(output())
</script>

<main class="mx-auto">

	<div id="links" class="flex flex-wrap gap-10 m-block-4 justify-around">
		<a href="/criteria">Макет</a>
		<a href="/reports">Отчёты</a>
		<a href="/data">Данные</a>
		<a href="/output">Вывод</a>
	</div>

	<SaveLoad />

	{@render children?.()}

<details>
	<summary>Данные для отладки</summary>
<pre>
reports_input: { JSON.stringify(reports_input) }
layout: { JSON.stringify(layout) }
data: { JSON.stringify(data) }
per_report:  { JSON.stringify(output_data) }
</pre>
</details>

	<footer class="text-center">Лицензия MIT (никаких гарантий)</footer>
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
