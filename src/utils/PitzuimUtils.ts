import { STATIC_TRACK_KEYS } from "@/utils/fieldTranslations";

export const BASE_TRACK_KEYS = STATIC_TRACK_KEYS.filter(
  (k) => !k.endsWith("__pitzuim")
);

const QUALIFYING_PRODUCTS = [
  "קרן פנסיה מקיפה",
  "קרן פנסיה משלימה",
  "קופת גמל",
];

const QUALIFYING_ACTIONS = ["פתיחת", "שינוי מסלול"];

export function isPitzuimQualifying(name?: string): boolean {
  if (!name) return false;
  // Exclude "קופת גמל להשקעה"
  const isExcluded = name.includes("קופת גמל להשקעה");
  if (isExcluded) return false;

  const hasProduct = QUALIFYING_PRODUCTS.some((p) => name.includes(p));
  const hasAction = QUALIFYING_ACTIONS.some((a) => name.includes(a));
  return hasProduct && hasAction;
}

export function applyPitzuimMirroring(
  tracks: Record<string, string>
): Record<string, string> {
  const result = { ...tracks };
  for (const key of BASE_TRACK_KEYS) {
    result[key + "__pitzuim"] = result[key] ?? "";
  }
  return result;
}

export function stripPitzuimKeys(
  tracks: Record<string, string>
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(tracks)) {
    if (!key.endsWith("__pitzuim")) {
      result[key] = value;
    }
  }
  return result;
}