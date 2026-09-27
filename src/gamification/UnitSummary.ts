import type { Ionicons } from '@expo/vector-icons';

export type NodeState = 'mastered' | 'completed' | 'available' | 'locked' | 'skipped';

export interface UnitNodeSummary {
  id: number;
  label: string;
  labelAr?: string;
  state: NodeState;
  xp: number;
  icon: string;
  hadith?: string;
}

export interface UnitSummary {
  id: number;
  titleEn: string;
  titleAr: string;
  iconName: keyof typeof Ionicons.glyphMap;
  completed: number;
  total: number;
  nodes: UnitNodeSummary[];
}
