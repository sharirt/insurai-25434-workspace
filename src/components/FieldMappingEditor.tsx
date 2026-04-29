import { useState, useMemo, useCallback } from "react";
import { useEntityUpdate, useEntityGetOne } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { FormsEntity } from "@/product-types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Save, X, Check, Calendar, Search } from "lucide-react";
import { toast } from "sonner";
import {
  DATA_TABLES,
  parseDataFieldExpression,
  getDataFieldDisplayLabel,
  getTrackOptions,
} from "@/utils/dataFieldConfig";
import {
  parseSimpleExpression,
  buildSimpleExpression,
  getSimpleExpressionDisplayLabel,
  SIMPLE_CONDITIONS,
} from "@/utils/simpleExpressionConfig";
import { SimpleExpressionBuilder } from "@/components/SimpleExpressionBuilder";
import { cn } from "@/lib/utils";

interface FieldMappingEditorProps {
  fieldName: string;
  mapping: any;
  formId: string;
  isHighlighted?: boolean;
  onHover?: (fieldName: string) => void;
  onHoverEnd?: () => void;
}

interface ParsedValue {
  ruleType: string;
  textValue: string;
  expressionValue: string;
  dataFieldTable: string;
  dataFieldField: string;
  dataFieldTrackKey: string;
  simpleConditionExpression: string;
  simpleThenValue: string;
  simpleElseValue: string;
  simpleConditionExpressions: string[];
  simpleConditionOperators: ('AND' | 'OR')[];
}

function parseStoredValue(storedValue: any): ParsedValue {
  const defaultResult: ParsedValue = {
    ruleType: "empty",
    textValue: "",
    expressionValue: "",
    dataFieldTable: "",
    dataFieldField: "",
    dataFieldTrackKey: "",
    simpleConditionExpression: "",
    simpleConditionExpressions: [""],
    simpleConditionOperators: [],
    simpleElseValue: "",
    simpleThenValue: "",
  };

  if (storedValue && typeof storedValue === "object" && storedValue.ruleType) {
    const legacyType = storedValue.ruleType;
    const legacyValue = storedValue.value || "";
    if (legacyType === "empty") return { ...defaultResult };
    if (legacyType === "text") return { ...defaultResult, ruleType: "text", textValue: legacyValue };
    if (legacyType === "javascript") return { ...defaultResult, ruleType: "expression", expressionValue: legacyValue };
    if (legacyType === "dataField") return { ...defaultResult, ruleType: "text", textValue: legacyValue };
    return { ...defaultResult };
  }

  const value = typeof storedValue === "string" ? storedValue : "";

  if (value === "") {
    return { ...defaultResult };
  }

  if (value === "true") {
    return { ...defaultResult, ruleType: "checkmark" };
  }

  const TODAY_DATE_EXPR = `{{new Date().toLocaleDateString('he-IL', {day:'2-digit',month:'2-digit',year:'numeric'}).split('.').join('/')}}`;
  if (value === TODAY_DATE_EXPR) {
    return { ...defaultResult, ruleType: "todayDate" };
  }

  const CANONICAL_BIRTHDAY_EXPR = `{{clients.dateOfBirth ? clients.dateOfBirth.split('-').reverse().join('/') : ''}}`;
  if (value === CANONICAL_BIRTHDAY_EXPR) {
    return { ...defaultResult, ruleType: "canonicalBirthday" };
  }

  if (value.startsWith("{{") && value.endsWith("}}")) {
    const expressionContent = value.slice(2, -2);

    const dataField = parseDataFieldExpression(expressionContent);
    if (dataField) {
      return {
        ...defaultResult,
        ruleType: "dataField",
        dataFieldTable: dataField.table,
        dataFieldField: dataField.field,
        dataFieldTrackKey: dataField.trackKey || "",
      };
    }

    const simpleExpr = parseSimpleExpression(expressionContent);
    if (simpleExpr) {
      return {
        ...defaultResult,
        ruleType: "simpleExpression",
        simpleConditionExpressions: simpleExpr.conditionExpressions,
        simpleConditionOperators: simpleExpr.conditionOperators,
        simpleConditionExpression: simpleExpr.conditionExpression,
        simpleThenValue: simpleExpr.thenValue,
        simpleElseValue: simpleExpr.elseValue,
      };
    }

    return { ...defaultResult, ruleType: "expression", expressionValue: expressionContent };
  }

  return { ...defaultResult, ruleType: "text", textValue: value };
}

