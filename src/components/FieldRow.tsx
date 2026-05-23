import { Badge } from "@/components/ui/badge";
import { PdfField, FIELD_TYPE_COLORS, FIELD_TYPE_LABELS_HE } from "@/utils/PdfFieldTypes";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface FieldRowProps {
  field: PdfField;
  isSelected: boolean;
  isExpanded: boolean;
  onClick: () => void;
}

export const FieldRow = ({ field, isSelected, isExpanded, onClick }: FieldRowProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 cursor-pointer border-b transition-colors overflow-hidden min-w-0",
        isSelected ? "bg-accent" : "hover:bg-muted/50"
      )}
      onClick={onClick}
      dir="rtl"
    >
      <div
        className="size-2.5 rounded-full shrink-0"
        style={{ backgroundColor: FIELD_TYPE_COLORS[field.type] }}
      />
      <span className="text-sm font-medium flex-1 truncate min-w-0">{field.name}</span>
      {field.isNew && (
        <Badge variant="secondary" className="text-xs shrink-0 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          חדש
        </Badge>
      )}
      {!field.isNew && !!field.originalName && field.name !== field.originalName && (
        <Badge variant="secondary" className="text-xs shrink-0 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
          שונה שם
        </Badge>
      )}
      <Badge variant="outline" className="text-xs shrink-0">
        {FIELD_TYPE_LABELS_HE[field.type]}
      </Badge>
      <span className="text-xs text-muted-foreground shrink-0">
        עמ׳ {field.page + 1}
      </span>
      <ChevronDown
        className={cn(
          "size-4 text-muted-foreground shrink-0 transition-transform duration-200",
          isExpanded && "rotate-180"
        )}
      />
    </div>
  );
};