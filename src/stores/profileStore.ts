import { create } from 'zustand';

interface ProfileState {
  profile: {
    current_xp: number;
    current_level: number;
    current_streak: number;
    longest_streak: number;
    streak_freezes_left: number;
    last_active_date: string | null;
  } | null;
  setProfile: (p: ProfileState['profile']) => void;
  patchProfile: (p: Partial<NonNullable<ProfileState['profile']>>) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  patchProfile: (p) =>
    set((s) => (s.profile ? { profile: { ...s.profile, ...p } } : s)),
}));
