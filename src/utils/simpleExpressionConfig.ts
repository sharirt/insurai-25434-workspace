/**
 * Configuration for Simple Expression (ביטוי פשוט) built-in conditions.
 * Each condition has a Hebrew label and maps to a JavaScript expression.
 * Used by the SimpleExpressionBuilder to create IF/THEN/ELSE ternary expressions.
 */

import { parseDataFieldExpression, getDataFieldDisplayLabel } from "@/utils/dataFieldConfig";
import { FIELD_TRANSLATIONS } from "@/utils/fieldTranslations";

const TODAY_DATE_EXPRESSION = "new Date().toLocaleDateString('he-IL', {day:'2-digit',month:'2-digit',year:'numeric'}).split('.').join('/')";

export interface SimpleCondition {
  label: string;
  expression: string;
}

export const SIMPLE_CONDITIONS: SimpleCondition[] = [
  { label: "אזרח ארה״ב", expression: "clients.american === true" },
  { label: "יליד ארה״ב", expression: "clients.bornInUSA === true" },
  { label: "תושב ארה״ב לצורכי מס", expression: "clients.americanForTax === true" },
  { label: "לקוח פעיל", expression: "clients.clientStatus === 'פעיל'" },
  { label: "לקוח טרום יעוץ", expression: "clients.clientStatus === 'טרום יעוץ'" },
  { label: "זכר", expression: "clients.gender === 'זכר'" },
  { label: "נקבה", expression: "clients.gender === 'נקבה'" },
  { label: "נשוי", expression: "clients.relationship === 'נשוי'" },
  { label: "רווק", expression: "clients.relationship === 'רווק'" },
  { label: "גרוש", expression: "clients.relationship === 'גרוש'" },
  { label: "אלמן", expression: "clients.relationship === 'אלמן'" },
  { label: "שכיר", expression: "clients.employment === 'שכיר'" },
  { label: "עצמאי", expression: "clients.employment === 'עצמאי'" },
  { label: "סטודנט", expression: "clients.employment === 'סטודנט'" },
  { label: "חבר קיבוץ", expression: "clients.employment === 'חבר קיבוץ'" },
  { label: "אברך", expression: "clients.employment === 'אברך'" },
  { label: "חייל בשירות חובה", expression: "clients.employment === 'חייל בשירות חובה'" },
  { label: "משרתת בשירות לאומי", expression: "clients.employment === 'משרתת בשירות לאומי'" },
  { label: "לא עובד/מובטל", expression: "clients.employment === 'לא עובד/מובטל'" },
  { label: "גמלאי", expression: "clients.employment === 'גמלאי'" },
  { label: "שכיר בעל שליטה", expression: "clients.employment === 'שכיר בעל שליטה'" },
  { label: "בגיר", expression: "clients.age >= 18" },
  { label: "קטין", expression: "clients.age < 18" },
  { label: `מסלול ${FIELD_TRANSLATIONS["clali"]} נבחר`, expression: "requests.tracks.clali !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["menayot"]} נבחר`, expression: "requests.tracks.menayot !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["okev_madad_sp"]} נבחר`, expression: "requests.tracks.okev_madad_sp !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["hilchati"]} נבחר`, expression: "requests.tracks.hilchati !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["okev_madadim_gamish"]} נבחר`, expression: "requests.tracks.okev_madadim_gamish !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["ashrai_veagach"]} נבחר`, expression: "requests.tracks.ashrai_veagach !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["agach_memshalot"]} נבחר`, expression: "requests.tracks.agach_memshalot !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["meshulav_sachir"]} נבחר`, expression: "requests.tracks.meshulav_sachir !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["ashrai_veagach_ad25_menayot"]} נבחר`, expression: "requests.tracks.ashrai_veagach_ad25_menayot !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["kaspi_shkali"]} נבחר`, expression: "requests.tracks.kaspi_shkali !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["menayot_sachir"]} נבחר`, expression: "requests.tracks.menayot_sachir !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["clali_ad500m"]} נבחר`, expression: "requests.tracks.clali_ad500m !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["okev_madadim_ad25_menayot"]} נבחר`, expression: "requests.tracks.okev_madadim_ad25_menayot !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["okev_madadei_menayot"]} נבחר`, expression: "requests.tracks.okev_madadei_menayot !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["agach_sachir"]} נבחר`, expression: "requests.tracks.agach_sachir !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["ad25_menayot"]} נבחר`, expression: "requests.tracks.ad25_menayot !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["kayamut"]} נבחר`, expression: "requests.tracks.kayamut !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["okev_madadei_agach"]} נבחר`, expression: "requests.tracks.okev_madadei_agach !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["agach_sachir_ad25_menayot"]} נבחר`, expression: "requests.tracks.agach_sachir_ad25_menayot !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["nihul_ishi"]} נבחר`, expression: "requests.tracks.nihul_ishi !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["agrresivi"]} נבחר`, expression: "requests.tracks.agrresivi !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["sharia"]} נבחר`, expression: "requests.tracks.sharia !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["ad_gil_50"]} נבחר`, expression: "requests.tracks.ad_gil_50 !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["gil_50_ad_60"]} נבחר`, expression: "requests.tracks.gil_50_ad_60 !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["gil_60_plus"]} נבחר`, expression: "requests.tracks.gil_60_plus !== ''" },
  { label: "סוג ההעברה היא צבירה והפקדות", expression: "requests.transferType === 'צבירה והפקדות'" },
  { label: "סוג ההעברה היא צבירה בלבד", expression: "requests.transferType === 'צבירה בלבד'" },
  { label: "סוג ההעברה היא הפקדות בלבד", expression: "requests.transferType === 'הפקדות בלבד'" },
  { label: "תקופת בחירה היא 6 חודשים", expression: "requests.choiceDuration === '6'" },
  { label: "תקופת בחירה היא 12 חודשים", expression: "requests.choiceDuration === '12'" },
  { label: "תקופת בחירה היא 24 חודשים", expression: "requests.choiceDuration === '24'" },
  { label: "שם הקרן היא כללי", expression: "requests.kerenName === 'כללי'" },
  { label: "שם הקרן היא אומגה", expression: "requests.kerenName === 'אומגה'" },
  { label: "העברת סכום מלא", expression: "requests.isTotalTransfer === true" },
  { label: "העברת סכום חלקי", expression: "requests.isTotalTransfer === false" },
];

