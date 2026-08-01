# supabase-clients Specification

## Purpose

Defines the Supabase client layer for the Stratifit platform: separate browser, server, and service-role clients with strict boundaries, typed helpers, and a centralized feature query foundation.

## Requirements

### Requirement: Browser client

The system SHALL provide a browser client creation function using only public environment variables. The browser client SHALL be usable in Client Components.

#### Scenario: Browser client creation

- **WHEN** a Client Component requires Supabase access
- **THEN** a browser client SHALL be created from `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **AND** no secret environment variable SHALL be referenced

#### Scenario: Browser client typing

- **WHEN** the browser client is created
- **THEN** it SHALL be typed with the generated `Database` type from `src/types/database.types.ts`

### Requirement: Server client

The system SHALL provide a server client creation function for Server Components, Server Actions, and Route Handlers. The server client SHALL use cookie-based session handling via `@supabase/ssr`.

#### Scenario: Server client creation

- **WHEN** server-side code requires authenticated Supabase access
- **THEN** a server client SHALL be created with cookie handling for the current request

#### Scenario: Server client typing

- **WHEN** the server client is created
- **THEN** it SHALL be typed with the generated `Database` type

### Requirement: Service-role client

The system SHALL provide a service-role client in a server-only module. The service-role client SHALL never be importable by Client Components or exposed to the browser.

#### Scenario: Service-role module protection

- **WHEN** the service-role client module is imported by a Client Component
- **THEN** the build SHALL fail because the module imports `server-only`

#### Scenario: Service-role key secrecy

- **WHEN** the service-role client is created
- **THEN** it SHALL read `SUPABASE_SERVICE_ROLE_KEY` from server environment
- **AND** the key SHALL never appear in client bundles

#### Scenario: Documented trusted use

- **WHEN** the service-role client is used
- **THEN** usage SHALL be limited to documented trusted server operations
- **AND** user-session access with RLS SHALL be preferred

### Requirement: Centralized feature queries

Raw Supabase queries SHALL be centralized in feature modules rather than scattered through components.

#### Scenario: Feature module structure

- **WHEN** a feature requires data access
- **THEN** query functions SHALL live in `src/features/<feature>/queries.ts`
- **AND** mutations SHALL live in `src/features/<feature>/mutations.ts`

#### Scenario: Public query filtering

- **WHEN** a public query returns content
- **THEN** it SHALL filter to published and visible records only
- **AND** it SHALL select only needed fields
- **AND** it SHALL apply stable ordering

### Requirement: Exemplar services module

The system SHALL provide a working exemplar feature module for services demonstrating the centralized query pattern.

#### Scenario: Services queries exist

- **WHEN** the services feature module is created
- **THEN** it SHALL export a public query returning published visible services ordered by `display_order`

### Requirement: Environment documentation

The system SHALL document required environment variables without committing secrets.

#### Scenario: Environment example file

- **WHEN** the project is set up
- **THEN** an `.env.example` SHALL exist listing `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and related approved variables
- **AND** `.env.local` SHALL remain untracked by Git

#### Scenario: Secret protection

- **WHEN** environment variables are referenced
- **THEN** secret variables SHALL be prefixed without `NEXT_PUBLIC_` to prevent browser exposure
