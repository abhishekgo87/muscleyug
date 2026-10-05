# Repositories Layer

This layer isolates all database-specific code. To migrate to a different database provider in the future, only files in this folder need to change.

## Rules:
- Only files in `src/repositories/` may import and interact with the database client (`src/config/supabaseClient.ts`).
- Services call repository functions to perform data persistence or queries.
- Repository function signatures must remain database-agnostic and return clean TypeScript types/models rather than query builders or provider-specific structures.
