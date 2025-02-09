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

<details>
	<summary>Заполнить названия критериев с помощью списка</summary>
	<TextAreaArray bind:values={ criteria_names } />

	<button class='btn' onclick={set_criteria}>Заполнить</button>

</details>

<details class="w-full md:w-200 lg:w-300" open>
	<summary>Критерии</summary>
	<div class="flex flex-wrap w-full gap-3">
		{#each layout.criteria as criterion, i}
			<CriterionCard index={i+1} bind:criterion />
		{/each}
	</div>
</details>