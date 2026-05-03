import { useState, useRef, useEffect } from "react";
import { PdfField, FIELD_TYPE_COLORS } from "@/utils/PdfFieldTypes";
import type { PdfNativeSize } from "@/hooks/usePdfNativeSize";

/** Fallback when native PDF size cannot be loaded; non-A4 pages may be slightly misaligned. */
const FALLBACK_PDF_W = 595;
const FALLBACK_PDF_H = 842;

interface PageRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface FormPdfFieldOverlayProps {
  fields: PdfField[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  /** 0-based page index, aligned with PdfField.page */
  currentPage: number;
  /** From usePdfNativeSize; when null, A4 fallback is used for scale (see FALLBACK_*). */
  nativeSize: PdfNativeSize | null;
}

export const FormPdfFieldOverlay = ({
  fields,
  selectedFieldId,
  onSelectField,
  currentPage,
  nativeSize,
}: FormPdfFieldOverlayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageRect, setPageRect] = useState<PageRect | null>(null);

  const pdfW = nativeSize?.pdfW ?? FALLBACK_PDF_W;
  const pdfH = nativeSize?.pdfH ?? FALLBACK_PDF_H;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const parentContainer = container.parentElement;
    if (!parentContainer) return;

    let resizeObserver: ResizeObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let trackedElement: Element | null = null;

    const measurePage = () => {
      if (!trackedElement || !parentContainer) return;
      const containerRect = parentContainer.getBoundingClientRect();
      const pageR = trackedElement.getBoundingClientRect();

      setPageRect({
        left: pageR.left - containerRect.left,
        top: pageR.top - containerRect.top,
        width: pageR.width,
        height: pageR.height,
      });
    };

    const findAndObservePage = () => {
      const canvas =
        (parentContainer.querySelector(
          ".react-pdf__Page__canvas",
        ) as HTMLElement | null) ??
        (parentContainer.querySelector(".react-pdf__Page") as HTMLElement | null) ??
        (parentContainer.querySelector("canvas") as HTMLElement | null);

      if (canvas && canvas !== trackedElement) {
        trackedElement = canvas;
        resizeObserver?.disconnect();
        resizeObserver = new ResizeObserver(() => measurePage());
        resizeObserver.observe(trackedElement);
        measurePage();
      } else if (trackedElement) {
        measurePage();
      }
    };

    mutationObserver = new MutationObserver(() => {
      findAndObservePage();
    });
    mutationObserver.observe(parentContainer, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    const scrollables = parentContainer.querySelectorAll(".overflow-auto");
    const handleScrollOrResize = () => measurePage();
    scrollables.forEach((el) => {
      el.addEventListener("scroll", handleScrollOrResize, { passive: true });
    });

    findAndObservePage();
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      mutationObserver?.disconnect();
      resizeObserver?.disconnect();
      scrollables.forEach((el) => {
        el.removeEventListener("scroll", handleScrollOrResize);
      });
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [currentPage]);

  const visibleFields = fields.filter(
    (f) => !f.isDeleted && f.page === currentPage,
  );

  if (!pageRect || pageRect.width === 0) {
    return (
      <div
        ref={containerRef}
        className="absolute inset-0 z-10"
        style={{ pointerEvents: "none" }}
      />
    );
  }

  const scaleX = pageRect.width / pdfW;
  const scaleY = pageRect.height / pdfH;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10"
      style={{ pointerEvents: "none" }}
    >
      <div
        className="absolute"
        style={{
          left: pageRect.left,
          top: pageRect.top,
          width: pageRect.width,
          height: pageRect.height,
          pointerEvents: "none",
        }}
      >
        {visibleFields.map((field) => {
          const color = FIELD_TYPE_COLORS[field.type];
          const isSelected = selectedFieldId === field.id;
          const screenY = pdfH - field.y - field.height;
          const left = field.x * scaleX;
          const top = screenY * scaleY;
          const width = field.width * scaleX;
          const height = field.height * scaleY;

          return (
            <div
              key={field.id}
              style={{
                position: "absolute",
                cursor: "pointer",
                display: "flex",
                alignItems: "flex-start",
                overflow: "hidden",
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: `${color}${isSelected ? "80" : "33"}`,
                border: isSelected
                  ? `2px solid ${color}`
                  : `1px solid ${color}CC`,
                pointerEvents: "auto",
                zIndex: isSelected ? 10 : 0,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectField(field.id);
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: "white",
                  paddingLeft: "2px",
                  paddingRight: "2px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: 1.2,
                }}
              >
                {field.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
