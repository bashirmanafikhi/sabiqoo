// Round-trip tests for the history repo against a real SQLite engine.
// better-sqlite3 ships a native binding that must match the host Node ABI;
// if it cannot be instantiated on this platform the suite skips gracefully.
// The requires live inside the availability branch because jest runs even
// skipped describe bodies while collecting tests.

jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(),
}));

jest.mock('@/db', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const Sqlite3 = require('better-sqlite3');
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const { drizzle } = require('drizzle-orm/better-sqlite3');
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const schema = require('@/db/schema');
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const { MIGRATION_SQL } = require('@/db/migrate');

  const sqlite = new Sqlite3(':memory:');
  sqlite.pragma('foreign_keys = ON');
  sqlite.exec(MIGRATION_SQL);
  const db = drizzle(sqlite, { schema });

  return {
    getDb: () => db,
    initDb: async () => {},
    __sqlite: sqlite,
  };
});

const betterSqlite3Available = (() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const Probe = require('better-sqlite3');
    const probeDb = new Probe(':memory:');
    probeDb.close();
    return true;
  } catch {
    return false;
  }
})();

if (!betterSqlite3Available) {
  test.skip('history repo suite needs the better-sqlite3 native binding (unavailable on this platform)', () => {});
} else {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const historyRepo = require('@/repos/historyRepo');
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const { __sqlite } = require('@/db');

  const sadaqah = { key: 'ch-sadaqah-little', titleAr: 'تصدّق ولو بالقليل', titleEn: 'Give charity, even a little' };

  describe('history repo', () => {
    test('add allows redoing the same deed the same day', async () => {
      expect(await historyRepo.add({ ...sadaqah, day: '2026-10-03' })).toBe(true);
      expect(await historyRepo.isDone(sadaqah.key, '2026-10-03')).toBe(true);
      // Same deed, same day → logged again, history keeps both.
      expect(await historyRepo.add({ ...sadaqah, day: '2026-10-03' })).toBe(true);
      expect(await historyRepo.total()).toBe(2);
    });

    test('the same deed can be completed again on another day', async () => {
      expect(await historyRepo.add({ ...sadaqah, day: '2026-10-01' })).toBe(true);
      expect(await historyRepo.add({ ...sadaqah, day: '2026-10-02' })).toBe(true);
    });

    test('no unique index blocks a same-day redo', async () => {
      await historyRepo.add({ ...sadaqah, day: '2026-10-03' });
      expect(() =>
        __sqlite.prepare('INSERT INTO history (key, day) VALUES (?, ?)').run(sadaqah.key, '2026-10-03'),
      ).not.toThrow();
    });

    test('countsForDay counts every completion per key', async () => {
      await historyRepo.add({ ...sadaqah, day: '2026-10-03' });
      await historyRepo.add({ ...sadaqah, day: '2026-10-03' });
      await historyRepo.add({ key: 'fam-call-parents', titleAr: 'اتصال', titleEn: 'Call', day: '2026-10-03' });
      await historyRepo.add({ ...sadaqah, day: '2026-10-02' });

      const counts = await historyRepo.countsForDay('2026-10-03');
      expect(counts.get(sadaqah.key)).toBe(2);
      expect(counts.get('fam-call-parents')).toBe(1);
    });

    test('countsAll counts completions per key across all days', async () => {
      await historyRepo.add({ ...sadaqah, day: '2026-10-01' });
      await historyRepo.add({ ...sadaqah, day: '2026-10-03' });
      await historyRepo.add({ key: 'fam-call-parents', titleAr: 'اتصال', titleEn: 'Call', day: '2026-10-02' });

      const counts = await historyRepo.countsAll();
      expect(counts.get(sadaqah.key)).toBe(2);
      expect(counts.get('fam-call-parents')).toBe(1);
    });

    test('removeLatest deletes the newest entry overall (uncheck)', async () => {
      await historyRepo.add({ ...sadaqah, day: '2026-10-01' });
      await historyRepo.add({ ...sadaqah, day: '2026-10-03' });
      await historyRepo.add({ ...sadaqah, day: '2026-10-03' });

      await historyRepo.removeLatest(sadaqah.key);
      expect(await historyRepo.total()).toBe(2);
      expect(await historyRepo.isDone(sadaqah.key, '2026-10-03')).toBe(true);

      await historyRepo.removeLatest(sadaqah.key);
      await historyRepo.removeLatest(sadaqah.key);
      expect(await historyRepo.total()).toBe(0);
      expect(await historyRepo.isDone(sadaqah.key, '2026-10-01')).toBe(false);
    });

    test('titles are snapshotted at completion time', async () => {
      await historyRepo.add({ ...sadaqah, day: '2026-10-03' });
      const rows = await historyRepo.listAll();
      expect(rows[0]?.titleAr).toBe('تصدّق ولو بالقليل');
      expect(rows[0]?.titleEn).toBe('Give charity, even a little');
    });

    test('doneKeysForDay returns the keys logged that day', async () => {
      await historyRepo.add({ ...sadaqah, day: '2026-10-03' });
      await historyRepo.add({ key: 'fam-call-parents', titleAr: 'اتصال', titleEn: 'Call', day: '2026-10-03' });
      await historyRepo.add({ key: 'nat-plant-tree', titleAr: 'غرس', titleEn: 'Plant', day: '2026-10-02' });

      const keys = await historyRepo.doneKeysForDay('2026-10-03');
      expect(keys.has(sadaqah.key)).toBe(true);
      expect(keys.has('fam-call-parents')).toBe(true);
      expect(keys.has('nat-plant-tree')).toBe(false);
    });

    test('listAll is newest first', async () => {
      await historyRepo.add({ ...sadaqah, day: '2026-10-01' });
      await historyRepo.add({ ...sadaqah, day: '2026-10-03' });
      await historyRepo.add({ ...sadaqah, day: '2026-10-02' });

      const days = (await historyRepo.listAll()).map((r: { day: string }) => r.day);
      expect(days).toEqual(['2026-10-03', '2026-10-02', '2026-10-01']);
    });

    test('total counts every logged completion', async () => {
      await historyRepo.add({ ...sadaqah, day: '2026-10-01' });
      await historyRepo.add({ ...sadaqah, day: '2026-10-02' });
      expect(await historyRepo.total()).toBe(2);
    });

    test('remove deletes only the latest (key, day) entry', async () => {
      await historyRepo.add({ ...sadaqah, day: '2026-10-03' });
      await historyRepo.add({ ...sadaqah, day: '2026-10-03' });
      await historyRepo.remove(sadaqah.key, '2026-10-03');
      expect(await historyRepo.isDone(sadaqah.key, '2026-10-03')).toBe(true);
      await historyRepo.remove(sadaqah.key, '2026-10-03');
      expect(await historyRepo.isDone(sadaqah.key, '2026-10-03')).toBe(false);
      expect(await historyRepo.total()).toBe(0);
    });

    test('removeAll wipes the history (Settings reset)', async () => {
      await historyRepo.add({ ...sadaqah, day: '2026-10-01' });
      await historyRepo.add({ ...sadaqah, day: '2026-10-02' });
      await historyRepo.removeAll();
      expect(await historyRepo.total()).toBe(0);
      expect(await historyRepo.listAll()).toEqual([]);
    });
  });
}
