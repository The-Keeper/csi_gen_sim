<script lang="ts">
	import WeightScoreBlock from "./WeightScoreBlock.svelte";

    export let criterion = {
        name: "Критерий",
        weight_min: 5,
        weight_max: 10,
        score_min: 8,
        score_max: 10,
    }
</script>
<div class="block">
    <input bind:value={criterion.name} />
    
    <WeightScoreBlock 
        bind:weight_min = {criterion.weight_min}
        bind:weight_max = {criterion.weight_max}
        bind:score_min = {criterion.score_min}
        bind:score_max = {criterion.score_max}
    ></WeightScoreBlock>
    
</div>
