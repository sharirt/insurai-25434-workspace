/**
 * Configuration for data field mapping - tables and their fields with Hebrew labels.
 * Used by the FieldMappingEditor to allow users to select a data field from a table.
 */

import { FIELD_TRANSLATIONS } from "@/utils/fieldTranslations";

export interface DataFieldOption {
  value: string;
  label: string;
}

export interface DataTableConfig {
  value: string;
  label: string;
  fields: DataFieldOption[];
}

export const DATA_TABLES: DataTableConfig[] = [
  {
    value: "clients",
    label: "לקוח",
    fields: [
      { value: "first_name", label: "שם פרטי" },
      { value: "last_name", label: "שם משפחה" },
      { value: "national_id", label: "תעודת זהות" },
      { value: "phone_number", label: "מספר טלפון" },
      { value: "email", label: 'דוא"ל' },
      { value: "dateOfBirth", label: "תאריך לידה" },
      { value: "gender", label: "מין" },
      { value: "relationship", label: "מצב משפחתי" },
      { value: "address", label: "כתובת" },
      { value: "fullAddress", label: "כתובת מלאה" },
      { value: "cityOfResidence", label: "יישוב" },
      { value: "zipCode", label: "מיקוד" },
      { value: "employment", label: "תעסוקה" },
      { value: "occupation", label: "עיסוק" },
      { value: "employer", label: "מעסיק" },
      { value: "companyId", label: "ח.פ / ע.מ" },
      { value: "american", label: "אזרח אמריקאי" },
      { value: "americanForTax", label: "תושב ארה\"ב לצורכי מס" },
      { value: "tinNumber", label: "מספר TIN" },
      { value: "englishFirstName", label: "שם פרטי אנגלית" },
      { value: "englishLastName", label: "שם משפחה אנגלית" },
      { value: "englishCity", label: "עיר אנגלית" },
      { value: "englishCountry", label: "מדינה אנגלית" },
      { value: "notes", label: "הערות" },
      { value: "clientStatus", label: "סטאטוס לקוח" },
      { value: "fullName", label: "שם מלא" },
      { value: "parent1Name", label: "שם הורה 1" },
      { value: "parent1FirstName", label: "שם פרטי הורה 1" },
      { value: "parent1LastName", label: "שם משפחה הורה 1" },
      { value: "parent1Id", label: "ת.ז הורה 1" },
      { value: "parent2Name", label: "שם הורה 2" },
      { value: "parent2FirstName", label: "שם פרטי הורה 2" },
      { value: "parent2LastName", label: "שם משפחה הורה 2" },
      { value: "parent2Id", label: "ת.ז הורה 2" },
      { value: "parent1DateOfBirth", label: "תאריך לידה הורה 1" },
      { value: "parent2DateOfBirth", label: "תאריך לידה הורה 2" },
      { value: "idIssueDate", label: "תאריך הנפקת ת.ז" },
      { value: "apartmentNumber", label: "מספר דירה" },
      { value: "streetName", label: "שם רחוב בלבד" },
      { value: "streetNumber", label: "מספר בית בלבד" },
      { value: "birthCountry", label: "ארץ לידה" },
      { value: "birthCity", label: "עיר לידה" },
      { value: "birthCountryEnglish", label: "ארץ לידה אנגלית" },
      { value: "birthCityEnglish", label: "עיר לידה אנגלית" },
      { value: "englishStreet", label: "רחוב באנגלית" },
      { value: "englishStreetWithNumber", label: "רחוב באנגלית עם מספר" },
      { value: "bornInUSA", label: "יליד ארה״ב" },
      { value: "taxCountry", label: "מדינת מס" },
      { value: "bankName", label: "קוד בנק" },
      { value: "branchNumber", label: "מספר סניף" },
      { value: "accountNumber", label: "מספר חשבון" },
    ],
  },
  {
    value: "agents",
    label: "סוכן",
    fields: [
      { value: "firstName", label: "שם פרטי" },
      { value: "lastName", label: "שם משפחה" },
      { value: "nationalId", label: "תעודת זהות" },
      { value: "agentNumber", label: "מספר סוכן" },
      { value: "email", label: 'דוא"ל' },
      { value: "fullName", label: "שם מלא" },
      { value: "phone", label: "טלפון" },
    ],
  },
  {
    value: "providers",
    label: "יצרן",
    fields: [
      { value: "provider_name", label: "שם יצרן" },
      { value: "institutionalName", label: "שם גוף מוסדי" },
      { value: "providerIdCode", label: "ח.פ חברה" },
      { value: "institutionalNameAndCode", label: "שם מוסדי וח.פ" },
    ],
  },
  {
    value: "funds",
    label: "מוצרים",
    fields: [
      { value: "planName", label: "שם תוכנית" },
      { value: "policyNumber", label: "מספר פוליסה" },
      { value: "productType", label: "סוג מוצר" },
      { value: "status", label: "סטטוס" },
      { value: "totalBalance", label: "יתרה כוללת" },
      { value: "employerContributions", label: "הפרשות מעסיק" },
      { value: "employeeContributions", label: "הפרשות עובד" },
      { value: "joinDate", label: "תאריך הצטרפות" },
      { value: "providerName", label: "שם יצרן" },
      { value: "employer", label: "מעסיק" },
      { value: "agentNumber", label: "מספר סוכן" },
      { value: "managementFeeDeposits", label: "דמי ניהול מהפקדות" },
      { value: "managementFeeAccumulation", label: "דמי ניהול מצבירה" },
      { value: "reportedSalary", label: "שכר מדווח" },
      { value: "severance", label: "פיצויים" },
      { value: "lastDepositAmount", label: "הפקדה אחרונה" },
      { value: "lastDepositDate", label: "תאריך הפקדה אחרונה" },
      { value: "dataValidityDate", label: "תאריך נכונות" },
    ],
  },
  {
    value: "agency",
    label: "סוכנות",
    fields: [
      { value: "agencyName", label: "שם הסוכנות" },
    ],
  },
  {
    value: "agencyCodes",
    label: "קודי סוכנות",
    fields: [
      { value: "agentCode", label: "קוד סוכן" },
    ],
  },
  {
    value: "beneficiaries",
    label: "מוטבים",
    fields: [
      { value: "firstName", label: "שם פרטי" },
      { value: "lastName", label: "שם משפחה" },
      { value: "fullName", label: "שם מלא" },
      { value: "nationalId", label: "תעודת זהות" },
      { value: "relationship", label: "קרבה" },
      { value: "allocationPercentage", label: "הקצאה באחוזים" },
      { value: "birthDate", label: "תאריך לידה" },
    ],
  },
  {
    value: "requests",
    label: "בקשה",
    fields: [
      { value: "managementFee", label: "דמי ניהול מהפקדה" },
      { value: "managementFeeAccumulation", label: "דמי ניהול מצבירה" },
      { value: "tracks", label: "מסלולים" },
      { value: "transferAmount", label: "סכום העברה" },
      { value: "accountType", label: "סוג חשבון" },
      { value: "chargeDay", label: "מועד חיוב" },
      { value: "independentTransferType", label: "סוג העברה עצמאית" },
      { value: "independentTransferAmount", label: "סכום העברה עצמאי" },
    ],
  },
];

