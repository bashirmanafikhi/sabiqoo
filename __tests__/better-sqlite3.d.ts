declare module 'better-sqlite3' {
  export interface RunResult {
    changes: number;
    lastInsertRowid: number | bigint;
  }
  export interface Statement<BindParameters = unknown[], Result = unknown> {
    run(...params: BindParameters): RunResult;
    get(...params: BindParameters): Result | undefined;
    all(...params: BindParameters): Result[];
    iterate(...params: BindParameters): IterableIterator<Result>;
    pluck(): this;
    expand(): this;
    raw(): this;
    busyTimer(ms: number): this;
    columns(): { name: string; column: string; type: string }[];
    bind(...params: BindParameters): this;
  }
  export interface Database {
    prepare<BindParameters = unknown[], Result = unknown>(
      source: string,
    ): Statement<BindParameters, Result>;
    exec(source: string): this;
    pragma(source: string, options?: { simple?: boolean }): unknown;
    function(
      name: string,
      options: { deterministic?: boolean; varargs?: boolean } | ((...args: unknown[]) => unknown),
    ): this;
    aggregate(
      name: string,
      options: {
        deterministic?: boolean;
        varargs?: boolean;
        start: unknown;
        step: (...args: unknown[]) => unknown;
        inverse?: (...args: unknown[]) => unknown;
        result: (...args: unknown[]) => unknown;
      },
    ): this;
    transaction<F extends (...args: unknown[]) => unknown>(fn: F): F;
    transaction<F extends (...args: unknown[]) => unknown>(
      deferred: F,
    ): (...args: Parameters<F>) => Promise<ReturnType<F>>;
    close(): this;
    memory: boolean;
    readonly name: string;
    readonly open: boolean;
    readonly inTransaction: boolean;
  }
  interface DatabaseConstructor {
    new (
      filename: string,
      options?: { readonly?: boolean; fileMustExist?: boolean },
    ): Database;
  }
  const Database: DatabaseConstructor;
  export default Database;
}
