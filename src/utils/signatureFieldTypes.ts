export type SignatureFieldType = "signature" | "date_signed" | "text" | "checkbox" | "initials";

export interface SignatureFieldConfig {
  type: SignatureFieldType;
  label: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export const SIGNATURE_FIELD_TYPES: SignatureFieldConfig[] = [
  {
    type: "signature",
    label: "חתימה",
    icon: "PenLine",
    defaultWidth: 200,
    defaultHeight: 50,
    colorClass: "text-primary",
    bgClass: "bg-primary/15",
    borderClass: "border-primary/40",
  },
  {
    type: "date_signed",
    label: "תאריך",
    icon: "Calendar",
    defaultWidth: 150,
    defaultHeight: 30,
    colorClass: "text-chart-2",
    bgClass: "bg-chart-2/15",
    borderClass: "border-chart-2/40",
  },
  {
    type: "text",
    label: "טקסט",
    icon: "Type",
    defaultWidth: 150,
    defaultHeight: 30,
    colorClass: "text-chart-5",
    bgClass: "bg-chart-5/15",
    borderClass: "border-chart-5/40",
  },
  {
    type: "checkbox",
    label: "תיבת סימון",
    icon: "CheckSquare",
    defaultWidth: 20,
    defaultHeight: 20,
    colorClass: "text-chart-3",
    bgClass: "bg-chart-3/15",
    borderClass: "border-chart-3/40",
  },
  {
    type: "initials",
    label: "ראשי תיבות",
    icon: "Fingerprint",
    defaultWidth: 80,
    defaultHeight: 40,
    colorClass: "text-accent-foreground",
    bgClass: "bg-accent/40",
    borderClass: "border-accent-foreground/40",
  },
];

export const getFieldConfig = (type: string): SignatureFieldConfig => {
  return SIGNATURE_FIELD_TYPES.find((f) => f.type === type) || SIGNATURE_FIELD_TYPES[0];
};