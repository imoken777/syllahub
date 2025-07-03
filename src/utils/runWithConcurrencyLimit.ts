/**
 * 最大同時実行数で非同期タスクを順次実行し、各タスクの結果（成功・失敗）を返すconcurrency limiter。
 *
 * @template T
 * @param {(() => Promise<T>)[]} tasks - 実行する非同期タスク（Promiseを返す関数）の配列
 * @param {number} maxConcurrency - 最大同時実行数
 * @returns {Promise<({ status: 'fulfilled'; value: T } | { status: 'rejected'; reason: unknown })[]>}
 *   各タスクの実行結果（成功: { status: 'fulfilled', value }, 失敗: { status: 'rejected', reason }）の配列
 */
export const runWithConcurrencyLimit = async <T>(
  tasks: (() => Promise<T>)[],
  maxConcurrency: number,
): Promise<({ status: 'fulfilled'; value: T } | { status: 'rejected'; reason: unknown })[]> => {
  const results = new Array(tasks.length);
  let currentIndex = 0;

  const runners = Array(Math.min(maxConcurrency, tasks.length))
    .fill(null)
    .map(() =>
      (async () => {
        while (currentIndex < tasks.length) {
          const taskIndex = currentIndex++;
          try {
            const value = await tasks[taskIndex]();
            results[taskIndex] = { status: 'fulfilled', value };
          } catch (reason) {
            results[taskIndex] = { status: 'rejected', reason };
          }
        }
      })(),
    );

  return Promise.all(runners).then(() => results);
};
