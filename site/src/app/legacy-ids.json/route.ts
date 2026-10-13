// /legacy-ids.json: where each anchor of the old JavaScript docs is now (see lib/legacy-ids.ts).
// public/_worker.js reads it for the old URLs that carry an ?id=.
import { legacyIds } from '@/lib/legacy-ids';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(legacyIds());
}
