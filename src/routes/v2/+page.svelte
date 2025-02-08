<script lang="ts">
	import { add_report, reports_input } from "$lib/store.svelte";
</script>

{#each reports_input as r_input }
	<div>
		<label for="r_title">Заголовок отчёта</label>
		<input bind:value={ r_input.title } type="text" name="" id="r_title" />

		<textarea name="" id=""></textarea>
	</div>
{/each}

<button onclick={add_report}>Добавить отчёт</button>

<pre>
	{ JSON.stringify(reports_input) }
</pre>