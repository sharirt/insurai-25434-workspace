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
  { label: "תושב מדינה זרה לצורכי מס", expression: "clients.taxCountry !== ''" },
  { label: "לקוח פעיל", expression: "clients.clientStatus === 'פעיל'" },
  { label: "לקוח טרום יעוץ", expression: "clients.clientStatus === 'טרום יעוץ'" },
  { label: "זכר", expression: "clients.gender === 'זכר'" },
  { label: "נקבה", expression: "clients.gender === 'נקבה'" },
  { label: "נשוי", expression: "clients.relationship === 'נשוי'" },
  { label: "רווק", expression: "clients.relationship === 'רווק'" },
  { label: "גרוש", expression: "clients.relationship === 'גרוש'" },
  { label: "אלמן", expression: "clients.relationship === 'אלמן'" },
  { label: "ידוע בציבור", expression: "clients.relationship === 'ידוע בציבור'" },
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
  { label: "בעל מוטבים", expression: "beneficiaries && beneficiaries.length > 0" },
  { label: "אינו בעל מוטבים", expression: "beneficiaries && beneficiaries.length == 0" },
  { label: "חלוקה בין מוטבים לחלקים שווים", expression: "clients.beneficiariesDivide === 'חלקים שווים'" },
  { label: "חלוקה בין מוטבים יחסי לחלקם", expression: "clients.beneficiariesDivide === 'יחסי לחלקם'" },
  { label: "חלוקה בין מוטבים ליורשים חוקיים", expression: "clients.beneficiariesDivide === 'יורשים חוקיים'" },
  { label: "חלוקה בין מוטבים - (לבחירה בילין בלבד) יורשים חוקיים על פי דין של המוטב הנפטר", expression: "clients.beneficiariesDivide === '(לבחירה בילין בלבד) יורשים חוקיים על פי דין של המוטב הנפטר'" },
  { label: "חלוקה בין מוטבים - אחר", expression: "clients.beneficiariesDivide === 'אחר'" },
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
  { label: `מסלול ${FIELD_TRANSLATIONS["bnei_50_umata"]} נבחר`, expression: "requests.tracks.bnei_50_umata !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["bnei_50_ad_60"]} נבחר`, expression: "requests.tracks.bnei_50_ad_60 !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["bnei_60_umaala"]} נבחר`, expression: "requests.tracks.bnei_60_umaala !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["yaad_2030"]} נבחר`, expression: "requests.tracks.yaad_2030 !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["yaad_2035"]} נבחר`, expression: "requests.tracks.yaad_2035 !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["yaad_2040"]} נבחר`, expression: "requests.tracks.yaad_2040 !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["yaad_2045"]} נבחר`, expression: "requests.tracks.yaad_2045 !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["yaad_2050"]} נבחר`, expression: "requests.tracks.yaad_2050 !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["yaad_2055"]} נבחר`, expression: "requests.tracks.yaad_2055 !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["yaad_2060"]} נבחר`, expression: "requests.tracks.yaad_2060 !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["yaad_2065"]} נבחר`, expression: "requests.tracks.yaad_2065 !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["mekablei_kitzba"]} נבחר`, expression: "requests.tracks.mekablei_kitzba !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["hilchati_lemekablei_kitzba"]} נבחר`, expression: "requests.tracks.hilchati_lemekablei_kitzba !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["pensionerim"]} נבחר`, expression: "requests.tracks.pensionerim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["zakaim_kayamim"]} נבחר`, expression: "requests.tracks.zakaim_kayamim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["okev_madadim_lemekablei_kitzba"]} נבחר`, expression: "requests.tracks.okev_madadim_lemekablei_kitzba !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["agach_memshalti_sachir"]} נבחר`, expression: "requests.tracks.agach_memshalti_sachir !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["okev_madadim_agach_ad25_menayot"]} נבחר`, expression: "requests.tracks.okev_madadim_agach_ad25_menayot !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["menayot_chul"]} נבחר`, expression: "requests.tracks.menayot_chul !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["chul"]} נבחר`, expression: "requests.tracks.chul !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["agach_chul"]} נבחר`, expression: "requests.tracks.agach_chul !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["tlui_gil"]} נבחר`, expression: "requests.tracks.tlui_gil !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["fidelity_clali"]} נבחר`, expression: "requests.tracks.fidelity_clali !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["fidelity_menayot"]} נבחר`, expression: "requests.tracks.fidelity_menayot !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["blackrock_clali"]} נבחר`, expression: "requests.tracks.blackrock_clali !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["blackrock_menayot"]} נבחר`, expression: "requests.tracks.blackrock_menayot !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["apollo_ashrai_veagach"]} נבחר`, expression: "requests.tracks.apollo_ashrai_veagach !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["migdal_okev_madad_sp"]} נבחר`, expression: "requests.tracks.migdal_okev_madad_sp !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["migdal_okev_madadei_menayot"]} נבחר`, expression: "requests.tracks.migdal_okev_madadei_menayot !== ''" },
  { label: "נבחר פיצויים", expression: "requests.pitzuimSeparate === true" },
  { label: `מסלול ${FIELD_TRANSLATIONS["menayot__pitzuim"]} נבחר`, expression: "requests.tracks.menayot__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["okev_madad_sp__pitzuim"]} נבחר`, expression: "requests.tracks.okev_madad_sp__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["hilchati__pitzuim"]} נבחר`, expression: "requests.tracks.hilchati__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["okev_madadim_gamish__pitzuim"]} נבחר`, expression: "requests.tracks.okev_madadim_gamish__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["ashrai_veagach__pitzuim"]} נבחר`, expression: "requests.tracks.ashrai_veagach__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["okev_madadei_menayot__pitzuim"]} נבחר`, expression: "requests.tracks.okev_madadei_menayot__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["meshulav_sachir__pitzuim"]} נבחר`, expression: "requests.tracks.meshulav_sachir__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["menayot_sachir__pitzuim"]} נבחר`, expression: "requests.tracks.menayot_sachir__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["agach_sachir__pitzuim"]} נבחר`, expression: "requests.tracks.agach_sachir__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["clali__pitzuim"]} נבחר`, expression: "requests.tracks.clali__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["yaad_2030__pitzuim"]} נבחר`, expression: "requests.tracks.yaad_2030__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["yaad_2035__pitzuim"]} נבחר`, expression: "requests.tracks.yaad_2035__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["yaad_2040__pitzuim"]} נבחר`, expression: "requests.tracks.yaad_2040__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["yaad_2045__pitzuim"]} נבחר`, expression: "requests.tracks.yaad_2045__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["yaad_2050__pitzuim"]} נבחר`, expression: "requests.tracks.yaad_2050__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["yaad_2055__pitzuim"]} נבחר`, expression: "requests.tracks.yaad_2055__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["yaad_2060__pitzuim"]} נבחר`, expression: "requests.tracks.yaad_2060__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["yaad_2065__pitzuim"]} נבחר`, expression: "requests.tracks.yaad_2065__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["mekablei_kitzba__pitzuim"]} נבחר`, expression: "requests.tracks.mekablei_kitzba__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["hilchati_lemekablei_kitzba__pitzuim"]} נבחר`, expression: "requests.tracks.hilchati_lemekablei_kitzba__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["pensionerim__pitzuim"]} נבחר`, expression: "requests.tracks.pensionerim__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["zakaim_kayamim__pitzuim"]} נבחר`, expression: "requests.tracks.zakaim_kayamim__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["kayamut__pitzuim"]} נבחר`, expression: "requests.tracks.kayamut__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["kaspi_shkali__pitzuim"]} נבחר`, expression: "requests.tracks.kaspi_shkali__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["okev_madadei_agach__pitzuim"]} נבחר`, expression: "requests.tracks.okev_madadei_agach__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["agach_memshalot__pitzuim"]} נבחר`, expression: "requests.tracks.agach_memshalot__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["okev_madadim_lemekablei_kitzba__pitzuim"]} נבחר`, expression: "requests.tracks.okev_madadim_lemekablei_kitzba__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["sharia__pitzuim"]} נבחר`, expression: "requests.tracks.sharia__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["ashrai_veagach_ad25_menayot__pitzuim"]} נבחר`, expression: "requests.tracks.ashrai_veagach_ad25_menayot__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["clali_ad500m__pitzuim"]} נבחר`, expression: "requests.tracks.clali_ad500m__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["okev_madadim_ad25_menayot__pitzuim"]} נבחר`, expression: "requests.tracks.okev_madadim_ad25_menayot__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["ad25_menayot__pitzuim"]} נבחר`, expression: "requests.tracks.ad25_menayot__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["agach_sachir_ad25_menayot__pitzuim"]} נבחר`, expression: "requests.tracks.agach_sachir_ad25_menayot__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["nihul_ishi__pitzuim"]} נבחר`, expression: "requests.tracks.nihul_ishi__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["agrresivi__pitzuim"]} נבחר`, expression: "requests.tracks.agrresivi__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["agach_memshalti_sachir__pitzuim"]} נבחר`, expression: "requests.tracks.agach_memshalti_sachir__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["okev_madadim_agach_ad25_menayot__pitzuim"]} נבחר`, expression: "requests.tracks.okev_madadim_agach_ad25_menayot__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["menayot_chul__pitzuim"]} נבחר`, expression: "requests.tracks.menayot_chul__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["chul__pitzuim"]} נבחר`, expression: "requests.tracks.chul__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["agach_chul__pitzuim"]} נבחר`, expression: "requests.tracks.agach_chul__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["bnei_50_umata__pitzuim"]} נבחר`, expression: "requests.tracks.bnei_50_umata__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["bnei_50_ad_60__pitzuim"]} נבחר`, expression: "requests.tracks.bnei_50_ad_60__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["bnei_60_umaala__pitzuim"]} נבחר`, expression: "requests.tracks.bnei_60_umaala__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["tlui_gil__pitzuim"]} נבחר`, expression: "requests.tracks.tlui_gil__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["fidelity_clali__pitzuim"]} נבחר`, expression: "requests.tracks.fidelity_clali__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["fidelity_menayot__pitzuim"]} נבחר`, expression: "requests.tracks.fidelity_menayot__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["blackrock_clali__pitzuim"]} נבחר`, expression: "requests.tracks.blackrock_clali__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["blackrock_menayot__pitzuim"]} נבחר`, expression: "requests.tracks.blackrock_menayot__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["apollo_ashrai_veagach__pitzuim"]} נבחר`, expression: "requests.tracks.apollo_ashrai_veagach__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["migdal_okev_madad_sp__pitzuim"]} נבחר`, expression: "requests.tracks.migdal_okev_madad_sp__pitzuim !== ''" },
  { label: `מסלול ${FIELD_TRANSLATIONS["migdal_okev_madadei_menayot__pitzuim"]} נבחר`, expression: "requests.tracks.migdal_okev_madadei_menayot__pitzuim !== ''" },
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
  { label: "מוצר במעמד שכיר", expression: "requests.standing === 'שכיר'" },
  { label: "מוצר במעמד עצמאי", expression: "requests.standing === 'עצמאי'" },
  { label: "מוצר במעמד שכיר בעל שליטה", expression: "requests.standing === 'שכיר בעל שליטה'" },
  { label: "מוצר במעמד עצמאי באמצעות מעסיק", expression: "requests.standing === 'עצמאי באמצעות מעסיק'" },
  { label: "מעמד קופה של חבר קיבוץ", expression: "requests.standing === 'חבר קיבוץ'" },
  { label: "הפקדה חד פעמית", expression: "requests.independentTransferType === 'הפקדה חד פעמית'" },
  { label: "הוראת קבע", expression: "requests.independentTransferType === 'הוראת קבע'" },
  { label: "ניוד חלקי", expression: "requests.isPartialTransfer === true" },
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