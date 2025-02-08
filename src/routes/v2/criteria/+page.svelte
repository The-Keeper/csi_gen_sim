<script lang="ts">
	import { criteria } from "$lib/store.svelte";
	import TextAreaArray from "$lib/components/TextAreaArray.svelte";

	let criteria_names = ['Критерий 1'];

</script>

<div>
	<p>Заполните названия критериев</p>

	<TextAreaArray bind:values={ criteria_names } />
</div>

<button onclick={add_report}>Заполнить названия критериев</button>

<pre>
	reports_input: { JSON.stringify(reports_input) }
	criteria: { JSON.stringify(criteria) }

</pre>