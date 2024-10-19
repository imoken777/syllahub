import { z } from 'zod';

/**
 * 指定された数値の配列を元に、数値がその配列に含まれているかを検証する関数を生成します。
 *
 * @template T - 数値型のジェネリック型パラメータ。
 * @param {readonly T[]} values - 検証対象となる数値の配列。
 * @returns {(v: number, ctx: z.RefinementCtx) => v is T} - 数値が配列に含まれているかを検証する関数。
 */
export function numberEnum<T extends number>(
  values: readonly T[],
): (v: number, ctx: z.RefinementCtx) => v is T {
  const set = new Set<unknown>(values);
  return (v: number, ctx: z.RefinementCtx): v is T => {
    if (!set.has(v)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_enum_value,
        received: v,
        options: [...values],
      });
    }
    return z.NEVER;
  };
}
