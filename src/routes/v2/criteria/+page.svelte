<script lang="ts">
	import { set_criteria } from "$lib/store.svelte";
	import TextAreaArray from "$lib/components/TextAreaArray.svelte";

	let criteria_names = ['Критерий 1'];

</script>

<div>
	<p>Заполните названия критериев</p>

	<TextAreaArray bind:values={ criteria_names } />

	<button onclick={set_criteria}>Заполнить</button>
</div>