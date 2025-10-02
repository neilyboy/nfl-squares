# Docker Build Notes

## Pre-render Warnings During Build

You may see "Error occurred prerendering page" messages during `docker compose build`. This is **EXPECTED** and **SAFE TO IGNORE**.

### Why This Happens

Next.js attempts to pre-render pages at build time for optimization. However, our application pages:
- Use React hooks (`useState`, `useEffect`)
- Require database connections
- Are fully dynamic (no static content)

These pages are configured with:
```typescript
export const dynamic = 'force-dynamic';
export const revalidate = 0;
```

This tells Next.js to render them on-demand at runtime, not at build time.

### What to Look For

**✅ Successful Build**:
```
✓ Generating static pages (17/17)  
Route (app)                              Size     First Load JS
├ ƒ /                                    4.3 kB          158 kB
├ ƒ /admin                               2.66 kB          98 kB
...
```

The `ƒ` symbol means "Dynamic" - pages are server-rendered on demand.

**✅ Successful Deployment**:
```
 => => naming to docker.io/library/nfl-squares-nfl-squares
[+] Running 1/1
 ✔ Container nfl-squares-nfl-squares-1  Started
```

### If Build Fails

If the Docker build actually fails (container doesn't start), check:

1. **Missing package-lock.json**
   ```bash
   npm install --package-lock-only
   ```

2. **Missing OpenSSL** - Should be fixed in Dockerfile already
   
3. **Missing assets** - Make sure `team_logos/`, `team_wordmarks/`, `team_colors/`, `vendor_logos/` directories exist

4. **Check logs**
   ```bash
   docker compose logs -f
   ```

### Development vs Production

- **Development** (`npm run dev`): No pre-rendering, works perfectly
- **Docker** (`docker compose up`): Pre-render warnings are shown but can be ignored
- **Runtime**: All pages work dynamically regardless of build warnings

The application functions identically whether or not pre-render warnings appear during build.
