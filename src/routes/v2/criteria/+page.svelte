<script lang="ts">
	import { criteria } from "$lib/store.svelte";
	import TextAreaArray from "$lib/components/TextAreaArray.svelte";

	let criteria_names = ['Критерий 1'];

</script>

<div>
	<p>Заполните названия критериев</p>

	<TextAreaArray bind:values={ criteria_names } />
</div>


<pre>
	criteria_names: { JSON.stringify(criteria_names) }

	criteria: { JSON.stringify(criteria) }

</pre>