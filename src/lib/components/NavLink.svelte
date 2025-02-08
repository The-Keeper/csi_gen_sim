<script lang="ts">
import { page } from '$app/state';  

let { link, children } = $props();
const url = $derived(page.url.pathname); 

$inspect(url);

</script>
<a class={[url === link && 'text-blue font-bold']} href={link}>
    {@render children?.()}
</a>