import { createHash } from "crypto";

/** SHA-256 hash of an anonymous visitor token — never stores raw tokens. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
