/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fully static site: `npm run build` writes a deployable folder to ./out
  // (Netlify, Vercel, Cloudflare Pages, GitHub Pages, any file host).
  output: 'export',
  // GitHub Pages under a repo path (https://user.github.io/repo)? Uncomment:
  // basePath: '/your-repo-name',
  // assetPrefix: '/your-repo-name/',
};

export default nextConfig;
