import { DynamicFieldBox } from "@/components/DynamicFieldBox";
import type { DynamicField } from "@/components/DynamicFieldBox";

interface DynamicFieldOverlayProps {
  fields: DynamicField[];
  selectedFieldName: string | null;
  containerWidth: number;
  numPages: number;
  pdfW: number;
  pdfH: number;
  onSelect: (name: string) => void;
  onDelete: (name: string) => void;
  onDragStart: (name: string, e: React.MouseEvent) => void;
  onResizeStart: (name: string, handle: string, e: React.MouseEvent) => void;
}

export const DynamicFieldOverlay = ({
  fields,
  selectedFieldName,
  containerWidth,
  numPages,
  pdfW,
  pdfH,
  onSelect,
  onDelete,
  onDragStart,
  onResizeStart,
}: DynamicFieldOverlayProps) => {
  const scale = containerWidth > 0 && pdfW > 0 ? containerWidth / pdfW : 1;
  const renderedPageHeight = containerWidth * (pdfH / pdfW);
  const totalHeight = numPages * renderedPageHeight;

  return (
    <div
      className="absolute top-0 left-0 w-full"
      style={{ pointerEvents: "none", height: totalHeight }}
    >
      {fields.map((field) => {
        const screenX = field.x * scale;
        const screenY =
          field.page * renderedPageHeight +
          (renderedPageHeight - (field.y + field.height) * scale);
        const screenW = field.width * scale;
        const screenH = field.height * scale;

        return (
          <DynamicFieldBox
            key={field.name}
            field={field}
            isSelected={selectedFieldName === field.name}
            screenX={screenX}
            screenY={screenY}
            screenW={screenW}
            screenH={screenH}
            onSelect={onSelect}
            onDelete={onDelete}
            onDragStart={onDragStart}
            onResizeStart={onResizeStart}
          />
        );
      })}
    </div>
  );
};