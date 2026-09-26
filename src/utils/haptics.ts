import * as Haptics from 'expo-haptics';

function runSafely(fn: () => Promise<unknown> | unknown): void {
  try {
    const result = fn();
    if (result instanceof Promise) {
      result.catch(() => undefined);
    }
  } catch {
    /* swallow haptic errors so UI never breaks */
  }
}

export function light(): void {
  runSafely(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

export function medium(): void {
  runSafely(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
}

export function heavy(): void {
  runSafely(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));
}

export function success(): void {
  runSafely(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  );
}

export function warning(): void {
  runSafely(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  );
}

export function selection(): void {
  runSafely(() => Haptics.selectionAsync());
}
