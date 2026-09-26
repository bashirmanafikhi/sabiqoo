type AnyDb = {
  $client?: unknown;
};

export async function runMigrationsFromFolder(db: AnyDb): Promise<void> {
  try {
    const segments = ['..', '..', '..', 'drizzle', 'migrations.js'];
    const modulePath = segments.join('/');
    const mod = await import(/* @vite-ignore */ modulePath).catch(() => null);
    if (!mod) return;
    const { migrate } = await import('drizzle-orm/expo-sqlite/migrator');
    const migrations = (mod as { default?: unknown }).default ?? mod;
    await migrate(db as never, migrations as never);
  } catch {
    // no migrations bundled yet: skip silently
  }
}
