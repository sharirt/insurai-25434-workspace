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

const RENDER_WIDTH = 800;

export const PdfViewerWithOverlays = ({
  pdfUrl,
  fields,
  selectedFieldId,
  onSelectField,
}: PdfViewerWithOverlaysProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nativeSize = usePdfNativeSize(pdfUrl);

  const scale = nativeSize ? RENDER_WIDTH / nativeSize.pdfW : 1;
  const pageHeight = nativeSize ? nativeSize.pdfH * scale : 0;

  const visibleFields = fields.filter(
    (f) => !f.isDeleted && f.page === currentPage
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const findTarget = () => {
      const el = containerRef.current?.querySelector(".shadow-lg");
      if (el instanceof HTMLElement) {
        setPortalTarget(el);
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

    return () => observer.disconnect();
  }, [currentPage]);

  const overlayContent = nativeSize && portalTarget && (
    <>
      {visibleFields.map((field) => {
        const screenX = field.x * scale;
        const screenY = (nativeSize.pdfH - field.y - field.height) * scale;
        const screenW = field.width * scale;
        const screenH = field.height * scale;
        const color = FIELD_TYPE_COLORS[field.type];
        const isSelected = selectedFieldId === field.id;

        return (
          <div
            key={field.id}
            className={cn(
              "absolute cursor-pointer flex items-start overflow-hidden",
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
        defaultWidth={RENDER_WIDTH}
        onPageChange={(page) => setCurrentPage(page - 1)}
      />
      {portalTarget && overlayContent && createPortal(overlayContent, portalTarget)}
    </div>
  );
};