import { FIELD_TYPE_COLORS, FIELD_TYPE_LABELS_HE, ALL_FIELD_TYPES } from "@/utils/PdfFieldTypes";

export const ColorLegend = () => {
  return (
    <div className="flex flex-wrap gap-3 p-3 border-b" dir="rtl">
      {ALL_FIELD_TYPES.map((type) => (
        <div key={type} className="flex items-center gap-1.5">
          <div
            className="size-3 rounded-sm"
            style={{ backgroundColor: FIELD_TYPE_COLORS[type] }}
          />
          <span className="text-xs text-muted-foreground">
            {FIELD_TYPE_LABELS_HE[type]}
          </span>
        </div>
      ))}
    </div>
  );
};