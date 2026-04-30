import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Eye, EyeOff, X, Plus, ChevronDown } from "lucide-react";
import { SIMPLE_CONDITIONS } from "@/utils/simpleExpressionConfig";
import { SearchableConditionSelect } from "@/components/SearchableConditionSelect";
import { cn } from "@/lib/utils";

const MAX_CONDITIONS = 3;

const conditionOptions = SIMPLE_CONDITIONS.map((c) => ({
  value: c.expression,
  label: c.label,
}));

function parseConditionToSelections(condition: string): {
  expressions: string[];
  operators: ("AND" | "OR")[];
  isNegated: boolean;
} {
  if (!condition || condition === "true") return { expressions: [], operators: [], isNegated: false };
  let trimmed = condition.trim();
  let isNegated = false;
  if (trimmed.startsWith("!(") && trimmed.endsWith(")")) {
    isNegated = true;
    trimmed = trimmed.slice(2, -1);
  }

  if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
    const inner = trimmed.slice(1, -1);
    const expressions: string[] = [];
    const operators: ("AND" | "OR")[] = [];
    let current = "";
    let parenDepth = 0;
    let inQuote = false;
    let i = 0;

    while (i < inner.length) {
      const ch = inner[i];
      if (ch === "'") {
        inQuote = !inQuote;
        current += ch;
        i++;
      } else if (!inQuote && ch === "(") {
        parenDepth++;
        current += ch;
        i++;
      } else if (!inQuote && ch === ")") {
        parenDepth--;
        current += ch;
        i++;
      } else if (!inQuote && parenDepth === 0 && inner.slice(i, i + 4) === " && ") {
        expressions.push(current.trim());
        operators.push("AND");
        current = "";
        i += 4;
      } else if (!inQuote && parenDepth === 0 && inner.slice(i, i + 4) === " || ") {
        expressions.push(current.trim());
        operators.push("OR");
        current = "";
        i += 4;
      } else {
        current += ch;
        i++;
      }
    }
    if (current.trim()) expressions.push(current.trim());
    if (expressions.length > 1) return { expressions, operators, isNegated };
  }

  return { expressions: [trimmed], operators: [], isNegated };
}

function buildConditionString(expressions: string[], operators: ("AND" | "OR")[]): string {
  const valid = expressions.filter((e) => e && e !== "true");
  if (valid.length === 0) return "";
  if (valid.length === 1) return valid[0];
  const parts: string[] = [];
  for (let i = 0; i < valid.length; i++) {
    parts.push(valid[i]);
    if (i < operators.length) {
      parts.push(operators[i] === "OR" ? "||" : "&&");
    }
  }
  return `(${parts.join(" ")})`;
}

function getLabelForExpression(expression: string): string | null {
  const match = SIMPLE_CONDITIONS.find((c) => c.expression === expression);
  return match?.label ?? null;
}

export function getConditionSummary(condition: string): { text: string; isMuted: boolean } {
  if (!condition || condition === "true") {
    return { text: "ללא תנאי", isMuted: true };
  }
  const { expressions, operators, isNegated } = parseConditionToSelections(condition);
  const validExpressions = expressions.filter((e) => e && e !== "true");
  if (validExpressions.length === 0) {
    return { text: "ללא תנאי", isMuted: true };
  }

  const labels = validExpressions.map((e) => getLabelForExpression(e)).filter(Boolean) as string[];
  if (labels.length === 0) {
    return { text: condition, isMuted: false };
  }

  let labelText = labels[0];
  for (let i = 1; i < labels.length; i++) {
    const opWord = operators[i - 1] === "OR" ? "או" : "וגם";
    labelText += ` ${opWord} ${labels[i]}`;
  }
  const action = isNegated ? "מוסתר" : "מוצג";
  return { text: `אם ${labelText} → ${action}`, isMuted: false };
}

interface ConditionBuilderPopoverProps {
  condition: string;
  onConditionChange: (condition: string) => void;
}

