export const STATUS_VALUES = [
  "מעבד",
  "מוכן לשליחה ללקוח",
  "נשלח ללקוח",
  "מוכן לשליחה לסוכן",
  "נשלח לסוכן",
  "מוכן לשליחה ליצרן",
  "נשלח ליצרן",
  "הושלם",
  "נדחה",
] as const;

export type StatusValue = (typeof STATUS_VALUES)[number];

export const STATUS_VARIANT_MAP: Record<StatusValue, "default" | "secondary" | "destructive" | "outline"> = {
  "מעבד": "secondary",
  "מוכן לשליחה ללקוח": "default",
  "נשלח ללקוח": "default",
  "מוכן לשליחה לסוכן": "default",
  "נשלח לסוכן": "default",
  "מוכן לשליחה ליצרן": "default",
  "נשלח ליצרן": "default",
  "הושלם": "secondary",
  "נדחה": "destructive",
};

export function getStatusLabel(status?: string): string {
  if (!status) return "לא ידוע";
  if (STATUS_VALUES.includes(status as StatusValue)) return status;
  return status;
}

export function getStatusVariant(status?: string): "default" | "secondary" | "destructive" | "outline" {
  if (!status) return "outline";
  return STATUS_VARIANT_MAP[status as StatusValue] ?? "outline";
}