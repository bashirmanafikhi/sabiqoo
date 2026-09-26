// __tests__/seed.test.ts
//
// Unit tests for the seed authoring arrays. These tests do not open a
// database; they only validate the in-memory arrays in `scripts/authoring.ts`.

import {
  seedUnits,
  seedCategories,
  seedDeeds,
  seedReferences,
} from '../scripts/authoring';

const ALL_CATEGORY_IDS = seedCategories.map((c) => c.id);
const ALL_UNIT_IDS = seedUnits.map((u) => u.id);

describe('seed authoring', () => {
  test('exports 8 units with bilingual titles', () => {
    expect(seedUnits).toHaveLength(8);
    for (const u of seedUnits) {
      expect(u.title_en.length).toBeGreaterThan(0);
      expect(u.title_ar.length).toBeGreaterThan(0);
    }
  });

  test('exports 7 categories with bilingual names', () => {
    expect(seedCategories).toHaveLength(7);
    for (const c of seedCategories) {
      expect(c.name_en.length).toBeGreaterThan(0);
      expect(c.name_ar.length).toBeGreaterThan(0);
      expect(c.icon_name.length).toBeGreaterThan(0);
      expect(c.color_code.length).toBeGreaterThan(0);
      expect(ALL_UNIT_IDS).toContain(c.unit_id);
    }
  });

  test('exports ≥ 150 deeds', () => {
    expect(seedDeeds.length).toBeGreaterThanOrEqual(150);
  });

  test('every deed has non-empty bilingual title + description', () => {
    for (const deed of seedDeeds) {
      expect(deed.title_ar.length).toBeGreaterThan(0);
      expect(deed.title_en.length).toBeGreaterThan(0);
      expect(deed.description_ar.length).toBeGreaterThan(0);
      expect(deed.description_en.length).toBeGreaterThan(0);
    }
  });

  test('every deed slug is unique', () => {
    const seen = new Set<string>();
    for (const deed of seedDeeds) {
      expect(seen.has(deed.slug)).toBe(false);
      seen.add(deed.slug);
    }
  });

  test('every deed references a valid unit_id and category_id', () => {
    for (const deed of seedDeeds) {
      expect(ALL_UNIT_IDS).toContain(deed.unit_id);
      expect(ALL_CATEGORY_IDS).toContain(deed.category_id);
      expect([1, 2, 3]).toContain(deed.difficulty_level);
      expect([1, 2]).toContain(deed.branch_group);
    }
  });

  test('≥ 70% of deeds are difficulty_level = 1', () => {
    const easy = seedDeeds.filter((d) => d.difficulty_level === 1).length;
    const ratio = easy / seedDeeds.length;
    expect(ratio).toBeGreaterThanOrEqual(0.7);
  });

  test('every category is represented with ≥ 15 deeds', () => {
    for (const catId of ALL_CATEGORY_IDS) {
      const count = seedDeeds.filter((d) => d.category_id === catId).length;
      expect(count).toBeGreaterThanOrEqual(15);
    }
  });

  test('every unit is represented in the deeds', () => {
    for (const unitId of ALL_UNIT_IDS) {
      const count = seedDeeds.filter((d) => d.unit_id === unitId).length;
      expect(count).toBeGreaterThan(0);
    }
  });

  test('exports ≥ 25 references with at least one of each type', () => {
    expect(seedReferences.length).toBeGreaterThanOrEqual(25);
    const types = new Set(seedReferences.map((r) => r.type));
    expect(types.has('quran')).toBe(true);
    expect(types.has('hadith')).toBe(true);
    expect(types.has('athkar')).toBe(true);
  });

  test('every reference points to an existing deed slug', () => {
    const slugs = new Set(seedDeeds.map((d) => d.slug));
    for (const ref of seedReferences) {
      expect(slugs.has(ref.deed_slug)).toBe(true);
    }
  });

  test('at least 15 deeds (by slug) have ≥ 1 reference', () => {
    const withRefs = new Set(seedReferences.map((r) => r.deed_slug));
    expect(withRefs.size).toBeGreaterThanOrEqual(15);
  });

  test('no deed has more than 3 references', () => {
    const counts = new Map<string, number>();
    for (const r of seedReferences) {
      counts.set(r.deed_slug, (counts.get(r.deed_slug) ?? 0) + 1);
    }
    for (const [, count] of counts) {
      expect(count).toBeLessThanOrEqual(3);
    }
  });
});
