import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#121113', // espresso-slate base
        bone: '#EFE7DA', // warm paper white
        zobo: '#E2325E', // hibiscus red, straight from the pink-lit photos
        kola: '#C9864F', // braid copper
        gold: '#DDA94B', // trophy
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
