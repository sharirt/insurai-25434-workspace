import { getFieldLabel } from "@/utils/fieldTranslations";

type TrackEntry = { customTranslation: string; trackCode: number };
type ProviderMap = Record<string, TrackEntry>;
type ProvidersByName = Record<string, ProviderMap>;

// =============================================
// קופת גמל providers
// =============================================

const gemelAltshullerShacham: ProviderMap = {
  "מניות": { customTranslation: "אלטשולר שחם גמל מניות", trackCode: 1375 },
  "מניות סחיר": { customTranslation: "אלטשולר שחם גמל מניות סחיר", trackCode: 15540 },
  "עוקב מדד S&P500": { customTranslation: "אלטשולר שחם גמל עוקב מדד S&P 500", trackCode: 14860 },
  "הלכתי": { customTranslation: "אלטשולר שחם גמל הלכה", trackCode: 2017 },
  "עוקב מדדים גמיש": { customTranslation: "אלטשולר שחם גמל עוקב מדדים - גמיש", trackCode: 14354 },
  "אשראי ואג״ח": { customTranslation: "אלטשולר שחם גמל אשראי ואג״ח", trackCode: 1376 },
  "עוקב מדדי מניות": { customTranslation: "אלטשולר שחם גמל עוקב מדדי מניות", trackCode: 989 },
  "משולב סחיר": { customTranslation: "אלטשולר שחם גמל משולב סחיר", trackCode: 14353 },
  "כללי": { customTranslation: "אלטשולר שחם גמל כללי", trackCode: 1085 },
  "כספי שקלי": { customTranslation: "אלטשולר שחם גמל כספי (שקלי)", trackCode: 1394 },
  "אג״ח ממשלות": { customTranslation: "אלטשולר שחם גמל אג״ח ממשלות", trackCode: 1395 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "אלטשולר שחם גמל אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 558 },
  "בני 50 ומטה": { customTranslation: "אלטשולר שחם גמל לבני 50 ומטה", trackCode: 9950 },
  "בני 50 עד 60": { customTranslation: "אלטשולר שחם גמל לבני 50 עד 60", trackCode: 9951 },
  "בני 60 ומעלה": { customTranslation: "אלטשולר שחם גמל לבני 60 ומעלה", trackCode: 9952 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מסלול השקעות משתנה ומותאם לפי גיל העמית", trackCode: 0 },
};

const gemelHaphoenix: ProviderMap = {
  "מניות": { customTranslation: "הפניקס גמל מניות", trackCode: 965 },
  "עוקב מדד S&P500": { customTranslation: "הפניקס גמל עוקב מדד S&P 500", trackCode: 13263 },
  "הלכתי": { customTranslation: "הפניקס גמל הלכה", trackCode: 9527 },
  "עוקב מדדים גמיש": { customTranslation: "הפניקס גמל עוקב מדדים גמיש", trackCode: 15234 },
  "אשראי ואג״ח": { customTranslation: "הפניקס גמל אשראי ואג״ח", trackCode: 714 },
  "עוקב מדדי מניות": { customTranslation: "הפניקס גמל עוקב מדדי מניות", trackCode: 15210 },
  "משולב סחיר": { customTranslation: "הפניקס גמל משולב סחיר", trackCode: 14281 },
  "מניות סחיר": { customTranslation: "הפניקס גמל מניות סחיר", trackCode: 15209 },
  "אג״ח סחיר": { customTranslation: "הפניקס גמל אג״ח סחיר", trackCode: 15208 },
  "כללי": { customTranslation: "הפניקס גמל כללי", trackCode: 961 },
  "כספי שקלי": { customTranslation: "הפניקס גמל כספי (שקלי)", trackCode: 9906 },
  "שריעה": { customTranslation: "הפניקס גמל שריעה", trackCode: 2049 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "הפניקס גמל אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 1100 },
  "בני 50 ומטה": { customTranslation: "הפניקס גמל לבני 50 ומטה", trackCode: 9916 },
  "בני 50 עד 60": { customTranslation: "הפניקס גמל לבני 50 עד 60", trackCode: 9529 },
  "בני 60 ומעלה": { customTranslation: "הפניקס גמל לבני 60 ומעלה", trackCode: 401 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מסלול השקעות משתנה ומותאם לפי גיל העמית", trackCode: 0 },
};

const gemelHarel: ProviderMap = {
  "מניות": { customTranslation: "הראל גמל מסלול מניות", trackCode: 761 },
  "עוקב מדד S&P500": { customTranslation: "הראל גמל מסלול עוקב מדד S&P 500", trackCode: 13501 },
  "הלכתי": { customTranslation: "הראל גמל מסלול הלכה", trackCode: 1524 },
  "עוקב מדדים גמיש": { customTranslation: "הראל גמל מסלול עוקב מדדים - גמיש", trackCode: 14201 },
  "אשראי ואג״ח": { customTranslation: "הראל גמל מסלול אשראי ואג״ח", trackCode: 1335 },
  "עוקב מדדי מניות": { customTranslation: "הראל גמל מסלול עוקב מדדי מניות", trackCode: 15293 },
  "משולב סחיר": { customTranslation: "הראל גמל מסלול משולב סחיר", trackCode: 14202 },
  "מניות סחיר": { customTranslation: "הראל גמל מניות סחיר", trackCode: 15295 },
  "אג״ח סחיר": { customTranslation: "הראל גמל מסלול אג״ח סחיר", trackCode: 15294 },
  "קיימות": { customTranslation: "הראל גמל מסלול קיימות", trackCode: 15291 },
  "כספי שקלי": { customTranslation: "הראל גמל מסלול כספי (שקלי)", trackCode: 1334 },
  "עוקב מדדי אג״ח": { customTranslation: "הראל גמל מסלול עוקב מדדי אג״ח", trackCode: 15292 },
  "בני 50 ומטה": { customTranslation: "מסלול לבני 50 ומטה", trackCode: 9744 },
  "בני 50 עד 60": { customTranslation: "מסלול לבני 50 עד 60", trackCode: 9742 },
  "בני 60 ומעלה": { customTranslation: "מסלול לבני 60 ומעלה", trackCode: 9745 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מודל השקעתך תלוי גיל", trackCode: 0 },
};

const gemelYalinLapidot: ProviderMap = {
  "מניות": { customTranslation: "ילין לפידות גמל מסלול מניות", trackCode: 8487 },
  "עוקב מדד S&P500": { customTranslation: "ילין לפידות גמל מסלול עוקב מדד S&P 500", trackCode: 15419 },
  "עוקב מדדים גמיש": { customTranslation: "ילין לפידות גמל מסלול עוקב מדדים גמיש", trackCode: 14293 },
  "אשראי ואג״ח": { customTranslation: "ילין לפידות גמל מסלול אשראי ואג״ח", trackCode: 1037 },
  "כללי": { customTranslation: "ילין לפידות גמל מסלול כללי", trackCode: 1160 },
  "אג״ח ממשלות": { customTranslation: "ילין לפידות גמל מסלול אג״ח ממשלות", trackCode: 1360 },
  "בני 50 ומטה": { customTranslation: "ילין לפידות קופת גמל מסלול לבני 50 ומטה", trackCode: 9939 },
  "בני 50 עד 60": { customTranslation: "ילין לפידות קופת גמל מסלול לבני 50 עד 60", trackCode: 9940 },
  "בני 60 ומעלה": { customTranslation: "ילין לפידות קופת גמל מסלול לבני 60 ומעלה", trackCode: 9941 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מסלול השקעות משתנה ומותאם לפי גיל העמית", trackCode: 0 },
};

const gemelClal: ProviderMap = {
  "מניות": { customTranslation: "כלל גמל מניות", trackCode: 1346 },
  "עוקב מדד S&P500": { customTranslation: "מסלול כלל תמר עוקב מדד S&P 500", trackCode: 13343 },
  "הלכתי": { customTranslation: "מסלול כלל תמר הלכה", trackCode: 1533 },
  "עוקב מדדים גמיש": { customTranslation: "מסלול כלל תמר עוקב מדדים גמיש", trackCode: 14237 },
  "אשראי ואג״ח": { customTranslation: "מסלול כלל תמר אשראי ואג״ח", trackCode: 117 },
  "עוקב מדדי מניות": { customTranslation: "מסלול כלל תמר עוקב מדדי מניות", trackCode: 15093 },
  "מניות סחיר": { customTranslation: "מסלול כלל תמר מניות סחיר", trackCode: 15430 },
  "אג״ח סחיר": { customTranslation: "מסלול כלל תמר אג״ח סחיר", trackCode: 15431 },
  "כללי": { customTranslation: "כלל גמל כללי", trackCode: 448 },
  "כספי שקלי": { customTranslation: "מסלול כלל תמר כספי (שקלי)", trackCode: 128 },
  "בני 50 ומטה": { customTranslation: "מסלול לבני 50 ומטה", trackCode: 9651 },
  "בני 50 עד 60": { customTranslation: "מסלול לבני 50 עד 60", trackCode: 9652 },
  "בני 60 ומעלה": { customTranslation: "מסלול לבני 60 ומעלה", trackCode: 9653 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מסלול השקעות משתנה ומותאם לפי גיל העמית", trackCode: 0 },
};

const gemelMor: ProviderMap = {
  "מניות": { customTranslation: "אלפא מור תגמולים - מניות", trackCode: 12531 },
  "עוקב מדד S&P500": { customTranslation: "אלפא מור תגמולים - עוקב מדד S&P500", trackCode: 9452 },
  "עוקב מדדים גמיש": { customTranslation: "אלפא מור תגמולים - עוקב מדדים גמיש", trackCode: 14394 },
  "אשראי ואג״ח": { customTranslation: "אלפא מור תגמולים - אשראי ואג״ח", trackCode: 14481 },
  "עוקב מדדי מניות": { customTranslation: "אלפא מור תגמולים - עוקב מדדי מניות", trackCode: 15249 },
  "משולב סחיר": { customTranslation: "אלפא מור תגמולים - משולב סחיר", trackCode: 14342 },
  "מניות סחיר": { customTranslation: "אלפא מור תגמולים - מניות סחיר", trackCode: 15247 },
  "אג״ח סחיר": { customTranslation: "אלפא מור תגמולים - אג״ח סחיר", trackCode: 15248 },
  "כספי שקלי": { customTranslation: "אלפא מור תגמולים - כספי (שקלי)", trackCode: 8699 },
  "עוקב מדדי אג״ח": { customTranslation: "אלפא מור תגמולים - עוקב מדדי אג״ח", trackCode: 15250 },
  "בני 50 ומטה": { customTranslation: "אלפא מור תגמולים - לבני 50 ומטה", trackCode: 12532 },
  "בני 50 עד 60": { customTranslation: "אלפא מור תגמולים - לבני 50 עד 60", trackCode: 12533 },
  "בני 60 ומעלה": { customTranslation: "אלפא מור תגמולים - לבני 60 ומעלה", trackCode: 12534 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מסלול השקעות משתנה ומותאם לפי גיל העמית", trackCode: 0 },
};

const gemelMeitav: ProviderMap = {
  "מניות": { customTranslation: "מיטב גמל מניות", trackCode: 877 },
  "עוקב מדד S&P500": { customTranslation: "מיטב גמל עוקב מדד S&P 500", trackCode: 13246 },
  "הלכתי": { customTranslation: "מיטב גמל הלכה", trackCode: 765 },
  "עוקב מדדים גמיש": { customTranslation: "מיטב גמל עוקב מדדים גמיש", trackCode: 14265 },
  "אשראי ואג״ח": { customTranslation: "מיטב גמל אשראי ואג״ח", trackCode: 223 },
  "עוקב מדדי מניות": { customTranslation: "מיטב גמל עוקב מדדי מניות", trackCode: 1689 },
  "משולב סחיר": { customTranslation: "מיטב גמל משולב סחיר", trackCode: 14264 },
  "מניות סחיר": { customTranslation: "מיטב גמל מניות סחיר", trackCode: 15345 },
  "אג״ח סחיר": { customTranslation: "מיטב גמל אג״ח סחיר", trackCode: 15344 },
  "כללי": { customTranslation: "מיטב גמל כללי", trackCode: 872 },
  "קיימות": { customTranslation: "מיטב גמל קיימות", trackCode: 15346 },
  "כספי שקלי": { customTranslation: "מיטב גמל כספי (שקלי)", trackCode: 876 },
  "עוקב מדדי אג״ח": { customTranslation: "מיטב גמל עוקב מדדי אג״ח", trackCode: 1692 },
  "אג״ח ממשלות": { customTranslation: "מיטב גמל אג״ח ממשלתי", trackCode: 1386 },
  "בני 50 ומטה": { customTranslation: "מיטב גמל לבני 50 ומטה", trackCode: 7215 },
  "בני 50 עד 60": { customTranslation: "מיטב גמל לבני 50 עד 60", trackCode: 103 },
  "בני 60 ומעלה": { customTranslation: "מיטב גמל לבני 60 ומעלה", trackCode: 551 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מסלול השקעות משתנה ומותאם לפי גיל העמית", trackCode: 0 },
};

const gemelMenora: ProviderMap = {
  "מניות": { customTranslation: "מסלול מניות", trackCode: 1364 },
  "עוקב מדד S&P500": { customTranslation: "מסלול עוקב מדד S&P 500", trackCode: 13946 },
  "הלכתי": { customTranslation: "מסלול הלכה", trackCode: 13867 },
  "עוקב מדדים גמיש": { customTranslation: "מסלול עוקב מדדים גמיש", trackCode: 14272 },
  "אשראי ואג״ח": { customTranslation: "מסלול אשראי ואג״ח", trackCode: 13355 },
  "עוקב מדדי מניות": { customTranslation: "מסלול עוקב מדדי מניות", trackCode: 13356 },
  "משולב סחיר": { customTranslation: "מסלול משולב סחיר", trackCode: 14271 },
  "מניות סחיר": { customTranslation: "מסלול מניות סחיר", trackCode: 15725 },
  "כללי": { customTranslation: "מסלול כללי", trackCode: 826 },
  "כספי שקלי": { customTranslation: "מסלול כספי (שקלי)", trackCode: 1343 },
  "עוקב מדדי אג״ח": { customTranslation: "מסלול עוקב מדדי אג״ח", trackCode: 14679 },
  "בני 50 ומטה": { customTranslation: "מסלול לבני 50 ומטה", trackCode: 9793 },
  "בני 50 עד 60": { customTranslation: "מסלול לבני 50-60", trackCode: 9792 },
  "בני 60 ומעלה": { customTranslation: "מסלול לבני 60 ומעלה", trackCode: 9794 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מסלול השקעות משתנה ומותאם לפי גיל העמית", trackCode: 0 },
  "קיימות": { customTranslation: "מסלול קיימות", trackCode: 14351 },
};

const gemelMigdal: ProviderMap = {
  "מניות": { customTranslation: "מניות", trackCode: 863 },
  "עוקב מדד S&P500": { customTranslation: "עוקב מדד S&P 500", trackCode: 13565 },
  "הלכתי": { customTranslation: "הלכה", trackCode: 15452 },
  "עוקב מדדים גמיש": { customTranslation: "עוקב מדדים - גמיש", trackCode: 14228 },
  "אשראי ואג״ח": { customTranslation: "אשראי ואג״ח", trackCode: 8012 },
  "עוקב מדדי מניות": { customTranslation: "עוקב מדדי מניות", trackCode: 15055 },
  "משולב סחיר": { customTranslation: "משולב סחיר", trackCode: 14229 },
  "מניות סחיר": { customTranslation: "מניות סחיר", trackCode: 15453 },
  "כספי שקלי": { customTranslation: "כספי (שקלי)", trackCode: 858 },
  "עוקב מדדי אג״ח": { customTranslation: "עוקב מדדי אג״ח", trackCode: 15454 },
  "אג״ח ממשלות": { customTranslation: "אג״ח ממשלתי", trackCode: 859 },
  "בני 50 ומטה": { customTranslation: "לבני 50 ומטה - מסלול מתמחה ללא מעבר אוטומטי לגיל הבא אחריו", trackCode: 9779 },
  "בני 50 עד 60": { customTranslation: "לבני 50 עד 60 - מסלול מתמחה ללא מעבר אוטומטי לגיל הבא אחריו", trackCode: 9780 },
  "בני 60 ומעלה": { customTranslation: "לבני 60 ומעלה", trackCode: 9781 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מסלול השקעות משתנה ומותאם לפי גיל העמית", trackCode: 0 },
};

const gemelKatzak: ProviderMap = {
  "מניות": { customTranslation: "קצ״ק מסלול מניות", trackCode: 2248 },
  "עוקב מדד S&P500": { customTranslation: "קצ״ק מסלול עוקב מדד S&P 500", trackCode: 13647 },
  "עוקב מדדים גמיש": { customTranslation: "קצ״ק מסלול עוקב מדדים גמיש", trackCode: 15315 },
  "אשראי ואג״ח": { customTranslation: "קצ״ק מסלול אשראי ואג״ח", trackCode: 2247 },
  "עוקב מדדי מניות": { customTranslation: "קצ״ק מסלול עוקב מדדי מניות", trackCode: 15316 },
  "משולב סחיר": { customTranslation: "קצ״ק מסלול משולב סחיר", trackCode: 15314 },
  "מניות סחיר": { customTranslation: "קצ״ק מסלול מניות סחיר", trackCode: 15313 },
  "כללי": { customTranslation: "קצ״ק מסלול כללי - מסלול ברירת המחדל", trackCode: 432 },
  "קיימות": { customTranslation: "קצ״ק מסלול קיימות", trackCode: 14272 },
  "כספי שקלי": { customTranslation: "קצ״ק מסלול כספי (שקלי)", trackCode: 15312 },
};

const gemelProviders: ProvidersByName = {
  "אלטשולר שחם": gemelAltshullerShacham,
  "הפניקס": gemelHaphoenix,
  "הראל": gemelHarel,
  "ילין לפידות": gemelYalinLapidot,
  "כלל": gemelClal,
  "מור": gemelMor,
  "מיטב": gemelMeitav,
  "מנורה": gemelMenora,
  "מגדל": gemelMigdal,
  "קרן החסכון לצבא הקבע": gemelKatzak,
};

// =============================================
// קופת גמל להשקעה providers
// =============================================

const gemelLeHashkaaAltshullerShacham: ProviderMap = {
  "מניות": { customTranslation: "אלטשולר שחם חיסכון פלוס מניות", trackCode: 7799 },
  "עוקב מדד S&P500": { customTranslation: "אלטשולר שחם חיסכון פלוס עוקב מדד S&P 500", trackCode: 14865 },
  "הלכתי": { customTranslation: "אלטשולר שחם חיסכון פלוס הלכה", trackCode: 12257 },
  "עוקב מדדים גמיש": { customTranslation: "אלטשולר שחם חיסכון פלוס עוקב מדדים - גמיש", trackCode: 15315 },
  "אשראי ואג״ח": { customTranslation: "אלטשולר שחם חיסכון פלוס אשראי ואג״ח", trackCode: 7801 },
  "עוקב מדדי מניות": { customTranslation: "אלטשולר שחם חיסכון פלוס עוקב מדדי מניות", trackCode: 14864 },
  "משולב סחיר": { customTranslation: "אלטשולר שחם חיסכון פלוס משולב סחיר", trackCode: 15541 },
  "כללי": { customTranslation: "אלטשולר שחם חיסכון פלוס כללי", trackCode: 7798 },
  "כספי שקלי": { customTranslation: "אלטשולר שחם חיסכון פלוס כספי (שקלי)", trackCode: 7802 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "אלטשולר שחם חיסכון פלוס אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 7800 },
};

const gemelLeHashkaaHaphoenix: ProviderMap = {
  "מניות": { customTranslation: "הפניקס גמל להשקעה מניות", trackCode: 7975 },
  "עוקב מדד S&P500": { customTranslation: "הפניקס גמל להשקעה עוקב מדד S&P 500", trackCode: 13250 },
  "עוקב מדדים גמיש": { customTranslation: "הפניקס גמל להשקעה עוקב מדדים גמיש", trackCode: 7909 },
  "אשראי ואג״ח": { customTranslation: "הפניקס גמל להשקעה אשראי ואג״ח", trackCode: 7905 },
  "משולב סחיר": { customTranslation: "הפניקס גמל להשקעה משולב סחיר", trackCode: 15214 },
  "מניות סחיר": { customTranslation: "הפניקס גמל להשקעה מניות סחיר", trackCode: 15233 },
  "אג״ח סחיר": { customTranslation: "הפניקס גמל להשקעה אג״ח סחיר", trackCode: 15215 },
  "כללי": { customTranslation: "הפניקס גמל להשקעה כללי", trackCode: 7908 },
  "כספי שקלי": { customTranslation: "הפניקס גמל להשקעה כספי (שקלי)", trackCode: 13209 },
  "שריעה": { customTranslation: "הפניקס גמל להשקעה שריעה", trackCode: 8004 },
  "עוקב מדדי אג״ח": { customTranslation: "הפניקס גמל להשקעה עוקב מדדי אג״ח", trackCode: 7907 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "הפניקס גמל להשקעה אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 7906 },
};

const gemelLeHashkaaHarel: ProviderMap = {
  "מניות": { customTranslation: "הראל גמל להשקעה מסלול מניות", trackCode: 8522 },
  "עוקב מדד S&P500": { customTranslation: "הראל גמל להשקעה מסלול עוקב מדד S&P 500", trackCode: 13414 },
  "הלכתי": { customTranslation: "הראל גמל להשקעה מסלול הלכה", trackCode: 8523 },
  "עוקב מדדים גמיש": { customTranslation: "הראל גמל להשקעה מסלול עוקב מדדים - גמיש", trackCode: 15284 },
  "אשראי ואג״ח": { customTranslation: "הראל גמל להשקעה מסלול אשראי ואג״ח", trackCode: 15283 },
  "עוקב מדדי מניות": { customTranslation: "הראל גמל להשקעה מסלול עוקב מדדי מניות", trackCode: 15040 },
  "משולב סחיר": { customTranslation: "הראל גמל להשקעה מסלול משולב סחיר", trackCode: 15288 },
  "מניות סחיר": { customTranslation: "הראל גמל להשקעה מסלול מניות סחיר", trackCode: 15286 },
  "אג״ח סחיר": { customTranslation: "הראל גמל להשקעה מסלול אג״ח סחיר", trackCode: 15287 },
  "כללי": { customTranslation: "הראל גמל להשקעה מסלול כללי - מסלול ברירת מחדל", trackCode: 8211 },
  "קיימות": { customTranslation: "הראל גמל להשקעה מסלול קיימות", trackCode: 14206 },
  "כספי שקלי": { customTranslation: "הראל גמל להשקעה מסלול כספי (שקלי)", trackCode: 13254 },
  "עוקב מדדי אג״ח": { customTranslation: "הראל גמל להשקעה מסלול עוקב מדדי אג״ח", trackCode: 15285 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "הראל גמל להשקעה מסלול אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 8521 },
  "אג״ח סחיר עד 25% מניות": { customTranslation: "הראל גמל להשקעה מסלול אג״ח עם מניות סחיר (עד 25% מניות)", trackCode: 15289 },
  "עוקב מדדים אג״ח עד 25% מניות": { customTranslation: "הראל גמל להשקעה מסלול עוקב מדדים - אג״ח עם מניות (עד 25% מניות)", trackCode: 15290 },
};

const gemelLeHashkaaYalinLapidot: ProviderMap = {
  "מניות": { customTranslation: "ילין לפידות קופת גמל להשקעה מסלול מניות", trackCode: 11394 },
  "עוקב מדד S&P500": { customTranslation: "ילין לפידות קופת גמל להשקעה מסלול עוקב מדד S&P 500", trackCode: 15420 },
  "עוקב מדדים גמיש": { customTranslation: "ילין לפידות קופת גמל להשקעה מסלול עוקב מדדים גמיש", trackCode: 14658 },
  "אשראי ואג״ח": { customTranslation: "ילין לפידות קופת גמל להשקעה מסלול אשראי ואג״ח", trackCode: 11391 },
  "מניות סחיר": { customTranslation: "ילין לפידות קופת גמל להשקעה מסלול מניות סחיר", trackCode: 15715 },
  "כללי": { customTranslation: "ילין לפידות קופת גמל להשקעה מסלול כללי", trackCode: 11390 },
  "אג״ח ממשלות": { customTranslation: "ילין לפידות קופת גמל להשקעה מסלול אג״ח ממשלות", trackCode: 11393 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "ילין לפידות קופת גמל להשקעה מסלול אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 11392 },
};

const gemelLeHashkaaClal: ProviderMap = {
  "מניות": { customTranslation: "כלל גמל לעתיד מניות", trackCode: 7991 },
  "עוקב מדד S&P500": { customTranslation: "כלל גמל לעתיד עוקב מדד S&P 500", trackCode: 13344 },
  "הלכתי": { customTranslation: "כלל גמל לעתיד הלכה", trackCode: 7994 },
  "עוקב מדדים גמיש": { customTranslation: "כלל גמל לעתיד עוקב מדדים גמיש", trackCode: 14681 },
  "אשראי ואג״ח": { customTranslation: "כלל גמל לעתיד אשראי ואג״ח", trackCode: 7989 },
  "עוקב מדדי מניות": { customTranslation: "כלל גמל לעתיד עוקב מדדי מניות", trackCode: 14791 },
  "משולב סחיר": { customTranslation: "כלל גמל לעתיד משולב סחיר", trackCode: 15429 },
  "מניות סחיר": { customTranslation: "כלל גמל לעתיד מניות סחיר", trackCode: 15427 },
  "אג״ח סחיר": { customTranslation: "כלל גמל לעתיד אג״ח סחיר", trackCode: 15428 },
  "כללי": { customTranslation: "כלל גמל לעתיד כללי", trackCode: 7988 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "כלל גמל לעתיד אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 7992 },
};

const gemelLeHashkaaMor: ProviderMap = {
  "מניות": { customTranslation: "מור גמל להשקעה - מניות", trackCode: 12537 },
  "עוקב מדד S&P500": { customTranslation: "מור גמל להשקעה - עוקב מדד S&P500", trackCode: 7958 },
  "עוקב מדדים גמיש": { customTranslation: "מור גמל להשקעה - עוקב מדדים גמיש", trackCode: 15257 },
  "אשראי ואג״ח": { customTranslation: "מור גמל להשקעה - אשראי ואג״ח", trackCode: 14482 },
  "עוקב מדדי מניות": { customTranslation: "מור גמל להשקעה - עוקב מדדי מניות", trackCode: 15259 },
  "משולב סחיר": { customTranslation: "מור גמל להשקעה - משולב סחיר", trackCode: 15253 },
  "מניות סחיר": { customTranslation: "מור גמל להשקעה - מניות סחיר", trackCode: 15256 },
  "אג״ח סחיר": { customTranslation: "מור גמל להשקעה - אג״ח סחיר", trackCode: 15255 },
  "כללי": { customTranslation: "מור גמל להשקעה - כללי", trackCode: 12538 },
  "כספי שקלי": { customTranslation: "מור גמל להשקעה - כספי (שקלי)", trackCode: 7963 },
  "עוקב מדדי אג״ח": { customTranslation: "מור גמל להשקעה - עוקב מדדי אג״ח", trackCode: 15260 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "מור גמל להשקעה - אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 12955 },
  "אג״ח סחיר עד 25% מניות": { customTranslation: "מור גמל להשקעה - אג״ח עם מניות (עד 25% מניות) סחיר", trackCode: 15254 },
  "עוקב מדדים אג״ח עד 25% מניות": { customTranslation: "מור גמל להשקעה - עוקב מדדי אג״ח עם מניות (עד 25% מניות)", trackCode: 15258 },
};

const gemelLeHashkaaMeitav: ProviderMap = {
  "מניות": { customTranslation: "מיטב גמל להשקעה מניות", trackCode: 7860 },
  "עוקב מדד S&P500": { customTranslation: "מיטב גמל להשקעה עוקב מדד S&P500", trackCode: 13259 },
  "הלכתי": { customTranslation: "מיטב גמל להשקעה הלכה", trackCode: 7863 },
  "עוקב מדדים גמיש": { customTranslation: "מיטב גמל להשקעה עוקב מדדים גמיש", trackCode: 7979 },
  "אשראי ואג״ח": { customTranslation: "מיטב גמל להשקעה אשראי ואג״ח", trackCode: 7862 },
  "עוקב מדדי מניות": { customTranslation: "מיטב גמל להשקעה עוקב מדדי מניות", trackCode: 7867 },
  "משולב סחיר": { customTranslation: "מיטב גמל להשקעה משולב סחיר", trackCode: 15349 },
  "מניות סחיר": { customTranslation: "מיטב גמל להשקעה מניות סחיר", trackCode: 15350 },
  "אג״ח סחיר": { customTranslation: "מיטב גמל להשקעה אג״ח סחיר", trackCode: 15347 },
  "כללי": { customTranslation: "מיטב גמל להשקעה כללי", trackCode: 7978 },
  "קיימות": { customTranslation: "מיטב גמל להשקעה קיימות", trackCode: 14270 },
  "כספי שקלי": { customTranslation: "מיטב גמל להשקעה כספי (שיקלי)", trackCode: 7861 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "מיטב גמל להשקעה אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 7980 },
  "אג״ח סחיר עד 25% מניות": { customTranslation: "מיטב גמל להשקעה סחיר - אג״ח עם מניות (עד 25% מניות)", trackCode: 15348 },
  "עוקב מדדים אג״ח עד 25% מניות": { customTranslation: "מיטב גמל להשקעה עוקב מדדי אג״ח עם מניות (עד 25% מניות)", trackCode: 15351 },
};

const gemelLeHashkaaMenora: ProviderMap = {
  "מניות": { customTranslation: "מסלול מניות", trackCode: 15724 },
  "עוקב מדד S&P500": { customTranslation: "מסלול עוקב מדד S&P 500", trackCode: 13874 },
  "הלכתי": { customTranslation: "מסלול הלכה", trackCode: 8716 },
  "עוקב מדדים גמיש": { customTranslation: "מסלול עוקב מדדים גמיש", trackCode: 14678 },
  "אשראי ואג״ח": { customTranslation: "מסלול אשראי ואג״ח", trackCode: 13354 },
  "עוקב מדדי מניות": { customTranslation: "מסלול עוקב מדדי מניות", trackCode: 8683 },
  "משולב סחיר": { customTranslation: "מסלול משולב סחיר", trackCode: 15465 },
  "מניות סחיר": { customTranslation: "מסלול מניות סחיר", trackCode: 13353 },
  "כללי": { customTranslation: "מסלול כללי", trackCode: 8675 },
  "כספי שקלי": { customTranslation: "מסלול כספי (שקלי)", trackCode: 8693 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "מסלול אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 8678 },
  "עוקב מדדים אג״ח עד 25% מניות": { customTranslation: "מסלול עוקב מדדים - אג״ח עם מניות (עד 25% מניות)", trackCode: 8684 },
};

const gemelLeHashkaaMigdal: ProviderMap = {
  "מניות": { customTranslation: "מגדל גמל להשקעה - מניות", trackCode: 7934 },
  "עוקב מדד S&P500": { customTranslation: "מגדל גמל להשקעה - עוקב מדד S&P 500", trackCode: 13563 },
  "הלכתי": { customTranslation: "מגדל גמל להשקעה - הלכה", trackCode: 7937 },
  "עוקב מדדים גמיש": { customTranslation: "מגדל גמל להשקעה - עוקב מדדים גמיש", trackCode: 15341 },
  "אשראי ואג״ח": { customTranslation: "מגדל גמל להשקעה - אשראי ואג״ח", trackCode: 14944 },
  "עוקב מדדי מניות": { customTranslation: "מגדל גמל להשקעה - עוקב מדדי מניות", trackCode: 14943 },
  "משולב סחיר": { customTranslation: "מגדל גמל להשקעה - משולב סחיר", trackCode: 15455 },
  "מניות סחיר": { customTranslation: "מגדל גמל להשקעה - מניות סחיר", trackCode: 15456 },
  "כללי": { customTranslation: "מגדל גמל להשקעה - כללי", trackCode: 7936 },
  "כספי שקלי": { customTranslation: "מגדל גמל להשקעה - כספי (שקלי)", trackCode: 7931 },
  "עוקב מדדי אג״ח": { customTranslation: "מגדל גמל להשקעה - עוקב מדדי אג״ח", trackCode: 15457 },
  "אג״ח ממשלות": { customTranslation: "מגדל גמל להשקעה - אג״ח ממשלתי", trackCode: 7932 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "מגדל גמל להשקעה - אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 7935 },
};

const gemelLeHashkaaProviders: ProvidersByName = {
  "אלטשולר שחם": gemelLeHashkaaAltshullerShacham,
  "הפניקס": gemelLeHashkaaHaphoenix,
  "הראל": gemelLeHashkaaHarel,
  "ילין לפידות": gemelLeHashkaaYalinLapidot,
  "כלל": gemelLeHashkaaClal,
  "מור": gemelLeHashkaaMor,
  "מיטב": gemelLeHashkaaMeitav,
  "מנורה": gemelLeHashkaaMenora,
  "מגדל": gemelLeHashkaaMigdal,
};

// =============================================
// קרן השתלמות providers (existing - unchanged)
// =============================================

const hishtalmutAltshullerShacham: ProviderMap = {
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

const hishtalmutHaphoenix: ProviderMap = {
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

const hishtalmutHarel: ProviderMap = {
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

const hishtalmutYalinLapidot: ProviderMap = {
  "מניות": { customTranslation: "ילין לפידות קרן השתלמות מסלול מניות", trackCode: 8563 },
  "עוקב מדד S&P500": { customTranslation: "ילין לפידות קרן השתלמות מסלול עוקב מדד S&P 500", trackCode: 14849 },
  "עוקב מדדים גמיש": { customTranslation: "ילין לפידות קרן השתלמות מסלול עוקב מדדים גמיש", trackCode: 14657 },
  "אשראי ואג״ח": { customTranslation: "ילין לפידות קרן השתלמות מסלול אשראי ואג״ח", trackCode: 1319 },
  "מניות סחיר": { customTranslation: "ילין לפידות קרן השתלמות מסלול מניות סחיר", trackCode: 15714 },
  "כללי": { customTranslation: "ילין לפידות קרן השתלמות מסלול כללי", trackCode: 1162 },
  "אג״ח ממשלות": { customTranslation: "ילין לפידות קרן השתלמות מסלול אג״ח ממשלות", trackCode: 1361 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "ילין לפידות קרן השתלמות מסלול אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 1038 },
};

const hishtalmutClal: ProviderMap = {
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

const hishtalmutMor: ProviderMap = {
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

const hishtalmutMeitav: ProviderMap = {
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

const hishtalmutMenora: ProviderMap = {
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

const hishtalmutMigdal: ProviderMap = {
  "מניות": { customTranslation: "מגדל השתלמות מניות", trackCode: 869 },
  "עוקב מדד S&P500": { customTranslation: "מגדל השתלמות עוקב מדד S&P 500", trackCode: 14668 },
  "הלכתי": { customTranslation: "מגדל השתלמות הלכה", trackCode: 2048 },
  "עוקב מדדים גמיש": { customTranslation: "מגדל השתלמות עוקב מדדים - גמיש", trackCode: 7256 },
  "אשראי ואג״ח": { customTranslation: "מגדל השתלמות אשראי ואג״ח", trackCode: 199 },
  "עוקב מדדי מניות": { customTranslation: "מגדל השתלמות עוקב מדדי מניות", trackCode: 14945 },
  "משולב סחיר": { customTranslation: "מגדל השתלמות משולב סחיר", trackCode: 15448 },
  "מניות סחיר": { customTranslation: "מגדל השתלמות מניות סחיר", trackCode: 15449 },
  "כללי": { customTranslation: "מגדל השתלמות כללי", trackCode: 579 },
  "כספי שקלי": { customTranslation: "מגדל השתלמות כספי (שקלי)", trackCode: 864 },
  "עוקב מדדי אג״ח": { customTranslation: "מגדל השתלמות עוקב מדדי אג״ח", trackCode: 15450 },
  "אג״ח ממשלות": { customTranslation: "מגדל השתלמות אג״ח ממשלתי", trackCode: 865 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "מגדל השתלמות אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 15340 },
};

const hishtalmutKatzak: ProviderMap = {
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

const hishtalmutProviders: ProvidersByName = {
  "אלטשולר שחם": hishtalmutAltshullerShacham,
  "הפניקס": hishtalmutHaphoenix,
  "הראל": hishtalmutHarel,
  "ילין לפידות": hishtalmutYalinLapidot,
  "כלל": hishtalmutClal,
  "מור": hishtalmutMor,
  "מיטב": hishtalmutMeitav,
  "מנורה": hishtalmutMenora,
  "מגדל": hishtalmutMigdal,
  "קרן החסכון לצבא הקבע": hishtalmutKatzak,
};

// =============================================
// קרן פנסיה מקיפה providers
// =============================================

const pensiaAltshullerShacham: ProviderMap = {
  "מניות": { customTranslation: "אלטשולר שחם פנסיה מניות", trackCode: 14006 },
  "עוקב מדד S&P500": { customTranslation: "אלטשולר שחם פנסיה עוקב מדד S&P 500", trackCode: 14866 },
  "הלכתי": { customTranslation: "אלטשולר שחם פנסיה הלכה", trackCode: 14008 },
  "עוקב מדדים גמיש": { customTranslation: "אלטשולר שחם פנסיה עוקב מדדים - גמיש", trackCode: 15032 },
  "אשראי ואג״ח": { customTranslation: "אלטשולר שחם פנסיה אשראי ואג״ח", trackCode: 14007 },
  "עוקב מדדי מניות": { customTranslation: "אלטשולר שחם פנסיה עוקב מדדי מניות", trackCode: 14867 },
  "משולב סחיר": { customTranslation: "אלטשולר שחם פנסיה משולב סחיר", trackCode: 15462 },
  "מניות סחיר": { customTranslation: "אלטשולר שחם פנסיה מניות סחיר", trackCode: 15542 },
  "אג״ח סחיר": { customTranslation: "אלטשולר שחם פנסיה אג״ח סחיר", trackCode: 15541 },
  "כללי": { customTranslation: "אלטשולר שחם פנסיה כללי", trackCode: 14005 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מסלול השקעות משתנה ומותאם לפי גיל העמית", trackCode: 0 },
  "בני 50 ומטה": { customTranslation: "אלטשולר שחם פנסיה מקיפה לבני 50 ומטה", trackCode: 9757 },
  "בני 50 עד 60": { customTranslation: "אלטשולר שחם פנסיה מקיפה לבני 50 עד 60", trackCode: 9758 },
  "בני 60 ומעלה": { customTranslation: "אלטשולר שחם פנסיה מקיפה לבני 60 ומעלה", trackCode: 9759 },
};

const pensiaHaphoenix: ProviderMap = {
  "מניות": { customTranslation: "הפניקס פנסיה מניות", trackCode: 13920 },
  "עוקב מדד S&P500": { customTranslation: "הפניקס פנסיה עוקב מדד S&P 500", trackCode: 14198 },
  "הלכתי": { customTranslation: "הפניקס פנסיה הלכה", trackCode: 13928 },
  "עוקב מדדים גמיש": { customTranslation: "הפניקס פנסיה עוקב מדדים גמיש", trackCode: 13924 },
  "אשראי ואג״ח": { customTranslation: "הפניקס פנסיה אשראי ואג״ח", trackCode: 13922 },
  "עוקב מדדי מניות": { customTranslation: "הפניקס פנסיה עוקב מדדי מניות", trackCode: 15011 },
  "משולב סחיר": { customTranslation: "הפניקס פנסיה משולב סחיר", trackCode: 15215 },
  "מניות סחיר": { customTranslation: "הפניקס פנסיה מניות סחיר", trackCode: 15236 },
  "אג״ח סחיר": { customTranslation: "הפניקס פנסיה אג״ח סחיר", trackCode: 15216 },
  "כללי": { customTranslation: "הפניקס פנסיה כללי", trackCode: 13918 },
  "כספי שקלי": { customTranslation: "הפניקס פנסיה כספי (שקלי)", trackCode: 13934 },
  "שריעה": { customTranslation: "הפניקס פנסיה שריעה", trackCode: 13930 },
  "עוקב מדדי אג״ח": { customTranslation: "הפניקס פנסיה עוקב מדדי אג״ח", trackCode: 9979 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מסלול השקעות משתנה ומותאם לפי גיל העמית", trackCode: 0 },
  "בני 50 ומטה": { customTranslation: "הפניקס פנסיה מקיפה לבני 50 ומטה", trackCode: 9974 },
  "בני 50 עד 60": { customTranslation: "הפניקס פנסיה מקיפה לבני 50 עד 60", trackCode: 9975 },
  "בני 60 ומעלה": { customTranslation: "הפניקס פנסיה מקיפה לבני 60 ומעלה", trackCode: 9976 },
  "מקבלי קצבה": { customTranslation: "הפניקס פנסיה מקבלי קצבה", trackCode: 13936 },
  "הלכתי למקבלי קצבה": { customTranslation: "הפניקס פנסיה הלכתי למקבלי קצבה", trackCode: 13938 },
  "פנסיונרים": { customTranslation: "הפניקס פנסיה פנסיונרים", trackCode: 13940 },
  "זכאים קיימים": { customTranslation: "הפניקס פנסיה זכאים קיימים", trackCode: 13942 },
  "עוקב מדדים למקבלי קצבה": { customTranslation: "הפניקס פנסיה עוקב מדדים למקבלי קצבה", trackCode: 13926 },
};

const pensiaHarel: ProviderMap = {
  "מניות": { customTranslation: "הראל פנסיה מסלול מניות", trackCode: 9860 },
  "עוקב מדד S&P500": { customTranslation: "הראל פנסיה מסלול עוקב מדד S&P 500", trackCode: 13506 },
  "הלכתי": { customTranslation: "הראל פנסיה מסלול הלכה", trackCode: 9862 },
  "עוקב מדדים גמיש": { customTranslation: "הראל פנסיה מסלול עוקב מדדים - גמיש", trackCode: 15373 },
  "אשראי ואג״ח": { customTranslation: "הראל פנסיה מסלול אשראי ואג״ח", trackCode: 9858 },
  "עוקב מדדי מניות": { customTranslation: "הראל פנסיה מסלול עוקב מדדי מניות", trackCode: 15376 },
  "משולב סחיר": { customTranslation: "הראל פנסיה מסלול משולב סחיר", trackCode: 15377 },
  "מניות סחיר": { customTranslation: "הראל פנסיה מניות סחיר", trackCode: 15379 },
  "אג״ח סחיר": { customTranslation: "הראל פנסיה מסלול אג״ח סחיר", trackCode: 15378 },
  "כללי": { customTranslation: "הראל פנסיה מסלול כללי", trackCode: 9852 },
  "קיימות": { customTranslation: "הראל פנסיה מסלול קיימות", trackCode: 15372 },
  "כספי שקלי": { customTranslation: "הראל פנסיה מסלול כספי (שקלי)", trackCode: 14720 },
  "עוקב מדדי אג״ח": { customTranslation: "הראל פנסיה מסלול עוקב מדדי אג״ח", trackCode: 15374 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מסלול השקעה משתנה ומותאם לגילו של העמית", trackCode: 0 },
  "בני 50 ומטה": { customTranslation: "גילאי 50 ומטה", trackCode: 9823 },
  "בני 50 עד 60": { customTranslation: "גילאי 50 עד 60", trackCode: 9827 },
  "בני 60 ומעלה": { customTranslation: "גילאי 60 ומעלה", trackCode: 9829 },
  "מקבלי קצבה": { customTranslation: "הראל פנסיה מסלול מקבלי קצבה", trackCode: 9864 },
  "הלכתי למקבלי קצבה": { customTranslation: "הראל פנסיה מסלול הלכתי למקבלי קצבה", trackCode: 9866 },
  "פנסיונרים": { customTranslation: "הראל פנסיה מסלול פנסיונרים", trackCode: 9868 },
  "עוקב מדדים אג״ח עד 25% מניות": { customTranslation: "הראל פנסיה מסלול עוקב מדדים - אג״ח עם מניות (עד 25% מניות)", trackCode: 15375 },
};

const pensiaClal: ProviderMap = {
  "מניות": { customTranslation: "כלל פנסיה מניות", trackCode: 9879 },
  "עוקב מדד S&P500": { customTranslation: "כלל פנסיה עוקב מדד S&P 500", trackCode: 13346 },
  "הלכתי": { customTranslation: "כלל פנסיה הלכה", trackCode: 9883 },
  "עוקב מדדים גמיש": { customTranslation: "כלל פנסיה עוקב מדדים גמיש", trackCode: 14684 },
  "אשראי ואג״ח": { customTranslation: "כלל פנסיה אשראי ואג״ח", trackCode: 9881 },
  "עוקב מדדי מניות": { customTranslation: "כלל פנסיה עוקב מדדי מניות", trackCode: 14794 },
  "משולב סחיר": { customTranslation: "כלל פנסיה משולב סחיר", trackCode: 15432 },
  "מניות סחיר": { customTranslation: "כלל פנסיה מניות סחיר", trackCode: 15434 },
  "אג״ח סחיר": { customTranslation: "כלל פנסיה אג״ח סחיר", trackCode: 15433 },
  "כללי": { customTranslation: "כלל פנסיה כללי", trackCode: 9877 },
  "כספי שקלי": { customTranslation: "כלל פנסיה כספי (שקלי)", trackCode: 9885 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מסלול השקעות משתנה ומותאם לפי גיל העמית", trackCode: 0 },
  "בני 50 ומטה": { customTranslation: "לבני 50 ומטה", trackCode: 9654 },
  "בני 50 עד 60": { customTranslation: "לבני 50 עד 60", trackCode: 9655 },
  "בני 60 ומעלה": { customTranslation: "לבני 60 ומעלה", trackCode: 9656 },
  "זכאים קיימים": { customTranslation: "מסלול כללי בחירה - במסלול כללי מתאפשרת רק במידה והיית עמית במסלול זה ביום 31.12.2015", trackCode: 2002 },
  "מקבלי קצבה": { customTranslation: "כלל פנסיה מקבלי קצבה", trackCode: 9887 },
  "הלכתי למקבלי קצבה": { customTranslation: "כלל פנסיה הלכתי למקבלי קצבה", trackCode: 9889 },
  "פנסיונרים": { customTranslation: "כלל פנסיה פנסיונרים", trackCode: 9891 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "כלל פנסיה אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 12603 },
  "עוקב מדדים למקבלי קצבה": { customTranslation: "כלל פנסיה עוקב מדדים למקבלי קצבה", trackCode: 14798 },
};

const pensiaMor: ProviderMap = {
  "מניות": { customTranslation: "מור פנסיה - מניות", trackCode: 9917 },
  "עוקב מדד S&P500": { customTranslation: "מור פנסיה - עוקב מדד S&P500", trackCode: 9918 },
  "עוקב מדדים גמיש": { customTranslation: "מור פנסיה - עוקב מדדים גמיש", trackCode: 15251 },
  "אשראי ואג״ח": { customTranslation: "מור פנסיה - אשראי ואג״ח", trackCode: 14487 },
  "עוקב מדדי מניות": { customTranslation: "מור פנסיה - עוקב מדדי מניות", trackCode: 15253 },
  "משולב סחיר": { customTranslation: "מור פנסיה - משולב סחיר", trackCode: 15255 },
  "מניות סחיר": { customTranslation: "מור פנסיה - מניות סחיר", trackCode: 15257 },
  "אג״ח סחיר": { customTranslation: "מור פנסיה - אג״ח סחיר", trackCode: 15256 },
  "כללי": { customTranslation: "מור פנסיה - כללי", trackCode: 9915 },
  "כספי שקלי": { customTranslation: "מור פנסיה - כספי (שקלי)", trackCode: 9919 },
  "עוקב מדדי אג״ח": { customTranslation: "מור פנסיה - עוקב מדדי אג״ח", trackCode: 15254 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מסלול השקעות תלוי גיל", trackCode: 0 },
  "בני 50 ומטה": { customTranslation: "מור פנסיה מקיפה - מסלול לבני 50 ומטה", trackCode: 13909 },
  "בני 50 עד 60": { customTranslation: "מור פנסיה מקיפה - מסלול לבני 50 עד 60", trackCode: 13910 },
  "בני 60 ומעלה": { customTranslation: "מור פנסיה מקיפה - מסלול לבני 60 ומעלה", trackCode: 13911 },
  "מקבלי קצבה": { customTranslation: "מור פנסיה - מקבלי קצבה", trackCode: 9916 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "מור פנסיה - אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 12960 },
  "עוקב מדדים אג״ח עד 25% מניות": { customTranslation: "מור פנסיה - עוקב מדדים אג״ח עם מניות (עד 25% מניות)", trackCode: 15252 },
};

const pensiaMeitav: ProviderMap = {
  "מניות": { customTranslation: "מיטב פנסיה מניות", trackCode: 9894 },
  "עוקב מדד S&P500": { customTranslation: "מיטב פנסיה עוקב מדד S&P 500", trackCode: 13249 },
  "הלכתי": { customTranslation: "מיטב פנסיה הלכה", trackCode: 9897 },
  "עוקב מדדים גמיש": { customTranslation: "מיטב פנסיה עוקב מדדים גמיש", trackCode: 9899 },
  "אשראי ואג״ח": { customTranslation: "מיטב פנסיה אשראי ואג״ח", trackCode: 9895 },
  "עוקב מדדי מניות": { customTranslation: "מיטב פנסיה עוקב מדדי מניות", trackCode: 15380 },
  "משולב סחיר": { customTranslation: "מיטב פנסיה משולב סחיר", trackCode: 15383 },
  "מניות סחיר": { customTranslation: "מיטב פנסיה מניות סחיר", trackCode: 15385 },
  "אג״ח סחיר": { customTranslation: "מיטב פנסיה אג״ח סחיר", trackCode: 15384 },
  "כללי": { customTranslation: "מיטב פנסיה כללי", trackCode: 9893 },
  "קיימות": { customTranslation: "מיטב פנסיה קיימות", trackCode: 14261 },
  "כספי שקלי": { customTranslation: "מיטב פנסיה כספי (שקלי)", trackCode: 9896 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מסלול השקעות משתנה ומותאם לפי גיל העמית", trackCode: 0 },
  "בני 50 ומטה": { customTranslation: "מיטב פנסיה מקיפה לבני 50 ומטה", trackCode: 2155 },
  "בני 50 עד 60": { customTranslation: "מיטב פנסיה מקיפה לבני 50 עד 60", trackCode: 9967 },
  "בני 60 ומעלה": { customTranslation: "מיטב פנסיה מקיפה לבני 60 ומעלה", trackCode: 9968 },
  "מקבלי קצבה": { customTranslation: "מיטב פנסיה מקבלי קצבה", trackCode: 9898 },
  "הלכתי למקבלי קצבה": { customTranslation: "מיטב פנסיה הלכתי למקבלי קצבה", trackCode: 9901 },
  "פנסיונרים": { customTranslation: "מיטב פנסיה פנסיונרים", trackCode: 9900 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "מיטב פנסיה אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 9902 },
  "עוקב מדדים אג״ח עד 25% מניות": { customTranslation: "מיטב פנסיה עוקב מדדי אג״ח עם מניות (עד 25% מניות)", trackCode: 15381 },
  "עוקב מדדים למקבלי קצבה": { customTranslation: "מיטב פנסיה עוקב מדדים למקבלי קצבה", trackCode: 15382 },
};

const pensiaMenora: ProviderMap = {
  "מניות": { customTranslation: "מסלול מניות", trackCode: 9903 },
  "עוקב מדד S&P500": { customTranslation: "מסלול עוקב מדד S&P 500", trackCode: 13877 },
  "הלכתי": { customTranslation: "מסלול הלכה", trackCode: 13883 },
  "עוקב מדדים גמיש": { customTranslation: "מסלול עוקב מדדים גמיש", trackCode: 11412 },
  "אשראי ואג״ח": { customTranslation: "מסלול אשראי ואג״ח", trackCode: 13363 },
  "עוקב מדדי מניות": { customTranslation: "מסלול עוקב מדדי מניות", trackCode: 14680 },
  "משולב סחיר": { customTranslation: "מסלול משולב סחיר", trackCode: 15470 },
  "מניות סחיר": { customTranslation: "מסלול מניות סחיר", trackCode: 15727 },
  "אג״ח סחיר": { customTranslation: "מסלול אג״ח סחיר", trackCode: 15726 },
  "כללי": { customTranslation: "מסלול כללי", trackCode: 9904 },
  "קיימות": { customTranslation: "מסלול קיימות", trackCode: 14348 },
  "כספי שקלי": { customTranslation: "מסלול כספי (שקלי)", trackCode: 9908 },
  "אג״ח ממשלות": { customTranslation: "מסלול אג״ח ממשלתי", trackCode: 15342 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מסלול השקעות מותאם לפי גיל העמית", trackCode: 0 },
  "בני 50 ומטה": { customTranslation: "מסלול לבני 50 ומטה", trackCode: 9793 },
  "בני 50 עד 60": { customTranslation: "מסלול לבני 50-60", trackCode: 9792 },
  "בני 60 ומעלה": { customTranslation: "מסלול לבני 60 ומעלה", trackCode: 9794 },
  "יעד 2030": { customTranslation: "מסלול יעד לפרישה 2030", trackCode: 2013 },
  "יעד 2035": { customTranslation: "מסלול יעד לפרישה 2035", trackCode: 2014 },
  "יעד 2040": { customTranslation: "מסלול יעד לפרישה 2040", trackCode: 2015 },
  "יעד 2045": { customTranslation: "מסלול יעד לפרישה 2045", trackCode: 2016 },
  "יעד 2050": { customTranslation: "מסלול יעד לפרישה 2050", trackCode: 2183 },
  "יעד 2055": { customTranslation: "מסלול יעד לפרישה 2055", trackCode: 2184 },
  "יעד 2060": { customTranslation: "מסלול יעד לפרישה 2060", trackCode: 8812 },
  "יעד 2065": { customTranslation: "מסלול יעד לפרישה 2065", trackCode: 13303 },
  "זכאים קיימים": { customTranslation: "אני עמית קיים במסלול הכללי ומבקש להישאר במסלול זה", trackCode: 2009 },
  "מקבלי קצבה": { customTranslation: "מסלול מקבלי קצבה", trackCode: 9909 },
  "הלכתי למקבלי קצבה": { customTranslation: "מסלול הלכתי למקבלי קצבה", trackCode: 9910 },
  "פנסיונרים": { customTranslation: "מסלול פנסיונרים", trackCode: 9911 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "מסלול אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 9905 },
  "עוקב מדדים אג״ח עד 25% מניות": { customTranslation: "מסלול עוקב מדדים - אג״ח עם מניות (עד 25% מניות)", trackCode: 11413 },
  "עוקב מדדים למקבלי קצבה": { customTranslation: "מסלול עוקב מדדים למקבלי קצבה", trackCode: 9907 },
};

const pensiaProviders: ProvidersByName = {
  "אלטשולר שחם": pensiaAltshullerShacham,
  "הפניקס": pensiaHaphoenix,
  "הראל": pensiaHarel,
  "כלל": pensiaClal,
  "מור": pensiaMor,
  "מיטב": pensiaMeitav,
  "מנורה": pensiaMenora,
  "מגדל": pensiaMigdal,
};

const pensiaMigdal: ProviderMap = {
  "מניות": { customTranslation: "מסלול מניות", trackCode: 2142 },
  "עוקב מדד S&P500": { customTranslation: "מסלול עוקב מדד S&P 500", trackCode: 13572 },
  "הלכתי": { customTranslation: "מסלול הלכה", trackCode: 2112 },
  "עוקב מדדים גמיש": { customTranslation: "מסלול עוקב מדדים - גמיש", trackCode: 14243 },
  "אשראי ואג״ח": { customTranslation: "מסלול אשראי ואג״ח", trackCode: 2144 },
  "עוקב מדדי מניות": { customTranslation: "מסלול עוקב מדדי מניות", trackCode: 14929 },
  "משולב סחיר": { customTranslation: "מסלול משולב סחיר", trackCode: 14242 },
  "מניות סחיר": { customTranslation: "מסלול מניות סחיר", trackCode: 15524 },
  "כספי שקלי": { customTranslation: "מסלול כספי (שקלי)*", trackCode: 2143 },
  "עוקב מדדי אג״ח": { customTranslation: "מסלול עוקב מדדי אג״ח", trackCode: 15525 },
  "בני 50 ומטה": { customTranslation: "לבני 50 ומטה", trackCode: 8801 },
  "בני 50 עד 60": { customTranslation: "לבני 50 עד 60", trackCode: 8802 },
  "בני 60 ומעלה": { customTranslation: "לבני 60 ומעלה", trackCode: 8803 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מודל השקעתך תלוי גיל", trackCode: 0 },
  "זכאים קיימים": { customTranslation: "מסלול כללי - סגור למצטרפים חדשים", trackCode: 2102 },
};

// =============================================
// קרן פנסיה משלימה providers
// =============================================

const pensiaMashlimaAltshullerShacham: ProviderMap = {
  "מניות": { customTranslation: "אלטשולר שחם פנסיה משלימה מניות", trackCode: 14018 },
  "עוקב מדד S&P500": { customTranslation: "אלטשולר שחם פנסיה משלימה עוקב מדד S&P 500", trackCode: 14868 },
  "הלכתי": { customTranslation: "אלטשולר שחם פנסיה משלימה הלכה", trackCode: 14020 },
  "עוקב מדדים גמיש": { customTranslation: "אלטשולר שחם פנסיה משלימה עוקב מדדים - גמיש", trackCode: 15034 },
  "אשראי ואג״ח": { customTranslation: "אלטשולר שחם פנסיה משלימה אשראי ואג״ח", trackCode: 14019 },
  "עוקב מדדי מניות": { customTranslation: "אלטשולר שחם פנסיה משלימה עוקב מדדי מניות", trackCode: 14869 },
  "משולב סחיר": { customTranslation: "אלטשולר שחם פנסיה משלימה משולב סחיר", trackCode: 15464 },
  "מניות סחיר": { customTranslation: "אלטשולר שחם פנסיה משלימה מניות סחיר", trackCode: 15544 },
  "אג״ח סחיר": { customTranslation: "אלטשולר שחם פנסיה משלימה אג״ח סחיר", trackCode: 15543 },
  "כללי": { customTranslation: "אלטשולר שחם פנסיה משלימה כללי", trackCode: 14017 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מסלול השקעות משתנה ומותאם לפי גיל העמית", trackCode: 0 },
  "בני 50 ומטה": { customTranslation: "אלטשולר שחם פנסיה כללית לבני 50 ומטה", trackCode: 9761 },
  "בני 50 עד 60": { customTranslation: "אלטשולר שחם פנסיה כללית לבני 50 עד 60", trackCode: 9762 },
  "בני 60 ומעלה": { customTranslation: "אלטשולר שחם פנסיה כללית לבני 60 ומעלה", trackCode: 9763 },
};

const pensiaMashlimaHaphoenix: ProviderMap = {
  "מניות": { customTranslation: "הפניקס פנסיה משלימה מניות", trackCode: 13944 },
  "עוקב מדד S&P500": { customTranslation: "הפניקס פנסיה משלימה עוקב מדד S&P 500", trackCode: 14200 },
  "הלכתי": { customTranslation: "הפניקס פנסיה משלימה הלכה", trackCode: 13952 },
  "עוקב מדדים גמיש": { customTranslation: "הפניקס פנסיה משלימה עוקב מדדים גמיש", trackCode: 13948 },
  "אשראי ואג״ח": { customTranslation: "הפניקס פנסיה משלימה אשראי ואג״ח", trackCode: 13946 },
  "עוקב מדדי מניות": { customTranslation: "הפניקס פנסיה משלימה עוקב מדדי מניות", trackCode: 15013 },
  "משולב סחיר": { customTranslation: "הפניקס פנסיה משלימה משולב סחיר", trackCode: 15217 },
  "מניות סחיר": { customTranslation: "הפניקס פנסיה משלימה מניות סחיר", trackCode: 15238 },
  "אג״ח סחיר": { customTranslation: "הפניקס פנסיה משלימה אג״ח סחיר", trackCode: 15218 },
  "כללי": { customTranslation: "הפניקס פנסיה משלימה כללי", trackCode: 13954 },
  "כספי שקלי": { customTranslation: "הפניקס פנסיה משלימה כספי (שקלי)", trackCode: 13958 },
  "שריעה": { customTranslation: "הפניקס פנסיה משלימה שריעה", trackCode: 14082 },
  "עוקב מדדי אג״ח": { customTranslation: "הפניקס פנסיה משלימה עוקב מדדי אג״ח", trackCode: 15222 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מסלול השקעות משתנה ומותאם לפי גיל העמית", trackCode: 0 },
  "בני 50 ומטה": { customTranslation: "הפניקס פנסיה משלימה לבני 50 ומטה", trackCode: 7234 },
  "בני 50 עד 60": { customTranslation: "הפניקס פנסיה משלימה לבני 50 עד 60", trackCode: 7235 },
  "בני 60 ומעלה": { customTranslation: "הפניקס פנסיה משלימה לבני 60 ומעלה", trackCode: 7236 },
  "מקבלי קצבה": { customTranslation: "הפניקס פנסיה משלימה מקבלי קצבה", trackCode: 13960 },
  "הלכתי למקבלי קצבה": { customTranslation: "הפניקס פנסיה משלימה הלכתי למקבלי קצבה", trackCode: 13962 },
  "פנסיונרים": { customTranslation: "הפניקס פנסיה משלימה פנסיונרים", trackCode: 13964 },
  "זכאים קיימים": { customTranslation: "הפניקס פנסיה משלימה זכאים קיימים", trackCode: 13966 },
  "עוקב מדדים למקבלי קצבה": { customTranslation: "הפניקס פנסיה משלימה עוקב מדדים למקבלי קצבה", trackCode: 13950 },
};

const pensiaMashlimaHarel: ProviderMap = {
  "מניות": { customTranslation: "הראל פנסיה משלימה מסלול מניות", trackCode: 14131 },
  "עוקב מדד S&P500": { customTranslation: "הראל פנסיה משלימה מסלול עוקב מדד S&P 500", trackCode: 14202 },
  "הלכתי": { customTranslation: "הראל פנסיה משלימה מסלול הלכה", trackCode: 14133 },
  "עוקב מדדים גמיש": { customTranslation: "הראל פנסיה משלימה מסלול עוקב מדדים - גמיש", trackCode: 15385 },
  "אשראי ואג״ח": { customTranslation: "הראל פנסיה משלימה מסלול אשראי ואג״ח", trackCode: 14132 },
  "עוקב מדדי מניות": { customTranslation: "הראל פנסיה משלימה מסלול עוקב מדדי מניות", trackCode: 15388 },
  "משולב סחיר": { customTranslation: "הראל פנסיה משלימה מסלול משולב סחיר", trackCode: 15389 },
  "מניות סחיר": { customTranslation: "הראל פנסיה משלימה מניות סחיר", trackCode: 15391 },
  "אג״ח סחיר": { customTranslation: "הראל פנסיה משלימה מסלול אג״ח סחיר", trackCode: 15390 },
  "כללי": { customTranslation: "הראל פנסיה משלימה מסלול כללי", trackCode: 14130 },
  "קיימות": { customTranslation: "הראל פנסיה משלימה מסלול קיימות", trackCode: 15384 },
  "כספי שקלי": { customTranslation: "הראל פנסיה משלימה מסלול כספי (שקלי)", trackCode: 14722 },
  "עוקב מדדי אג״ח": { customTranslation: "הראל פנסיה משלימה מסלול עוקב מדדי אג״ח", trackCode: 15386 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מודל השקעתך תלוי גיל", trackCode: 0 },
  "בני 50 ומטה": { customTranslation: "גילאי 50 ומטה", trackCode: 9862 },
  "בני 50 עד 60": { customTranslation: "גילאי 50 עד 60", trackCode: 9858 },
  "בני 60 ומעלה": { customTranslation: "גילאי 60 ומעלה", trackCode: 9856 },
  "מקבלי קצבה": { customTranslation: "הראל פנסיה משלימה מסלול מקבלי קצבה", trackCode: 14135 },
  "הלכתי למקבלי קצבה": { customTranslation: "הראל פנסיה משלימה מסלול הלכתי למקבלי קצבה", trackCode: 14137 },
  "פנסיונרים": { customTranslation: "הראל פנסיה משלימה מסלול פנסיונרים", trackCode: 14139 },
  "עוקב מדדים אג״ח עד 25% מניות": { customTranslation: "הראל פנסיה משלימה מסלול עוקב מדדים - אג״ח עם מניות (עד 25% מניות)", trackCode: 15387 },
};

const pensiaMashlimaClal: ProviderMap = {
  "מניות": { customTranslation: "כלל פנסיה משלימה מניות", trackCode: 14141 },
  "עוקב מדד S&P500": { customTranslation: "כלל פנסיה משלימה עוקב מדד S&P 500", trackCode: 14204 },
  "הלכתי": { customTranslation: "כלל פנסיה משלימה הלכה", trackCode: 14145 },
  "עוקב מדדים גמיש": { customTranslation: "כלל פנסיה משלימה עוקב מדדים גמיש", trackCode: 14686 },
  "אשראי ואג״ח": { customTranslation: "כלל פנסיה משלימה אשראי ואג״ח", trackCode: 14143 },
  "עוקב מדדי מניות": { customTranslation: "כלל פנסיה משלימה עוקב מדדי מניות", trackCode: 14796 },
  "משולב סחיר": { customTranslation: "כלל פנסיה משלימה משולב סחיר", trackCode: 15436 },
  "מניות סחיר": { customTranslation: "כלל פנסיה משלימה מניות סחיר", trackCode: 15438 },
  "אג״ח סחיר": { customTranslation: "כלל פנסיה משלימה אג״ח סחיר", trackCode: 15437 },
  "כללי": { customTranslation: "כלל פנסיה משלימה כללי", trackCode: 14147 },
  "כספי שקלי": { customTranslation: "כלל פנסיה משלימה כספי (שקלי)", trackCode: 14149 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מסלול השקעות משתנה ומותאם לפי גיל העמית", trackCode: 0 },
  "בני 50 ומטה": { customTranslation: "מסלול לבני 50 ומטה", trackCode: 9633 },
  "בני 50 עד 60": { customTranslation: "מסלול לבני 50 עד 60", trackCode: 9634 },
  "בני 60 ומעלה": { customTranslation: "מסלול לבני 60 ומעלה", trackCode: 9635 },
  "זכאים קיימים": { customTranslation: "מסלול כללי - בחירה במסלול כללי מתאפשרת רק במידה והיית עמית במסלול זה ביום 31.12.2015", trackCode: 2176 },
  "מקבלי קצבה": { customTranslation: "כלל פנסיה משלימה מקבלי קצבה", trackCode: 14151 },
  "הלכתי למקבלי קצבה": { customTranslation: "כלל פנסיה משלימה הלכתי למקבלי קצבה", trackCode: 14153 },
  "פנסיונרים": { customTranslation: "כלל פנסיה משלימה פנסיונרים", trackCode: 14155 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "כלל פנסיה משלימה אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 14157 },
  "עוקב מדדים למקבלי קצבה": { customTranslation: "כלל פנסיה משלימה עוקב מדדים למקבלי קצבה", trackCode: 14800 },
};

const pensiaMashlimaMor: ProviderMap = {
  "מניות": { customTranslation: "מור פנסיה משלימה - מניות", trackCode: 14107 },
  "עוקב מדד S&P500": { customTranslation: "מור פנסיה משלימה - עוקב מדד S&P500", trackCode: 14108 },
  "עוקב מדדים גמיש": { customTranslation: "מור פנסיה משלימה - עוקב מדדים גמיש", trackCode: 15259 },
  "אשראי ואג״ח": { customTranslation: "מור פנסיה משלימה - אשראי ואג״ח", trackCode: 14489 },
  "עוקב מדדי מניות": { customTranslation: "מור פנסיה משלימה - עוקב מדדי מניות", trackCode: 15261 },
  "משולב סחיר": { customTranslation: "מור פנסיה משלימה - משולב סחיר", trackCode: 15263 },
  "מניות סחיר": { customTranslation: "מור פנסיה משלימה - מניות סחיר", trackCode: 15265 },
  "אג״ח סחיר": { customTranslation: "מור פנסיה משלימה - אג״ח סחיר", trackCode: 15264 },
  "כללי": { customTranslation: "מור פנסיה משלימה - כללי", trackCode: 14105 },
  "כספי שקלי": { customTranslation: "מור פנסיה משלימה - כספי (שקלי)", trackCode: 14109 },
  "עוקב מדדי אג״ח": { customTranslation: "מור פנסיה משלימה - עוקב מדדי אג״ח", trackCode: 15262 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מסלול השקעות תלוי גיל", trackCode: 0 },
  "בני 50 ומטה": { customTranslation: "מור פנסיה כללית - מסלול לבני 50 ומטה", trackCode: 13919 },
  "בני 50 עד 60": { customTranslation: "מור פנסיה כללית - מסלול לבני 50 עד 60", trackCode: 13920 },
  "בני 60 ומעלה": { customTranslation: "מור פנסיה כללית - מסלול לבני 60 ומעלה", trackCode: 13921 },
  "מקבלי קצבה": { customTranslation: "מור פנסיה משלימה - מקבלי קצבה", trackCode: 14106 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "מור פנסיה משלימה - אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 14111 },
  "עוקב מדדים אג״ח עד 25% מניות": { customTranslation: "מור פנסיה משלימה - עוקב מדדים אג״ח עם מניות (עד 25% מניות)", trackCode: 15260 },
};

const pensiaMashlimaMeitav: ProviderMap = {
  "מניות": { customTranslation: "מיטב פנסיה משלימה מניות", trackCode: 14057 },
  "עוקב מדד S&P500": { customTranslation: "מיטב פנסיה משלימה עוקב מדד S&P 500", trackCode: 14206 },
  "הלכתי": { customTranslation: "מיטב פנסיה משלימה הלכה", trackCode: 14059 },
  "עוקב מדדים גמיש": { customTranslation: "מיטב פנסיה משלימה עוקב מדדים גמיש", trackCode: 14061 },
  "אשראי ואג״ח": { customTranslation: "מיטב פנסיה משלימה אשראי ואג״ח", trackCode: 14058 },
  "עוקב מדדי מניות": { customTranslation: "מיטב פנסיה משלימה עוקב מדדי מניות", trackCode: 15392 },
  "משולב סחיר": { customTranslation: "מיטב פנסיה משלימה משולב סחיר", trackCode: 15395 },
  "מניות סחיר": { customTranslation: "מיטב פנסיה משלימה מניות סחיר", trackCode: 15397 },
  "אג״ח סחיר": { customTranslation: "מיטב פנסיה משלימה אג״ח סחיר", trackCode: 15396 },
  "כללי": { customTranslation: "מיטב פנסיה משלימה כללי", trackCode: 14055 },
  "קיימות": { customTranslation: "מיטב פנסיה משלימה קיימות", trackCode: 14269 },
  "כספי שקלי": { customTranslation: "מיטב פנסיה משלימה כספי (שקלי)", trackCode: 14060 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מסלול השקעות משתנה ומותאם לפי גיל העמית", trackCode: 0 },
  "בני 50 ומטה": { customTranslation: "מיטב פנסיה כללית לבני 50 ומטה", trackCode: 2158 },
  "בני 50 עד 60": { customTranslation: "מיטב פנסיה כללית לבני 50 עד 60", trackCode: 9972 },
  "בני 60 ומעלה": { customTranslation: "מיטב פנסיה כללית לבני 60 ומעלה", trackCode: 9973 },
  "מקבלי קצבה": { customTranslation: "מיטב פנסיה משלימה מקבלי קצבה", trackCode: 14062 },
  "הלכתי למקבלי קצבה": { customTranslation: "מיטב פנסיה משלימה הלכתי למקבלי קצבה", trackCode: 14065 },
  "פנסיונרים": { customTranslation: "מיטב פנסיה משלימה פנסיונרים", trackCode: 14063 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "מיטב פנסיה משלימה אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 14064 },
  "עוקב מדדים אג״ח עד 25% מניות": { customTranslation: "מיטב פנסיה משלימה עוקב מדדי אג״ח עם מניות (עד 25% מניות)", trackCode: 15393 },
  "עוקב מדדים למקבלי קצבה": { customTranslation: "מיטב פנסיה משלימה עוקב מדדים למקבלי קצבה", trackCode: 15394 },
};

const pensiaMashlimaMenora: ProviderMap = {
  "מניות": { customTranslation: "מסלול מניות", trackCode: 14069 },
  "עוקב מדד S&P500": { customTranslation: "מסלול עוקב מדד S&P 500", trackCode: 14210 },
  "הלכתי": { customTranslation: "מסלול הלכה", trackCode: 14214 },
  "עוקב מדדים גמיש": { customTranslation: "מסלול עוקב מדדים גמיש", trackCode: 14071 },
  "אשראי ואג״ח": { customTranslation: "מסלול אשראי ואג״ח", trackCode: 14073 },
  "עוקב מדדי מניות": { customTranslation: "מסלול עוקב מדדי מניות", trackCode: 14682 },
  "משולב סחיר": { customTranslation: "מסלול משולב סחיר", trackCode: 15472 },
  "מניות סחיר": { customTranslation: "מסלול מניות סחיר", trackCode: 15729 },
  "אג״ח סחיר": { customTranslation: "מסלול אג״ח סחיר", trackCode: 15728 },
  "כללי": { customTranslation: "מסלול כללי", trackCode: 14067 },
  "כספי שקלי": { customTranslation: "מסלול כספי (שקלי)", trackCode: 14079 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מסלול השקעה מותאם לפי גיל העמית", trackCode: 0 },
  "בני 50 ומטה": { customTranslation: "מסלול לבני 50 ומטה", trackCode: 9793 },
  "בני 50 עד 60": { customTranslation: "מסלול לבני 50-60", trackCode: 9792 },
  "בני 60 ומעלה": { customTranslation: "מסלול לבני 60 ומעלה", trackCode: 9794 },
  "יעד 2030": { customTranslation: "מסלול יעד לפרישה 2030", trackCode: 1619 },
  "יעד 2035": { customTranslation: "מסלול יעד לפרישה 2035", trackCode: 1638 },
  "יעד 2040": { customTranslation: "מסלול יעד לפרישה 2040", trackCode: 1645 },
  "יעד 2045": { customTranslation: "מסלול יעד לפרישה 2045", trackCode: 1651 },
  "יעד 2050": { customTranslation: "מסלול יעד לפרישה 2050", trackCode: 1652 },
  "יעד 2055": { customTranslation: "מסלול יעד לפרישה 2055", trackCode: 1653 },
  "יעד 2060": { customTranslation: "מסלול יעד לפרישה 2060", trackCode: 1666 },
  "יעד 2065": { customTranslation: "מסלול יעד לפרישה 2065", trackCode: 13307 },
  "מקבלי קצבה": { customTranslation: "מסלול מקבלי קצבה", trackCode: 14075 },
  "הלכתי למקבלי קצבה": { customTranslation: "מסלול הלכתי למקבלי קצבה", trackCode: 14077 },
  "פנסיונרים": { customTranslation: "מסלול פנסיונרים", trackCode: 14083 },
  "אשראי ואג״ח עד 25% מניות": { customTranslation: "מסלול אשראי ואג״ח עם מניות (עד 25% מניות)", trackCode: 14081 },
  "עוקב מדדים אג״ח עד 25% מניות": { customTranslation: "מסלול עוקב מדדים - אג״ח עם מניות (עד 25% מניות)", trackCode: 14085 },
  "עוקב מדדים למקבלי קצבה": { customTranslation: "מסלול עוקב מדדים למקבלי קצבה", trackCode: 14087 },
};

const pensiaMashlimaProviders: ProvidersByName = {
  "אלטשולר שחם": pensiaMashlimaAltshullerShacham,
  "הפניקס": pensiaMashlimaHaphoenix,
  "הראל": pensiaMashlimaHarel,
  "כלל": pensiaMashlimaClal,
  "מור": pensiaMashlimaMor,
  "מיטב": pensiaMashlimaMeitav,
  "מנורה": pensiaMashlimaMenora,
  "מגדל": pensiaMashlimaMigdal,
};

const pensiaMashlimaMigdal: ProviderMap = {
  "מניות": { customTranslation: "מסלול מניות", trackCode: 2146 },
  "עוקב מדד S&P500": { customTranslation: "מסלול עוקב מדד S&P 500", trackCode: 13627 },
  "הלכתי": { customTranslation: "מסלול הלכה", trackCode: 2149 },
  "עוקב מדדים גמיש": { customTranslation: "מסלול עוקב מדדים - גמיש", trackCode: 14245 },
  "אשראי ואג״ח": { customTranslation: "מסלול אשראי ואג״ח", trackCode: 2148 },
  "עוקב מדדי מניות": { customTranslation: "מסלול עוקב מדדי מניות", trackCode: 14930 },
  "משולב סחיר": { customTranslation: "מסלול משולב סחיר", trackCode: 14244 },
  "מניות סחיר": { customTranslation: "מסלול מניות סחיר", trackCode: 15526 },
  "כספי שקלי": { customTranslation: "מסלול כספי (שקלי)*", trackCode: 2147 },
  "עוקב מדדי אג״ח": { customTranslation: "מסלול עוקב מדדי אג״ח", trackCode: 15527 },
  "בני 50 ומטה": { customTranslation: "לבני 50 ומטה", trackCode: 9453 },
  "בני 50 עד 60": { customTranslation: "לבני 50 עד 60", trackCode: 9454 },
  "בני 60 ומעלה": { customTranslation: "לבני 60 ומעלה", trackCode: 9455 },
  "מסלול השקעה תלוי גיל": { customTranslation: "מודל השקעתך תלוי גיל", trackCode: 0 },
  "זכאים קיימים": { customTranslation: "מסלול כללי - סגור למצטרפים חדשים", trackCode: 2145 },
};

// =============================================
// Main translation map: request type -> providers
// =============================================

export const TRACK_CUSTOM_TRANSLATIONS: Record<string, Record<string, Record<string, TrackEntry>>> = {
  // קופת גמל
  "פתיחת קופת גמל": gemelProviders,
  "שינוי מסלול קופת גמל": gemelProviders,
  "ניוד קופת גמל": gemelProviders,
  // קופת גמל להשקעה
  "פתיחת קופת גמל להשקעה": gemelLeHashkaaProviders,
  "ניוד קופת גמל להשקעה": gemelLeHashkaaProviders,
  "שינוי מסלול קופת גמל להשקעה": gemelLeHashkaaProviders,
  // קרן השתלמות
  "פתיחת קרן השתלמות": hishtalmutProviders,
  "ניוד קרן השתלמות": hishtalmutProviders,
  "שינוי מסלול קרן השתלמות": hishtalmutProviders,
  // קרן פנסיה מקיפה
  "פתיחת קרן פנסיה מקיפה": pensiaProviders,
  "ניוד קרן פנסיה מקיפה": pensiaProviders,
  "שינוי מסלול קרן פנסיה מקיפה": pensiaProviders,
  // קרן פנסיה משלימה
  "פתיחת קרן פנסיה משלימה": pensiaMashlimaProviders,
  "ניוד קרן פנסיה משלימה": pensiaMashlimaProviders,
  "שינוי מסלול קרן פנסיה משלימה": pensiaMashlimaProviders,
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
    if (entry.trackCode === 0) {
      return entry.customTranslation;
    }
    return `${entry.customTranslation} - ${entry.trackCode}`;
  }
  return defaultTranslation;
};