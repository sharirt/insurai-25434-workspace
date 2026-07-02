import React from "react";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  DATA_TABLES,
  parseDataFieldExpression,
  getTrackOptions,
} from "@/utils/dataFieldConfig";
import { Check, Calendar, Code, Search } from "lucide-react";

type ValueMode = "empty" | "text" | "dataField" | "checkmark" | "todayDate" | "expression";

const TODAY_DATE_VALUE = "new Date().toLocaleDateString('he-IL', {day:'2-digit',month:'2-digit',year:'numeric'}).split('.').join('/')";

interface ValueModeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  accentType: "then" | "else";
  placeholder?: string;
}

/**
 * Determine the initial mode from a value string:
 * - "" or undefined → "empty"
 * - "true" → "checkmark"
 * - the today date expression → "todayDate"
 * - matches tableName.fieldName from DATA_TABLES → "dataField"
 * - any other non-empty string → "expression" (raw JS expression)
 * - plain text that doesn't match any pattern → "text"
 *
 * Note: In ValueModeSelector, values are stored WITHOUT the {{ }} wrapper
 * (the wrapper is added by FieldMappingEditor's buildStoredValue).
 * So here we detect on the raw value.
 */
function detectMode(value: string | undefined): ValueMode {
  if (!value) return "empty";
  if (value === "true") return "checkmark";
  if (value === TODAY_DATE_VALUE) return "todayDate";
  const parsed = parseDataFieldExpression(value);
  if (parsed) return "dataField";
  // If it looks like a JS expression (contains operators, function calls, etc.)
  // or doesn't look like plain text, treat as expression.
  // Plain text: no special chars beyond spaces and basic punctuation
  const looksLikePlainText = /^[א-תa-zA-Z0-9\s\-_.,'"!?@#$%^&*()+=[\]{}|\\/<>:;`~]+$/.test(value);
  if (!looksLikePlainText) return "expression";
  return "text";
}

function parseTableField(value: string): { table: string; field: string; trackKey: string; beneficiaryIndex: string } {
  const parsed = parseDataFieldExpression(value);
  if (parsed) return { table: parsed.table, field: parsed.field, trackKey: parsed.trackKey || "", beneficiaryIndex: parsed.beneficiaryIndex !== undefined ? String(parsed.beneficiaryIndex) : "" };
  return { table: "", field: "", trackKey: "", beneficiaryIndex: "" };
}

export const ValueModeSelector = ({
  value,
  onChange,
  accentType,
  placeholder,
}: ValueModeSelectorProps) => {
  const initialMode = useMemo(() => detectMode(value), []);
  const [mode, setMode] = useState<ValueMode>(initialMode);
  const [textValue, setTextValue] = useState(() =>
    initialMode === "text" ? value : ""
  );
  const [expressionValue, setExpressionValue] = useState(() =>
    initialMode === "expression" ? value : ""
  );
  const [selectedTable, setSelectedTable] = useState(() => {
    if (initialMode === "dataField") return parseTableField(value).table;
    return "";
  });
  const [selectedField, setSelectedField] = useState(() => {
    if (initialMode === "dataField") return parseTableField(value).field;
    return "";
  });
  const [selectedTrackKey, setSelectedTrackKey] = useState(() => {
    if (initialMode === "dataField") return parseTableField(value).trackKey;
    return "";
  });
  const [selectedBeneficiaryIndex, setSelectedBeneficiaryIndex] = useState(() => {
    if (initialMode === "dataField") return parseTableField(value).beneficiaryIndex;
    return "";
  });

  const [fieldSearch, setFieldSearch] = useState("");
  const [trackSearch, setTrackSearch] = useState("");
  const [fieldDropdownOpen, setFieldDropdownOpen] = useState(false);
  const [trackDropdownOpen, setTrackDropdownOpen] = useState(false);

  const availableFields = useMemo(() => {
    if (!selectedTable) return [];
    const tableConfig = DATA_TABLES.find((t) => t.value === selectedTable);
    return tableConfig?.fields || [];
  }, [selectedTable]);

  const trackOptions = useMemo(() => {
    if (selectedTable === "requests" && selectedField === "tracks") {
      return getTrackOptions();
    }
    return [];
  }, [selectedTable, selectedField]);

  const showTrackSelector = selectedTable === "requests" && selectedField === "tracks";

  const handleModeChange = useCallback(
    (newMode: ValueMode) => {
      setMode(newMode);
      // Clear expression textarea when switching away from expression
      if (newMode !== "expression") {
        setExpressionValue("");
      }
      if (newMode !== "dataField") {
        setSelectedTable("");
        setSelectedField("");
        setSelectedTrackKey("");
        setSelectedBeneficiaryIndex("");
      }

      if (newMode === "empty") {
        onChange("");
      } else if (newMode === "text") {
        onChange(textValue);
      } else if (newMode === "checkmark") {
        onChange("true");
      } else if (newMode === "todayDate") {
        onChange(TODAY_DATE_VALUE);
      } else if (newMode === "expression") {
        onChange("");
      } else if (newMode === "dataField") {
        if (selectedTable && selectedField) {
          if (selectedTable === "requests" && selectedField === "tracks" && selectedTrackKey) {
            onChange(`${selectedTable}.${selectedField}.${selectedTrackKey}`);
          } else if (selectedTable === "beneficiaries" && selectedBeneficiaryIndex !== "") {
            onChange(`beneficiaries[${selectedBeneficiaryIndex}]?.${selectedField}`);
          } else {
            onChange(`${selectedTable}.${selectedField}`);
          }
        } else {
          onChange("");
        }
      }
    },
    [onChange, textValue, selectedTable, selectedField, selectedTrackKey, selectedBeneficiaryIndex]
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setTextValue(newValue);
      onChange(newValue);
    },
    [onChange]
  );

  const handleExpressionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setExpressionValue(newValue);
      onChange(newValue);
    },
    [onChange]
  );

  const handleTableChange = useCallback(
    (newTable: string) => {
      setSelectedTable(newTable);
      setSelectedField("");
      setSelectedTrackKey("");
      setSelectedBeneficiaryIndex("");
      setFieldSearch("");
      setTrackSearch("");
      onChange("");
    },
    [onChange]
  );

  const handleFieldChange = useCallback(
    (newField: string) => {
      setSelectedField(newField);
      setSelectedTrackKey("");
      setTrackSearch("");
      if (selectedTable === "requests" && newField === "tracks") {
        onChange("");
        return;
      }
      if (selectedTable === "beneficiaries" && selectedBeneficiaryIndex !== "" && newField) {
        onChange(`beneficiaries[${selectedBeneficiaryIndex}]?.${newField}`);
        return;
      }
      if (selectedTable && newField) {
        onChange(`${selectedTable}.${newField}`);
      }
    },
    [onChange, selectedTable, selectedBeneficiaryIndex]
  );

  const handleTrackKeyChange = useCallback(
    (newTrackKey: string) => {
      setSelectedTrackKey(newTrackKey);
      if (selectedTable && selectedField && newTrackKey) {
        onChange(`${selectedTable}.${selectedField}.${newTrackKey}`);
      }
    },
    [onChange, selectedTable, selectedField]
  );

  const handleBeneficiaryIndexChange = useCallback(
    (newIndex: string) => {
      setSelectedBeneficiaryIndex(newIndex);
      setSelectedField("");
      onChange("");
    },
    [onChange]
  );

  // Sync from external value changes (e.g. when parent resets)
  useEffect(() => {
    const newMode = detectMode(value);
    if (newMode !== mode) {
      setMode(newMode);
      if (newMode === "text") setTextValue(value);
      if (newMode === "expression") setExpressionValue(value);
      if (newMode === "dataField") {
        const parsed = parseTableField(value);
        setSelectedTable(parsed.table);
        setSelectedField(parsed.field);
        setSelectedTrackKey(parsed.trackKey);
        setSelectedBeneficiaryIndex(parsed.beneficiaryIndex);
      }
    } else if (newMode === "text" && value !== textValue) {
      setTextValue(value);
    } else if (newMode === "expression" && value !== expressionValue) {
      setExpressionValue(value);
    }
  }, [value]);

  const modeButtons = useMemo(
    () => [
      { key: "empty" as ValueMode, label: "ריק", icon: null },
      { key: "text" as ValueMode, label: "טקסט", icon: null },
      { key: "checkmark" as ValueMode, label: "סימון וי", icon: <Check className="h-3 w-3" /> },
      { key: "todayDate" as ValueMode, label: "תאריך היום", icon: <Calendar className="h-3 w-3" /> },
      { key: "dataField" as ValueMode, label: "שדה נתונים", icon: null },
      { key: "expression" as ValueMode, label: "ביטוי", icon: <Code className="h-3 w-3" /> },
    ],
    []
  );

  const activeClass =
    accentType === "then"
      ? "bg-chart-2 text-white"
      : "bg-muted-foreground text-white";

  const inactiveClass = "bg-muted text-muted-foreground hover:bg-muted/80";

  return (
    <div className="space-y-2" dir="rtl">
      {/* Mode selector row — wraps naturally with flex-wrap */}
      <div className="flex flex-wrap gap-1">
        {modeButtons.map((btn) => (
          <button
            key={btn.key}
            type="button"
            onClick={() => handleModeChange(btn.key)}
            className={cn(
              "inline-flex items-center gap-1 text-xs py-1 px-2 rounded-full transition-colors font-medium",
              mode === btn.key ? activeClass : inactiveClass
            )}
          >
            {btn.icon}
            {btn.label}
          </button>
        ))}
      </div>

      {/* Mode-specific inputs */}
      {mode === "text" && (
        <Input
          value={textValue}
          onChange={handleTextChange}
          placeholder={placeholder || "הכנס ערך טקסט"}
          className="text-sm"
        />
      )}

      {mode === "checkmark" && (
        <p className="text-xs text-muted-foreground">✓ יסומן</p>
      )}

      {mode === "todayDate" && (
        <p className="text-xs text-muted-foreground">תאריך נוכחי יוכנס</p>
      )}

      {mode === "expression" && (
        <Textarea
          value={expressionValue}
          onChange={handleExpressionChange}
          placeholder="הכנס ביטוי JavaScript"
          rows={3}
          className="resize-none text-sm font-mono"
          dir="ltr"
        />
      )}

      {mode === "dataField" && (
        <div className="space-y-2">
          <Select value={selectedTable} onValueChange={handleTableChange}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="בחר טבלה" />
            </SelectTrigger>
            <SelectContent>
              {DATA_TABLES.map((table) => (
                <SelectItem key={table.value} value={table.value}>
                  {table.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedTable === "beneficiaries" && (
            <Select value={selectedBeneficiaryIndex} onValueChange={handleBeneficiaryIndexChange}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="בחר מוטב" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 6 }, (_, i) => (
                  <SelectItem key={i} value={String(i)}>
                    מוטב {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select
            value={selectedField}
            onValueChange={handleFieldChange}
            disabled={!selectedTable || (selectedTable === "beneficiaries" && selectedBeneficiaryIndex === "")}
            open={fieldDropdownOpen}
            onOpenChange={(open) => {
              setFieldDropdownOpen(open);
              if (!open) setFieldSearch("");
            }}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="בחר שדה" />
            </SelectTrigger>
            <SelectContent>
              <div
                className="flex items-center gap-2 px-2 pb-2 border-b border-border"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <Search className="shrink-0 text-muted-foreground" />
                <Input
                  value={fieldSearch}
                  onChange={(e) => setFieldSearch(e.target.value)}
                  placeholder="חפש שדה..."
                  className="h-8 text-sm border-0 shadow-none focus-visible:ring-0"
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
              {availableFields
                .filter((field) =>
                  field.label?.toLowerCase().includes(fieldSearch.toLowerCase())
                )
                .map((field) => (
                  <SelectItem key={field.value} value={field.value}>
                    {field.label}
                  </SelectItem>
                ))}
              {availableFields.filter((field) =>
                field.label?.toLowerCase().includes(fieldSearch.toLowerCase())
              ).length === 0 && (
                <p className="py-2 px-3 text-sm text-muted-foreground text-center">לא נמצאו שדות</p>
              )}
            </SelectContent>
          </Select>

          {showTrackSelector && (
            <Select
              value={selectedTrackKey}
              onValueChange={handleTrackKeyChange}
              open={trackDropdownOpen}
              onOpenChange={(open) => {
                setTrackDropdownOpen(open);
                if (!open) setTrackSearch("");
              }}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="בחר מסלול" />
              </SelectTrigger>
              <SelectContent>
                <div
                  className="flex items-center gap-2 px-2 pb-2 border-b border-border"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Search className="shrink-0 text-muted-foreground" />
                  <Input
                    value={trackSearch}
                    onChange={(e) => setTrackSearch(e.target.value)}
                    placeholder="חפש מסלול..."
                    className="h-8 text-sm border-0 shadow-none focus-visible:ring-0"
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
                {trackOptions
                  .filter((track) =>
                    track.label?.toLowerCase().includes(trackSearch.toLowerCase())
                  )
                  .map((track) => (
                    <SelectItem key={track.value} value={track.value}>
                      {track.label}
                    </SelectItem>
                  ))}
                {trackOptions.filter((track) =>
                  track.label?.toLowerCase().includes(trackSearch.toLowerCase())
                ).length === 0 && (
                  <p className="py-2 px-3 text-sm text-muted-foreground text-center">לא נמצאו מסלולים</p>
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      )}
    </div>
  );
};