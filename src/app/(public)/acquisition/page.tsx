import { permanentRedirect } from "next/navigation";

/**
 * Legacy acquisition page — replaced by the /buy-business marketplace hub.
 * Keep the old URL working via a permanent redirect so external links and
 * bookmarks continue to resolve.
 */
export default function AcquisitionPage() {
  permanentRedirect("/buy-business");
}
