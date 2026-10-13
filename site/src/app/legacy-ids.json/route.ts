// /legacy-ids.json: where each anchor of the old JavaScript docs is now (see lib/legacy-ids.ts).
// Only the JavaScript library's page reads it, and only when its URL has an ?id=.
import { legacyIds } from '@/lib/legacy-ids';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(legacyIds());
}
