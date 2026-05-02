import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DynamicField } from "@/components/DynamicFieldBox";

interface DynamicFieldPropertiesProps {
  field: DynamicField | null;
  onUpdate: (name: string, updates: Partial<DynamicField>) => void;
  allFieldNames: string[];
}

export const DynamicFieldProperties = ({
  field,
  onUpdate,
  allFieldNames,
}: DynamicFieldPropertiesProps) => {
  if (!field) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p>בחר שדה לעריכה</p>
      </div>
    );
  }

  const showFontOptions = ["text", "date", "dropdown"].includes(field.type);

  const handleNameChange = (newName: string) => {
    if (newName && !allFieldNames.filter((n) => n !== field.name).includes(newName)) {
      onUpdate(field.name, { name: newName });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4" style={{ direction: "rtl" }}>
      <div className="flex flex-col gap-4">
        {/* Field name */}
        <div className="flex flex-col gap-1.5">
          <Label>שם שדה</Label>
          <Input
            value={field.name}
            onChange={(e) => handleNameChange(e.target.value)}
            dir="ltr"
          />
        </div>

        {/* Field type */}
        <div className="flex flex-col gap-1.5">
          <Label>סוג שדה</Label>
          <Select
            value={field.type}
            onValueChange={(v) => onUpdate(field.name, { type: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">טקסט</SelectItem>
              <SelectItem value="checkbox">תיבת סימון</SelectItem>
              <SelectItem value="signature">חתימה</SelectItem>
              <SelectItem value="date">תאריך</SelectItem>
              <SelectItem value="dropdown">רשימה נפתחת</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Font family */}
        {showFontOptions && (
          <div className="flex flex-col gap-1.5">
            <Label>גופן</Label>
            <Select
              value={field.fontFamily || "helvetica"}
              onValueChange={(v) => onUpdate(field.name, { fontFamily: v })}
            >
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

        {/* Text direction */}
        {showFontOptions && (
          <div className="flex flex-col gap-1.5">
            <Label>כיוון כתיבה</Label>
            <Select
              value={field.textDirection || "rtl"}
              onValueChange={(v) => onUpdate(field.name, { textDirection: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rtl">ימין לשמאל</SelectItem>
                <SelectItem value="ltr">שמאל לימין</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Font size */}
        {showFontOptions && (
          <div className="flex flex-col gap-1.5">
            <Label>גודל גופן</Label>
            <Input
              type="number"
              min={6}
              max={72}
              value={field.fontSize ?? 12}
              onChange={(e) =>
                onUpdate(field.name, { fontSize: Number(e.target.value) })
              }
              dir="ltr"
            />
          </div>
        )}

        {/* Multiline */}
        {field.type === "text" && (
          <div className="flex items-center justify-between">
            <Label>שורות מרובות</Label>
            <Switch
              checked={!!field.multiline}
              onCheckedChange={(v) => onUpdate(field.name, { multiline: v })}
            />
          </div>
        )}

        {/* Read only */}
        <div className="flex items-center justify-between">
          <Label>קריאה בלבד</Label>
          <Switch
            checked={!!field.readOnly}
            onCheckedChange={(v) => onUpdate(field.name, { readOnly: v })}
          />
        </div>

        {/* Position & dimensions */}
        <div className="flex flex-col gap-1.5">
          <Label>מיקום ומידות</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">X</span>
              <Input
                type="number"
                value={Math.round(field.x * 100) / 100}
                onChange={(e) =>
                  onUpdate(field.name, { x: Number(e.target.value) })
                }
                dir="ltr"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Y</span>
              <Input
                type="number"
                value={Math.round(field.y * 100) / 100}
                onChange={(e) =>
                  onUpdate(field.name, { y: Number(e.target.value) })
                }
                dir="ltr"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Width</span>
              <Input
                type="number"
                value={Math.round(field.width * 100) / 100}
                onChange={(e) =>
                  onUpdate(field.name, { width: Number(e.target.value) })
                }
                dir="ltr"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Height</span>
              <Input
                type="number"
                value={Math.round(field.height * 100) / 100}
                onChange={(e) =>
                  onUpdate(field.name, { height: Number(e.target.value) })
                }
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Page */}
        <div className="flex items-center justify-between">
          <Label>עמוד</Label>
          <Badge variant="secondary">{field.page}</Badge>
        </div>
      </div>
    </div>
  );
};