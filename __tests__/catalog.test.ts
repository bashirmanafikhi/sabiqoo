import { CATEGORIES, SUGGESTIONS, categoryById, deedsByCategory, suggestionByKey } from '@/content/catalog';

describe('deed catalog', () => {
  test('offers a large, browsable set of deeds', () => {
    expect(SUGGESTIONS.length).toBeGreaterThanOrEqual(100);
  });

  test('deed keys are unique', () => {
    const keys = new Set(SUGGESTIONS.map((s) => s.key));
    expect(keys.size).toBe(SUGGESTIONS.length);
  });

  test('every deed is bilingual with a one-line description', () => {
    for (const s of SUGGESTIONS) {
      expect(s.ar.trim()).not.toBe('');
      expect(s.en.trim()).not.toBe('');
      expect(s.descAr.trim()).not.toBe('');
      expect(s.descEn.trim()).not.toBe('');
    }
  });

  test('every deed points at an existing category, and categories are unique', () => {
    const ids = new Set(CATEGORIES.map((c) => c.id));
    expect(CATEGORIES.length).toBeGreaterThanOrEqual(5);
    expect(ids.size).toBe(CATEGORIES.length);
    for (const s of SUGGESTIONS) {
      expect(ids.has(s.category)).toBe(true);
    }
  });

  test('helpers resolve lookups and filtering', () => {
    const first = SUGGESTIONS[0];
    if (!first) throw new Error('catalog must not be empty');
    expect(suggestionByKey(first.key)).toEqual(first);
    expect(categoryById(first.category)?.en.trim()).not.toBe('');
    expect(deedsByCategory(first.category).every((s) => s.category === first.category)).toBe(true);
    expect(deedsByCategory('all')).toHaveLength(SUGGESTIONS.length);
    expect(deedsByCategory('all').length).toBeGreaterThan(deedsByCategory(first.category).length);
  });
});