/**
 * Check if a value is a data field reference (e.g. "clients.national_id").
 */
function isDataFieldValue(value: string): boolean {
  if (!value) return false;
  return parseDataFieldExpression(value) !== null;
}

/**
 * Wrap a value for the ternary expression:
 * - Data field values (tableName.fieldName) are stored WITHOUT quotes
 * - Empty string values are stored as ''
 * - Plain text values are wrapped in single quotes: 'text'
 */
function wrapValue(value: string): string {
  if (isDataFieldValue(value)) {
    return value;
  }
  if (value === "true" || value === "false") {
    return value;
  }
  if (value === TODAY_DATE_EXPRESSION) {
    return value;
  }
  return `'${value}'`;
}

/**
 * Join multiple condition expressions with AND (&&) or OR (||) operators.
 * If only one condition, returns it as-is (no parentheses).
 * If multiple, wraps in parentheses: (cond1 && cond2).
 */
function joinConditions(
  conditionExpressions: string[],
  conditionOperators: ("AND" | "OR")[]
): string {
  if (conditionExpressions.length === 0) return "";
  if (conditionExpressions.length === 1) return conditionExpressions[0];

  const parts: string[] = [];
  for (let i = 0; i < conditionExpressions.length; i++) {
    parts.push(conditionExpressions[i]);
    if (i < conditionOperators.length) {
      parts.push(conditionOperators[i] === "AND" ? "&&" : "||");
    }
  }
  return `(${parts.join(" ")})`;
}

/**
 * Build a JavaScript ternary expression from multiple conditions.
 * - Single condition: `condition ? thenValue : elseValue`
 * - Multiple conditions: `(cond1 && cond2) ? thenValue : elseValue`
 */
export function buildSimpleExpression(
  conditionExpressions: string[],
  thenValue: string,
  elseValue: string,
  conditionOperators?: ("AND" | "OR")[]
): string {
  const operators = conditionOperators || [];
  const combined = joinConditions(conditionExpressions, operators);
  return `${combined} ? ${wrapValue(thenValue)} : ${wrapValue(elseValue)}`;
}

/**
 * Split a combined condition string back into individual expressions and operators.
 * Handles:
 *   - Single condition: "clients.american === true"
 *   - Multi condition: "(cond1 && cond2)" or "(cond1 || cond2)" or "(cond1 && cond2 || cond3)"
 */
function splitConditions(combinedCondition: string): {
  expressions: string[];
  operators: ("AND" | "OR")[];
} {
  // Check if it's a parenthesized multi-condition
  const trimmed = combinedCondition.trim();
  if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
    const inner = trimmed.slice(1, -1).trim();
    // Split on top-level && or || (not inside nested parens)
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
    if (current.trim()) {
      expressions.push(current.trim());
    }

    if (expressions.length > 1) {
      return { expressions, operators };
    }
  }

  // Single condition (no parentheses)
  return { expressions: [trimmed], operators: [] };
}

