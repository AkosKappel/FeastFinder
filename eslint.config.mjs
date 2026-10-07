// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  rules: {
    // Prettier owns formatting, including how void elements are closed.
    'vue/html-self-closing': 'off',
    // Single-word names like Modal and Pagination are clear in this small app.
    'vue/multi-word-component-names': 'off',
  },
});
