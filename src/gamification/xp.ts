export type Difficulty = 1 | 2 | 3;

const MULTIPLIER: Record<Difficulty, number> = { 1: 1.0, 2: 1.25, 3: 1.5 };

export function computeXpEarned(params: {
  baseReward: number;
  quantity: number;
  difficulty: Difficulty;
}): number {
  const { baseReward, quantity, difficulty } = params;
  return Math.round(baseReward * quantity * MULTIPLIER[difficulty]);
}
