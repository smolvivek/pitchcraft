# /deploy-check

Pre-deployment safety check. Run before pushing or deploying.

## Steps

1. Run `npx next build` — must pass with zero errors
2. Run `npx tsc --noEmit` — must pass with zero type errors
3. Check `git status` — flag any:
   - Untracked files that should be committed
   - Uncommitted changes
   - Files that should NOT be committed: `.env`, `*.local`, credentials, API keys
4. Check `.env` for exposed secrets:
   - Grep for any hardcoded API keys, passwords, or tokens in tracked files
   - Verify `.gitignore` includes `.env`, `.env.local`, `.env.*.local`
5. Check for console.log statements in production code (not in API routes where they serve as server logs)
6. Verify `package.json` has no unused dependencies (check imports vs installed packages)

## Output Format

```
DEPLOY CHECK
-------------------------------
Build:          PASS / FAIL
Types:          PASS / FAIL
Git status:     CLEAN / [details]
Secrets:        SAFE / EXPOSED [details]
Console logs:   CLEAN / [N] found
Dependencies:   CLEAN / [N] unused
-------------------------------
Ready to deploy: YES / NO
```

If any check fails, explain what needs fixing before deployment.
