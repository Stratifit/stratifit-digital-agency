import { NextResponse } from "next/server";
import { processDueSchedules } from "@/features/communication/process-schedules";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Cron entry point for the Communication Engine schedule processor.
 *
 * Triggered by Vercel Cron (see `vercel.json` crons entry) with an HTTP GET.
 * Guarded two ways:
 *   1. Requests carrying the `x-vercel-cron-schedule` header are accepted —
 *      Vercel adds this header to cron invocations.
 *   2. Any other caller must present `Authorization: Bearer <COMMUNICATION_CRON_SECRET>`.
 *
 * When neither guard passes, the route returns 401. Sends are idempotent by
 * schedule id, so overlapping runs are safe.
 */
export async function GET(request: Request) {
  const isVercelCron = request.headers.has("x-vercel-cron-schedule");
  const secret = process.env.COMMUNICATION_CRON_SECRET;
  const bearer = request.headers.get("authorization");

  const authorized =
    isVercelCron ||
    (secret !== undefined && secret.length > 0 && bearer === `Bearer ${secret}`);

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const result = await processDueSchedules();
  return NextResponse.json(result);
}
