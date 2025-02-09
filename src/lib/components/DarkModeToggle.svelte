<script lang="ts">
    import { localStore } from '$lib/localStore.svelte';
    const theme = localStore('darkTheme', 'dark');
    let checked = $state(theme.value === 'dark');

    $effect(() => {
        const element = document.getElementsByTagName("html")[0];

        if (checked) {
            element.classList.add("dark");
            theme.value = 'dark';
        } else {
            element.classList.remove("dark");
            theme.value = 'light'
        }
    })
</script>

<div>
    <label for="theme">Тёмная</label>
    <input type="checkbox" bind:checked name="theme" id="theme" />    
</div>