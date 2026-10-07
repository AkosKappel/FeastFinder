import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

// Kitchen palette: bay leaf (dark surfaces), paprika (actions, Tailwind orange), saffron (highlights
// on dark), sage (page background).
export default {
  theme: {
    extend: {
      colors: {
        bay: {
          50: '#f2f6f3',
          100: '#e1ebe5',
          200: '#c3d6ca',
          300: '#9bbaa7',
          600: '#3d6a5c',
          700: '#2b5248',
          800: '#1f4038',
          900: '#17332c',
          950: '#0f231e',
        },
        sage: '#eef2ef',
        ink: '#1c2b27',
        saffron: '#fcd34d',
      },
      fontFamily: {
        sans: ['"Figtree Variable"', ...defaultTheme.fontFamily.sans],
        display: ['"Bricolage Grotesque Variable"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
} satisfies Partial<Config>;
