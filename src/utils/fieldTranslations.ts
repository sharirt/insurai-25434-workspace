export const FIELD_TRANSLATIONS: Record<string, string> = {
  menayot: "מניות",
  okev_madad_sp: "עוקב מדד S&P500",
  hilchati: "הלכתי",
  okev_madadim_gamish: "עוקב מדדים גמיש",
  ashrai_veagach: "אשראי ואג״ח",
  okev_madadei_menayot: "עוקב מדדי מניות",
  meshulav_sachir: "משולב סחיר",
  menayot_sachir: "מניות סחיר",
  agach_sachir: "אג״ח סחיר",
  clali: "כללי",
  yaad_2030: "יעד 2030",
  yaad_2035: "יעד 2035",
  yaad_2040: "יעד 2040",
  yaad_2045: "יעד 2045",
  yaad_2050: "יעד 2050",
  yaad_2055: "יעד 2055",
  yaad_2060: "יעד 2060",
  yaad_2065: "יעד 2065",
  mekablei_kitzba: "מקבלי קצבה",
  hilchati_lemekablei_kitzba: "הלכתי למקבלי קצבה",
  pensionerim: "פנסיונרים",
  zakaim_kayamim: "זכאים קיימים",
  kayamut: "קיימות",
  kaspi_shkali: "כספי שקלי",
  okev_madadei_agach: "עוקב מדדי אג״ח",
  agach_memshalot: "אג״ח ממשלות",
  okev_madadim_lemekablei_kitzba: "עוקב מדדים למקבלי קצבה",
  sharia: "שריעה",
  ashrai_veagach_ad25_menayot: "אשראי ואג״ח עד 25% מניות",
  clali_ad500m: "כללי עד 500 מיליון",
  okev_madadim_ad25_menayot: "עוקב מדדים עד 25% מניות",
  ad25_menayot: "עד 25% מניות",
  agach_sachir_ad25_menayot: "אג״ח סחיר עד 25% מניות",
  nihul_ishi: "ניהול אישי",
  agrresivi: "אגרסיבי",
  agach_memshalti_sachir: "אג״ח ממשלתי סחיר",
  okev_madadim_agach_ad25_menayot: "עוקב מדדים אג״ח עד 25% מניות",
  menayot_chul: "מניות חו״ל",
  chul: "חו״ל",
  agach_chul: "אג״ח חו״ל",
  bnei_50_umata: "בני 50 ומטה",
  bnei_50_ad_60: "בני 50 עד 60",
  bnei_60_umaala: "בני 60 ומעלה",
  tlui_gil: "מסלול השקעה תלוי גיל",
};

export const STATIC_TRACK_KEYS = Object.keys(FIELD_TRANSLATIONS);

export const AVAILABLE_CHANGE_FIELDS = Object.keys(FIELD_TRANSLATIONS);

export const getFieldLabel = (key: string): string => {
  return FIELD_TRANSLATIONS[key] || key;
};