import type { Result } from 'neverthrow';
import { err, ok } from 'neverthrow';
import type { z } from 'zod';

/**
 * localStorageから値を取得してパースし、Zodスキーマで検証する関数
 * @param key - localStorageのキー
 * @param schema - 検証に使用するZodスキーマ
 * @returns 検証済みの値、またはエラー
 */
export const getFromStorage = <T extends z.ZodType>(
  key: string,
  schema: T,
): Result<z.infer<T>, string> => {
  if (typeof window === 'undefined') {
    return err('localStorage is not available on the server');
  }

  const stored = localStorage.getItem(key);
  if (!stored) {
    return err('Item not found in localStorage');
  }

  try {
    const parsed = JSON.parse(stored);
    const validated = schema.safeParse(parsed);

    if (!validated.success) {
      const errors = validated.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      return err(`Failed to validate ${key}: ${errors}`);
    }

    return ok(validated.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to parse JSON';
    return err(`Failed to parse ${key}: ${message}`);
  }
};

/**
 * localStorageに値を保存する純粋関数（Zodスキーマで検証）
 * @param key - localStorageのキー
 * @param value - 保存する値
 * @param schema - 検証に使用するZodスキーマ
 * @returns 成功した場合はvoid、失敗した場合はエラーメッセージ
 */
export const saveToStorage = <T extends z.ZodTypeAny>(
  key: string,
  value: unknown,
  schema: T,
): Result<void, string> => {
  if (typeof window === 'undefined') {
    return err('localStorage is not available on the server');
  }

  try {
    // 保存前にZodスキーマで検証
    const validated = schema.safeParse(value);
    if (!validated.success) {
      const errors = validated.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      return err(`Failed to validate ${key}: ${errors}`);
    }

    const serialized = JSON.stringify(validated.data);
    localStorage.setItem(key, serialized);
    return ok(undefined);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to serialize value';
    return err(`Failed to save to ${key}: ${message}`);
  }
};

/**
 * localStorageから値を削除する純粋関数
 * @param key - localStorageのキー
 * @returns 成功した場合はvoid、失敗した場合はエラーメッセージ
 */
export const removeFromStorage = (key: string): Result<void, string> => {
  if (typeof window === 'undefined') {
    return err('localStorage is not available on the server');
  }

  try {
    localStorage.removeItem(key);
    return ok(undefined);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to remove item';
    return err(`Failed to remove ${key}: ${message}`);
  }
};
