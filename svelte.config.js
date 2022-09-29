import sveltePreprocess from 'svelte-preprocess'
import adapter from 'svelte-adapter-bun';

export default {
  kit: {
    adapter: adapter()
  },
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: sveltePreprocess()
}
