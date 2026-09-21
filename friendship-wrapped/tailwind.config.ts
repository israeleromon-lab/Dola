import type { Config } from 'tailwindcss';
const config: Config = { content: ['./src/**/*.{ts,tsx}'], theme: { extend: { colors: { ink: '#121113', bone: '#EFE7DA', zobo: '#E2325E', kola: '#C9864F', gold: '#DDA94B' }, fontFamily: { display: ['var(--font-display)', 'Georgia', 'serif'], sans: ['var(--font-sans)', 'system-ui', 'sans-serif'] } } }, plugins: [] };
export default config;