function buildStoredValue(
  ruleType: string,
  textValue: string,
  expressionValue: string,
  dataFieldTable: string,
  dataFieldField: string,
  dataFieldTrackKey: string,
  simpleConditionExpressions: string[],
  simpleThenValue: string,
  simpleElseValue: string,
  simpleConditionOperators: ('AND' | 'OR')[]
): string {
  if (ruleType === "empty") return "";
  if (ruleType === "text") return textValue;
  if (ruleType === "checkmark") return "true";
  if (ruleType === "todayDate") return `{{new Date().toLocaleDateString('he-IL', {day:'2-digit',month:'2-digit',year:'numeric'}).split('.').join('/')}}`;
  if (ruleType === "canonicalBirthday") return `{{clients.dateOfBirth ? clients.dateOfBirth.split('-').reverse().join('/') : ''}}`;
  if (ruleType === "dataField" && dataFieldTable && dataFieldField) {
    if (dataFieldTable === "requests" && dataFieldField === "tracks" && dataFieldTrackKey) {
      return `{{${dataFieldTable}.${dataFieldField}.${dataFieldTrackKey}}}`;
    }
    return `{{${dataFieldTable}.${dataFieldField}}}`;
  }
  if (ruleType === "simpleExpression" && simpleConditionExpressions.length > 0 && simpleConditionExpressions[0]) {
    const expr = buildSimpleExpression(
      simpleConditionExpressions,
      simpleThenValue,
      simpleElseValue,
      simpleConditionOperators
    );
    return `{{${expr}}}`;
  }
  if (ruleType === "expression") return `{{${expressionValue}}}`;
  return "";
}

