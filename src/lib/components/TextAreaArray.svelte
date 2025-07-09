<script lang="ts">
let { values = $bindable([] as string[]) } = $props();

function setValues(val: string) {
    values = val
        .split("\n")
        .filter((s) => s.trim() !== "")
        .map((name) => name);
}
</script>
<textarea class="main h-40 w-sm" bind:value={
    () => values.join('\n') + ('\n'),
    setValues
}></textarea>
