import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
// import { vitePreprocess } from '@sveltejs/kit/vite';
import UnoCSS from 'unocss/vite'
import extractorSvelte from '@unocss/extractor-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	plugins: [
		UnoCSS({
		  extractors: [
			extractorSvelte(),
		  ],
		  /* more options */
		}),
	],
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
            base: process.env.NODE_ENV === 'production' ? '/csi_gen_sim' : '',
        }

	}
};

export default config;

