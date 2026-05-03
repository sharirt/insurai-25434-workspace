import { useState, useEffect } from "react";
import { pdfjs } from "react-pdf";

export interface PdfNativeSize {
  pdfW: number;
  pdfH: number;
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
        const loadingTask = pdfjs.getDocument(pdfUrl);
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