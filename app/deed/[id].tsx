import { useCallback, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ConfettiOverlay } from '@/components/ConfettiOverlay';
import { useColors } from '@/theme/tokens';
import * as deedsRepo from '@/repos/deedsRepo';
import * as logsRepo from '@/repos/logsRepo';
import * as referencesRepo from '@/repos/referencesRepo';
import * as categoriesRepo from '@/repos/categoriesRepo';
import * as bookmarksRepo from '@/repos/bookmarksRepo';
import * as skippedRepo from '@/repos/skippedRepo';
import * as profileRepo from '@/repos/profileRepo';
import { computeXpEarned } from '@/gamification/xp';
import { levelFromXp } from '@/gamification/level';
import { nextStreakOnLog } from '@/gamification/streak';
import { success as hapticSuccess } from '@/utils/haptics';
import { todayIso, nowIsoUtc } from '@/utils/dates';
import type {
  Deed,
  Category,
  DeedReference,
  UserLog,
  UserProfile,
} from '@/db/schema';
import { TodayTab } from './_TodayTab';
import { EvidenceTab } from './_EvidenceTab';
import { HistoryTab } from './_HistoryTab';
import { DeedHeader, DeedTabs, type TabKey } from './_Header';
import { pickLocale, titleFor, type Locale } from './_helpers';

export default function DeedDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const idRaw = params.id;
  const id = idRaw ? Number(idRaw) : NaN;
  const { t, i18n } = useTranslation();
  const locale: Locale = pickLocale(i18n.language);

  const [deed, setDeed] = useState<Deed | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [refs, setRefs] = useState<DeedReference[]>([]);
  const [logs, setLogs] = useState<UserLog[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [tab, setTab] = useState<TabKey>('today');
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [celebrate, setCelebrate] = useState<{ xp: number } | null>(null);

  const today = useMemo(() => todayIso(), []);

  const load = useCallback(async () => {
    if (!Number.isFinite(id)) return;
    const d = await deedsRepo.getById(id);
    if (!d) {
      setDeed(null);
      return;
    }
    setDeed(d);
    const [cats, r, l, p, bm, sk] = await Promise.all([
      categoriesRepo.list(),
      referencesRepo.listByDeed(id),
      logsRepo.listByDeed(id),
      profileRepo.get(),
      bookmarksRepo.isBookmarked(id),
      skippedRepo.isSkipped(id),
    ]);
    const cat = cats.find(c => c.id === d.categoryId) ?? null;
    setCategory(cat);
    setRefs(r);
    setLogs(l);
    setProfile(p);
    setBookmarked(bm);
    setSkipped(sk);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load().catch(err => console.warn('[deed] load', err));
    }, [load]),
  );

  const difficulty = useMemo(() => {
    if (!deed) return 1 as 1 | 2 | 3;
    if (deed.difficultyLevel === 2 || deed.difficultyLevel === 3) {
      return deed.difficultyLevel as 2 | 3;
    }
    return 1 as 1;
  }, [deed]);

  const predictedXp = useMemo(() => {
    if (!deed) return 0;
    return computeXpEarned({
      baseReward: deed.xpReward,
      quantity: qty,
      difficulty,
    });
  }, [deed, qty, difficulty]);

  const onComplete = useCallback(async () => {
    if (!deed || !profile || busy) return;
    setBusy(true);
    try {
      const xpEarned = computeXpEarned({
        baseReward: deed.xpReward,
        quantity: qty,
        difficulty,
      });
      await logsRepo.insert({
        deedId: deed.id,
        completedAt: nowIsoUtc(),
        xpEarned,
        quantity: qty,
        dayBucket: today,
      });
      const next = nextStreakOnLog({
        profile: {
          current_streak: profile.currentStreak,
          longest_streak: profile.longestStreak,
          last_active_date: profile.lastActiveDate,
          streak_freezes_left: profile.streakFreezesLeft,
        },
        dayBucket: today,
      });
      const newXp = profile.currentXp + xpEarned;
      const newLevel = levelFromXp(newXp);
      const updated: UserProfile = {
        ...profile,
        currentXp: newXp,
        currentLevel: newLevel,
        currentStreak: next.current_streak,
        longestStreak: next.longest_streak,
        lastActiveDate: next.last_active_date,
        streakFreezesLeft: next.streak_freezes_left,
      };
      await profileRepo.upsert(updated);
      setProfile(updated);
      hapticSuccess();
      setCelebrate({ xp: xpEarned });
      setQty(1);
      await load();
    } finally {
      setBusy(false);
    }
  }, [deed, profile, busy, qty, today, difficulty, load]);

  const onToggleBookmark = useCallback(async () => {
    if (!deed) return;
    if (bookmarked) {
      await bookmarksRepo.remove(deed.id);
      setBookmarked(false);
    } else {
      await bookmarksRepo.add(deed.id);
      setBookmarked(true);
    }
  }, [deed, bookmarked]);

  const onToggleSkip = useCallback(async () => {
    if (!deed) return;
    if (skipped) {
      await skippedRepo.unSkip(deed.id);
      setSkipped(false);
    } else {
      await skippedRepo.skip(deed.id);
      setSkipped(true);
    }
  }, [deed, skipped]);

  if (!deed) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <Stack.Screen
          options={{ title: t('home.title'), headerShown: false }}
        />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text className="text-base" style={{ color: colors.textMuted }}>
            {t('common.loading')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen
        options={{ title: titleFor(deed, locale), headerShown: false }}
      />
      <DeedHeader
        deed={deed}
        bookmarked={bookmarked}
        skipped={skipped}
        onBack={() => router.back()}
        onToggleBookmark={onToggleBookmark}
        onToggleSkip={onToggleSkip}
        locale={locale}
      />
      <DeedTabs tab={tab} onChange={setTab} />
      {tab === 'today' ? (
        <TodayTab
          deed={deed}
          category={category}
          predictedXp={predictedXp}
          onComplete={onComplete}
          busy={busy}
          locale={locale}
        />
      ) : tab === 'evidence' ? (
        <EvidenceTab refs={refs} locale={locale} />
      ) : (
        <HistoryTab
          deed={deed}
          logs={logs}
          locale={locale}
          today={today}
        />
      )}
      {celebrate ? (
        <ConfettiOverlay
          visible
          xpEarned={celebrate.xp}
          streak={profile?.currentStreak ?? 0}
          onDone={() => setCelebrate(null)}
        />
      ) : null}
    </View>
  );
}
