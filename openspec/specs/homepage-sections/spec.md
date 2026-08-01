# homepage-sections Specification

## Purpose

Defines the Stratifit homepage: twelve approved sections in fixed order, each rendered from Supabase content through registered section components with safe empty states.

## Requirements

### Requirement: Fixed section order

The homepage SHALL render sections in the approved order: Hero, Trusted By, Services, Process, Why Choose Us, Insights & Expertise, Portfolio, Acquisition, Testimonials, Pricing, FAQ, Final CTA.

#### Scenario: Homepage renders in order

- **WHEN** the homepage renders
- **THEN** sections SHALL appear in the approved fixed order
- **AND** hidden sections SHALL be skipped without breaking the page

### Requirement: Section Registry

The system SHALL provide a Section Registry mapping approved section keys to React components.

#### Scenario: Registry lookup

- **WHEN** a section key is looked up
- **THEN** the registry SHALL return its React component
- **AND** unknown section keys SHALL be ignored safely

### Requirement: Hero section

The Hero SHALL render from the `hero` singleton when visible.

#### Scenario: Hero content

- **WHEN** the hero is visible
- **THEN** it SHALL render eyebrow, title, highlight, description, and CTA translations
- **AND** content SHALL resolve for the current locale with English fallback

### Requirement: Services section

The Services section SHALL render published, visible services ordered by `display_order`.

#### Scenario: Service cards

- **WHEN** services render
- **THEN** each SHALL show title, short description, and icon name
- **AND** featured services SHALL be distinguishable

### Requirement: Process section

The Process section SHALL render visible process steps in `display_order`.

#### Scenario: Process steps

- **WHEN** process steps render
- **THEN** each SHALL show number, title, and description translations

### Requirement: Why Choose Us section

The Why Choose Us section SHALL render from the `why_choose_us` singleton when visible.

#### Scenario: Why Choose Us content

- **WHEN** the section is visible
- **THEN** it SHALL render eyebrow, title, description, and items

### Requirement: Insights section

The Insights section SHALL render up to a bounded number of published insights.

#### Scenario: Insight cards

- **WHEN** insights render
- **THEN** each SHALL show title, excerpt, and featured image reference when present

### Requirement: Portfolio section

The Portfolio section SHALL render up to a bounded number of published portfolio projects.

#### Scenario: Portfolio cards

- **WHEN** portfolio projects render
- **THEN** each SHALL show client name, title, and summary

### Requirement: Acquisition section

The Acquisition section SHALL render from the `acquisition_section` singleton when visible.

#### Scenario: Acquisition content

- **WHEN** the section is visible
- **THEN** it SHALL render title, description, benefits, and CTA

### Requirement: Testimonials section

The Testimonials section SHALL render visible, verified testimonials.

#### Scenario: Testimonial cards

- **WHEN** testimonials render
- **THEN** each SHALL show quote, person name, role, and company

### Requirement: Pricing section

The Pricing section SHALL render published, visible pricing plans ordered by `display_order`.

#### Scenario: Pricing cards

- **WHEN** pricing plans render
- **THEN** each SHALL show name, description, price label, features, and CTA

### Requirement: FAQ section

The FAQ section SHALL render published, visible FAQs ordered by `display_order`.

#### Scenario: FAQ items

- **WHEN** FAQs render
- **THEN** questions SHALL be disclosed one at a time in an accessible accordion pattern

### Requirement: Final CTA section

The Final CTA section SHALL render from the `final_cta` singleton when visible.

#### Scenario: Final CTA content

- **WHEN** the section is visible
- **THEN** it SHALL render title, description, and CTA buttons

### Requirement: Empty-state safety

Each section SHALL render a safe empty state when no content is available without breaking the page.

#### Scenario: Missing content

- **WHEN** a section has no content or is hidden
- **THEN** the section SHALL skip or render a minimal placeholder
- **AND** the rest of the homepage SHALL remain intact

### Requirement: Revalidation

Homepage content SHALL be revalidated when CMS content changes.

#### Scenario: Cache tags

- **WHEN** the homepage renders
- **THEN** it SHALL be associated with homepage content cache tags
- **AND** updates to homepage content SHALL trigger revalidation


