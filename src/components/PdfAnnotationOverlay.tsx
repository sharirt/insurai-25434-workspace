import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import type { PdfNativeSize } from "@/hooks/usePdfNativeSize";

export interface AnnotationField {
  id: string;
  name: string;
  type: string;
  page: number; // 0-indexed
  x: number; // pixels
  y: number; // pixels
  width: number; // pixels
  height: number; // pixels
  options?: string[];
  fontSize?: number;
  fontFamily?: string;
  textDirection?: string;
  required?: boolean;
  readOnly?: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  text: "#3B82F6",
  multiline: "#6366F1",
  checkbox: "#22C55E",
  radio: "#A855F7",
  dropdown: "#F97316",
  date: "#14B8A6",
  signature: "#EF4444",
};

function getColor(type: string) {
  return TYPE_COLORS[type] || "#3B82F6";
}

const RESIZE_HANDLES: { dir: string; cursor: string; position: string }[] = [
  { dir: "nw", cursor: "nw-resize", position: "-top-1 -left-1" },
  { dir: "n", cursor: "n-resize", position: "-top-1 left-1/2 -translate-x-1/2" },
  { dir: "ne", cursor: "ne-resize", position: "-top-1 -right-1" },
  { dir: "e", cursor: "e-resize", position: "top-1/2 -right-1 -translate-y-1/2" },
  { dir: "se", cursor: "se-resize", position: "-bottom-1 -right-1" },
  { dir: "s", cursor: "s-resize", position: "-bottom-1 left-1/2 -translate-x-1/2" },
  { dir: "sw", cursor: "sw-resize", position: "-bottom-1 -left-1" },
  { dir: "w", cursor: "w-resize", position: "top-1/2 -left-1 -translate-y-1/2" },
];

interface PdfAnnotationOverlayProps {
  annotationFields: AnnotationField[];
  currentPage: number; // 1-indexed from PdfViewer
  pdfWidth: number;
  pdfNativeSize: PdfNativeSize | null;
  selectedAnnotationId: string | null;
  onSelectField: (id: string | null) => void;
  onUpdateFields: (fields: AnnotationField[]) => void;
  onMarkDirty: () => void;
  pdfContainerRef: React.RefObject<HTMLDivElement | null>;
}

function useCanvasOffset(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [offset, setOffset] = useState({ top: 0, left: 0, width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const canvas = container.querySelector("canvas.react-pdf__Page__canvas") as HTMLCanvasElement | null;
      if (!canvas) return;

      let top = 0;
      let left = 0;
      let el: HTMLElement | null = canvas;
      while (el && el !== container) {
        top += el.offsetTop;
        left += el.offsetLeft;
        el = el.offsetParent as HTMLElement | null;
      }

      setOffset({
        top,
        left,
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
      });
    };

    update();
    const observer = new MutationObserver(update);
    observer.observe(container, { childList: true, subtree: true });
    container.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [containerRef]);

  return offset;
}

