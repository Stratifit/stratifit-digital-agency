# public-layout Specification

## Purpose

Defines the global public website frame for Stratifit: announcement bar, header/navigation, footer, and language selector, all wired to Supabase content through the approved query pattern.

## Requirements

### Requirement: Global public layout

The system SHALL render a global public frame in the approved order: Announcement Bar, Header/Navigation, page content, Footer. The frame SHALL apply to all public routes.

#### Scenario: Layout order

- **WHEN** any public route renders
- **THEN** the Announcement Bar SHALL render first
- **AND** the Header/Navigation SHALL render second
- **AND** the page content SHALL render third
- **AND** the Footer SHALL render last

#### Scenario: Skip link

- **WHEN** the public layout renders
- **THEN** a visible-on-focus skip link to main content SHALL be present

### Requirement: Announcement Bar

The system SHALL render an announcement bar driven by the `announcement_bar` Supabase singleton.

#### Scenario: Announcement visible

- **WHEN** the announcement is enabled and within its date range
- **THEN** the message SHALL render
- **AND** the optional link SHALL render

#### Scenario: Announcement hidden

- **WHEN** the announcement is disabled or outside its date range
- **THEN** no announcement bar SHALL render

### Requirement: Header and navigation

The system SHALL render a header with navigation driven by `navigation_items` where `location = 'header'` and `is_visible = true`.

#### Scenario: Desktop navigation

- **WHEN** the viewport is desktop width
- **THEN** navigation items SHALL render in `display_order`
- **AND** items SHALL link to their `href`

#### Scenario: Mobile navigation

- **WHEN** the viewport is mobile width
- **THEN** a menu control SHALL be available
- **AND** opening the menu SHALL reveal the navigation items in a Drawer
- **AND** focus and keyboard behavior SHALL follow the Drawer component contract

#### Scenario: Navigation content

- **WHEN** navigation items load from Supabase
- **THEN** labels SHALL use the translation object resolved for the current locale
- **AND** English SHALL be the fallback

### Requirement: Footer

The system SHALL render a footer driven by `footer_groups` and `footer_links` from Supabase.

#### Scenario: Footer groups and links

- **WHEN** the footer renders
- **THEN** visible footer groups SHALL render in `display_order`
- **AND** each group SHALL render its visible links in `display_order`
- **AND** labels SHALL resolve for the current locale with English fallback

### Requirement: Language selector

The system SHALL provide a language selector for the four approved locales: en, de, fr, es.

#### Scenario: Locale options

- **WHEN** the language selector opens
- **THEN** en, de, fr, and es SHALL be available

#### Scenario: Current locale

- **WHEN** the language selector renders
- **THEN** the current locale SHALL be indicated

### Requirement: Data access pattern

Global chrome content SHALL load through feature modules, not inline queries.

#### Scenario: Feature modules

- **WHEN** the header, footer, or announcement bar needs data
- **THEN** it SHALL call query functions from `src/features/`
- **AND** the queries SHALL filter to visible content only

#### Scenario: Fallback behavior

- **WHEN** Supabase content is unavailable
- **THEN** safe fallbacks SHALL render without breaking the page
- **AND** no hardcoded editable marketing content SHALL be introduced
