## Purpose

Defines admin authentication and the admin application shell: login, session handling, route protection, logout, and the dashboard frame.

## ADDED Requirements

### Requirement: Admin login

The system SHALL provide an admin login page at `/admin/login` accepting email and password.

#### Scenario: Successful sign-in

- **WHEN** an admin submits valid credentials
- **THEN** a Supabase session SHALL be created
- **AND** the user SHALL be redirected to `/admin/dashboard`

#### Scenario: Failed sign-in

- **WHEN** an admin submits invalid credentials
- **THEN** a clear error SHALL be shown
- **AND** no session SHALL be created

#### Scenario: Input validation

- **WHEN** the login form is submitted
- **THEN** email format and non-empty password SHALL be validated on the server

### Requirement: Admin route protection

The system SHALL protect all admin routes except `/admin/login`.

#### Scenario: Unauthenticated access

- **WHEN** an unauthenticated user requests a protected admin route
- **THEN** the request SHALL redirect to `/admin/login`

#### Scenario: Non-admin authenticated access

- **WHEN** an authenticated user without an active `admin_users` record requests a protected admin route
- **THEN** the request SHALL redirect to `/admin/login`
- **AND** no admin UI SHALL render

### Requirement: Admin logout

The system SHALL provide a logout action that clears the Supabase session.

#### Scenario: Logout

- **WHEN** an admin logs out
- **THEN** the Supabase session SHALL be cleared
- **AND** the user SHALL be redirected to `/admin/login`

### Requirement: Admin shell

The system SHALL render an admin shell around all protected admin routes with a sidebar, top bar, and content area.

#### Scenario: Shell navigation

- **WHEN** an admin views any protected route
- **THEN** the sidebar SHALL show approved admin navigation sections
- **AND** the top bar SHALL show the current admin identity and a logout control

#### Scenario: Dashboard

- **WHEN** an admin visits `/admin/dashboard`
- **THEN** an overview SHALL render with operational summary widgets

### Requirement: Admin identity

The system SHALL resolve the current admin's identity and role from the session and `admin_users`.

#### Scenario: Identity display

- **WHEN** the admin shell renders
- **THEN** the current admin display name and role SHALL be available

### Requirement: Server-only authorization

Authorization SHALL be enforced server-side, never by UI hiding alone.

#### Scenario: Server check

- **WHEN** a protected admin route renders
- **THEN** the server SHALL verify the session and the active admin record before rendering children
