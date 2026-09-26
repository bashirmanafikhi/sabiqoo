import { computeXpEarned } from '@/gamification/xp';
import {
  levelFromXp,
  xpForLevel,
  xpIntoLevel,
} from '@/gamification/level';
import {
  nextStreakOnLog,
  type StreakProfile,
} from '@/gamification/streak';

const baseProfile: StreakProfile = {
  current_streak: 0,
  longest_streak: 0,
  last_active_date: null,
  streak_freezes_left: 0,
};

describe('xp.computeXpEarned', () => {
  test('easy difficulty (1) at quantity 1 yields base reward', () => {
    expect(
      computeXpEarned({ baseReward: 10, quantity: 1, difficulty: 1 }),
    ).toBe(10);
  });

  test('medium difficulty (2) at quantity 3 rounds 37.5 to 38', () => {
    expect(
      computeXpEarned({ baseReward: 10, quantity: 3, difficulty: 2 }),
    ).toBe(38);
  });

  test('hard difficulty (3) at quantity 1 yields 15', () => {
    expect(
      computeXpEarned({ baseReward: 10, quantity: 1, difficulty: 3 }),
    ).toBe(15);
  });
});

describe('level.xpForLevel', () => {
  test('level 1', () => expect(xpForLevel(1)).toBe(100));
  test('level 2', () => expect(xpForLevel(2)).toBe(300));
  test('level 3', () => expect(xpForLevel(3)).toBe(600));
  test('level 4', () => expect(xpForLevel(4)).toBe(1000));
});

describe('level.levelFromXp', () => {
  test('xp 0 → level 1', () => expect(levelFromXp(0)).toBe(1));
  test('xp 299 → level 1 (still below xpForLevel(2)=300)', () => expect(levelFromXp(299)).toBe(1));
  test('xp 300 → level 2', () => expect(levelFromXp(300)).toBe(2));
  test('xp 599 → level 2 (still below xpForLevel(3)=600)', () => expect(levelFromXp(599)).toBe(2));
  test('xp 600 → level 3 (exact boundary)', () => expect(levelFromXp(600)).toBe(3));
  test('xp 601 → level 3', () => expect(levelFromXp(601)).toBe(3));
  test('xp 999 → level 3', () => expect(levelFromXp(999)).toBe(3));
  test('xp 1000 → level 4 (exact boundary)', () => expect(levelFromXp(1000)).toBe(4));
});

describe('level.xpIntoLevel', () => {
  test('xp 150 → current 50 / needed 200 / 25%', () => {
    expect(xpIntoLevel(150)).toEqual({ current: 50, needed: 200, percent: 0.25 });
  });
  test('xp 0 → 0% progress', () => {
    const info = xpIntoLevel(0);
    expect(info.percent).toBe(0);
  });
  test('percent is clamped to [0,1]', () => {
    expect(xpIntoLevel(10_000).percent).toBeLessThanOrEqual(1);
    expect(xpIntoLevel(-50).percent).toBeGreaterThanOrEqual(0);
  });
});

describe('streak.nextStreakOnLog', () => {
  test('first-ever log starts streak at 1', () => {
    const out = nextStreakOnLog({
      profile: { ...baseProfile, streak_freezes_left: 2 },
      dayBucket: '2026-09-26',
    });
    expect(out.current_streak).toBe(1);
    expect(out.last_active_date).toBe('2026-09-26');
    expect(out.streak_freezes_left).toBe(2);
    expect(out.longest_streak).toBe(1);
  });

  test('same day is a no-op', () => {
    const profile: StreakProfile = {
      current_streak: 5,
      longest_streak: 5,
      last_active_date: '2026-09-26',
      streak_freezes_left: 2,
    };
    const out = nextStreakOnLog({ profile, dayBucket: '2026-09-26' });
    expect(out).toBe(profile);
  });

  test('consecutive day increments by 1', () => {
    const profile: StreakProfile = {
      current_streak: 5,
      longest_streak: 5,
      last_active_date: '2026-09-26',
      streak_freezes_left: 2,
    };
    const out = nextStreakOnLog({ profile, dayBucket: '2026-09-27' });
    expect(out.current_streak).toBe(6);
    expect(out.longest_streak).toBe(6);
    expect(out.last_active_date).toBe('2026-09-27');
    expect(out.streak_freezes_left).toBe(2);
  });

  test('missed 1 day with a freeze available consumes freeze and increments', () => {
    const profile: StreakProfile = {
      current_streak: 5,
      longest_streak: 5,
      last_active_date: '2026-09-26',
      streak_freezes_left: 1,
    };
    const out = nextStreakOnLog({ profile, dayBucket: '2026-09-28' });
    expect(out.current_streak).toBe(6);
    expect(out.streak_freezes_left).toBe(0);
    expect(out.last_active_date).toBe('2026-09-28');
  });

  test('missed 2 days with only one freeze resets streak', () => {
    const profile: StreakProfile = {
      current_streak: 5,
      longest_streak: 5,
      last_active_date: '2026-09-26',
      streak_freezes_left: 1,
    };
    const out = nextStreakOnLog({ profile, dayBucket: '2026-09-29' });
    expect(out.current_streak).toBe(1);
    expect(out.streak_freezes_left).toBe(1);
  });

  test('missed 1 day with zero freezes resets streak', () => {
    const profile: StreakProfile = {
      current_streak: 5,
      longest_streak: 5,
      last_active_date: '2026-09-26',
      streak_freezes_left: 0,
    };
    const out = nextStreakOnLog({ profile, dayBucket: '2026-09-28' });
    expect(out.current_streak).toBe(1);
    expect(out.streak_freezes_left).toBe(0);
  });

  test('seven consecutive active days from a fresh profile refills one freeze', () => {
    let profile: StreakProfile = { ...baseProfile };
    for (let i = 1; i <= 7; i++) {
      const day = `2026-09-${String(i).padStart(2, '0')}`;
      profile = nextStreakOnLog({ profile, dayBucket: day });
    }
    expect(profile.current_streak).toBe(7);
    expect(profile.streak_freezes_left).toBe(1);
  });

  test('refill caps at 2 after fourteen consecutive active days', () => {
    let profile: StreakProfile = { ...baseProfile };
    for (let i = 1; i <= 14; i++) {
      const day = `2026-09-${String(i).padStart(2, '0')}`;
      profile = nextStreakOnLog({ profile, dayBucket: day });
    }
    expect(profile.current_streak).toBe(14);
    expect(profile.streak_freezes_left).toBe(2);
  });

  test('streak survives across month and year boundaries', () => {
    const profile: StreakProfile = {
      current_streak: 1,
      longest_streak: 1,
      last_active_date: '2026-12-31',
      streak_freezes_left: 2,
    };
    const out = nextStreakOnLog({ profile, dayBucket: '2027-01-01' });
    expect(out.current_streak).toBe(2);
    expect(out.last_active_date).toBe('2027-01-01');
  });
});
