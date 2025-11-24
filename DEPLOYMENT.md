# Deployment

## GitHub Release
1. Ensure `main` is green in CI.
2. Update version in `package.json` if needed.
3. Tag the release locally and push:
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```

## npm Publish
1. Authenticate: `npm login`
2. From a clean tree: `npm publish --access public`
