import { siteInfo } from '@/app/siteInfo';

/**
 * 時間割のTwitter共有用のテキストを生成
 * @param semester 学期名（nullの場合は"全期間"として扱われる）
 * @param courseCount 登録講義数
 * @returns 共有用のテキスト
 */
export const generateTimetableShareText = (
  semester: string | null,
  courseCount: number,
): string => {
  const semesterDisplay = semester ?? '全期間';
  const hashTags = `#${siteInfo.title} #INIAD #情報連携 #時間割共有`;
  const shareUrl = `${siteInfo.url}?share=twitter`;

  return `${siteInfo.title}で${semesterDisplay}の時間割を作成しました！📚\n登録講義数: ${courseCount}件\n\n${shareUrl}\n\n${hashTags}`;
};

/**
 * Twitter共有URLを生成
 * @param text 共有するテキスト
 * @param url 共有するURL（オプション）
 * @returns Twitter共有用のURL
 */
export const generateTwitterShareUrl = (text: string, url?: string): string => {
  const params = new URLSearchParams({
    text,
    ...(url && { url }),
  });

  return `https://twitter.com/intent/tweet?${params.toString()}`;
};

/**
 * 時間割画像のファイル名を生成
 * @param semester 学期名（nullの場合は"all"として扱われる）
 * @returns 時間割画像用のファイル名
 */
export const generateTimetableImageFilename = (semester: string | null): string => {
  const semesterPart = semester ?? 'all';
  const timestamp = Date.now();
  return `syllahub-timetable-${semesterPart}-${timestamp}.png`;
};
