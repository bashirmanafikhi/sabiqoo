export interface StreakProfile {
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  streak_freezes_left: number;
}

export interface StreakUpdate {
  profile: StreakProfile;
  dayBucket: string;
  freezerConsumed?: boolean;
  freezerRefilled?: boolean;
}

const MAX_FREEZES = 2;

function parseBucket(s: string): Date {
  const parts = s.split('-');
  if (parts.length !== 3) throw new Error(`Invalid day bucket: ${s}`);
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) {
    throw new Error(`Invalid day bucket: ${s}`);
  }
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0, 0));
}

function daysBetween(a: string, b: string): number {
  const ms = parseBucket(b).getTime() - parseBucket(a).getTime();
  return Math.round(ms / 86_400_000);
}

function withOptionalRefill(
  value: number,
  freezesLeft: number,
): { value: number; freezesLeft: number; refilled: boolean } {
  if (value > 0 && value % 7 === 0 && freezesLeft < MAX_FREEZES) {
    return { value, freezesLeft: freezesLeft + 1, refilled: true };
  }
  return { value, freezesLeft, refilled: false };
}

export function nextStreakOnLog(input: StreakUpdate): StreakProfile {
  const { profile, dayBucket } = input;
  if (profile.last_active_date === dayBucket) return profile;

  let value: number;
  let freezesLeft = profile.streak_freezes_left;

  if (profile.last_active_date === null) {
    value = 1;
  } else {
    const diff = daysBetween(profile.last_active_date, dayBucket);
    if (diff === 1) {
      value = profile.current_streak + 1;
    } else if (diff === 2 && freezesLeft > 0) {
      value = profile.current_streak + 1;
      freezesLeft -= 1;
    } else {
      value = 1;
    }
  }

  const r = withOptionalRefill(value, freezesLeft);
  return {
    ...profile,
    current_streak: r.value,
    longest_streak: Math.max(profile.longest_streak, r.value),
    last_active_date: dayBucket,
    streak_freezes_left: r.freezesLeft,
  };
}
