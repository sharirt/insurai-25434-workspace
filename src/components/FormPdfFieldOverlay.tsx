import React from "react";
import { useState, useRef, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { PdfField, FIELD_TYPE_COLORS } from "@/utils/PdfFieldTypes";
import type { PdfNativeSize } from "@/hooks/usePdfNativeSize";

const FALLBACK_PDF_W = 595;
const FALLBACK_PDF_H = 842;
const MIN_FIELD_SIZE = 10; // minimum PDF units

interface PageRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

type HandleDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

interface DragState {
  active: boolean;
  fieldId: string;
  mode: "move" | "resize";
  handleDir?: HandleDir;
  startMouseX: number;
  startMouseY: number;
  startLeft: number;
  startTop: number;
  startWidth: number;
  startHeight: number;
  didMove: boolean;
}

interface FormPdfFieldOverlayProps {
  fields: PdfField[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  onUpdateField?: (id: string, updates: Partial<PdfField>) => void;
  onDeleteField?: (id: string) => void;
  currentPage: number;
  nativeSize: PdfNativeSize | null;
}

const HANDLE_SIZE = 6;

const HANDLE_DIRS: { dir: HandleDir; cursor: string; xPct: number; yPct: number }[] = [
  { dir: "nw", cursor: "nwse-resize", xPct: 0, yPct: 0 },
  { dir: "n", cursor: "ns-resize", xPct: 0.5, yPct: 0 },
  { dir: "ne", cursor: "nesw-resize", xPct: 1, yPct: 0 },
  { dir: "w", cursor: "ew-resize", xPct: 0, yPct: 0.5 },
  { dir: "e", cursor: "ew-resize", xPct: 1, yPct: 0.5 },
  { dir: "sw", cursor: "nesw-resize", xPct: 0, yPct: 1 },
  { dir: "s", cursor: "ns-resize", xPct: 0.5, yPct: 1 },
  { dir: "se", cursor: "nwse-resize", xPct: 1, yPct: 1 },
];

export const FormPdfFieldOverlay = ({
  fields,
  selectedFieldId,
  onSelectField,
  onUpdateField,
  onDeleteField,
  currentPage,
  nativeSize,
}: FormPdfFieldOverlayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageRect, setPageRect] = useState<PageRect | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const [dragPos, setDragPos] = useState<{ id: string; left: number; top: number; width: number; height: number } | null>(null);

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

  // Document-level mouse handlers for drag/resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag?.active || !pageRect) return;

      const dx = e.clientX - drag.startMouseX;
      const dy = e.clientY - drag.startMouseY;

      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        drag.didMove = true;
      }

      if (drag.mode === "move") {
        setDragPos({
          id: drag.fieldId,
          left: drag.startLeft + dx,
          top: drag.startTop + dy,
          width: drag.startWidth,
          height: drag.startHeight,
        });
      } else {
        // resize
        let newLeft = drag.startLeft;
        let newTop = drag.startTop;
        let newWidth = drag.startWidth;
        let newHeight = drag.startHeight;
        const dir = drag.handleDir!;

        if (dir.includes("e")) {
          newWidth = Math.max(MIN_FIELD_SIZE * (pageRect.width / pdfW), drag.startWidth + dx);
        }
        if (dir.includes("w")) {
          const maxDx = drag.startWidth - MIN_FIELD_SIZE * (pageRect.width / pdfW);
          const clampedDx = Math.min(dx, maxDx);
          newLeft = drag.startLeft + clampedDx;
          newWidth = drag.startWidth - clampedDx;
        }
        if (dir.includes("s")) {
          newHeight = Math.max(MIN_FIELD_SIZE * (pageRect.height / pdfH), drag.startHeight + dy);
        }
        if (dir.includes("n")) {
          const maxDy = drag.startHeight - MIN_FIELD_SIZE * (pageRect.height / pdfH);
          const clampedDy = Math.min(dy, maxDy);
          newTop = drag.startTop + clampedDy;
          newHeight = drag.startHeight - clampedDy;
        }

        setDragPos({
          id: drag.fieldId,
          left: newLeft,
          top: newTop,
          width: newWidth,
          height: newHeight,
        });
      }
    };

    const handleMouseUp = () => {
      const drag = dragRef.current;
      if (!drag?.active || !pageRect) {
        dragRef.current = null;
        setDragPos(null);
        return;
      }

      const didMove = drag.didMove;
      const fieldId = drag.fieldId;

      if (didMove && onUpdateField) {
        const pos = dragPos;
        if (pos && pos.id === fieldId) {
          const scaleX = pageRect.width / pdfW;
          const scaleY = pageRect.height / pdfH;
          const newPdfWidth = pos.width / scaleX;
          const newPdfHeight = pos.height / scaleY;
          const newPdfX = pos.left / scaleX;
          const newPdfY = pdfH - (pos.top / scaleY) - newPdfHeight;

          onUpdateField(fieldId, {
            x: newPdfX,
            y: newPdfY,
            width: newPdfWidth,
            height: newPdfHeight,
            isModified: true,
          });
        }
      }

      if (!didMove) {
        onSelectField(fieldId);
      }

      dragRef.current = null;
      setDragPos(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [pageRect, pdfW, pdfH, onUpdateField, onSelectField, dragPos]);

  const startDrag = (e: React.MouseEvent, fieldId: string, left: number, top: number, width: number, height: number) => {
    e.stopPropagation();
    e.preventDefault();
    dragRef.current = {
      active: true,
      fieldId,
      mode: "move",
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startLeft: left,
      startTop: top,
      startWidth: width,
      startHeight: height,
      didMove: false,
    };
    setDragPos({ id: fieldId, left, top, width, height });
  };

  const startResize = (e: React.MouseEvent, fieldId: string, dir: HandleDir, left: number, top: number, width: number, height: number) => {
    e.stopPropagation();
    e.preventDefault();
    dragRef.current = {
      active: true,
      fieldId,
      mode: "resize",
      handleDir: dir,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startLeft: left,
      startTop: top,
      startWidth: width,
      startHeight: height,
      didMove: false,
    };
    setDragPos({ id: fieldId, left, top, width, height });
  };

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
  const isDragging = dragRef.current?.active ?? false;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10"
      style={{ pointerEvents: "none", userSelect: isDragging ? "none" : undefined }}
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
          let left = field.x * scaleX;
          let top = screenY * scaleY;
          let width = field.width * scaleX;
          let height = field.height * scaleY;

          // Override with drag position if this field is being dragged
          if (dragPos && dragPos.id === field.id) {
            left = dragPos.left;
            top = dragPos.top;
            width = dragPos.width;
            height = dragPos.height;
          }

          return (
            <div key={field.id}>
              <div
                style={{
                  position: "absolute",
                  cursor: "move",
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
                onMouseDown={(e) => {
                  startDrag(e, field.id, left, top, width, height);
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
                    pointerEvents: "none",
                  }}
                >
                  {field.name}
                </span>
                {isSelected && onDeleteField && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onDeleteField(field.id);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-6px",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      backgroundColor: "#EF4444",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "none",
                      cursor: "pointer",
                      zIndex: 30,
                      pointerEvents: "auto",
                      padding: 0,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#DC2626";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#EF4444";
                    }}
                  >
                    <Trash2 style={{ width: "10px", height: "10px", color: "white" }} />
                  </button>
                )}
              </div>
              {/* Resize handles for selected field */}
              {isSelected && HANDLE_DIRS.map((h) => (
                <div
                  key={h.dir}
                  style={{
                    position: "absolute",
                    left: `${left + width * h.xPct - HANDLE_SIZE / 2}px`,
                    top: `${top + height * h.yPct - HANDLE_SIZE / 2}px`,
                    width: `${HANDLE_SIZE}px`,
                    height: `${HANDLE_SIZE}px`,
                    backgroundColor: "white",
                    border: `1.5px solid ${color}`,
                    cursor: h.cursor,
                    zIndex: 20,
                    pointerEvents: "auto",
                  }}
                  onMouseDown={(e) => {
                    startResize(e, field.id, h.dir, left, top, width, height);
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};