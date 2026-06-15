# GitHub Pages Deployment Fix

This package includes a GitHub Pages workflow at:

`.github/workflows/deploy-pages.yml`

Use it from the repository root with:

- `index.html`
- `site.css`
- `site.js`
- `services/`
- `about/`
- `privacy/`
- `terms/`
- `logo.png` if available
- `CNAME`
- `.nojekyll`
- `.github/workflows/deploy-pages.yml`

In GitHub, set Pages source to **GitHub Actions**:

`Settings -> Pages -> Build and deployment -> Source -> GitHub Actions`

The workflow copies the full static site into `dist` before deploying. It uses one Pages deployment queue with `cancel-in-progress: false`, so a new push should not automatically cancel an in-flight Pages deployment.
