import { toBlob } from 'html-to-image';
import type { Options } from 'html-to-image/lib/types';

/**
 * HTML要素から画像を生成する
 * @param element 画像化するHTML要素
 * @param excludeAttributes 除外する属性のリスト（この属性を持つ要素は画像に含まれない）デフォルトは空配列
 * @returns 生成された画像のBlob
 * @throws 画像生成に失敗した場合はエラーをスロー
 */
export const generateElementImage = async (
  element: HTMLElement,
  excludeAttributes: string[] = [],
): Promise<Blob> => {
  const rect = element.getBoundingClientRect();
  const elementWidth = Math.max(element.offsetWidth, element.scrollWidth, rect.width);
  const elementHeight = Math.max(element.offsetHeight, element.scrollHeight, rect.height);

  const createElementFilter = (excludeAttrs: string[]) => (node: Element) => {
    if (!node.hasAttribute) return true;
    return !excludeAttrs.some((attr) => node.hasAttribute(attr));
  };
  const elementFilter = createElementFilter(excludeAttributes);

  const imageOptions: Options = {
    backgroundColor: '#ffffff',
    width: elementWidth + 40,
    height: elementHeight + 40,
    cacheBust: true,
    style: {
      padding: '10px',
    },
    filter: elementFilter,
  };

  const result = await toBlob(element, imageOptions);
  if (!result) {
    throw new Error('画像生成に失敗しました');
  }
  return result;
};