export const PdfAnnotationOverlay = ({
  annotationFields,
  currentPage,
  pdfWidth: _pdfWidth,
  pdfNativeSize: _pdfNativeSize,
  selectedAnnotationId,
  onSelectField,
  onUpdateFields,
  onMarkDirty,
  pdfContainerRef,
}: PdfAnnotationOverlayProps) => {
  const canvasOffset = useCanvasOffset(pdfContainerRef);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawCurrent, setDrawCurrent] = useState<{ x: number; y: number } | null>(null);

  // Move state
  const [movingFieldId, setMovingFieldId] = useState<string | null>(null);
  const [moveOffset, setMoveOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Resize state
  const [resizingFieldId, setResizingFieldId] = useState<string | null>(null);
  const [resizeDir, setResizeDir] = useState<string>("");
  const [resizeStart, setResizeStart] = useState<{ mx: number; my: number; x: number; y: number; w: number; h: number }>({ mx: 0, my: 0, x: 0, y: 0, w: 0, h: 0 });

  const visibleFields = annotationFields.filter((f) => f.page + 1 === currentPage);

  const getRelativePos = (e: React.MouseEvent) => {
    const overlay = overlayRef.current;
    if (!overlay) return { x: 0, y: 0 };
    const rect = overlay.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest("[data-field-box]") || target.closest("[data-resize-handle]") || target.closest("[data-delete-btn]")) return;

    onSelectField(null);
    const pos = getRelativePos(e);
    setIsDrawing(true);
    setDrawStart(pos);
    setDrawCurrent(pos);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing && drawStart) {
      setDrawCurrent(getRelativePos(e));
      return;
    }

    if (movingFieldId) {
      const pos = getRelativePos(e);
      onUpdateFields(
        annotationFields.map((f) =>
          f.id === movingFieldId
            ? {
                ...f,
                x: Math.max(0, Math.min(pos.x - moveOffset.x, canvasOffset.width - f.width)),
                y: Math.max(0, Math.min(pos.y - moveOffset.y, canvasOffset.height - f.height)),
              }
            : f
        )
      );
      return;
    }

    if (resizingFieldId) {
      const dx = e.clientX - resizeStart.mx;
      const dy = e.clientY - resizeStart.my;
      const field = annotationFields.find((f) => f.id === resizingFieldId);
      if (!field) return;

      let newX = resizeStart.x;
      let newY = resizeStart.y;
      let newW = resizeStart.w;
      let newH = resizeStart.h;

      if (resizeDir.includes("e")) newW = Math.max(20, resizeStart.w + dx);
      if (resizeDir.includes("s")) newH = Math.max(20, resizeStart.h + dy);
      if (resizeDir.includes("w")) {
        newW = Math.max(20, resizeStart.w - dx);
        newX = resizeStart.x + resizeStart.w - newW;
      }
      if (resizeDir.includes("n")) {
        newH = Math.max(20, resizeStart.h - dy);
        newY = resizeStart.y + resizeStart.h - newH;
      }

      onUpdateFields(
        annotationFields.map((f) =>
          f.id === resizingFieldId ? { ...f, x: newX, y: newY, width: newW, height: newH } : f
        )
      );
      return;
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && drawStart && drawCurrent) {
      const x = Math.min(drawStart.x, drawCurrent.x);
      const y = Math.min(drawStart.y, drawCurrent.y);
      const w = Math.abs(drawCurrent.x - drawStart.x);
      const h = Math.abs(drawCurrent.y - drawStart.y);

      if (w > 10 && h > 10) {
        const fieldNum = annotationFields.length + 1;
        const newField: AnnotationField = {
          id: crypto.randomUUID(),
          name: `שדה_${fieldNum}`,
          type: "text",
          page: currentPage - 1,
          x,
          y,
          width: w,
          height: h,
          fontSize: 10,
          fontFamily: "Helvetica",
          textDirection: "rtl",
          required: false,
          readOnly: false,
        };
        onUpdateFields([...annotationFields, newField]);
        onSelectField(newField.id);
        onMarkDirty();
      }

      setIsDrawing(false);
      setDrawStart(null);
      setDrawCurrent(null);
      return;
    }

    if (movingFieldId) {
      setMovingFieldId(null);
      onMarkDirty();
      return;
    }

    if (resizingFieldId) {
      setResizingFieldId(null);
      onMarkDirty();
      return;
    }
  };

  const handleFieldMouseDown = (e: React.MouseEvent, fieldId: string) => {
    e.preventDefault();
    e.stopPropagation();
    onSelectField(fieldId);
    const pos = getRelativePos(e);
    const field = annotationFields.find((f) => f.id === fieldId);
    if (!field) return;
    setMovingFieldId(fieldId);
    setMoveOffset({ x: pos.x - field.x, y: pos.y - field.y });
  };

  const handleResizeStart = (e: React.MouseEvent, fieldId: string, dir: string) => {
    e.preventDefault();
    e.stopPropagation();
    const field = annotationFields.find((f) => f.id === fieldId);
    if (!field) return;
    onSelectField(fieldId);
    setResizingFieldId(fieldId);
    setResizeDir(dir);
    setResizeStart({ mx: e.clientX, my: e.clientY, x: field.x, y: field.y, w: field.width, h: field.height });
  };

  const handleDeleteField = (fieldId: string) => {
    onUpdateFields(annotationFields.filter((f) => f.id !== fieldId));
    if (selectedAnnotationId === fieldId) onSelectField(null);
    onMarkDirty();
  };

  // Keyboard handler for delete
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selectedAnnotationId) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        // Don't delete if user is typing in an input
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") return;
        handleDeleteField(selectedAnnotationId);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedAnnotationId, annotationFields]);

  const drawRect = isDrawing && drawStart && drawCurrent
    ? {
        x: Math.min(drawStart.x, drawCurrent.x),
        y: Math.min(drawStart.y, drawCurrent.y),
        w: Math.abs(drawCurrent.x - drawStart.x),
        h: Math.abs(drawCurrent.y - drawStart.y),
      }
    : null;

  return (
    <div
      ref={overlayRef}
      className="absolute z-10"
      style={{
        top: canvasOffset.top,
        left: canvasOffset.left,
        width: canvasOffset.width || "100%",
        height: canvasOffset.height || "100%",
        cursor: isDrawing ? "crosshair" : movingFieldId ? "move" : resizingFieldId ? "default" : "crosshair",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Drawing rubber band */}
      {drawRect && drawRect.w > 2 && drawRect.h > 2 && (
        <div
          className="absolute border-2 border-dashed pointer-events-none"
          style={{
            left: drawRect.x,
            top: drawRect.y,
            width: drawRect.w,
            height: drawRect.h,
            borderColor: "#3B82F6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
          }}
        />
      )}

      {/* Rendered field boxes */}
      {visibleFields.map((field) => {
        const color = getColor(field.type);
        const isSelected = selectedAnnotationId === field.id;
        return (
          <div
            key={field.id}
            data-field-box
            className={cn(
              "absolute select-none group",
              isSelected ? "z-40" : "z-30"
            )}
            style={{
              left: field.x,
              top: field.y,
              width: field.width,
              height: field.height,
              border: isSelected ? `2px solid ${color}` : `1px dashed ${color}`,
              backgroundColor: isSelected
                ? `${color}33`
                : `${color}14`,
              boxShadow: isSelected ? `0 0 8px ${color}66` : undefined,
              cursor: movingFieldId === field.id ? "grabbing" : "move",
            }}
            onMouseDown={(e) => {
              const target = e.target as HTMLElement;
              if (target.closest("[data-resize-handle]") || target.closest("[data-delete-btn]")) return;
              handleFieldMouseDown(e, field.id);
            }}
          >
            {/* Name label */}
            <div
              className="absolute -top-5 left-0 px-1 py-0 text-[9px] font-medium rounded-sm truncate max-w-full"
              style={{ backgroundColor: color, color: "#fff" }}
            >
              {field.name}
            </div>

            {/* Delete button */}
            {isSelected && (
              <button
                data-delete-btn
                type="button"
                className="absolute -top-7 right-0 rounded-full p-0.5 bg-destructive text-destructive-foreground hover:opacity-80 z-50"
                style={{ backgroundColor: "#EF4444", color: "#fff" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteField(field.id);
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <Trash2 className="size-3" />
              </button>
            )}

            {/* Resize handles */}
            {isSelected &&
              RESIZE_HANDLES.map((handle) => (
                <div
                  key={handle.dir}
                  data-resize-handle
                  className={cn("absolute size-2 rounded-sm bg-background z-50", handle.position)}
                  style={{
                    cursor: handle.cursor,
                    border: `2px solid ${color}`,
                  }}
                  onMouseDown={(e) => handleResizeStart(e, field.id, handle.dir)}
                />
              ))}
          </div>
        );
      })}
    </div>
  );
};