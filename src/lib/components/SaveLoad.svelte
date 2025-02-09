<script lang="ts">
    import { layout, reports_input, data } from "$lib/store.svelte";
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';

	let files =  $state<FileList>();
    let fileInput: HTMLInputElement;

	$effect(() => {
        if (files) {
            const reader = new FileReader();

            // Note that `files` is of type `FileList`, not an Array:
            // https://developer.mozilla.org/en-US/docs/Web/API/FileList
            for (const file of files) {
                reader.readAsText(file);
                reader.onload = (e) => {
                    const result = JSON.parse(String(e.target?.result) || '');
                    layout.criteria = result.layout.criteria;
                    reports_input.splice(0, reports_input.length, ...result.reports_input)
                    data.reports = result.data.reports;

                    goto(`${base}/output`)
                };
            }
        }
    })

	function saveTemplateAsFile(filename: string, dataObjToWrite: object) {
		const blob = new Blob([JSON.stringify(dataObjToWrite, null, 2)], { type: 'text/json' });
		const link = document.createElement('a');

		link.download = filename;
		link.href = window.URL.createObjectURL(blob);
		link.dataset.downloadurl = ['text/json', link.download, link.href].join(':');

		const evt = new MouseEvent('click', {
			view: window,
			bubbles: true,
			cancelable: true
		});

		link.dispatchEvent(evt);
		link.remove();
	}

	function saveData() {
		saveTemplateAsFile('данные.json', { layout, reports_input, data } );
	}

</script>


<div class="flex flex-wrap m-2">
    <button class="btn" onclick={saveData}>Сохранить данные</button>

    <label class="btn b-black text-sm bg-white dark:bg-blue">
        <input
            accept="text/json"
            bind:files
            id="datafile"
            name="datafile"
            type="file"
            bind:this={fileInput}
        />
        Загрузить из файла
    </label>
</div>

<style>
    input[type="file"] {
        display: none;
    }
</style>