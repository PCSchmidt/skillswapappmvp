# ESLint Dependency Resolution Fix

## Issue Description

The SkillSwap MVP build was failing on Vercel with the following error:

```
npm error code ETARGET
npm error notarget No matching version found for @eslint/config-array@^3.0.0.
npm error notarget In most cases you or one of your dependencies are requesting
npm error notarget a package version that doesn't exist.
```

This occurred because of a dependency version mismatch between ESLint and its dependencies. The specific error indicates that some package was looking for version 3.x of `@eslint/config-array`, but this version wasn't available or compatible with other dependencies.

## Resolution

The issue was fixed by explicitly specifying compatible versions of ESLint and its related packages in `package.json`:

1. Updated `eslint` to version `8.57.0`
2. Updated `eslint-config-next` to version `14.0.4`
3. Added `@typescript-eslint/eslint-plugin` at version `6.19.1`
4. Added `@typescript-eslint/parser` at version `6.19.1`

These specific versions are known to work together without dependency conflicts.

## Vercel Configuration Changes

Additionally, we updated the `vercel.json` configuration to ensure a consistent build process:

```json
{
  "version": 2,
  "regions": ["iad1"],
  "buildCommand": "npm ci && NEXT_TELEMETRY_DISABLED=1 npm run build",
  "env": {
    "NODE_ENV": "production",
    "NEXT_TELEMETRY_DISABLED": "1",
    "SKIP_TYPE_CHECK": "true",
    "NODE_OPTIONS": "--max-old-space-size=4096"
  },
  "github": {
    "enabled": true,
    "silent": false
  }
}
```

Using `buildCommand` allows us to control the exact installation and build process that Vercel uses, instead of relying on its auto-detection.

## Preventing Future Issues

To prevent similar issues in the future:

1. **Use exact versions**: For critical development dependencies, use exact versions (without ^ or ~) to prevent npm from installing incompatible updates.

2. **Lock files**: Ensure package-lock.json is committed to the repository.

3. **Testing before deployment**: Test with a clean install (`npm ci`) before pushing to ensure dependency resolution works.

4. **Dependency updates**: When updating ESLint or TypeScript-related packages, always update them together as a group.

5. **Vercel Preview**: Use Vercel preview deployments to catch issues before merging to the main branch.

## Reference

This fix was implemented on May 7, 2025, in response to ongoing build failures in the Vercel deployment pipeline. The specific combination of ESLint packages mentioned above is known to work with Node.js 18.17.0 (as specified in `.nvmrc`).
