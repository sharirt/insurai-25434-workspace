import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { PdfViewer } from "@/components/ui/pdf-viewer";
import { usePdfNativeSize } from "@/hooks/usePdfNativeSize";
import { PdfField, FIELD_TYPE_COLORS } from "@/utils/PdfFieldTypes";
import { cn } from "@/lib/utils";

interface PdfViewerWithOverlaysProps {
  pdfUrl: string;
  fields: PdfField[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
}

export const PdfViewerWithOverlays = ({
  pdfUrl,
  fields,
  selectedFieldId,
  onSelectField,
}: PdfViewerWithOverlaysProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [renderedWidth, setRenderedWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const nativeSize = usePdfNativeSize(pdfUrl);

  // Find the .shadow-lg portal target via MutationObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const attachResizeObserver = (el: HTMLElement) => {
      resizeObserverRef.current?.disconnect();
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setRenderedWidth(entry.contentRect.width);
        }
      });
      ro.observe(el);
      resizeObserverRef.current = ro;
      // Set initial width
      setRenderedWidth(el.getBoundingClientRect().width);
    };

    const findTarget = () => {
      const el = containerRef.current?.querySelector(".shadow-lg");
      if (el instanceof HTMLElement) {
        setPortalTarget(el);
        attachResizeObserver(el);
      }
    };

    findTarget();

    const observer = new MutationObserver(() => {
      findTarget();
    });

    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      resizeObserverRef.current?.disconnect();
    };
  }, []);

  // Fallback: try to get native size from canvas if usePdfNativeSize fails
  const getNativeSize = (): { pdfW: number; pdfH: number } | null => {
    if (nativeSize) return nativeSize;
    // Try reading canvas natural dimensions as fallback
    if (portalTarget) {
      const canvas = portalTarget.querySelector("canvas");
      if (canvas) {
        return { pdfW: canvas.width, pdfH: canvas.height };
      }
    }
    return null;
  };

  const native = getNativeSize();
  const scale = native && renderedWidth > 0 ? renderedWidth / native.pdfW : 0;

  const visibleFields = fields.filter(
    (f) => !f.isDeleted && f.page === currentPage - 1
  );

  const overlayContent = scale > 0 && native && portalTarget && (
    <>
      {visibleFields.map((field) => {
        const screenX = field.x * scale;
        const screenY = (native.pdfH - field.y - field.height) * scale;
        const screenW = field.width * scale;
        const screenH = field.height * scale;
        const color = FIELD_TYPE_COLORS[field.type];
        const isSelected = selectedFieldId === field.id;

        return (
          <div
            key={field.id}
            className={cn(
              "absolute cursor-pointer flex items-start overflow-hidden pointer-events-auto",
              isSelected ? "z-10" : "z-0"
            )}
            style={{
              left: `${screenX}px`,
              top: `${screenY}px`,
              width: `${screenW}px`,
              height: `${screenH}px`,
              backgroundColor: `${color}${isSelected ? "80" : "4D"}`,
              border: isSelected
                ? `2px solid ${color}`
                : `1px solid ${color}66`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectField(field.id);
            }}
          >
            <span
              className="text-white px-0.5 truncate leading-tight"
              style={{ fontSize: "10px" }}
            >
              {field.name}
            </span>
          </div>
        );
      })}
    </>
  );

  return (
    <div ref={containerRef} className="w-full h-full">
      <PdfViewer
        file={pdfUrl}
        onPageChange={(page) => setCurrentPage(page)}
      />
      {portalTarget && overlayContent && createPortal(overlayContent, portalTarget)}
    </div>
  );
};