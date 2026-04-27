import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Save, Loader2, Trash2, Plus, X, MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnnotationField } from "@/components/PdfAnnotationOverlay";

const TYPE_COLORS: Record<string, string> = {
  text: "#3B82F6",
  multiline: "#6366F1",
  checkbox: "#22C55E",
  radio: "#A855F7",
  dropdown: "#F97316",
  date: "#14B8A6",
  signature: "#EF4444",
};

const TYPE_LABELS: Record<string, string> = {
  text: "טקסט קצר",
  multiline: "טקסט ארוך",
  checkbox: "תיבת סימון",
  radio: "בחירה יחידה",
  dropdown: "רשימה נפתחת",
  date: "תאריך",
  signature: "חתימה",
};

interface AnnotationPropertiesPanelProps {
  annotationFields: AnnotationField[];
  selectedAnnotationId: string | null;
  isAnnotationDirty: boolean;
  isSaving: boolean;
  isBaking?: boolean;
  onUpdateField: (id: string, updates: Partial<AnnotationField>) => void;
  onDeleteField: (id: string) => void;
  onSave: () => void;
  onClearAll: () => void;
  onSelectField: (id: string | null) => void;
  currentPage: number;
  onNavigateToPage: (page: number) => void;
}

export const AnnotationPropertiesPanel = ({
  annotationFields,
  selectedAnnotationId,
  isAnnotationDirty,
  isSaving,
  isBaking,
  onUpdateField,
  onDeleteField,
  onSave,
  onClearAll,
  onSelectField,
  currentPage,
  onNavigateToPage,
}: AnnotationPropertiesPanelProps) => {
  const selectedField = annotationFields.find((f) => f.id === selectedAnnotationId);

  const hasTextStyling = selectedField && ["text", "multiline", "date"].includes(selectedField.type);
  const hasOptions = selectedField && ["radio", "dropdown"].includes(selectedField.type);

  const handleAddOption = () => {
    if (!selectedField) return;
    const currentOptions = selectedField.options || [];
    onUpdateField(selectedField.id, { options: [...currentOptions, ""] });
  };

  const handleRemoveOption = (index: number) => {
    if (!selectedField) return;
    const currentOptions = selectedField.options || [];
    onUpdateField(selectedField.id, { options: currentOptions.filter((_, i) => i !== index) });
  };

  const handleUpdateOption = (index: number, value: string) => {
    if (!selectedField) return;
    const currentOptions = [...(selectedField.options || [])];
    currentOptions[index] = value;
    onUpdateField(selectedField.id, { options: currentOptions });
  };

  return (
    <div className="flex flex-col h-full" dir="rtl">
      {/* Top toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30 shrink-0">
        <Button
          size="sm"
          className="gap-1.5 h-7 text-xs"
          onClick={onSave}
          disabled={!isAnnotationDirty || isSaving}
        >
          {isSaving ? (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          ) : (
            <Save data-icon="inline-start" />
          )}
          {isBaking ? "אופה PDF..." : isSaving ? "שומר..." : "שמור שינויים"}
        </Button>
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
          {annotationFields.length} שדות
        </Badge>
        {annotationFields.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 h-7 text-xs text-destructive hover:text-destructive mr-auto"
            onClick={onClearAll}
          >
            <Trash2 data-icon="inline-start" />
            נקה הכל
          </Button>
        )}
      </div>

      {/* Info banner */}
      <div className="px-3 py-2 border-b bg-blue-50/50 dark:bg-blue-950/20 shrink-0">
        <p className="text-xs text-muted-foreground leading-relaxed">
          💡 לחיצה על שמור תטמיע את השדות ישירות בקובץ ה-PDF כשדות אינטראקטיביים אמיתיים
        </p>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 flex flex-col gap-3">
          {/* Properties panel when field selected */}
          {selectedField && (
            <Card>
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-sm">מאפייני שדה</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 flex flex-col gap-3">
                {/* Field Name */}
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">שם שדה</Label>
                  <Input
                    value={selectedField.name}
                    onChange={(e) => onUpdateField(selectedField.id, { name: e.target.value })}
                    className="h-8 text-sm"
                    dir="rtl"
                  />
                </div>

                {/* Field Type */}
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">סוג שדה</Label>
                  <Select
                    value={selectedField.type}
                    onValueChange={(v) => onUpdateField(selectedField.id, { type: v })}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Text styling */}
                {hasTextStyling && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs">גודל גופן</Label>
                        <Input
                          type="number"
                          min={8}
                          max={72}
                          value={selectedField.fontSize || 10}
                          onChange={(e) =>
                            onUpdateField(selectedField.id, {
                              fontSize: parseInt(e.target.value) || 10,
                            })
                          }
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs">גופן</Label>
                        <Select
                          value={selectedField.fontFamily || "Helvetica"}
                          onValueChange={(v) =>
                            onUpdateField(selectedField.id, { fontFamily: v })
                          }
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                            <SelectItem value="Times-Roman">Times-Roman</SelectItem>
                            <SelectItem value="Courier">Courier</SelectItem>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="David">David</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs">כיוון טקסט</Label>
                      <ToggleGroup
                        type="single"
                        value={selectedField.textDirection || "rtl"}
                        onValueChange={(v) => {
                          if (v) onUpdateField(selectedField.id, { textDirection: v });
                        }}
                        className="justify-start"
                      >
                        <ToggleGroupItem value="rtl" className="text-xs h-7 px-3">
                          RTL
                        </ToggleGroupItem>
                        <ToggleGroupItem value="ltr" className="text-xs h-7 px-3">
                          LTR
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </>
                )}

                {/* Options editor for radio/dropdown */}
                {hasOptions && (
                  <>
                    <Separator />
                    <div className="flex flex-col gap-2">
                      <Label className="text-xs">אפשרויות</Label>
                      {(selectedField.options || []).map((opt, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <Input
                            value={opt}
                            onChange={(e) => handleUpdateOption(i, e.target.value)}
                            className="h-7 text-xs flex-1"
                            placeholder={`אפשרות ${i + 1}`}
                            dir="rtl"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 shrink-0"
                            onClick={() => handleRemoveOption(i)}
                          >
                            <X className="size-3" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={handleAddOption}
                      >
                        <Plus data-icon="inline-start" />
                        הוסף אפשרות
                      </Button>
                    </div>
                  </>
                )}

                <Separator />

                {/* Required / ReadOnly */}
                <div className="flex items-center justify-between">
                  <Label className="text-xs">שדה חובה</Label>
                  <Switch
                    checked={selectedField.required || false}
                    onCheckedChange={(v) => onUpdateField(selectedField.id, { required: v })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">קריאה בלבד</Label>
                  <Switch
                    checked={selectedField.readOnly || false}
                    onCheckedChange={(v) => onUpdateField(selectedField.id, { readOnly: v })}
                  />
                </div>

                <Separator />

                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full gap-1.5 h-8 text-xs"
                  onClick={() => onDeleteField(selectedField.id)}
                >
                  <Trash2 data-icon="inline-start" />
                  מחק שדה
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Fields list */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              כל השדות
            </p>
            {annotationFields.length === 0 && (
              <div className="text-center py-8 flex flex-col items-center gap-2 text-muted-foreground">
                <MousePointerClick className="size-8 opacity-50" />
                <p className="text-sm">לחץ וגרור על ה-PDF כדי להוסיף שדה</p>
              </div>
            )}
            {annotationFields.map((field) => {
              const color = TYPE_COLORS[field.type] || "#3B82F6";
              const isSelected = selectedAnnotationId === field.id;
              return (
                <button
                  key={field.id}
                  type="button"
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs text-right w-full transition-colors",
                    isSelected
                      ? "bg-accent border-primary/30"
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => {
                    onSelectField(field.id);
                    if (field.page + 1 !== currentPage) {
                      onNavigateToPage(field.page + 1);
                    }
                  }}
                >
                  <span
                    className="size-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-medium truncate flex-1">{field.name}</span>
                  <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 shrink-0">
                    {TYPE_LABELS[field.type] || field.type}
                  </Badge>
                  <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 shrink-0">
                    עמוד {field.page + 1}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};