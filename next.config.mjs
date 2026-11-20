/** @type {import('next').NextConfig} */

// GitHub Pages serves project sites from https://<user>.github.io/<repo>/
// Set REPO_NAME below (or the NEXT_PUBLIC_REPO env var) to your repo name.
// Leave it as '' if the repo is named <user>.github.io or you use a custom domain.
const REPO_NAME = process.env.NEXT_PUBLIC_REPO ?? 'Ashoka_Medi-Lab'

const isProd = process.env.NODE_ENV === 'production'
const basePath = isProd && REPO_NAME ? `/${REPO_NAME}` : ''

const nextConfig = {
  output: 'export', // builds static HTML into /out (this is what GitHub Pages needs)
  trailingSlash: true, // /about -> about/index.html
  basePath,
  assetPrefix: basePath || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
