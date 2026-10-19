import { beforeEach, expect, mock, test } from 'bun:test';
import { INITIAL_LEADS } from '../data/initialData';

let rows = [];
let insertError = null;
Object.defineProperty(globalThis, 'localStorage', { value: {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0
}, configurable: true });
mock.module('../integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: () => ({ order: async () => ({ data: [...rows], error: null }) }),
      insert: async (row) => {
        if (insertError) return { error: insertError };
        rows.push(row);
        return { error: null };
      },
      upsert: async (incoming) => {
        if (insertError) return { error: insertError };
        for (const row of Array.isArray(incoming) ? incoming : [incoming]) {
          rows = [...rows.filter((existing) => existing.id !== row.id), row];
        }
        return { error: null };
      },
      delete: () => ({ in: async (_column, ids) => {
        rows = rows.filter((row) => !ids.includes(row.id));
        return { error: null };
      } })
    })
  }
}));

const { addLead, loadLeads, saveLeads } = await import('./db');
beforeEach(() => { rows = []; insertError = null; });

test('site submission inserts only its own lead without removing existing records', async () => {
  rows = [{ id: 'existing-record' }];
  await addLead({ ...INITIAL_LEADS[0], id: 'website-request' });
  expect(rows.map((row) => row.id)).toEqual(['existing-record', 'website-request']);
});

test('failed website submission rejects instead of confirming a saved record', async () => {
  insertError = new Error('No API key found in request');
  await expect(addLead({ ...INITIAL_LEADS[0], id: 'failed-request' })).rejects.toThrow('No API key');
  expect(rows).toHaveLength(0);
});

test('stale panel saves preserve a lead submitted by another browser', async () => {
  await addLead({ ...INITIAL_LEADS[0], id: 'original' });
  const panelLeads = await loadLeads();
  await addLead({ ...INITIAL_LEADS[0], id: 'new-from-other-browser' });
  await saveLeads(panelLeads);
  expect(rows.map((row) => row.id).sort()).toEqual(['new-from-other-browser', 'original']);
});