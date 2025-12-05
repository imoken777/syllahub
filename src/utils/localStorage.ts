import type { Result } from 'neverthrow';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

/**
 * localStorageから値を取得してパースし、valibotスキーマで検証する関数
 * @param key - localStorageのキー
 * @param schema - 検証に使用するvalibotスキーマ
 * @returns 検証済みの値、またはエラー
 */
export const getFromStorage = <T extends v.GenericSchema>(
  key: string,
  schema: T,
): Result<v.InferOutput<T>, string> => {
  if (typeof window === 'undefined') {
    return err('localStorage is not available on the server');
  }

  const stored = localStorage.getItem(key);
  if (!stored) {
    return err('Item not found in localStorage');
  }

  try {
    const validated = v.safeParse(schema, JSON.parse(stored));

    if (!validated.success) {
      const issueMessages = validated.issues.map((issue) => issue.message).join(', ');
      return err(`Failed to validate ${key}: ${issueMessages}`);
    }

    return ok(validated.output);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to parse JSON';
    return err(`Failed to parse ${key}: ${message}`);
  }
};

/**
 * localStorageに値を保存する関数（valibotスキーマで検証）
 * @param key - localStorageのキー
 * @param value - 保存する値
 * @param schema - 検証に使用するvalibotスキーマ
 * @returns 成功した場合はvoid、失敗した場合はエラーメッセージ
 */
export const saveToStorage = <T extends v.GenericSchema>(
  key: string,
  value: unknown,
  schema: T,
): Result<void, string> => {
  if (typeof window === 'undefined') {
    return err('localStorage is not available on the server');
  }

  try {
    // 保存前にvalibotスキーマで検証
    const validated = v.safeParse(schema, value);
    if (!validated.success) {
      const issueMessages = validated.issues.map((issue) => issue.message).join(', ');
      return err(`Failed to validate ${key}: ${issueMessages}`);
    }

    const serialized = JSON.stringify(validated.output);
    localStorage.setItem(key, serialized);
    return ok(undefined);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to serialize value';
    return err(`Failed to save to ${key}: ${message}`);
  }
};

/**
 * localStorageから値を削除する関数
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
