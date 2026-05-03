import { getFieldLabel } from "@/utils/fieldTranslations";
import {
  TRACK_TRANSLATION_OVERRIDES,
  type TrackTranslationOverrideRowGen,
} from "@/utils/trackTranslationOverrides.generated";

export type TrackTranslationOverrideRow = TrackTranslationOverrideRowGen;

const rows: TrackTranslationOverrideRow[] = TRACK_TRANSLATION_OVERRIDES;

function contextKey(requestTypeName: string, providerName: string): string {
  return `${requestTypeName.trim()}\u0000${providerName.trim()}`;
}

function formatTrackCode(code: number): string {
  if (!Number.isFinite(code) || code === 0) {
    return String(code);
  }
  if (Number.isInteger(code)) {
    return String(code);
  }
  return String(code);
}

function buildIndex(): Map<
  string,
  Map<string, { customTranslation: string; trackCode: number }>
> {
  const outer = new Map<
    string,
    Map<string, { customTranslation: string; trackCode: number }>
  >();
  for (const row of rows) {
    const ck = contextKey(row.requestTypeName, row.providerName);
    const def = row.defaultTranslation.trim();
    if (!def) continue;
    let inner = outer.get(ck);
    if (!inner) {
      inner = new Map();
      outer.set(ck, inner);
    }
    inner.set(def, {
      customTranslation: row.customTranslation.trim(),
      trackCode: row.trackCode,
    });
  }
  return outer;
}

const overrideIndex = buildIndex();

export interface TrackDisplayLabelContext {
  requestTypeName: string;
  providerName: string;
  trackKey: string;
}

/**
 * Returns `customTranslation - trackCode` when the Excel table has a matching
 * row for (request type, provider, default Hebrew label); otherwise the default
 * `getFieldLabel(trackKey)` only.
 */
export function getTrackDisplayLabel(ctx: TrackDisplayLabelContext): string {
  const defaultLabel = getFieldLabel(ctx.trackKey).trim();
  const rt = ctx.requestTypeName?.trim() ?? "";
  const pn = ctx.providerName?.trim() ?? "";
  if (!rt || !pn) {
    return defaultLabel;
  }
  const inner = overrideIndex.get(contextKey(rt, pn));
  if (!inner) {
    return defaultLabel;
  }
  const match = inner.get(defaultLabel);
  if (!match || !match.customTranslation) {
    return defaultLabel;
  }
  return `${match.customTranslation} - ${formatTrackCode(match.trackCode)}`;
}
