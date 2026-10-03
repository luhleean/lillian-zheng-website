import { env } from 'cloudflare:workers';
import { emptyLibrary, validateLibrary, type Library } from './flashcards';
export const runtime = () => env as unknown as { DB: D1Database; BUCKET: R2Bucket };
export class StoreError extends Error { constructor(message: string, public status = 400) { super(message); } }
export function userId(request: Request) {
  const id = request.headers.get('oai-authenticated-user-id');
  if (!id || !request.headers.get('oai-authenticated-user-email')) throw new StoreError('Sign in to open your library.', 401);
  return id;
}
export function checkOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) throw new StoreError('This request is not allowed.', 403);
}
export async function readLibrary(user: string) {
  const db = runtime().DB;
  if (!db) throw new StoreError('Your library is temporarily unavailable. Please try again.', 503);
  const row = await db.prepare('SELECT data, revision FROM flashcard_libraries WHERE user_id = ?').bind(user).first<{data: string; revision: number}>();
  return row ? { library: JSON.parse(row.data) as Library, revision: row.revision } : { library: emptyLibrary(), revision: 0 };
}
export async function saveLibrary(user: string, value: unknown, revision: number) {
  const library = validateLibrary(value);
  const json = JSON.stringify(library);
  if (json.length > 2_000_000 || !Number.isInteger(revision) || revision < 0) throw new StoreError('Library exceeds the limit. Export some sets before adding more.');
  const result = await runtime().DB.prepare('INSERT INTO flashcard_libraries (user_id, data, revision) VALUES (?, ?, 1) ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, revision = flashcard_libraries.revision + 1 WHERE flashcard_libraries.revision = ?').bind(user, json, revision).run();
  if (!result.meta.changes) throw new StoreError('Your library changed on another device. Reload before saving; your current draft is still here.', 409);
  return { library, revision: revision + 1 };
}
export function failure(error: unknown) {
  if (error instanceof StoreError) return Response.json({error: error.message}, {status:error.status});
  console.error('Flashcard operation failed', error);
  return Response.json({error:'Could not complete this action. Your input has been kept; please try again.'}, {status:503});
}

