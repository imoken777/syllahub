/**
 * ブラウザでファイルをダウンロード
 * @param blob ダウンロードするファイルのBlob
 * @param filename ダウンロード時のファイル名
 */
export const downloadFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
