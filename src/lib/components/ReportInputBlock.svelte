<script lang="ts">
	import TextAreaArray from "./TextAreaArray.svelte";

let { title =  $bindable(''), subjects = $bindable([] as string[]) } = $props();

</script>
<div class="block">   
    <div class="flex items-center justify-end gap-1">
        <label class="block" for="weight_min">Название отчёта</label>
        <input class="block" bind:value={title} />
    </div>
    <TextAreaArray bind:values = {subjects} />
</div>
