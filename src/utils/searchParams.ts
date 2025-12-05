import type { Result } from 'neverthrow';
import { err, ok } from 'neverthrow';
import * as v from 'valibot';

/**
 * パラメータ定義の型
 * キーとそのスキーマ、シリアライズ/デシリアライズ方法を定義
 */
export type ParamDefinition<T> = {
  key: string;
  schema: v.GenericSchema;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => unknown;
};

/**
 * URLSearchParamsから値を型安全に取得してパースする関数
 * @param searchParams - URLSearchParams
 * @param key - パラメータのキー
 * @param schema - 検証に使用するvalibotスキーマ
 * @param deserialize - オプションのデシリアライズ関数（JSON.parse など）
 * @returns 検証済みの値、またはエラー
 */
export const getFromSearchParams = <T extends v.GenericSchema>(
  searchParams: URLSearchParams,
  key: string,
  schema: T,
  deserialize?: (value: string) => unknown,
): Result<v.InferOutput<T>, string> => {
  const value = searchParams.get(key);
  if (!value) {
    return err(`Parameter '${key}' not found`);
  }

  try {
    const parsed = deserialize ? deserialize(value) : value;
    const validated = v.safeParse(schema, parsed);

    if (!validated.success) {
      const issueMessages = validated.issues.map((issue) => issue.message).join(', ');
      return err(`Failed to validate '${key}': ${issueMessages}`);
    }

    return ok(validated.output);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return err(`Failed to parse '${key}': ${message}`);
  }
};

/**
 * URLSearchParamsに値を型安全に設定する関数
 * @param params - URLSearchParams
 * @param key - パラメータのキー
 * @param value - 設定する値（undefined の場合は削除）
 * @param schema - 検証に使用するvalibotスキーマ
 * @param serialize - オプションのシリアライズ関数（JSON.stringify など）
 * @returns 成功した場合はvoid、失敗した場合はエラーメッセージ
 */
export const setToSearchParams = <T extends v.GenericSchema>(
  params: URLSearchParams,
  key: string,
  value: unknown,
  schema: T,
  serialize?: (value: v.InferOutput<T>) => string,
): Result<void, string> => {
  if (value === undefined) {
    params.delete(key);
    return ok();
  }

  try {
    const validated = v.safeParse(schema, value);
    if (!validated.success) {
      const issueMessages = validated.issues.map((issue) => issue.message).join(', ');
      return err(`Failed to validate '${key}': ${issueMessages}`);
    }

    const serialized = serialize ? serialize(validated.output) : String(validated.output);
    params.set(key, serialized);
    return ok();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return err(`Failed to serialize '${key}': ${message}`);
  }
};

/**
 * 複数のパラメータ定義に基づいてURLSearchParamsからオブジェクトを構築する
 * @param searchParams - URLSearchParams
 * @param definitions - パラメータ定義の配列
 * @param schema - 結果全体を検証するためのvalibotスキーマ
 * @returns 検証済みのオブジェクト、またはエラー
 */
export const parseSearchParams = <T extends v.GenericSchema>(
  searchParams: URLSearchParams,
  definitions: ParamDefinition<unknown>[],
  schema: T,
): Result<v.InferOutput<T>, string> => {
  const result: Record<string, unknown> = {};

  definitions.forEach((def) => {
    const parsed = getFromSearchParams(searchParams, def.key, def.schema, def.deserialize);
    parsed.match(
      (value) => {
        result[def.key] = value;
      },
      () => {
        // 失敗した場合は無視
      },
    );
  });

  const validated = v.safeParse(schema, result);
  if (!validated.success) {
    return err(`Failed to validate search params: ${JSON.stringify(validated.issues)}`);
  }

  return ok(validated.output);
};

/**
 * オブジェクトをURLSearchParamsにシリアライズする
 * @param currentParams - 現在のURLSearchParams
 * @param data - シリアライズするデータ
 * @param definitions - パラメータ定義の配列
 * @returns 新しいURLSearchParams
 */
export const serializeToSearchParams = <T extends Record<string, unknown>>(
  currentParams: URLSearchParams,
  data: T,
  definitions: ParamDefinition<unknown>[],
): URLSearchParams => {
  const params = new URLSearchParams(currentParams.toString());

  definitions.forEach((def) => {
    const value = data[def.key];
    setToSearchParams(params, def.key, value, def.schema, def.serialize).match(
      () => {
        // 成功時は何もしない（paramsは既に更新されている）
      },
      (error) => {
        console.warn(`Failed to serialize parameter '${def.key}':`, error);
      },
    );
  });

  return params;
};
