# database-seed Specification

## Purpose

Defines seed data that provides predictable development content for all major content types, enabling frontend development, CMS testing, and visual preview without requiring manual data entry.

## Requirements

### Requirement: Seed file location and format

Seed data SHALL be stored in `supabase/seed.sql` as plain SQL. The file SHALL use `INSERT ... ON CONFLICT` or stable IDs to ensure idempotent reruns.

#### Scenario: Seed file exists

- **WHEN** the project is initialized
- **THEN** `supabase/seed.sql` SHALL exist at the repository root

### Requirement: Singleton defaults seeded

Seed data SHALL include default rows for all singleton tables: `site_settings`, `announcement_bar`, `hero`, `why_choose_us`, `acquisition_section`, `chatbot_settings`, and `ai_faq_settings`.

#### Scenario: Site settings seeded

- **WHEN** the seed file is applied to a fresh database
- **THEN** `site_settings` SHALL contain one row with `site_name = 'Stratifit'`, `default_locale = 'en'`, and `supported_locales = '{en,de,fr,es}'`

#### Scenario: Hero seeded

- **WHEN** the seed file is applied
- **THEN** `hero` SHALL contain one row with `is_visible = true` and populated `title_translations` and `description_translations`

### Requirement: Navigation seeded

Seed data SHALL include header navigation items for: Home, Services, Work, Insights, About, Acquisition, and Contact. Each item SHALL have `location = 'header'`, correct `href` values, `display_order`, and `is_visible = true`.

#### Scenario: Header navigation items

- **WHEN** the seed file is applied
- **THEN** `navigation_items` SHALL contain at least 7 rows with `location = 'header'` ordered from 1 to 7

### Requirement: Footer seeded

Seed data SHALL include footer groups and footer links for: Services, Company, and Legal. Each group SHALL have a `title_translations` and `display_order`. Links SHALL have correct `href` values, `group_id` references, and `display_order`.

#### Scenario: Footer groups

- **WHEN** the seed file is applied
- **THEN** `footer_groups` SHALL contain at least 3 rows with `is_visible = true`

### Requirement: Core services seeded

Seed data SHALL include the four core services: `brand-design`, `website-development`, `ai-automation`, and `growth-marketing`. Each service SHALL have `status = 'published'`, `is_visible = true`, a `slug`, `title_translations` with English values, and `display_order` from 1 to 4.

#### Scenario: Four services created

- **WHEN** the seed file is applied
- **THEN** `services` SHALL contain exactly 4 rows with slugs `brand-design`, `website-development`, `ai-automation`, and `growth-marketing`

### Requirement: Process steps seeded

Seed data SHALL include process steps with `step_key`, `number`, `title_translations`, `description_translations`, `icon_name`, `display_order`, and `is_visible = true`.

#### Scenario: Process steps exist

- **WHEN** the seed file is applied
- **THEN** `process_steps` SHALL contain at least 4 rows ordered sequentially

### Requirement: Homepage content seeded

Seed data SHALL include default content for `why_choose_us` and `acquisition_section` with populated translation fields and `is_visible = true`.

#### Scenario: Homepage sections populated

- **WHEN** the seed file is applied
- **THEN** each homepage singleton table SHALL contain one row with `is_visible = true`

### Requirement: Pricing plans seeded

Seed data SHALL include at least one pricing plan with `status = 'published'`, `is_visible = true`, `slug`, `name_translations`, and `display_order`.

#### Scenario: Default pricing plan

- **WHEN** the seed file is applied
- **THEN** `pricing_plans` SHALL contain at least 1 row

### Requirement: FAQs seeded

Seed data SHALL include at least 5 sample FAQs with `question_translations`, `answer_translations`, `category`, `display_order`, `is_visible = true`, `status = 'published'`, and `is_ai_eligible = true`.

#### Scenario: Default FAQs

- **WHEN** the seed file is applied
- **THEN** `faqs` SHALL contain at least 5 rows

### Requirement: Chatbot settings seeded

Seed data SHALL include default `chatbot_settings` with `is_enabled = false`, `welcome_message_translations`, `offline_message_translations`, and `escalation_message_translations`.

#### Scenario: Chatbot settings default

- **WHEN** the seed file is applied
- **THEN** `chatbot_settings` SHALL contain one row with `is_enabled = false`

### Requirement: AI FAQ settings seeded

Seed data SHALL include default `ai_faq_settings` with `is_enabled = false`, `intro_translations`, and `suggested_questions`.

#### Scenario: AI FAQ settings default

- **WHEN** the seed file is applied
- **THEN** `ai_faq_settings` SHALL contain one row with `is_enabled = false`

### Requirement: No production secrets

Seed data SHALL NOT contain production API keys, real customer data, passwords, service-role keys, or other secrets.

#### Scenario: Seed safety

- **WHEN** the seed file is reviewed
- **THEN** it SHALL NOT contain any environment-specific secrets or real private data

### Requirement: Seed rerun safety

The seed file SHALL be safe to rerun against the same database without creating duplicate records or violating unique constraints.

#### Scenario: Idempotent seed

- **WHEN** the seed file is applied twice to the same database
- **THEN** no duplicate rows or constraint violations SHALL occur
