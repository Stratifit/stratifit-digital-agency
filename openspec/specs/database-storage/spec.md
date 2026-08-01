# database-storage Specification

## Purpose

Defines Supabase Storage buckets and policies for media management, ensuring public read access for approved assets and admin-only upload, replace, and delete operations.

## Requirements

### Requirement: Storage buckets created

Four storage buckets SHALL be created: `logos`, `portfolio-images`, `insights-images`, and `general-media`. Each bucket SHALL be configured as a public bucket for read access.

#### Scenario: Buckets exist

- **WHEN** Supabase Storage is queried for available buckets
- **THEN** `logos`, `portfolio-images`, `insights-images`, and `general-media` SHALL be listed

### Requirement: Public read for storage objects

Public users SHALL be able to read (download) objects from all four storage buckets without authentication.

#### Scenario: Anonymous reads logo

- **WHEN** the `anon` role requests a file from the `logos` bucket
- **THEN** the file SHALL be returned successfully

### Requirement: Admin-only upload

Only authenticated users WHERE `public.is_admin()` returns `true` SHALL be able to upload objects to any storage bucket.

#### Scenario: Admin uploads media

- **WHEN** an authenticated admin uploads a file to `general-media`
- **THEN** the upload SHALL succeed and the file SHALL be stored

#### Scenario: Anonymous upload denied

- **WHEN** the `anon` role attempts to upload a file to any bucket
- **THEN** the upload SHALL be denied

### Requirement: Admin-only delete

Only authenticated users WHERE `public.is_admin()` returns `true` SHALL be able to delete objects from any storage bucket.

#### Scenario: Admin deletes media

- **WHEN** an authenticated admin deletes a file from `portfolio-images`
- **THEN** the file SHALL be removed

#### Scenario: Anonymous delete denied

- **WHEN** the `anon` role attempts to delete a file from any bucket
- **THEN** the deletion SHALL be denied

### Requirement: Admin-only update

Only authenticated users WHERE `public.is_admin()` returns `true` SHALL be able to replace or update objects in any storage bucket.

#### Scenario: Admin replaces media

- **WHEN** an authenticated admin replaces a file in `insights-images`
- **THEN** the old file SHALL be replaced with the new file

### Requirement: File validation

Uploads SHALL be validated for MIME type, file size, and storage path. Approved MIME types for image buckets include `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`, and `image/gif`. Maximum file size SHALL be 10 MB for images and 50 MB for general media.

#### Scenario: Valid image upload

- **WHEN** an admin uploads a 2 MB JPEG to `portfolio-images`
- **THEN** the upload SHALL succeed

#### Scenario: Oversized file rejected

- **WHEN** an admin attempts to upload a 60 MB file to `general-media`
- **THEN** the upload SHALL be rejected

### Requirement: Media metadata linkage

Each uploaded file SHALL have a corresponding row in the `media_assets` table with the correct `bucket_name`, `storage_path`, `mime_type`, and `file_size_bytes`. The storage object and the database record SHALL be kept in sync.

#### Scenario: Upload creates metadata

- **WHEN** a file is uploaded to a storage bucket
- **THEN** a row in `media_assets` SHALL be created with the matching `bucket_name` and `storage_path`
