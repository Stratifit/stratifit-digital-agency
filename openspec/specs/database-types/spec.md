# database-types Specification

## Purpose

Defines generated TypeScript database types that provide type-safe access to all Supabase tables, columns, relationships, and database functions for application code.

## Requirements

### Requirement: Type generation output location

Generated TypeScript types SHALL be written to `src/types/database.types.ts`. The file SHALL be generated using the Supabase CLI command `npx supabase gen types typescript --linked > src/types/database.types.ts`.

#### Scenario: Type file exists

- **WHEN** migrations and seeds are applied
- **THEN** `src/types/database.types.ts` SHALL exist and export a `Database` type

### Requirement: Types reflect current schema

The generated types SHALL accurately reflect all tables, columns, relationships, constraints, and database functions in the linked Supabase project. Types SHALL be regenerated after every schema-changing migration.

#### Scenario: Type accuracy

- **WHEN** a new table is added via migration and types are regenerated
- **THEN** the new table SHALL appear in the `Database` type with all its columns and correct types

### Requirement: Types not manually edited

The `src/types/database.types.ts` file SHALL NOT be manually edited. All changes to this file SHALL come from the Supabase CLI type generation command.

#### Scenario: Manual edit prevention

- **WHEN** a developer attempts to manually add a table to `database.types.ts`
- **THEN** the change SHALL be overwritten on the next type generation run

### Requirement: Application types wrap generated types

Application-specific types may wrap or extend generated database types. These wrapper types SHALL be placed in separate files within `src/types/` or `src/features/*/types.ts`.

#### Scenario: Feature types exist

- **WHEN** the services feature needs custom types
- **THEN** types SHALL be defined in `src/features/services/types.ts`, not by editing `database.types.ts`
