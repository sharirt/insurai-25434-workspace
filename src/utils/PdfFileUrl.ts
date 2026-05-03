/**
 * Resolves Blocks fileDataBlock redirect URLs for client-side PDF.js fetches.
 * Mirrors logic in src/components/ui/pdf-viewer.tsx (immutable); keep in sync if that changes.
 */
const FILE_DATA_BLOCK_PATTERN = /api\/blocks\/fileDataBlock\/[^/]+\/redirect/;

export const isFileDataBlockRedirectUrl = (url: string): boolean =>
  FILE_DATA_BLOCK_PATTERN.test(url);

export const resolvePdfFileUrl = (file: string): string => {
  if (!isFileDataBlockRedirectUrl(file)) {
    return file;
  }

  let token = localStorage.getItem("token");
  const appId = (window as { appId?: string }).appId;
  if (appId) {
    const appToken = window.localStorage.getItem(`token-${appId}`);
    if (appToken) {
      token = appToken;
    }
  }

  return token ? `${file}?token=${token}` : file;
};
