<script lang="ts">
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
    
    <div class="flex justify-end gap-1">
        <label class="block" for="weight_min">Вес от</label>
        <input class="block" id="weight_min" type="number" min="1" max="10" bind:value={criterion.weight_min} />
        <label class="block" for="weight_max">до</label>
        <input class="block" id="weight_max" type="number" min="1" max="10" bind:value={criterion.weight_max} />
    </div>
    <div class="flex justify-end gap-1">
        <label for="score_min">Балл от</label>
        <input id="score_min" type="number" min="1" max="10" bind:value={criterion.score_min} />
        <label for="score_max">до</label>
        <input id="score_max" type="number" min="1" max="10" bind:value={criterion.score_max} />
    </div>
    
</div>
