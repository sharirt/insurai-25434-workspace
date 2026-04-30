import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import type { EditorField } from "@/components/FieldOverlay";

interface FieldPropertiesPanelProps {
  selectedField: EditorField | null;
  onFieldChange: (id: string, updates: Partial<EditorField>) => void;
  onAddField: () => void;
  allFieldNames: string[];
}

export const FieldPropertiesPanel = ({
  selectedField,
  onFieldChange,
  onAddField,
  allFieldNames,
}: FieldPropertiesPanelProps) => {
  const isTextOrDate = selectedField?.type === "text" || selectedField?.type === "date";

  const handleChange = (key: keyof EditorField, value: any) => {
    if (!selectedField) return;
    onFieldChange(selectedField.id, { [key]: value });
  };

  return (
    <div className="flex flex-col h-full border-r bg-card" dir="rtl">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">מאפייני שדה</h2>
      </div>

      <ScrollArea className="flex-1">
        {!selectedField ? (
          <div className="p-6 text-center text-muted-foreground">
            בחר שדה לעריכה
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">שם שדה</Label>
              <Input
                value={selectedField.name}
                onChange={(e) => handleChange("name", e.target.value)}
                dir="ltr"
                className="text-left"
              />
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">סוג שדה</Label>
              <Select value={selectedField.type} onValueChange={(v) => handleChange("type", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">text</SelectItem>
                  <SelectItem value="checkbox">checkbox</SelectItem>
                  <SelectItem value="signature">signature</SelectItem>
                  <SelectItem value="date">date</SelectItem>
                  <SelectItem value="dropdown">dropdown</SelectItem>
                  <SelectItem value="optionList">optionList</SelectItem>
                  <SelectItem value="radio">radio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Font Family - text/date only */}
            {isTextOrDate && (
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">גופן</Label>
                <Select value={selectedField.fontFamily || "helvetica"} onValueChange={(v) => handleChange("fontFamily", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="helvetica">helvetica</SelectItem>
                    <SelectItem value="rubik">rubik</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Text Direction - text/date only */}
            {isTextOrDate && (
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">כיוון כתיבה</Label>
                <Select value={selectedField.textDirection || "rtl"} onValueChange={(v) => handleChange("textDirection", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rtl">RTL</SelectItem>
                    <SelectItem value="ltr">LTR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Font Size - text/date only */}
            {isTextOrDate && (
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">גודל גופן</Label>
                <Input
                  type="number"
                  value={selectedField.fontSize ?? 12}
                  onChange={(e) => handleChange("fontSize", Number(e.target.value))}
                  min={4}
                  max={72}
                />
              </div>
            )}

            {/* Multiline - text only */}
            {selectedField.type === "text" && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="multiline"
                  checked={selectedField.multiline ?? false}
                  onCheckedChange={(v) => handleChange("multiline", !!v)}
                />
                <Label htmlFor="multiline" className="text-sm">רב שורות</Label>
              </div>
            )}

            {/* Read Only */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="readOnly"
                checked={selectedField.readOnly ?? false}
                onCheckedChange={(v) => handleChange("readOnly", !!v)}
              />
              <Label htmlFor="readOnly" className="text-sm">קריאה בלבד</Label>
            </div>

            <Separator />

            {/* Page */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">עמוד</Label>
              <Input value={selectedField.page} disabled className="bg-muted" />
            </div>

            {/* Position */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">מיקום X</Label>
                <Input
                  type="number"
                  value={Math.round(selectedField.x * 100) / 100}
                  onChange={(e) => handleChange("x", Number(e.target.value))}
                  step={0.5}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">מיקום Y</Label>
                <Input
                  type="number"
                  value={Math.round(selectedField.y * 100) / 100}
                  onChange={(e) => handleChange("y", Number(e.target.value))}
                  step={0.5}
                />
              </div>
            </div>

            {/* Size */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">רוחב</Label>
                <Input
                  type="number"
                  value={Math.round(selectedField.width * 100) / 100}
                  onChange={(e) => handleChange("width", Number(e.target.value))}
                  step={0.5}
                  min={5}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">גובה</Label>
                <Input
                  type="number"
                  value={Math.round(selectedField.height * 100) / 100}
                  onChange={(e) => handleChange("height", Number(e.target.value))}
                  step={0.5}
                  min={5}
                />
              </div>
            </div>
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t">
        <Button onClick={onAddField} className="w-full">
          <Plus data-icon="inline-start" />
          הוסף שדה
        </Button>
      </div>
    </div>
  );
};