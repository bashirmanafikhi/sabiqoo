import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import * as unitsRepo from '@/repos/unitsRepo';
import * as deedsRepo from '@/repos/deedsRepo';
import * as logsRepo from '@/repos/logsRepo';
import * as skippedRepo from '@/repos/skippedRepo';
import type { Deed, Unit } from '@/db/schema';
import { computeUnlockedIds } from '@app/_helpers';
import type { NodeState, UnitNodeSummary, UnitSummary } from './UnitSummary';

export interface UseRoadmapUnitsResult {
  units: UnitSummary[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

function stateFor(
  deedId: number,
  skippedIds: number[],
  logCounts: Record<number, number>,
  unlockedIds: Set<number>,
): NodeState {
  if (skippedIds.includes(deedId)) return 'skipped';
  const count = logCounts[deedId] ?? 0;
  if (count >= 10) return 'mastered';
  if (count >= 1) return 'completed';
  if (unlockedIds.has(deedId)) return 'available';
  return 'locked';
}

export function useRoadmapUnits(): UseRoadmapUnitsResult {
  const [units, setUnits] = useState<Unit[]>([]);
  const [deeds, setDeeds] = useState<Deed[]>([]);
  const [logCounts, setLogCounts] = useState<Record<number, number>>({});
  const [skippedIds, setSkippedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [u, d, sk, logs] = await Promise.all([
        unitsRepo.list(),
        deedsRepo.listAll(),
        skippedRepo.listAll(),
        logsRepo.listAll(),
      ]);
      const counts: Record<number, number> = {};
      for (const l of logs) {
        counts[l.deedId] = (counts[l.deedId] ?? 0) + 1;
      }
      setUnits(u);
      setDeeds(d);
      setSkippedIds(sk);
      setLogCounts(counts);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load().catch(() => {});
    }, [load]),
  );

  const unitsOut: UnitSummary[] = useMemo(() => {
    const unlockedIds = computeUnlockedIds(deeds, logCounts, skippedIds);
    const byUnit = new Map<number, Deed[]>();
    for (const d of deeds) {
      const arr = byUnit.get(d.unitId) ?? [];
      arr.push(d);
      byUnit.set(d.unitId, arr);
    }
    return units.map((u): UnitSummary => {
      const uDeeds = (byUnit.get(u.id) ?? [])
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder);
      const total = uDeeds.length;
      const completed = uDeeds.filter(d => {
        const st = stateFor(d.id, skippedIds, logCounts, unlockedIds);
        return st === 'completed' || st === 'mastered';
      }).length;
      const nodes: UnitNodeSummary[] = uDeeds.map((d): UnitNodeSummary => ({
        id: d.id,
        label: d.titleEn,
        labelAr: d.titleAr,
        state: stateFor(d.id, skippedIds, logCounts, unlockedIds),
        xp: d.xpReward,
        icon: 'star',
      }));
      return {
        id: u.id,
        titleEn: u.titleEn,
        titleAr: u.titleAr,
        iconName: 'heart-outline',
        completed,
        total,
        nodes,
      };
    });
  }, [units, deeds, logCounts, skippedIds]);

  return { units: unitsOut, isLoading, error, refresh: load };
}
