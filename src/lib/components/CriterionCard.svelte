<script lang="ts">
import WeightScoreBlock from "./WeightScoreBlock.svelte";

let {
    index,
    criterion = $bindable({
        name: "Критерий",
        weight_min: 5,
        weight_max: 10,
        score_min: 8,
        score_max: 10,
    }),
} = $props();
</script>
<div class="block">
    <div class="flex justify-center items-center gap-2">
        <label for="name">{index}</label>
        <input class="main" id="name" bind:value={criterion.name} />
    </div>
    <WeightScoreBlock 
        bind:weight_min = {criterion.weight_min}
        bind:weight_max = {criterion.weight_max}
        bind:score_min = {criterion.score_min}
        bind:score_max = {criterion.score_max}
    ></WeightScoreBlock>
    
</div>
