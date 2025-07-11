<script lang="ts">
let { values = $bindable([] as string[]) } = $props();

function setValues(val: string) {
    values = val
        .split("\n")
        .filter((s) => s.trim() !== "")
        .map((name) => name.trim());
}

function handlePaste(e: ClipboardEvent) {
    // Prevent the default paste behavior
    e.preventDefault();

    // Get the pasted text from clipboard
    const pastedText = e.clipboardData?.getData("text/plain") || "";

    // Replace one or more tabs with a single linebreak
    const modifiedText = pastedText.replace(/\t+/g, "\n");

    setValues(modifiedText);
}
</script>

<textarea
	onpaste={handlePaste}
	class="h-40 w-sm border txt-input"
	bind:value={() => values.join('\n') + '\n', setValues}
></textarea>
