import { DynamicFieldBox } from "@/components/DynamicFieldBox";
import type { DynamicField } from "@/components/DynamicFieldBox";

interface DynamicFieldOverlayProps {
  fields: DynamicField[];
  currentPage: number;
  selectedFieldName: string | null;
  scale: number;
  pdfNativeHeight: number;
  onSelect: (name: string) => void;
  onDelete: (name: string) => void;
  onDragStart: (name: string, e: React.MouseEvent) => void;
  onResizeStart: (name: string, handle: string, e: React.MouseEvent) => void;
}

export const DynamicFieldOverlay = ({
  fields,
  currentPage,
  selectedFieldName,
  scale,
  pdfNativeHeight,
  onSelect,
  onDelete,
  onDragStart,
  onResizeStart,
}: DynamicFieldOverlayProps) => {
  const pageFields = fields.filter((f) => f.page === currentPage - 1);

  return (
    <div
      className="absolute top-0 left-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    >
      {pageFields.map((field) => (
        <DynamicFieldBox
          key={field.name}
          field={field}
          isSelected={selectedFieldName === field.name}
          scale={scale}
          pdfNativeHeight={pdfNativeHeight}
          onSelect={onSelect}
          onDelete={onDelete}
          onDragStart={onDragStart}
          onResizeStart={onResizeStart}
        />
      ))}
    </div>
  );
};