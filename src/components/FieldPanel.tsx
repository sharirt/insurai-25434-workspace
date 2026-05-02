import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, RefreshCw, Plus, Save, Loader2 } from "lucide-react";
import { PdfField } from "@/utils/PdfFieldTypes";
import { ColorLegend } from "@/components/ColorLegend";
import { FieldRow } from "@/components/FieldRow";
import { FieldEditor } from "@/components/FieldEditor";
import { Link } from "react-router";
import { getPageUrl } from "@/lib/utils";
import { FormsManagerPage } from "@/product-types";

interface FieldPanelProps {
  formTitle: string;
  fields: PdfField[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  onUpdateField: (id: string, updates: Partial<PdfField>) => void;
  onDeleteField: (id: string) => void;
  onAddField: () => void;
  onRefresh: () => void;
  onSave: () => void;
  isSaving: boolean;
  isRefreshing: boolean;
}

export const FieldPanel = ({
  formTitle,
  fields,
  selectedFieldId,
  onSelectField,
  onUpdateField,
  onDeleteField,
  onAddField,
  onRefresh,
  onSave,
  isSaving,
  isRefreshing,
}: FieldPanelProps) => {
  const visibleFields = fields.filter((f) => !f.isDeleted);

  return (
    <div className="flex flex-col h-full bg-card border-r" dir="rtl">
      {/* Header */}
      <div className="p-4 border-b flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Link to={getPageUrl(FormsManagerPage)}>
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowRight />
            </Button>
          </Link>
          <h2 className="text-lg font-semibold truncate flex-1">{formTitle}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="animate-spin" data-icon="inline-start" />
            ) : (
              <RefreshCw data-icon="inline-start" />
            )}
            רענן שדות
          </Button>
          <Button variant="outline" size="sm" onClick={onAddField}>
            <Plus data-icon="inline-start" />
            הוסף שדה
          </Button>
          <Button size="sm" onClick={onSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="animate-spin" data-icon="inline-start" />
            ) : (
              <Save data-icon="inline-start" />
            )}
            שמור שינויים
          </Button>
        </div>
      </div>

      {/* Color Legend */}
      <ColorLegend />

      {/* Field List */}
      <ScrollArea className="flex-1">
        {isRefreshing && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        )}
        {!isRefreshing && visibleFields.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm">
            לא נמצאו שדות בטופס
          </div>
        )}
        {!isRefreshing &&
          visibleFields.map((field) => (
            <div key={field.id}>
              <FieldRow
                field={field}
                isSelected={selectedFieldId === field.id}
                onClick={() => onSelectField(field.id)}
              />
              {selectedFieldId === field.id && (
                <FieldEditor
                  field={field}
                  onUpdate={onUpdateField}
                  onDelete={onDeleteField}
                />
              )}
            </div>
          ))}
      </ScrollArea>
    </div>
  );
};