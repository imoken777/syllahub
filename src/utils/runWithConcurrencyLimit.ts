import type { Result } from 'neverthrow';
import { err } from 'neverthrow';

/**
 * 最大同時実行数で非同期タスクを順次実行し、各タスクの結果（成功・失敗）を返す concurrency limiter。
 *
 * @template T - 成功時の値の型
 * @param tasks - 実行する非同期タスク（Resultを返すPromiseを返す関数）の配列
 * @param maxConcurrency - 最大同時実行数
 * @returns 各タスクの実行結果の配列
 */
export const runWithConcurrencyLimit = async <T>(
  tasks: (() => Promise<Result<T, string>>)[],
  maxConcurrency: number,
): Promise<Result<T, string>[]> => {
  if (tasks.length === 0) return [];

  const results: Result<T, string>[] = new Array(tasks.length);
  let taskIndex = 0;

  const worker = async (): Promise<void> => {
    while (taskIndex < tasks.length) {
      const currentIndex = taskIndex++;
      const task = tasks[currentIndex];

      const result = await task().catch((error): Result<T, string> => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return err(errorMessage);
      });

      results[currentIndex] = result;
    }
  };

  await Promise.all(new Array(Math.min(maxConcurrency, tasks.length)).fill(0).map(() => worker()));

  return results;
};
