<script lang="ts">
    let isDark = $state(false);

    $effect(() => {
        const element = document.getElementsByTagName("html")[0];

        if (isDark) {
            element.classList.add("dark");
        } else {
            element.classList.remove("dark")
        }
    })
</script>

<div>
    <label for="theme">Тёмная</label>
    <input type="checkbox" bind:checked={isDark} name="theme" id="theme" />    
</div>