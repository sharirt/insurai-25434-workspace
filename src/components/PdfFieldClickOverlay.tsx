import React from "react";
import { useState, useEffect, useRef } from "react";

interface PdfFieldClickOverlayField {
  name?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  page?: number;
}

interface PdfFieldClickOverlayProps {
  fields: PdfFieldClickOverlayField[];
  currentPage: number;
  pdfNativeWidth: number;
  pdfNativeHeight: number;
  onFieldClick: (fieldName: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const PdfFieldClickOverlay = ({
  fields,
  currentPage,
  pdfNativeWidth,
  pdfNativeHeight,
  onFieldClick,
  containerRef,
}: PdfFieldClickOverlayProps) => {
  const [pageRect, setPageRect] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updatePageRect = () => {
      const pageEl = container.querySelector(".react-pdf__Page");
      if (!pageEl) return;
      const containerRect = container.getBoundingClientRect();
      const pageElRect = pageEl.getBoundingClientRect();
      setPageRect({
        left: pageElRect.left - containerRect.left + container.scrollLeft,
        top: pageElRect.top - containerRect.top + container.scrollTop,
        width: pageElRect.width,
      });
    };

    updatePageRect();

    const debouncedUpdate = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updatePageRect);
    };

    const observer = new MutationObserver(debouncedUpdate);
    observer.observe(container, { childList: true, subtree: true });

    const resizeObserver = new ResizeObserver(debouncedUpdate);
    resizeObserver.observe(container);

    container.addEventListener("scroll", debouncedUpdate);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener("scroll", debouncedUpdate);
      cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef, currentPage]);

  if (!pageRect) return null;

  const scale = pageRect.width / pdfNativeWidth;
  const pageFields = fields.filter(
    (f) => f.page === currentPage - 1 && f.name
  );

  return (
    <div
      style={{
        position: "absolute",
        left: pageRect.left,
        top: pageRect.top,
        width: pageRect.width,
        height: pdfNativeHeight * scale,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {pageFields.map((field, i) => {
        const w = (field.width || 20) * scale;
        const h = (field.height || 15) * scale;
        const fieldTop = pdfNativeHeight * scale - (field.y || 0) * scale - h;
        return (
          <div
            key={field.name || i}
            onClick={() => onFieldClick(field.name!)}
            style={{
              position: "absolute",
              left: (field.x || 0) * scale,
              top: fieldTop,
              width: w,
              height: h,
              cursor: "pointer",
              pointerEvents: "auto",
            }}
            title={field.name}
          />
        );
      })}
    </div>
  );
};