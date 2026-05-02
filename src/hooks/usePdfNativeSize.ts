import { useState, useEffect } from "react";
import { pdfjs } from "react-pdf";

export interface PdfNativeSize {
  pdfW: number;
  pdfH: number;
}

const FILE_DATA_BLOCK_PATTERN = /api\/blocks\/fileDataBlock\/[^/]+\/redirect/;

function resolveFileUrl(url: string): string {
  if (!FILE_DATA_BLOCK_PATTERN.test(url)) {
    return url;
  }
  let token = localStorage.getItem('token');
  if (token) {
    try {
      token = JSON.parse(token);
    } catch {
      // use as-is
    }
  }
  const separator = url.includes('?') ? '&' : '?';
  return token ? `${url}${separator}token=${token}` : url;
}

export function usePdfNativeSize(pdfUrl: string | undefined | null): PdfNativeSize | null {
  const [nativeSize, setNativeSize] = useState<PdfNativeSize | null>(null);

  useEffect(() => {
    if (!pdfUrl) {
      setNativeSize(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const resolved = resolveFileUrl(pdfUrl);
        const loadingTask = pdfjs.getDocument(resolved);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const view = page.view; // [x1, y1, x2, y2]
        if (!cancelled) {
          setNativeSize({ pdfW: view[2], pdfH: view[3] });
        }
        pdf.destroy();
      } catch {
        // Silently fail - pdfNativeSize will remain null
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  return nativeSize;
}