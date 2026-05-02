export type FieldType = "text" | "checkbox" | "dropdown" | "radio" | "optionList" | "signature" | "date";

export interface PdfField {
  id: string;
  name: string;
  type: FieldType;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: "helvetica" | "rubik";
  textDirection: "ltr" | "rtl";
  multiline: boolean;
  required: boolean;
  readOnly: boolean;
  options: string[];
  defaultValue: string;
  isNew: boolean;
  isModified: boolean;
  isDeleted: boolean;
}

export const FIELD_TYPE_COLORS: Record<FieldType, string> = {
  text: "#3B82F6",
  checkbox: "#22C55E",
  dropdown: "#A855F7",
  radio: "#F97316",
  signature: "#EF4444",
  date: "#14B8A6",
  optionList: "#EAB308",
};

export const FIELD_TYPE_LABELS_HE: Record<FieldType, string> = {
  text: "טקסט",
  checkbox: "תיבת סימון",
  dropdown: "רשימה נפתחת",
  radio: "כפתורי בחירה",
  optionList: "רשימת אפשרויות",
  signature: "חתימה",
  date: "תאריך",
};

export const ALL_FIELD_TYPES: FieldType[] = [
  "text", "checkbox", "dropdown", "radio", "optionList", "signature", "date",
];

let fieldCounter = 0;
export function createNewField(): PdfField {
  fieldCounter++;
  return {
    id: `new_${Date.now()}_${fieldCounter}`,
    name: `שדה_חדש_${fieldCounter}`,
    type: "text",
    page: 0,
    x: 50,
    y: 50,
    width: 200,
    height: 20,
    fontSize: 12,
    fontFamily: "helvetica",
    textDirection: "ltr",
    multiline: false,
    required: false,
    readOnly: false,
    options: [],
    defaultValue: "",
    isNew: true,
    isModified: false,
    isDeleted: false,
  };
}