/** Result of parsing a data field expression. trackKey is present for 3-part expressions like "requests.tracks.clali" */
export interface ParsedDataField {
  table: string;
  field: string;
  trackKey?: string;
  beneficiaryIndex?: number;
}

/**
 * Get the available track keys with their Hebrew labels from FIELD_TRANSLATIONS.
 * Used for the third dropdown when table=requests and field=tracks.
 */
export function getTrackOptions(): DataFieldOption[] {
  return Object.entries(FIELD_TRANSLATIONS).map(([key, label]) => ({
    value: key,
    label,
  }));
}

/**
 * Parse a data field expression like "clients.national_id" or "requests.tracks.clali"
 * from a stored value "{{clients.national_id}}" or "{{requests.tracks.clali}}"
 * Returns the table, field, and optional trackKey, or null if not a valid data field pattern.
 */
export function parseDataFieldExpression(expression: string): ParsedDataField | null {
  // Check for beneficiary indexed pattern: beneficiaries[N]?.fieldName
  const beneficiaryMatch = expression.match(/^beneficiaries\[(\d+)\]\?\.(\w+)$/);
  if (beneficiaryMatch) {
    const index = parseInt(beneficiaryMatch[1], 10);
    const fieldName = beneficiaryMatch[2];
    const beneficiaryTable = DATA_TABLES.find(t => t.value === "beneficiaries");
    if (beneficiaryTable?.fields.some(f => f.value === fieldName)) {
      return { table: "beneficiaries", field: fieldName, beneficiaryIndex: index };
    }
  }

  const tableNames = DATA_TABLES.map((t) => t.value);
  for (const tableName of tableNames) {
    if (expression.startsWith(`${tableName}.`)) {
      // Skip beneficiaries dot-notation — only indexed pattern is valid
      if (tableName === "beneficiaries") continue;
      const rest = expression.slice(tableName.length + 1);
      const tableConfig = DATA_TABLES.find((t) => t.value === tableName);
      if (!tableConfig) continue;

      // Check for 3-part pattern: requests.tracks.<trackKey>
      if (tableName === "requests" && rest.startsWith("tracks.")) {
        const trackKey = rest.slice("tracks.".length);
        if (trackKey && FIELD_TRANSLATIONS[trackKey]) {
          return { table: tableName, field: "tracks", trackKey };
        }
      }

      // Standard 2-part pattern: table.field
      if (tableConfig.fields.some((f) => f.value === rest)) {
        return { table: tableName, field: rest };
      }
    }
  }
  return null;
}

/**
 * Get the Hebrew display string for a data field expression.
 * E.g., "clients.national_id" → "לקוח > תעודת זהות"
 * E.g., "requests.tracks.clali" → "בקשה > מסלולים > כללי"
 */
export function getDataFieldDisplayLabel(
  table: string,
  field: string,
  trackKey?: string,
  beneficiaryIndex?: number
): string {
  const tableConfig = DATA_TABLES.find((t) => t.value === table);
  if (!tableConfig) return `${table}.${field}`;
  const fieldConfig = tableConfig.fields.find((f) => f.value === field);
  if (!fieldConfig) return `${tableConfig.label} > ${field}`;

  // If trackKey is provided, add the track Hebrew label
  if (trackKey && field === "tracks") {
    const trackLabel = FIELD_TRANSLATIONS[trackKey] || trackKey;
    return `${tableConfig.label} > ${fieldConfig.label} > ${trackLabel}`;
  }

  if (table === "beneficiaries" && beneficiaryIndex !== undefined) {
    return `${tableConfig.label} > מוטב ${beneficiaryIndex + 1} > ${fieldConfig.label}`;
  }

  return `${tableConfig.label} > ${fieldConfig.label}`;
}