<script lang="ts">
import { browser } from "$app/environment";

// import { localStore } from '$lib/localStore.svelte';
// const theme = localStore('darkTheme', 'dark');

function set_theme(theme: string) {
    const one_year = 60 * 60 * 24 * 365;
    document.cookie = `theme=${theme}; max-age=${one_year}; path=/`;
    document.documentElement.setAttribute("data-theme", theme);
}

const root = browser
    ? document.getElementById("htmlroot")
    : { dataset: { theme: "dark" } };
let checked = $state(root?.dataset?.theme === "dark");
const themeIcon = $derived(checked ? "🌙" : "☀️");

function changeTheme() {
    set_theme(checked ? "dark" : "light");
}
</script>
{#if browser}
    <div class="fixed z-90 bottom-10 right-8 bg-blue-600 w-15 h-15 rounded-full drop-shadow-lg flex justify-center items-center text-white text-2xl hover:bg-blue-700 hover:drop-shadow-2xl"> 
        <label class="cursor-pointer" for="theme">{themeIcon}</label>  
        <input class="hidden" type="checkbox" onchange={changeTheme} bind:checked name="theme" id="theme" />    
    </div>
{/if}
