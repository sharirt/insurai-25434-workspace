import { getFieldLabel } from "@/utils/fieldTranslations";

type TrackEntry = { customTranslation: string; trackCode: number };
type ProviderMap = Record<string, TrackEntry>;
type ProvidersByName = Record<string, ProviderMap>;

const altshullerShacham: ProviderMap = {
  "מניות": { customTranslation: "אלטשולר שחם השתלמות מניות", trackCode: 1377 },
  "עוקב מדד S&P500": { customTranslation: "אלטשולר שחם השתלמות עוקב מדד S&P 500", trackCode: 14862 },
  "הלכתי": { customTranslation: "אלטשולר שחם השתלמות הלכה", trackCode: 12256 },
  "עוקב מדדים גמיש": { customTranslation: "אלטשולר שחם השתלמות עוקב מדדים - גמיש", trackCode: 15028 },
  "אשראי ואג״ח": { customTranslation: "אלטשולר שחם השתלמות אשראי ואג״ח", trackCode: 1378 },
  "עוקב מדדי מניות": { customTranslation: "אלטשולר שחם השתלמות עוקב מדדי מניות", trackCode: 14863 },
  "משולב סחיר": { customTranslation: "אלטשולר שחם השתלמות משולב סחיר", trackCode: 15458 },
  "כללי": { customTranslation: "אלטשולר שחם השתלמות כללי", trackCode: 1093 },
  "כספי שקלי": { customTranslation: "אלטשולר שחם השתלמות כספי (שקלי)", trackCode: 1398 },
  "אג״ח ממשלות": { customTranslation: "אלטשולר שחם השתלמות אג״ח ממשלות", trackCode: 1399 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "אלטשולר שחם השתלמות אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 558 },
};

const haphoenix: ProviderMap = {
  "מניות": { customTranslation: "הפניקס השתלמות מניות", trackCode: 968 },
  "עוקב מדד S&P500": { customTranslation: "הפניקס השתלמות עוקב מדד S&P 500", trackCode: 13264 },
  "הלכתי": { customTranslation: "הפניקס השתלמות הלכה", trackCode: 9528 },
  "עוקב מדדים גמיש": { customTranslation: "הפניקס השתלמות עוקב מדדים גמיש", trackCode: 8629 },
  "אשראי ואג״ח": { customTranslation: "הפניקס השתלמות אשראי ואג״ח", trackCode: 716 },
  "עוקב מדדי מניות": { customTranslation: "הפניקס השתלמות עוקב מדדי מניות", trackCode: 15007 },
  "משולב סחיר": { customTranslation: "הפניקס השתלמות משולב סחיר", trackCode: 15211 },
  "מניות סחיר": { customTranslation: "הפניקס השתלמות מניות סחיר", trackCode: 15232 },
  "אג״ח סחיר": { customTranslation: "הפניקס השתלמות אג״ח סחיר", trackCode: 15212 },
  "כללי": { customTranslation: "הפניקס השתלמות כללי", trackCode: 964 },
  "כספי שקלי": { customTranslation: "הפניקס השתלמות כספי (שקלי)", trackCode: 715 },
  "שריעה": { customTranslation: "הפניקס השתלמות שריעה", trackCode: 2058 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "הפניקס השתלמות אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 1100 },
};

const harel: ProviderMap = {
  "מניות": { customTranslation: "הראל השתלמות מסלול מניות", trackCode: 763 },
  "עוקב מדד S&P500": { customTranslation: "הראל השתלמות מסלול עוקב מדד S&P 500", trackCode: 13502 },
  "הלכתי": { customTranslation: "הראל השתלמות מסלול הלכה", trackCode: 1523 },
  "עוקב מדדים גמיש": { customTranslation: "הראל השתלמות מסלול עוקב מדדים - גמיש", trackCode: 15297 },
  "אשראי ואג״ח": { customTranslation: "הראל השתלמות מסלול אשראי ואג״ח", trackCode: 1485 },
  "עוקב מדדי מניות": { customTranslation: "הראל השתלמות מסלול עוקב מדדי מניות", trackCode: 15300 },
  "משולב סחיר": { customTranslation: "הראל השתלמות מסלול משולב סחיר", trackCode: 1034 },
  "מניות סחיר": { customTranslation: "הראל השתלמות מניות סחיר", trackCode: 15302 },
  "אג״ח סחיר": { customTranslation: "הראל השתלמות מסלול אג״ח סחיר", trackCode: 15301 },
  "כללי": { customTranslation: "הראל השתלמות מסלול כללי - מסלול ברירת המחדל", trackCode: 154 },
  "קיימות": { customTranslation: "הראל השתלמות מסלול קיימות", trackCode: 15296 },
  "כספי שקלי": { customTranslation: "הראל השתלמות מסלול כספי (שקלי)", trackCode: 14716 },
  "עוקב מדדי אג״ח": { customTranslation: "הראל השתלמות מסלול עוקב מדדי אג״ח", trackCode: 15298 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "הראל השתלמות מסלול אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 416 },
  "אג״ח סחיר עד 25% מניות": { customTranslation: "הראל השתלמות מסלול סחיר - אג״ח עם מניות (עד 25% מניות)", trackCode: 15303 },
  "עוקב מדדים אג״ח עד 25% מניות": { customTranslation: "הראל השתלמות מסלול עוקב מדדים - אג״ח עם מניות (עד 25% מניות)", trackCode: 15299 },
};

const yalinLapidot: ProviderMap = {
  "מניות": { customTranslation: "ילין לפידות קרן השתלמות מסלול מניות", trackCode: 8563 },
  "עוקב מדד S&P500": { customTranslation: "ילין לפידות קרן השתלמות מסלול עוקב מדד S&P 500", trackCode: 14849 },
  "עוקב מדדים גמיש": { customTranslation: "ילין לפידות קרן השתלמות מסלול עוקב מדדים גמיש", trackCode: 14657 },
  "אשראי ואג״ח": { customTranslation: "ילין לפידות קרן השתלמות מסלול אשראי ואג״ח", trackCode: 1319 },
  "מניות סחיר": { customTranslation: "ילין לפידות קרן השתלמות מסלול מניות סחיר", trackCode: 15714 },
  "כללי": { customTranslation: "ילין לפידות קרן השתלמות מסלול כללי", trackCode: 1162 },
  "אג״ח ממשלות": { customTranslation: "ילין לפידות קרן השתלמות מסלול אג״ח ממשלות", trackCode: 1361 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "ילין לפידות קרן השתלמות מסלול אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 1038 },
};

const clal: ProviderMap = {
  "מניות": { customTranslation: "כלל השתלמות מניות", trackCode: 1350 },
  "עוקב מדד S&P500": { customTranslation: "כלל השתלמות עוקב מדד S&P 500", trackCode: 13342 },
  "הלכתי": { customTranslation: "כלל השתלמות הלכה", trackCode: 1534 },
  "עוקב מדדים גמיש": { customTranslation: "כלל השתלמות עוקב מדדים גמיש", trackCode: 14680 },
  "אשראי ואג״ח": { customTranslation: "כלל השתלמות אשראי ואג״ח", trackCode: 1348 },
  "עוקב מדדי מניות": { customTranslation: "כלל השתלמות עוקב מדדי מניות", trackCode: 14790 },
  "משולב סחיר": { customTranslation: "כלל השתלמות משולב סחיר", trackCode: 15426 },
  "מניות סחיר": { customTranslation: "כלל השתלמות מניות סחיר", trackCode: 15424 },
  "אג״ח סחיר": { customTranslation: "כלל השתלמות אג״ח סחיר", trackCode: 15425 },
  "כללי": { customTranslation: "כלל השתלמות כללי", trackCode: 456 },
  "כספי שקלי": { customTranslation: "כלל השתלמות כספי (שקלי)", trackCode: 1351 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "כלל השתלמות אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 12599 },
};

const mor: ProviderMap = {
  "מניות": { customTranslation: "מור השתלמות - מניות", trackCode: 12536 },
  "עוקב מדד S&P500": { customTranslation: "מור השתלמות - עוקב מדד S&P500", trackCode: 9451 },
  "עוקב מדדים גמיש": { customTranslation: "מור השתלמות - עוקב מדדים גמיש", trackCode: 15239 },
  "אשראי ואג״ח": { customTranslation: "מור השתלמות - אשראי ואג״ח", trackCode: 14483 },
  "עוקב מדדי מניות": { customTranslation: "מור השתלמות - עוקב מדדי מניות", trackCode: 15241 },
  "משולב סחיר": { customTranslation: "מור השתלמות - משולב סחיר", trackCode: 15235 },
  "מניות סחיר": { customTranslation: "מור השתלמות - מניות סחיר", trackCode: 15238 },
  "אג״ח סחיר": { customTranslation: "מור השתלמות - אג״ח סחיר", trackCode: 15237 },
  "כללי": { customTranslation: "מור השתלמות - כללי", trackCode: 12535 },
  "כספי שקלי": { customTranslation: "מור השתלמות - כספי (שקלי)", trackCode: 8705 },
  "עוקב מדדי אג״ח": { customTranslation: "מור השתלמות - עוקב מדדי אג״ח", trackCode: 15242 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "מור השתלמות - אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 12956 },
  "אג״ח סחיר עד 25% מניות": { customTranslation: "מור השתלמות - אג״ח עם מניות (עד 25% מניות) סחיר", trackCode: 15236 },
  "עוקב מדדים אג״ח עד 25% מניות": { customTranslation: "מור השתלמות - עוקב מדדים אג״ח עם מניות (עד 25% מניות)", trackCode: 15240 },
};

const meitav: ProviderMap = {
  "מניות": { customTranslation: "מיטב השתלמות מניות", trackCode: 883 },
  "עוקב מדד S&P500": { customTranslation: "S&P500", trackCode: 13245 },
  "הלכתי": { customTranslation: "מיטב השתלמות הלכה", trackCode: 768 },
  "עוקב מדדים גמיש": { customTranslation: "מיטב השתלמות עוקב מדדים גמיש", trackCode: 481 },
  "אשראי ואג״ח": { customTranslation: "מיטב השתלמות אשראי ואג״ח", trackCode: 1240 },
  "עוקב מדדי מניות": { customTranslation: "מיטב השתלמות עוקב מדדי מניות", trackCode: 15356 },
  "משולב סחיר": { customTranslation: "מיטב השתלמות משולב סחיר", trackCode: 15355 },
  "מניות סחיר": { customTranslation: "מיטב השתלמות מניות סחיר", trackCode: 15352 },
  "אג״ח סחיר": { customTranslation: "מיטב השתלמות אג״ח סחיר", trackCode: 15353 },
  "כללי": { customTranslation: "מיטב השתלמות כללי", trackCode: 880 },
  "קיימות": { customTranslation: "מיטב השתלמות קיימות", trackCode: 15358 },
  "כספי שקלי": { customTranslation: "מיטב השתלמות כספי (שיקלי)", trackCode: 1370 },
  "אג״ח ממשלות": { customTranslation: "מיטב השתלמות אג״ח ממשלתי", trackCode: 1387 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "מיטב השתלמות אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 8885 },
  "אג״ח סחיר עד 25% מניות": { customTranslation: "מיטב השתלמות סחיר - אג״ח עם מניות (עד 25% מניות)", trackCode: 15354 },
  "עוקב מדדים אג״ח עד 25% מניות": { customTranslation: "מיטב השתלמות עוקב מדדי אג״ח עם מניות (עד 25% מניות)", trackCode: 15357 },
};

const menora: ProviderMap = {
  "מניות": { customTranslation: "מסלול מניות", trackCode: 1256 },
  "עוקב מדד S&P500": { customTranslation: "מסלול עוקב מדד S&P 500", trackCode: 13873 },
  "הלכתי": { customTranslation: "מסלול הלכה", trackCode: 13869 },
  "עוקב מדדים גמיש": { customTranslation: "מסלול עוקב מדדים גמיש", trackCode: 11408 },
  "אשראי ואג״ח": { customTranslation: "מסלול אשראי ואג״ח", trackCode: 13357 },
  "עוקב מדדי מניות": { customTranslation: "מסלול עוקב מדדי מניות", trackCode: 14676 },
  "משולב סחיר": { customTranslation: "מסלול משולב סחיר", trackCode: 15466 },
  "מניות סחיר": { customTranslation: "מסלול מניות סחיר", trackCode: 1409 },
  "כללי": { customTranslation: "מסלול כללי", trackCode: 828 },
  "כספי שקלי": { customTranslation: "מסלול כספי (שקלי)", trackCode: 1114 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "מסלול אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 9662 },
  "עוקב מדדים אג״ח עד 25% מניות": { customTranslation: "מסלול עוקב מדדים - אג״ח עם מניות (עד 25% מניות)", trackCode: 11409 },
};

const katzak: ProviderMap = {
  "מניות": { customTranslation: "קצ״ק מסלול מניות", trackCode: 1411 },
  "עוקב מדד S&P500": { customTranslation: "קצ״ק מסלול עוקב מדד S&P 500", trackCode: 13649 },
  "עוקב מדדים גמיש": { customTranslation: "קצ״ק מסלול עוקב מדדים גמיש", trackCode: 15307 },
  "אשראי ואג״ח": { customTranslation: "קצ״ק מסלול אשראי ואג״ח", trackCode: 1410 },
  "עוקב מדדי מניות": { customTranslation: "קצ״ק מסלול עוקב מדדי מניות", trackCode: 15308 },
  "משולב סחיר": { customTranslation: "קצ״ק מסלול משולב סחיר", trackCode: 15306 },
  "מניות סחיר": { customTranslation: "קצ״ק מסלול מניות סחיר", trackCode: 15305 },
  "כללי": { customTranslation: "קצ״ק מסלול כללי - מסלול ברירת המחדל", trackCode: 438 },
  "קיימות": { customTranslation: "קצ״ק מסלול קיימות", trackCode: 14274 },
  "כספי שקלי": { customTranslation: "קצ״ק מסלול כספי (שקלי)", trackCode: 15304 },
};

const sharedProviders: ProvidersByName = {
  "אלטשולר שחם": altshullerShacham,
  "הפניקס": haphoenix,
  "הראל": harel,
  "ילין לפידות": yalinLapidot,
  "כלל": clal,
  "מור": mor,
  "מיטב": meitav,
  "מנורה": menora,
  "קרן החסכון לצבא הקבע": katzak,
};

export const TRACK_CUSTOM_TRANSLATIONS: Record<string, Record<string, Record<string, TrackEntry>>> = {
  "פתיחת קרן השתלמות": sharedProviders,
  "ניוד קרן השתלמות": sharedProviders,
  "שינוי מסלול קרן השתלמות": sharedProviders,
};

export const getCustomTrackLabel = (
  requestTypeName: string,
  providerName: string,
  trackKey: string
): string => {
  const defaultTranslation = getFieldLabel(trackKey);
  const entry =
    TRACK_CUSTOM_TRANSLATIONS[requestTypeName]?.[providerName]?.[defaultTranslation];
  if (entry) {
    return `${entry.customTranslation} - ${entry.trackCode}`;
  }
  return defaultTranslation;
};