<script lang="ts">
interface Props {
    weight_min: number;
    weight_max: number;
    score_min: number;
    score_max: number;
}

let {
    weight_min = $bindable(5),
    weight_max = $bindable(10),
    score_min = $bindable(8),
    score_max = $bindable(10),
}: Props = $props();
</script>
<div class="block">   
    <div class="flex items-center justify-end gap-1">
        <label class="block" for="weight_min">Вес от</label>
        <input class="block max-w-20 main" id="weight_min" type="number" min="1" max="10" bind:value={weight_min} />
        <label class="block" for="weight_max">до</label>
        <input class="block max-w-20 main" id="weight_max" type="number" min="1" max="10" bind:value={weight_max} />
    </div>
    <div class="flex items-center justify-end gap-1">
        <label for="score_min">Балл от</label>
        <input class="block max-w-20 main" id="score_min" type="number" min="1" max="10" bind:value={score_min} />
        <label for="score_max">до</label>
        <input class="block max-w-20 main" id="score_max" type="number" min="1" max="10" bind:value={score_max} />
    </div>
</div>
