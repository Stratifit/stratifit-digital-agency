import type { Json } from "@/types/database.types";

/**
 * Runtime-guarded read of a JSONB array column into a typed array.
 *
 * Supabase types JSONB columns as `Json`, so typed features currently cast
 * them with `as unknown as T[]`. This helper centralizes that boundary and
 * adds a real `Array.isArray` guard: non-array values (e.g. a `null` column)
 * resolve to `null` instead of leaking a bad shape into renderers.
 */
export function parseJsonArray<T>(value: unknown): T[] | null {
  return Array.isArray(value) ? (value as T[]) : null;
}

/**
 * Runtime-guarded read of a JSONB object column into a mutable JSON object.
 *
 * Used when a feature needs to read-modify-write a `Json` column (e.g. chat
 * visitor metadata) without widening to `unknown` and casting back.
 */
export function readJsonObject(
  value: Json | null | undefined
): Record<string, Json> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, Json>;
}