export const ConditionBuilderPopover = ({ condition, onConditionChange }: ConditionBuilderPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [expressions, setExpressions] = useState<string[]>([]);
  const [operators, setOperators] = useState<("AND" | "OR")[]>([]);
  const [thenAction, setThenAction] = useState<"shown" | "hidden">("shown");
  const [elseAction, setElseAction] = useState<"shown" | "hidden">("hidden");

  const handleOpen = () => {
    const parsed = parseConditionToSelections(condition);
    const valid = parsed.expressions.filter((e) => e && e !== "true");
    setExpressions(valid.length > 0 ? valid : [""]);
    setOperators(parsed.operators);
    if (parsed.isNegated) {
      setThenAction("hidden");
      setElseAction("shown");
    } else {
      setThenAction("shown");
      setElseAction("hidden");
    }
    setOpen(true);
  };

  const handleConfirm = () => {
    const valid = expressions.filter((e) => e && e !== "true");
    if (valid.length === 0) {
      onConditionChange("");
      setOpen(false);
      return;
    }
    // Build operators for valid expressions only
    const validOps: ("AND" | "OR")[] = [];
    let opIdx = 0;
    for (let i = 0; i < expressions.length; i++) {
      if (expressions[i] && expressions[i] !== "true") {
        if (validOps.length > 0 || opIdx > 0) {
          // need an operator before this valid expression (if not first valid)
        }
      }
      if (i < operators.length) opIdx++;
    }
    // Simpler: rebuild ops from the valid subset
    const filteredOps: ("AND" | "OR")[] = [];
    let validCount = 0;
    for (let i = 0; i < expressions.length; i++) {
      if (expressions[i] && expressions[i] !== "true") {
        if (validCount > 0 && i > 0 && operators[i - 1]) {
          filteredOps.push(operators[i - 1]);
        } else if (validCount > 0 && !operators[i - 1]) {
          filteredOps.push("AND");
        }
        validCount++;
      }
    }
    const raw = buildConditionString(valid, filteredOps);
    const result = thenAction === "hidden" ? `!(${raw})` : raw;
    onConditionChange(result);
    setOpen(false);
  };

  const addCondition = () => {
    if (expressions.length < MAX_CONDITIONS) {
      setExpressions([...expressions, ""]);
      setOperators([...operators, "AND"]);
    }
  };

  const removeCondition = (index: number) => {
    const newExpr = expressions.filter((_, i) => i !== index);
    const newOps = [...operators];
    if (index > 0) {
      newOps.splice(index - 1, 1);
    } else if (newOps.length > 0) {
      newOps.splice(0, 1);
    }
    setExpressions(newExpr);
    setOperators(newOps);
  };

  const updateExpression = (index: number, value: string) => {
    const newExpr = [...expressions];
    newExpr[index] = value;
    setExpressions(newExpr);
  };

  const toggleOperator = (index: number) => {
    const newOps = [...operators];
    newOps[index] = newOps[index] === "AND" ? "OR" : "AND";
    setOperators(newOps);
  };

  const summary = getConditionSummary(condition);

  return (
    <div className="flex items-center gap-1.5" dir="rtl">
      <span className={cn("text-[10px] shrink-0", summary.isMuted ? "text-muted-foreground" : "text-foreground")}>
        {summary.text}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-5 px-1.5 text-[10px] text-muted-foreground gap-1"
        onClick={handleOpen}
      >
        <SlidersHorizontal className="h-3 w-3" />
        ערוך תנאי
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[480px] p-0" dir="rtl">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>הגדרת תנאי הצגה</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3 p-4">
            {/* IF Block */}
            <div className="rounded-lg border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border-b">
                <span className="text-sm font-bold text-primary">IF</span>
                <span className="text-xs text-muted-foreground">אם</span>
              </div>
              <div className="p-3 flex flex-col gap-2">
                {expressions.map((expr, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    {index > 0 && (
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => toggleOperator(index - 1)}
                          className={cn(
                            "text-[10px] font-bold px-3 py-0.5 rounded-full border transition-colors cursor-pointer select-none",
                            operators[index - 1] === "OR"
                              ? "bg-amber-100 text-amber-800 border-amber-300"
                              : "bg-primary/10 text-primary border-primary/30"
                          )}
                        >
                          {operators[index - 1] === "OR" ? "OR" : "AND"}
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <SearchableConditionSelect
                          value={expr || undefined}
                          options={conditionOptions}
                          placeholder="בחר תנאי..."
                          onValueChange={(val) => updateExpression(index, val)}
                        />
                      </div>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-1.5 text-muted-foreground hover:text-destructive shrink-0"
                          onClick={() => removeCondition(index)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {expressions.length < MAX_CONDITIONS && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full border-dashed text-xs text-muted-foreground gap-1.5"
                    onClick={addCondition}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    הוסף תנאי
                  </Button>
                )}
              </div>
            </div>

            {/* Arrow connector IF → THEN */}
            <div className="flex justify-center">
              <div className="flex items-center justify-center size-6 rounded-full bg-muted">
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>

            {/* THEN Block */}
            <div className="rounded-lg border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 bg-chart-2/10 border-b">
                <span className="text-sm font-bold text-chart-2">THEN</span>
                <span className="text-xs text-muted-foreground">אז</span>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 text-xs gap-1.5 flex-1",
                      thenAction === "shown"
                        ? "bg-primary/15 text-primary border-primary/30 hover:bg-primary/25"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => {
                      setThenAction("shown");
                      setElseAction("hidden");
                    }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    מוצג
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 text-xs gap-1.5 flex-1",
                      thenAction === "hidden"
                        ? "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => {
                      setThenAction("hidden");
                      setElseAction("shown");
                    }}
                  >
                    <EyeOff className="h-3.5 w-3.5" />
                    מוסתר
                  </Button>
                </div>
              </div>
            </div>

            {/* Arrow connector THEN → ELSE */}
            <div className="flex justify-center">
              <div className="flex items-center justify-center size-6 rounded-full bg-muted">
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>

            {/* ELSE Block */}
            <div className="rounded-lg border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 bg-muted border-b">
                <span className="text-sm font-bold text-muted-foreground">ELSE</span>
                <span className="text-xs text-muted-foreground">אחרת</span>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 text-xs gap-1.5 flex-1",
                      elseAction === "shown"
                        ? "bg-primary/15 text-primary border-primary/30 hover:bg-primary/25"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => {
                      setElseAction("shown");
                      setThenAction("hidden");
                    }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    מוצג
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 text-xs gap-1.5 flex-1",
                      elseAction === "hidden"
                        ? "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => {
                      setElseAction("hidden");
                      setThenAction("shown");
                    }}
                  >
                    <EyeOff className="h-3.5 w-3.5" />
                    מוסתר
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 pt-0 flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              ביטול
            </Button>
            <Button size="sm" onClick={handleConfirm}>
              אישור
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};