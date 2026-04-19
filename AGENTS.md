# AGENTS.md — Machine-readable project contract

Read this before generating or modifying any code.

## Tech stack

| Layer      | Choice                        | Version |
|------------|-------------------------------|---------|
| Framework  | Vue 3 (Composition API only)  | ^3.4    |
| Build      | Vite                          | ^5.x    |
| Language   | TypeScript (strict)           | ^5.5    |
| UI         | Element Plus                  | ^2.7    |
| State      | Pinia (Setup Store pattern)   | ^2.1    |
| Styling    | UnoCSS                        | ^0.61   |
| HTTP       | Axios (via @/plugins/http)    | ^1.7    |
| Router     | Vue Router 4                  | ^4.3    |
| Testing    | Vitest                        | ^2.0    |

## Absolute rules

- NEVER use Options API — always `<script setup lang="ts">`
- NEVER import Vue/Pinia/Router APIs manually — unplugin-auto-import handles it
- NEVER import Element Plus components manually — unplugin-vue-components handles it
- NEVER call axios directly — use get/post/put/del from @/plugins/http
- NEVER hardcode env values — use import.meta.env.VITE_*
- NEVER commit .env.local
- NEVER use `any` — use `unknown` and narrow, or define an interface

## State management

- Stores in src/stores/, one file per domain
- Always use Setup Store: defineStore('id', () => { ... })
- Expose $reset() in every store that holds persistent state
- Cross-store calls: import the other store's composable inside an action

## Style conventions

- Utility classes via UnoCSS — no scoped style for layout/spacing
- <style scoped> only for :deep() Element Plus overrides and keyframes
- CSS tokens live in src/styles/variables.css — never duplicate inline
- Dark mode: [data-theme="dark"] on <html>, UnoCSS dark: variant

## Component conventions

- Props: defineProps<{...}>() — never runtime array syntax
- Emits: defineEmits<{...}>() — always typed
- Composables: use prefix, live in src/composables/
- Extract to composable when <script setup> block exceeds ~30 lines

## Route meta shape

```ts
meta: {
  title?: string       // breadcrumb + tab title
  icon?: string        // sidebar icon
  roles?: string[]     // required roles; omit = any authenticated user
  hidden?: boolean     // hide from sidebar
  keepAlive?: boolean  // wrap in <KeepAlive>
}
```

## API layer rules

- src/api/ files export typed async functions only — no store access inside api/
- Return typed response directly; error handling is in the HTTP interceptor

## Git conventions

- Branches: feat/<id>-name | fix/<id>-name | chore/name
- Commits: Conventional Commits (feat:, fix:, chore:, refactor:, test:, docs:)
- Template upgrades: git fetch template && git merge template/main
