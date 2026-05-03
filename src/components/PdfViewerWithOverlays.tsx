import { useState, useEffect, useRef } from "react";
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
  const [currentPage, setCurrentPage] = useState(0);
  const [canvasSize, setCanvasSize] = useState<{ w: number; h: number } | null>(null);
  const [overlayPos, setOverlayPos] = useState({ left: 0, top: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const nativeSize = usePdfNativeSize(pdfUrl);

  const visibleFields = fields.filter(
    (f) => !f.isDeleted && f.page === currentPage
  );

  // Find canvas via MutationObserver, track size via ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let resizeObserver: ResizeObserver | null = null;

    const attachToCanvas = (canvas: HTMLCanvasElement) => {
      canvasRef.current = canvas;
      setCanvasSize({ w: canvas.offsetWidth, h: canvas.offsetHeight });

      resizeObserver = new ResizeObserver(() => {
        setCanvasSize({ w: canvas.offsetWidth, h: canvas.offsetHeight });
      });
      resizeObserver.observe(canvas);
    };

    const existing = container.querySelector("canvas");
    if (existing) {
      attachToCanvas(existing);
    }

    const mutationObserver = new MutationObserver(() => {
      const canvas = container.querySelector("canvas");
      if (canvas && canvas !== canvasRef.current) {
        resizeObserver?.disconnect();
        attachToCanvas(canvas);
      }
    });

    mutationObserver.observe(container, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      resizeObserver?.disconnect();
      canvasRef.current = null;
    };
  }, []);

  // Update overlay position to match canvas location within scroll container
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const updatePosition = () => {
      const containerRect = container.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      setOverlayPos({
        left: canvasRect.left - containerRect.left + container.scrollLeft,
        top: canvasRect.top - containerRect.top + container.scrollTop,
      });
      rafRef.current = requestAnimationFrame(updatePosition);
    };

    rafRef.current = requestAnimationFrame(updatePosition);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [canvasSize]);

  const scale = nativeSize && canvasSize ? canvasSize.w / nativeSize.pdfW : 1;

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "auto" }}
    >
      <PdfViewer
        file={pdfUrl}
        onPageChange={(page: number) => setCurrentPage(page - 1)}
      />
      {nativeSize && canvasSize && (
        <div
          style={{
            position: "absolute",
            pointerEvents: "none",
            left: `${overlayPos.left}px`,
            top: `${overlayPos.top}px`,
            width: `${canvasSize.w}px`,
            height: `${canvasSize.h}px`,
          }}
        >
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
                    : `1px solid ${color}CC`,
                  pointerEvents: "auto",
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
        </div>
      )}
    </div>
  );
};