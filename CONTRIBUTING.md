# Contributing guide

## Setup

```bash
# Requires Node 20+ and pnpm 9+
pnpm install
pnpm dev           # dev server on :5173
pnpm build         # production build
pnpm test          # unit tests
pnpm lint          # eslint + prettier
pnpm typecheck     # tsc --noEmit
```

## Branch model

| Branch            | Purpose                          |
|-------------------|----------------------------------|
| main              | Production-ready. Protected.     |
| develop           | Integration. All features merge here. |
| feat/<id>-name    | New feature                      |
| fix/<id>-name     | Bug fix                          |
| chore/name        | Non-functional (deps, tooling)   |

## Commit format

```
feat(auth): add refresh-token queue lock
fix(http): prevent double 401 retry
chore: upgrade element-plus to 2.8
```

## Component rules

Extract to a component when: template > 80 lines, OR appears 2+ places, OR has a clear nameable responsibility.

### Naming

| Type         | Convention  | Example              |
|--------------|-------------|----------------------|
| Page views   | PascalCase  | UserListView.vue     |
| Components   | PascalCase  | DataTable.vue        |
| Composables  | camelCase   | useTableData.ts      |
| Stores       | camelCase   | user.ts              |
| API files    | camelCase   | user.ts              |

## PR checklist

- [ ] pnpm typecheck passes
- [ ] pnpm lint passes
- [ ] pnpm test passes
- [ ] New logic has a .test.ts
- [ ] No console.log in production paths
- [ ] No secrets committed

## Template upgrades

```bash
git remote add template https://github.com/your-org/vue3-enterprise-template.git
git fetch template
git merge template/main --allow-unrelated-histories --no-commit
git commit -m "chore: merge template vX.Y.Z"
```
