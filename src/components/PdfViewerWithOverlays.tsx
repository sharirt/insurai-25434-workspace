import { useState, useEffect, useRef } from "react";
import { PdfViewer } from "@/components/ui/pdf-viewer";
import { usePdfNativeSize } from "@/hooks/usePdfNativeSize";
import { PdfField, FIELD_TYPE_COLORS } from "@/utils/PdfFieldTypes";

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
  const [currentPage, setCurrentPage] = useState(0);
  const [canvasRect, setCanvasRect] = useState<DOMRect | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const nativeSize = usePdfNativeSize(pdfUrl);

  const visibleFields = fields.filter(
    (f) => !f.isDeleted && f.page === currentPage
  );

  // Find canvas via MutationObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const findCanvas = () => {
      const canvas = container.querySelector("canvas");
      if (canvas && canvas !== canvasRef.current) {
        canvasRef.current = canvas;
      }
    };

    findCanvas();

    const mutationObserver = new MutationObserver(findCanvas);
    mutationObserver.observe(container, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      canvasRef.current = null;
    };
  }, []);

  // rAF loop to track canvas position using getBoundingClientRect (fixed positioning)
  useEffect(() => {
    const updatePosition = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        setCanvasRect((prev) => {
          if (
            prev &&
            Math.abs(prev.left - rect.left) < 0.5 &&
            Math.abs(prev.top - rect.top) < 0.5 &&
            Math.abs(prev.width - rect.width) < 0.5 &&
            Math.abs(prev.height - rect.height) < 0.5
          ) {
            return prev;
          }
          return rect;
        });
      }
      rafRef.current = requestAnimationFrame(updatePosition);
    };

    rafRef.current = requestAnimationFrame(updatePosition);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scale =
    nativeSize && canvasRect ? canvasRect.width / nativeSize.pdfW : 1;

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}
    >
      <PdfViewer
        file={pdfUrl}
        onPageChange={(page: number) => setCurrentPage(page - 1)}
      />
      {nativeSize && canvasRect && (
        <div
          style={{
            position: "fixed",
            pointerEvents: "none",
            left: `${canvasRect.left}px`,
            top: `${canvasRect.top}px`,
            width: `${canvasRect.width}px`,
            height: `${canvasRect.height}px`,
            zIndex: 10,
          }}
        >
          {visibleFields.map((field) => {
            const screenX = field.x * scale;
            const screenY =
              nativeSize.pdfH * scale - field.y * scale - field.height * scale;
            const screenW = field.width * scale;
            const screenH = field.height * scale;
            const color = FIELD_TYPE_COLORS[field.type];
            const isSelected = selectedFieldId === field.id;

            return (
              <div
                key={field.id}
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "flex-start",
                  overflow: "hidden",
                  left: `${screenX}px`,
                  top: `${screenY}px`,
                  width: `${screenW}px`,
                  height: `${screenH}px`,
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
      )}
    </div>
  );
};