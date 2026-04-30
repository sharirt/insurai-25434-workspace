import { useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EditorField {
  id: string;
  name: string;
  type: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontFamily?: string;
  textDirection?: string;
  multiline?: boolean;
  readOnly?: boolean;
}

const FIELD_COLORS: Record<string, string> = {
  text: "#3B82F6",
  checkbox: "#10B981",
  signature: "#8B5CF6",
  date: "#F59E0B",
  dropdown: "#06B6D4",
  optionList: "#EC4899",
  radio: "#EF4444",
};

interface FieldOverlayProps {
  field: EditorField;
  isSelected: boolean;
  screenX: number;
  screenY: number;
  screenWidth: number;
  screenHeight: number;
  scaleX: number;
  scaleY: number;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dx: number, dy: number) => void;
  onResize: (id: string, dw: number, dh: number, dx: number, dy: number) => void;
}

export const FieldOverlay = ({
  field,
  isSelected,
  screenX,
  screenY,
  screenWidth,
  screenHeight,
  scaleX,
  scaleY,
  onSelect,
  onDelete,
  onMove,
  onResize,
}: FieldOverlayProps) => {
  const color = FIELD_COLORS[field.type] || "#6B7280";
  const dragRef = useRef<{ startX: number; startY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; handle: string } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect(field.id);
    dragRef.current = { startX: e.clientX, startY: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragRef.current) {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      dragRef.current = { startX: e.clientX, startY: e.clientY };
      onMove(field.id, dx / scaleX, dy / scaleY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    dragRef.current = null;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleResizeDown = (e: React.PointerEvent, handle: string) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect(field.id);
    resizeRef.current = { startX: e.clientX, startY: e.clientY, handle };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleResizeMove = (e: React.PointerEvent) => {
    if (!resizeRef.current) return;
    const dx = (e.clientX - resizeRef.current.startX) / scaleX;
    const dy = (e.clientY - resizeRef.current.startY) / scaleY;
    resizeRef.current.startX = e.clientX;
    resizeRef.current.startY = e.clientY;

    const h = resizeRef.current.handle;
    let dw = 0, dh = 0, mx = 0, my = 0;

    if (h.includes("e")) dw = dx;
    if (h.includes("w")) { dw = -dx; mx = dx; }
    if (h.includes("s")) dh = dy;
    if (h.includes("n")) { dh = -dy; my = dy; }

    if (mx !== 0 || my !== 0) onMove(field.id, mx, my);
    if (dw !== 0 || dh !== 0) onResize(field.id, dw, dh, 0, 0);
  };

  const handleResizeUp = (e: React.PointerEvent) => {
    resizeRef.current = null;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
  const handlePositions: Record<string, { top: string; left: string; cursor: string }> = {
    nw: { top: "-4px", left: "-4px", cursor: "nwse-resize" },
    n: { top: "-4px", left: "calc(50% - 4px)", cursor: "ns-resize" },
    ne: { top: "-4px", left: "calc(100% - 4px)", cursor: "nesw-resize" },
    e: { top: "calc(50% - 4px)", left: "calc(100% - 4px)", cursor: "ew-resize" },
    se: { top: "calc(100% - 4px)", left: "calc(100% - 4px)", cursor: "nwse-resize" },
    s: { top: "calc(100% - 4px)", left: "calc(50% - 4px)", cursor: "ns-resize" },
    sw: { top: "calc(100% - 4px)", left: "-4px", cursor: "nesw-resize" },
    w: { top: "calc(50% - 4px)", left: "-4px", cursor: "ew-resize" },
  };

  return (
    <div
      className="absolute group"
      style={{
        left: screenX,
        top: screenY,
        width: screenWidth,
        height: screenHeight,
      }}
    >
      {/* Main box */}
      <div
        className={cn(
          "size-full border-2 rounded-sm cursor-move",
          isSelected && "ring-2 ring-offset-1"
        )}
        style={{
          borderColor: color,
          backgroundColor: `${color}15`,
          boxShadow: isSelected ? `0 0 8px ${color}50` : undefined,
          ringColor: color,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Label */}
        <div
          className="absolute bottom-full left-0 mb-0.5 px-1 py-0.5 text-[9px] font-medium text-white rounded-sm whitespace-nowrap max-w-[150px] truncate"
          style={{ backgroundColor: color }}
        >
          {field.name}
        </div>
      </div>

      {/* Delete button */}
      <button
        className={cn(
          "absolute -top-3 -right-3 size-5 rounded-full flex items-center justify-center text-white text-xs z-10",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
        style={{ backgroundColor: "#EF4444" }}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(field.id);
        }}
      >
        <X className="size-3" />
      </button>

      {/* Resize handles */}
      {isSelected && handles.map((h) => {
        const pos = handlePositions[h];
        return (
          <div
            key={h}
            className="absolute size-2 rounded-full bg-background border-2 z-10"
            style={{
              top: pos.top,
              left: pos.left,
              cursor: pos.cursor,
              borderColor: color,
            }}
            onPointerDown={(e) => handleResizeDown(e, h)}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeUp}
          />
        );
      })}
    </div>
  );
};