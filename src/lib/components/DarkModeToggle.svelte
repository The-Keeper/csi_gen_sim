<script lang="ts">
    import { browser } from '$app/environment';

    // import { localStore } from '$lib/localStore.svelte';
    // const theme = localStore('darkTheme', 'dark');

    function set_theme(theme: string) {
        const one_year = 60 * 60 * 24 * 365;
        document.cookie = `theme=${theme}; max-age=${one_year}; path=/`;
        document.documentElement.setAttribute("data-theme", theme);
    }

    const root = browser ? document.getElementById('htmlroot') : { dataset: {theme: 'dark'} };
    let checked = $state(root?.dataset?.theme === 'dark');

    function changeTheme() {
        set_theme( checked ? 'dark' : 'light' )
    }
</script>
{#if browser}
    <div class="flex">   
        <label for="theme">Тёмная тема:</label>
        <input type="checkbox" onchange={changeTheme} bind:checked name="theme" id="theme" />    
    </div>
{/if}
