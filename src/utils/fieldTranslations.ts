/**
 * Translation map from English field keys to Hebrew display names.
 * Used in the request creation flow to show user-friendly Hebrew labels.
 */
export const FIELD_TRANSLATIONS: Record<string, string> = {
  clali: "כללי",
  menayot: "מניות",
  okev_madad_sp: "עוקב מדד S&P500",
  hilchati: "הלכתי",
  okev_madadim_gamish: "עוקב מדדים גמיש",
  ashrai_veagach: "אשראי ואג״ח",
  agach_memshalot: "אג״ח ממשלות",
  meshulav_sachir: "משולב סחיר",
  ashrai_veagach_ad25_menayot: "אשראי ואג״ח עד 25% מניות",
  kaspi_shkali: "כספי שקלי",
  menayot_sachir: "מניות סחיר",
  clali_ad500m: "כללי עד 500 מיליון",
  okev_madadim_ad25_menayot: "עוקב מדדים עד 25% מניות",
  okev_madadei_menayot: "עוקב מדדי מניות",
  agach_sachir: "אג״ח סחיר",
  ad25_menayot: "עד 25% מניות",
  kayamut: "קיימות",
  okev_madadei_agach: "עוקב מדדי אג״ח",
  agach_sachir_ad25_menayot: "אג״ח סחיר עד 25% מניות",
  nihul_ishi: "ניהול אישי",
  agrresivi: "אגרסיבי",
  sharia: "שריעה",
  ad_gil_50: "עד גיל 50",
  gil_50_ad_60: "מגיל 50 עד 60",
  gil_60_plus: "מגיל 60 ומעלה",
};

/**
 * All available change field keys that can be added to a request type.
 */
export const AVAILABLE_CHANGE_FIELDS = Object.keys(FIELD_TRANSLATIONS);

/**
 * Returns the Hebrew translation for a given English field key.
 * Falls back to the raw key if no translation is found.
 */
export const getFieldLabel = (key: string): string => {
  return FIELD_TRANSLATIONS[key] || key;
};