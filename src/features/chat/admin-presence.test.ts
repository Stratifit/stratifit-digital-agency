import { describe, expect, it } from "vitest";
import {
  ADMIN_ONLINE_WINDOW_MS,
  isWithinOnlineWindow,
} from "./admin-presence-utils";

describe("isWithinOnlineWindow", () => {
  const now = Date.parse("2026-08-21T12:00:00Z");

  it("returns false for a null or empty timestamp", () => {
    expect(isWithinOnlineWindow(null, now)).toBe(false);
    expect(isWithinOnlineWindow("", now)).toBe(false);
  });

  it("returns false for an invalid timestamp", () => {
    expect(isWithinOnlineWindow("not-a-date", now)).toBe(false);
  });

  it("returns true for a fresh heartbeat inside the window", () => {
    const fresh = new Date(now - 30_000).toISOString();
    expect(isWithinOnlineWindow(fresh, now)).toBe(true);
  });

  it("returns true exactly at the window boundary", () => {
    const boundary = new Date(now - ADMIN_ONLINE_WINDOW_MS).toISOString();
    expect(isWithinOnlineWindow(boundary, now)).toBe(true);
  });

  it("returns false once the heartbeat is older than the window", () => {
    const stale = new Date(now - ADMIN_ONLINE_WINDOW_MS - 1).toISOString();
    expect(isWithinOnlineWindow(stale, now)).toBe(false);
  });

  it("returns false for a future timestamp", () => {
    const future = new Date(now + 60_000).toISOString();
    expect(isWithinOnlineWindow(future, now)).toBe(false);
  });

  it("honors a custom window", () => {
    const twoMinAgo = new Date(now - 2 * 60_000).toISOString();
    expect(isWithinOnlineWindow(twoMinAgo, now, 3 * 60_000)).toBe(true);
    expect(isWithinOnlineWindow(twoMinAgo, now, 60_000)).toBe(false);
  });
});