/**
 * Try to parse a stored expression as a simple expression (ternary format).
 * Supports both single and multi-condition expressions.
 *
 * Returns null if the expression does not match the expected pattern.
 */
export function parseSimpleExpression(expression: string): {
  conditionLabel: string;
  conditionExpression: string;
  conditionExpressions: string[];
  conditionOperators: ("AND" | "OR")[];
  thenValue: string;
  elseValue: string;
} | null {
  const questionMarkIdx = findTernaryQuestionMark(expression);
  if (questionMarkIdx === -1) return null;

  const conditionExpr = expression.slice(0, questionMarkIdx).trim();
  const rest = expression.slice(questionMarkIdx + 1).trim();

  const colonIdx = findTernaryColon(rest);
  if (colonIdx === -1) return null;

  const thenPart = rest.slice(0, colonIdx).trim();
  const elsePart = rest.slice(colonIdx + 1).trim();

  const thenValue = parseValuePart(thenPart);
  const elseValue = parseValuePart(elsePart);

  if (thenValue === null || elseValue === null) return null;

  // Split the combined condition into individual expressions
  const { expressions, operators } = splitConditions(conditionExpr);

  // Validate each expression against known conditions
  for (const expr of expressions) {
    const known = SIMPLE_CONDITIONS.find((c) => c.expression === expr);
    if (!known) return null;
  }

  // For backward compat: single condition label
  const firstCondition = SIMPLE_CONDITIONS.find((c) => c.expression === expressions[0]);
  const conditionLabel = firstCondition?.label || "";

  return {
    conditionLabel,
    conditionExpression: expressions[0],
    conditionExpressions: expressions,
    conditionOperators: operators,
    thenValue,
    elseValue,
  };
}

/**
 * Find the index of the ternary '?' operator (not inside quotes or parentheses).
 */
function findTernaryQuestionMark(expr: string): number {
  let inQuote = false;
  let parenDepth = 0;
  for (let i = 0; i < expr.length; i++) {
    if (expr[i] === "'") {
      inQuote = !inQuote;
    } else if (!inQuote) {
      if (expr[i] === "(") {
        parenDepth++;
      } else if (expr[i] === ")") {
        parenDepth--;
      } else if (expr[i] === "?" && parenDepth === 0) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * Find the index of the ternary ':' operator (not inside quotes or parentheses).
 */
function findTernaryColon(expr: string): number {
  let inQuote = false;
  let parenDepth = 0;
  for (let i = 0; i < expr.length; i++) {
    if (expr[i] === "'") {
      inQuote = !inQuote;
    } else if (!inQuote) {
      if (expr[i] === "(") {
        parenDepth++;
      } else if (expr[i] === ")") {
        parenDepth--;
      } else if (expr[i] === ":" && parenDepth === 0) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * Parse a single value part from a ternary expression.
 */
function parseValuePart(part: string): string | null {
  const quotedMatch = part.match(/^'([^']*)'$/);
  if (quotedMatch) {
    return quotedMatch[1];
  }
  if (part === "true" || part === "false") {
    return part;
  }
  if (isDataFieldValue(part)) {
    return part;
  }
  if (part === TODAY_DATE_EXPRESSION) {
    return part;
  }
  return null;
}

/**
 * Get a display-friendly label for a value (resolves data field references to Hebrew).
 */
function getValueDisplayLabel(value: string): string {
  if (!value) return "ריק";
  const parsed = parseDataFieldExpression(value);
  if (parsed) {
    return getDataFieldDisplayLabel(parsed.table, parsed.field, parsed.trackKey);
  }
  return value;
}

/**
 * Get the display string for a simple expression in view mode.
 * Accepts either:
 *   - (conditionLabel: string, thenValue: string, elseValue: string) — legacy single condition
 *   - (conditionLabels: string[], thenValue: string, elseValue: string, operators: ('AND'|'OR')[]) — multi condition
 */
export function getSimpleExpressionDisplayLabel(
  conditionLabelOrLabels: string | string[],
  thenValue: string,
  elseValue: string,
  operators?: ("AND" | "OR")[]
): string {
  const thenDisplay = getValueDisplayLabel(thenValue);
  const elseDisplay = getValueDisplayLabel(elseValue);

  if (Array.isArray(conditionLabelOrLabels)) {
    const labels = conditionLabelOrLabels;
    const ops = operators || [];
    let conditionStr = labels[0] || "";
    for (let i = 1; i < labels.length; i++) {
      const opWord = ops[i - 1] === "OR" ? "או" : "וגם";
      conditionStr += ` ${opWord} ${labels[i]}`;
    }
    return `אם ${conditionStr} → ${thenDisplay} / ${elseDisplay}`;
  }

  return `אם ${conditionLabelOrLabels} → ${thenDisplay} / ${elseDisplay}`;
}