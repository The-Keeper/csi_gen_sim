<script lang="ts">
	import { layout } from "$lib/store.svelte";
	import TextAreaArray from "$lib/components/TextAreaArray.svelte";
	import CriterionCard from "$lib/components/CriterionCard.svelte";

	let criteria_names = ['Критерий 1'];
	
	function set_criteria() {
		layout.criteria = criteria_names.map( name => {
			 return { name, score_min: 8, score_max: 10, weight_min: 8, weight_max: 10 }
		})
	}

</script>

<pre>
	criteria_names: { JSON.stringify(criteria_names) }
</pre>

<div>
	<p>Заполнить названия критериев с помощью списка:</p>

	<TextAreaArray bind:values={ criteria_names } />

	<button onclick={set_criteria}>Заполнить</button>
</div>

<details class="w-full md:w-200" open>
	<summary>Критерии</summary>
	<div class="flex flex-wrap w-full sm:w-160 gap-2">
		{#each layout.criteria as criterion, i}
			<CriterionCard bind:criterion />
		{/each}
	</div>
</details>