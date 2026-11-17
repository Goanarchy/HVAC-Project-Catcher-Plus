# Deployment — HVAC Project Catcher Plus

The app is a static site. No build, server, secrets, or environment variables are required.

## Local (Windows)

1. Clone or download the repository.
2. Double-click `start.bat`.
3. The app opens in Edge/Chrome app mode; if unavailable, the default browser opens `index.html`.

Alternative: open `index.html` directly. All runtime files are relative (`styles.css`, `js/*.js`).

## Local (any OS)

Open `index.html` in a modern browser. If your browser restricts `file://` behavior, serve the folder with any static server:

```bash
python -m http.server 8080
# then open http://localhost:8080
```

## GitHub Pages

The repository includes `.github/workflows/deploy-pages.yml`:

- Triggers on pushes to `main` and manual dispatch.
- Copies `index.html`, `styles.css`, and `js/` into `_site`.
- Uploads the artifact and deploys with the official GitHub Pages actions.

### First-time setup

1. Push the repository to GitHub.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Run the workflow (or push to `main`).
4. Open `https://<owner>.github.io/<repo>/`.

If the Pages API requires it, enable Pages with build type `workflow`:

```bash
curl -X POST \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/<owner>/<repo>/pages \
  -d '{"build_type":"workflow"}'
```

## Updating the deployed site

Commit and push to `main`. The workflow rebuilds `_site` from the runtime files and redeploys. Documentation changes do not affect the deployed app because only runtime files are copied.

## Versioning

- Update the version in `js/i18n.js` (`version`), the brand line, `index.html` title, and `README.md`.
- Add a new section to `RELEASE_NOTES.md`.
- Keep `PROJECT_CONTEXT.md` and `docs/ARCHITECTURE.md` aligned with structural changes.

## Rollback

Revert the commit on `main` (or re-run an earlier workflow run). The app has no database or server state; users' data lives in their browser and is unaffected by deployments.
