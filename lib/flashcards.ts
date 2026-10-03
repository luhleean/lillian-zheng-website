export type Card = { id: string; front: string; back: string; mastered?: boolean };
export type Folder = { id: string; name: string };
export type Set = { id: string; name: string; folderId: string | null; cards: Card[]; updatedAt: string };
export type Upload = { id: string; name: string; size: number; createdAt: string };
export type Library = { folders: Folder[]; sets: Set[]; uploads: Upload[]; username?: string };
export const emptyLibrary = (): Library => ({ folders: [], sets: [], uploads: [] });
export function validateLibrary(value: unknown): Library {
  const v = value as Library;
  const str = (s: unknown, max: number) => typeof s === 'string' && s.length > 0 && s.length <= max;
  if (!v || !Array.isArray(v.folders) || !Array.isArray(v.sets) || !Array.isArray(v.uploads) || v.folders.length > 200 || v.sets.length > 500 || v.uploads.length > 500) throw new Error('Library is too large or invalid.');
  const ids = new Set<string>();
  const id = (s: string) => { if (!str(s, 100) || ids.has(s)) throw new Error('Invalid or duplicate ID.'); ids.add(s); };
  v.folders.forEach(f => { id(f.id); if (!str(f.name, 120)) throw new Error('Folder names need 1–120 characters.'); });
  v.sets.forEach(s => { id(s.id); if (!str(s.name, 120) || !Array.isArray(s.cards) || s.cards.length > 1000 || (s.folderId !== null && !v.folders.some(f => f.id === s.folderId))) throw new Error('Invalid set.'); s.cards.forEach(c => { id(c.id); if (!str(c.front, 4000) || !str(c.back, 8000) || (c.mastered !== undefined && typeof c.mastered !== 'boolean')) throw new Error('Each card needs a question and answer.'); }); });
  v.uploads.forEach(u => { id(u.id); if (!str(u.name, 255) || !Number.isFinite(u.size)) throw new Error('Invalid upload.'); });
  if (v.username !== undefined && (!str(v.username, 40) || !v.username.trim())) throw new Error('Username needs 1–40 characters.');
  return { folders: v.folders, sets: v.sets, uploads: v.uploads, ...(v.username !== undefined ? { username: v.username.trim() } : {}) };
}
// Parse explicit Q/A, tables, JSON, CSV/TSV, and definition-style notes. Never invent facts.
export function parseCards(input: string): Card[] {
  const text = input.trim().replace(/^```(?:json|csv|tsv)?\s*\n/i, '').replace(/\n```$/, '');
  let pairs: { front: string; back: string }[] = [];
  try { const j = JSON.parse(text); const a = Array.isArray(j) ? j : j.cards; if (Array.isArray(a)) pairs = a.map(x => ({ front: x.front ?? x.question ?? x.term, back: x.back ?? x.answer ?? x.definition })); } catch {}
  if (!pairs.length) {
    const qa = [...text.matchAll(/(?:^|\n)\s*(?:Q|Question)\s*:\s*([\s\S]*?)\n\s*(?:A|Answer)\s*:\s*([\s\S]*?)(?=\n\s*(?:Q|Question)\s*:|$)/gi)];
    if (qa.length) pairs = qa.map(m => ({ front: m[1], back: m[2] }));
  }
  if (!pairs.length) {
    const rows: string[][] = []; let row: string[] = [], cell = '', quoted = false;
    const sep = text.includes('\t') ? '\t' : ',';
    for (let i = 0; i <= text.length; i++) { const ch = text[i] ?? '\n'; if (ch === '"') { if (quoted && text[i+1] === '"') { cell += '"'; i++; } else quoted = !quoted; } else if (!quoted && (ch === sep || ch === '\n')) { row.push(cell.trim()); cell = ''; if (ch === '\n') { rows.push(row); row = []; } } else cell += ch; }
    if (rows.length && rows.every(r => r.length === 2)) pairs = rows.map(r => ({front:r[0],back:r[1]}));
  }
  if (!pairs.length) pairs = text.split('\n').flatMap(line => {
    const clean = line.trim().replace(/^[-*•]\s+/, '');
    if (/^\|?\s*:?-{2,}/.test(clean)) return [];
    const table = clean.replace(/^\||\|$/g, '').split('|').map(x => x.trim());
    if (table.length === 2) return [{ front: table[0], back: table[1] }];
    const m = clean.match(/^(.{1,200}?)(?:\s*::\s*|:\s+|\s+[–—]\s+|\s+is\s+|\s+means\s+)(.+)$/i);
    return m ? [{ front: m[1], back: m[2] }] : [];
  });
  return pairs.filter(p => typeof p.front === 'string' && typeof p.back === 'string' && p.front.trim() && p.back.trim() && !/^(front|question|term)$/i.test(p.front.trim())).slice(0,200).map(p => ({ id: crypto.randomUUID(), front: p.front.trim().slice(0,4000), back: p.back.trim().slice(0,8000) }));
}
