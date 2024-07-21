<script lang="ts">
        export let weight_min: number = 5;
        export let weight_max: number = 10;
        export let score_min: number = 8;
        export let score_max: number = 10;
</script>
<div class="block">   
    <div class="flex items-center justify-end gap-1">
        <label class="block" for="weight_min">Вес от</label>
        <input class="block max-w-20" id="weight_min" type="number" min="1" max="10" bind:value={weight_min} />
        <label class="block" for="weight_max">до</label>
        <input class="block max-w-20" id="weight_max" type="number" min="1" max="10" bind:value={weight_max} />
    </div>
    <div class="flex items-center justify-end gap-1">
        <label for="score_min">Балл от</label>
        <input class="block max-w-20" id="score_min" type="number" min="1" max="10" bind:value={score_min} />
        <label for="score_max">до</label>
        <input class="block max-w-20" id="score_max" type="number" min="1" max="10" bind:value={score_max} />
    </div>
</div>
