import { Badge } from "@/components/ui/badge";
import { PdfField, FIELD_TYPE_COLORS, FIELD_TYPE_LABELS_HE } from "@/utils/PdfFieldTypes";
import { cn } from "@/lib/utils";

interface FieldRowProps {
  field: PdfField;
  isSelected: boolean;
  onClick: () => void;
}

export const FieldRow = ({ field, isSelected, onClick }: FieldRowProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 cursor-pointer border-b transition-colors",
        isSelected ? "bg-accent" : "hover:bg-muted/50"
      )}
      onClick={onClick}
      dir="rtl"
    >
      <div
        className="size-2.5 rounded-full shrink-0"
        style={{ backgroundColor: FIELD_TYPE_COLORS[field.type] }}
      />
      <span className="text-sm font-medium flex-1 truncate">{field.name}</span>
      <Badge variant="outline" className="text-xs shrink-0">
        {FIELD_TYPE_LABELS_HE[field.type]}
      </Badge>
      <span className="text-xs text-muted-foreground shrink-0">
        עמ׳ {field.page + 1}
      </span>
    </div>
  );
};