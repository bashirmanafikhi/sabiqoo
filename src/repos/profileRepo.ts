import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { userProfile, type UserProfile } from '@/db/schema';

const DEFAULT_PROFILE: UserProfile = {
  id: 1,
  currentXp: 0,
  currentLevel: 1,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  streakFreezesLeft: 2,
};

export async function get(): Promise<UserProfile> {
  const db = getDb();
  const row = db.select().from(userProfile).where(eq(userProfile.id, 1)).get();
  if (row) return row;
  db.insert(userProfile).values(DEFAULT_PROFILE).run();
  const created = db.select().from(userProfile).where(eq(userProfile.id, 1)).get();
  return created ?? DEFAULT_PROFILE;
}

export async function upsert(p: UserProfile): Promise<void> {
  const db = getDb();
  db.insert(userProfile)
    .values(p)
    .onConflictDoUpdate({
      target: userProfile.id,
      set: {
        currentXp: p.currentXp,
        currentLevel: p.currentLevel,
        currentStreak: p.currentStreak,
        longestStreak: p.longestStreak,
        lastActiveDate: p.lastActiveDate,
        streakFreezesLeft: p.streakFreezesLeft,
      },
    })
    .run();
}
