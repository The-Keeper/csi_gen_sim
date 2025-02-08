<script lang="ts">
let { title =  $bindable(''), subjects = $bindable([] as string[]) } = $props();

let subjectTextArea = $state("");

function setSubjectNames() {
	subjects = subjectTextArea
		.split("\n")
		.filter((s) => s.trim() !== "")
		.map((name) => name.trim());
}

export function getSubjects() {
	return subjects;
}
</script>
<div class="block">   
    <div class="flex items-center justify-end gap-1">
        <label class="block" for="weight_min">Название отчёта</label>
        <input class="block" bind:value={title} />
    </div>
    <textarea class="block w-full h-40" id="subject_names" onchange={setSubjectNames} bind:value={subjectTextArea}></textarea>

</div>
