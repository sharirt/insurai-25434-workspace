import React, { useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DynamicField {
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

interface DynamicFieldBoxProps {
  field: DynamicField;
  isSelected: boolean;
  screenX: number;
  screenY: number;
  screenW: number;
  screenH: number;
  onSelect: (name: string) => void;
  onDelete: (name: string) => void;
  onDragStart: (name: string, e: React.MouseEvent) => void;
  onResizeStart: (name: string, handle: string, e: React.MouseEvent) => void;
}

const TYPE_COLORS: Record<string, string> = {
  text: "#3B82F6",
  checkbox: "#10B981",
  signature: "#8B5CF6",
  date: "#F59E0B",
  dropdown: "#14B8A6",
};

function getColor(type: string) {
  return TYPE_COLORS[type] || "#6B7280";
}

const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

const HANDLE_CURSORS: Record<string, string> = {
  nw: "nwse-resize",
  n: "ns-resize",
  ne: "nesw-resize",
  e: "ew-resize",
  se: "nwse-resize",
  s: "ns-resize",
  sw: "nesw-resize",
  w: "ew-resize",
};

const HANDLE_POSITIONS: Record<string, React.CSSProperties> = {
  nw: { top: -4, left: -4 },
  n: { top: -4, left: "50%", transform: "translateX(-50%)" },
  ne: { top: -4, right: -4 },
  e: { top: "50%", right: -4, transform: "translateY(-50%)" },
  se: { bottom: -4, right: -4 },
  s: { bottom: -4, left: "50%", transform: "translateX(-50%)" },
  sw: { bottom: -4, left: -4 },
  w: { top: "50%", left: -4, transform: "translateY(-50%)" },
};

export const DynamicFieldBox = ({
  field,
  isSelected,
  screenX,
  screenY,
  screenW,
  screenH,
  onSelect,
  onDelete,
  onDragStart,
  onResizeStart,
}: DynamicFieldBoxProps) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const color = getColor(field.type);

  return (
    <div
      ref={boxRef}
      className={cn(
        "absolute group",
        isSelected && "z-10"
      )}
      style={{
        left: screenX,
        top: screenY,
        width: screenW,
        height: screenH,
        border: `${isSelected ? 3 : 1.5}px solid ${color}`,
        backgroundColor: `${color}20`,
        cursor: "move",
        pointerEvents: "auto",
        boxShadow: isSelected ? `0 0 0 2px hsl(var(--primary) / 0.4)` : undefined,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect(field.name);
        onDragStart(field.name, e);
      }}
    >
      {/* Field name label */}
      <span
        className="absolute -top-5 left-0 text-[10px] leading-none px-1 py-0.5 rounded truncate max-w-full"
        style={{ backgroundColor: color, color: "#fff" }}
      >
        {field.name}
      </span>

      {/* Delete button */}
      <button
        type="button"
        className="absolute -top-2 -right-2 size-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: "#EF4444", color: "#fff" }}
        onMouseDown={(e) => {
          e.stopPropagation();
          onDelete(field.name);
        }}
      >
        <X className="size-2.5" />
      </button>

      {/* Resize handles */}
      {isSelected &&
        HANDLES.map((handle) => (
          <div
            key={handle}
            className="absolute size-2 rounded-full bg-background border-2"
            style={{
              ...HANDLE_POSITIONS[handle],
              borderColor: color,
              cursor: HANDLE_CURSORS[handle],
              pointerEvents: "auto",
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              onResizeStart(field.name, handle, e);
            }}
          />
        ))}
    </div>
  );
};