export const FieldMappingEditor = ({ fieldName, mapping, formId, isHighlighted = false, onHover, onHoverEnd }: FieldMappingEditorProps) => {
  const parsed = useMemo(() => parseStoredValue(mapping), [mapping]);

  const [isEditing, setIsEditing] = useState(false);
  const [ruleType, setRuleType] = useState(parsed.ruleType);
  const [textValue, setTextValue] = useState(parsed.textValue);
  const [expressionValue, setExpressionValue] = useState(parsed.expressionValue);
  const [dataFieldTable, setDataFieldTable] = useState(parsed.dataFieldTable);
  const [dataFieldField, setDataFieldField] = useState(parsed.dataFieldField);
  const [dataFieldTrackKey, setDataFieldTrackKey] = useState(parsed.dataFieldTrackKey);
  const [simpleConditionExpressions, setSimpleConditionExpressions] = useState<string[]>(
    parsed.simpleConditionExpressions
  );
  const [simpleConditionOperators, setSimpleConditionOperators] = useState<('AND' | 'OR')[]>(
    parsed.simpleConditionOperators
  );
  const [simpleThenValue, setSimpleThenValue] = useState(parsed.simpleThenValue);
  const [simpleElseValue, setSimpleElseValue] = useState(parsed.simpleElseValue);

  const [fieldSearch, setFieldSearch] = useState("");

  const { updateFunction, isLoading } = useEntityUpdate(FormsEntity);
  const { data: currentForm } = useEntityGetOne(FormsEntity, { id: formId });

  const availableFields = useMemo(() => {
    if (!dataFieldTable) return [];
    const tableConfig = DATA_TABLES.find((t) => t.value === dataFieldTable);
    return tableConfig?.fields || [];
  }, [dataFieldTable]);

  const trackOptions = useMemo(() => {
    if (dataFieldTable === "requests" && dataFieldField === "tracks") {
      return getTrackOptions();
    }
    return [];
  }, [dataFieldTable, dataFieldField]);

  const showTrackSelector = dataFieldTable === "requests" && dataFieldField === "tracks";

  const handleRuleTypeChange = useCallback((newRuleType: string) => {
    setRuleType(newRuleType);
    if (newRuleType !== "dataField") {
      setDataFieldTable("");
      setDataFieldField("");
      setDataFieldTrackKey("");
    }
    if (newRuleType !== "simpleExpression") {
      setSimpleConditionExpressions([""]);
      setSimpleConditionOperators([]);
      setSimpleThenValue("");
      setSimpleElseValue("");
    }
  }, []);

  const filteredFields = useMemo(() => {
    if (!fieldSearch.trim()) return availableFields;
    const search = fieldSearch.trim().toLowerCase();
    return availableFields.filter((f) => f.label?.toLowerCase().includes(search));
  }, [availableFields, fieldSearch]);

  const handleTableChange = useCallback((newTable: string) => {
    setDataFieldTable(newTable);
    setDataFieldField("");
    setDataFieldTrackKey("");
    setFieldSearch("");
  }, []);

  const handleFieldChange = useCallback((newField: string) => {
    setDataFieldField(newField);
    setDataFieldTrackKey("");
  }, []);

  const handleConditionsChange = useCallback((exprs: string[], ops: ('AND' | 'OR')[]) => {
    setSimpleConditionExpressions(exprs);
    setSimpleConditionOperators(ops);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const currentFieldMapping = currentForm?.fieldMapping || {};

      const valueString = buildStoredValue(
        ruleType,
        textValue,
        expressionValue,
        dataFieldTable,
        dataFieldField,
        dataFieldTrackKey,
        simpleConditionExpressions,
        simpleThenValue,
        simpleElseValue,
        simpleConditionOperators
      );

      await updateFunction({
        id: formId,
        data: {
          fieldMapping: {
            ...currentFieldMapping,
            [fieldName]: valueString,
          },
        },
      });

      toast.success("המיפוי עודכן בהצלחה");
      setIsEditing(false);
    } catch (error) {
      toast.error("שגיאה בעדכון המיפוי");
      console.error("Error updating field mapping:", error);
    }
  }, [
    currentForm,
    ruleType,
    textValue,
    expressionValue,
    dataFieldTable,
    dataFieldField,
    dataFieldTrackKey,
    simpleConditionExpressions,
    simpleConditionOperators,
    simpleThenValue,
    simpleElseValue,
    updateFunction,
    formId,
    fieldName,
  ]);

  const handleCancel = useCallback(() => {
    setRuleType(parsed.ruleType);
    setTextValue(parsed.textValue);
    setExpressionValue(parsed.expressionValue);
    setDataFieldTable(parsed.dataFieldTable);
    setDataFieldField(parsed.dataFieldField);
    setDataFieldTrackKey(parsed.dataFieldTrackKey);
    setSimpleConditionExpressions(parsed.simpleConditionExpressions);
    setSimpleConditionOperators(parsed.simpleConditionOperators);
    setSimpleThenValue(parsed.simpleThenValue);
    setSimpleElseValue(parsed.simpleElseValue);
    setIsEditing(false);
  }, [parsed]);

  const fieldType = useMemo(() => {
    if (fieldName.toLowerCase().includes("checkbox")) return "checkbox";
    if (fieldName.toLowerCase().includes("page")) return "page";
    return "text";
  }, [fieldName]);

  const displayValue = useMemo(() => {
    if (parsed.ruleType === "empty") return "ריק";
    if (parsed.ruleType === "text") return parsed.textValue || "ריק";
    if (parsed.ruleType === "checkmark") return "סימון וי ✓";
    if (parsed.ruleType === "todayDate") return "תאריך היום";
    if (parsed.ruleType === "canonicalBirthday") return "תאריך לידה קאנוני";
    if (parsed.ruleType === "dataField") {
      return getDataFieldDisplayLabel(parsed.dataFieldTable, parsed.dataFieldField, parsed.dataFieldTrackKey);
    }
    if (parsed.ruleType === "simpleExpression") {
      const condLabels = parsed.simpleConditionExpressions.map((expr) => {
        const found = SIMPLE_CONDITIONS.find((c) => c.expression === expr);
        return found?.label || expr;
      });
      return getSimpleExpressionDisplayLabel(
        condLabels,
        parsed.simpleThenValue,
        parsed.simpleElseValue,
        parsed.simpleConditionOperators,
      );
    }
    if (parsed.ruleType === "expression") return parsed.expressionValue || "ביטוי ריק";
    return "לא ידוע";
  }, [parsed]);

  const displayBadgeVariant = useMemo(() => {
    if (parsed.ruleType === "dataField") return "default" as const;
    if (parsed.ruleType === "simpleExpression") return "default" as const;
    return "secondary" as const;
  }, [parsed.ruleType]);

  return (
    <Card
      className={cn(
        "transition-all duration-150 overflow-hidden",
        isHighlighted
          ? "border-l-4 border-l-primary shadow-md bg-primary/5"
          : "hover:border-primary/50",
        isEditing && "max-h-[480px]"
      )}
      onMouseEnter={() => !isEditing && onHover?.(fieldName)}
      onMouseLeave={() => !isEditing && onHoverEnd?.()}
    >
      <CardContent className={cn("p-4 flex flex-col", isEditing && "overflow-hidden h-full")}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm truncate">{fieldName}</h3>
              <Badge variant="outline" className="text-xs">
                {fieldType}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Page: {(typeof mapping === "object" && mapping?.page) || "Unknown"}
            </p>
          </div>
          {!isEditing && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>

        {!isEditing ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">מיפוי:</span>
              <Badge variant={displayBadgeVariant} className="text-xs truncate max-w-[200px]">
                {displayValue}
              </Badge>
            </div>
          </div>
        ) : (
          <>
          <div className="border-t shrink-0" />
          <div
            className="space-y-3 pt-3 flex-1 overflow-y-auto px-0.5"
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <label className="text-xs font-medium mb-1 block">סוג חוק</label>
              <Select value={ruleType} onValueChange={handleRuleTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={4}>
                  <SelectItem value="empty">ריק</SelectItem>
                  <SelectItem value="text">טקסט</SelectItem>
                  <SelectItem value="checkmark">סימון וי ✓</SelectItem>
                  <SelectItem value="todayDate">תאריך היום</SelectItem>
                  <SelectItem value="canonicalBirthday">תאריך לידה קאנוני</SelectItem>
                  <SelectItem value="dataField">שדה נתונים</SelectItem>
                  <SelectItem value="simpleExpression">ביטוי פשוט</SelectItem>
                  <SelectItem value="expression">ביטוי</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {ruleType === "text" && (
              <div>
                <label className="text-xs font-medium mb-1 block">ערך טקסט</label>
                <Input
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder="הכנס ערך טקסט"
                />
              </div>
            )}

            {ruleType === "dataField" && (
              <>
                <div>
                  <label className="text-xs font-medium mb-1 block">טבלה</label>
                  <Select value={dataFieldTable} onValueChange={handleTableChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר טבלה..." />
                    </SelectTrigger>
                    <SelectContent>
                      {DATA_TABLES.map((table) => (
                        <SelectItem key={table.value} value={table.value}>
                          {table.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {dataFieldTable && (
                  <div>
                    <label className="text-xs font-medium mb-1 block">שדה</label>
                    <Select value={dataFieldField} onValueChange={handleFieldChange} onOpenChange={(open) => { if (!open) setFieldSearch(""); }}>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר שדה..." />
                      </SelectTrigger>
                      <SelectContent>
                        <div
                          className="flex items-center gap-1.5 px-2 pb-1.5 pt-1 border-b border-border"
                          dir="rtl"
                          onKeyDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <Search className="size-3.5 text-muted-foreground shrink-0" />
                          <input
                            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                            placeholder="חפש שדה..."
                            value={fieldSearch}
                            onChange={(e) => setFieldSearch(e.target.value)}
                          />
                        </div>
                        {filteredFields.length === 0 ? (
                          <div className="py-2 text-center text-xs text-muted-foreground">לא נמצאו שדות</div>
                        ) : (
                          filteredFields.map((field) => (
                            <SelectItem key={field.value} value={field.value}>
                              {field.label}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {showTrackSelector && (
                  <div>
                    <label className="text-xs font-medium mb-1 block">מסלול</label>
                    <Select value={dataFieldTrackKey} onValueChange={setDataFieldTrackKey}>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר מסלול" />
                      </SelectTrigger>
                      <SelectContent>
                        {trackOptions.map((track) => (
                          <SelectItem key={track.value} value={track.value}>
                            {track.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}

            {ruleType === "simpleExpression" && (
              <SimpleExpressionBuilder
                conditionExpressions={simpleConditionExpressions}
                conditionOperators={simpleConditionOperators}
                thenValue={simpleThenValue}
                elseValue={simpleElseValue}
                onConditionsChange={handleConditionsChange}
                onThenChange={setSimpleThenValue}
                onElseChange={setSimpleElseValue}
              />
            )}

            {ruleType === "expression" && (
              <div>
                <label className="text-xs font-medium mb-1 block">ביטוי</label>
                <div className="flex gap-2 mb-2 justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setExpressionValue("true")}
                    className="text-xs h-7 px-2 gap-1"
                  >
                    <Check className="h-3 w-3" />
                    סימון וי
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setExpressionValue("new Date().toLocaleDateString('he-IL', {day:'2-digit',month:'2-digit',year:'numeric'}).split('.').join('/')")}
                    className="text-xs h-7 px-2 gap-1"
                  >
                    <Calendar className="h-3 w-3" />
                    תאריך היום
                  </Button>
                </div>
                <Textarea
                  value={expressionValue}
                  onChange={(e) => setExpressionValue(e.target.value)}
                  placeholder="הכנס ביטוי"
                  rows={3}
                  className="resize-none"
                />
              </div>
            )}

            </div>
            <div className="flex gap-2 pt-2 border-t shrink-0" dir="rtl">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1"
              >
                <Save className="h-3 w-3" />
                {isLoading ? "שומר..." : "שמור"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="h-3 w-3" />
                ביטול
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};