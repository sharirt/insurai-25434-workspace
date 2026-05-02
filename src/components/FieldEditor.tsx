import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { PdfField, FieldType, ALL_FIELD_TYPES, FIELD_TYPE_LABELS_HE } from "@/utils/PdfFieldTypes";

interface FieldEditorProps {
  field: PdfField;
  onUpdate: (id: string, updates: Partial<PdfField>) => void;
  onDelete: (id: string) => void;
}

export const FieldEditor = ({ field, onUpdate, onDelete }: FieldEditorProps) => {
  const update = (updates: Partial<PdfField>) => {
    onUpdate(field.id, { ...updates, isModified: true });
  };

  return (
    <div className="p-3 bg-muted/30 border-t flex flex-col gap-3" dir="rtl">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Label className="text-xs">שם</Label>
          <Input
            value={field.name}
            onChange={(e) => update({ name: e.target.value })}
            className="h-8 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs">סוג</Label>
          <Select
            value={field.type}
            onValueChange={(v) => update({ type: v as FieldType })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_FIELD_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {FIELD_TYPE_LABELS_HE[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        <div className="flex flex-col gap-1">
          <Label className="text-xs">עמוד</Label>
          <Input
            type="number"
            value={field.page}
            onChange={(e) => update({ page: parseInt(e.target.value) || 0 })}
            className="h-8 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs">X</Label>
          <Input
            type="number"
            value={field.x}
            onChange={(e) => update({ x: parseFloat(e.target.value) || 0 })}
            className="h-8 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Y</Label>
          <Input
            type="number"
            value={field.y}
            onChange={(e) => update({ y: parseFloat(e.target.value) || 0 })}
            className="h-8 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs">רוחב</Label>
          <Input
            type="number"
            value={field.width}
            onChange={(e) => update({ width: parseFloat(e.target.value) || 0 })}
            className="h-8 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs">גובה</Label>
          <Input
            type="number"
            value={field.height}
            onChange={(e) => update({ height: parseFloat(e.target.value) || 0 })}
            className="h-8 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1">
          <Label className="text-xs">גודל גופן</Label>
          <Input
            type="number"
            value={field.fontSize}
            onChange={(e) => update({ fontSize: parseFloat(e.target.value) || 12 })}
            className="h-8 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs">גופן</Label>
          <Select
            value={field.fontFamily}
            onValueChange={(v) => update({ fontFamily: v as "helvetica" | "rubik" })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="helvetica">Helvetica</SelectItem>
              <SelectItem value="rubik">Rubik</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs">כיוון טקסט</Label>
          <Select
            value={field.textDirection}
            onValueChange={(v) => update({ textDirection: v as "ltr" | "rtl" })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ltr">שמאל לימין</SelectItem>
              <SelectItem value="rtl">ימין לשמאל</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {field.type === "text" && (
          <div className="flex items-center gap-2">
            <Checkbox
              id={`multiline-${field.id}`}
              checked={field.multiline}
              onCheckedChange={(v) => update({ multiline: !!v })}
            />
            <Label htmlFor={`multiline-${field.id}`} className="text-xs">רב שורות</Label>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Checkbox
            id={`required-${field.id}`}
            checked={field.required}
            onCheckedChange={(v) => update({ required: !!v })}
          />
          <Label htmlFor={`required-${field.id}`} className="text-xs">חובה</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id={`readonly-${field.id}`}
            checked={field.readOnly}
            onCheckedChange={(v) => update({ readOnly: !!v })}
          />
          <Label htmlFor={`readonly-${field.id}`} className="text-xs">קריאה בלבד</Label>
        </div>
      </div>

      {(field.type === "dropdown" || field.type === "radio" || field.type === "optionList") && (
        <div className="flex flex-col gap-1">
          <Label className="text-xs">אפשרויות (שורה לכל אפשרות)</Label>
          <Textarea
            value={field.options?.join("\n") || ""}
            onChange={(e) => update({ options: e.target.value.split("\n") })}
            rows={3}
            className="text-sm"
          />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <Label className="text-xs">ערך ברירת מחדל</Label>
        <Input
          value={field.defaultValue}
          onChange={(e) => update({ defaultValue: e.target.value })}
          className="h-8 text-sm"
        />
      </div>

      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(field.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 data-icon="inline-start" />
          מחק שדה
        </Button>
      </div>
    </div>
  );
};