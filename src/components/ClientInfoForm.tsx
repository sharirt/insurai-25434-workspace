import React from "react";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IClientsEntity } from "@/product-types";
import { BANK_OPTIONS, BANK_CODE_MAP, BANK_CODE_TO_NAME, BANK_CODE_OPTIONS } from "@/utils/BankOptions";

interface ClientInfoFormProps {
  formData: Partial<IClientsEntity>;
  onFieldChange: (field: keyof IClientsEntity, value: string | boolean) => void;
}

export const ClientInfoForm = ({
  formData,
  onFieldChange,
}: ClientInfoFormProps) => {
  const handleInputChange = useCallback(
    (field: keyof IClientsEntity) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onFieldChange(field, e.target.value);
      },
    [onFieldChange]
  );

  const handleSelectChange = useCallback(
    (field: keyof IClientsEntity) => (value: string) => {
      onFieldChange(field, value);
    },
    [onFieldChange]
  );

  const handleCheckboxChange = useCallback(
    (field: keyof IClientsEntity) => (checked: boolean | "indeterminate") => {
      onFieldChange(field, checked === true);
    },
    [onFieldChange]
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* שם פרטי */}
      <div className="space-y-1.5">
        <Label htmlFor="first_name" className="text-sm font-medium">
          שם פרטי
        </Label>
        <Input
          id="first_name"
          value={formData.first_name ?? ""}
          onChange={handleInputChange("first_name")}
          placeholder="שם פרטי"
          dir="rtl"
        />
      </div>

      {/* שם משפחה */}
      <div className="space-y-1.5">
        <Label htmlFor="last_name" className="text-sm font-medium">
          שם משפחה
        </Label>
        <Input
          id="last_name"
          value={formData.last_name ?? ""}
          onChange={handleInputChange("last_name")}
          placeholder="שם משפחה"
          dir="rtl"
        />
      </div>

      {/* תעודת זהות */}
      <div className="space-y-1.5">
        <Label htmlFor="national_id" className="text-sm font-medium">
          תעודת זהות
        </Label>
        <Input
          id="national_id"
          value={formData.national_id ?? ""}
          onChange={handleInputChange("national_id")}
          placeholder="תעודת זהות"
          dir="rtl"
        />
      </div>

      {/* תאריך הנפקה */}
    <div className="space-y-1.5">
      <Label htmlFor="idIssueDate" className="text-sm font-medium">
        תאריך הנפקה
      </Label>
      <Input
        id="idIssueDate"
        type="date"
        value={formData.idIssueDate ?? ""}
        onChange={handleInputChange("idIssueDate")}
        dir="rtl"
      />
    </div>

    {/* תאריך לידה */}
      <div className="space-y-1.5">
        <Label htmlFor="dateOfBirth" className="text-sm font-medium">
          תאריך לידה
        </Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth ?? ""}
          onChange={handleInputChange("dateOfBirth")}
          dir="rtl"
        />
      </div>

      {/* מין */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">מין</Label>
        <Select
          value={formData.gender ?? ""}
          onValueChange={handleSelectChange("gender")}
          dir="rtl"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="בחר מין" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="זכר">זכר</SelectItem>
            <SelectItem value="נקבה">נקבה</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* מצב משפחתי */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">מצב משפחתי</Label>
        <Select
          value={formData.relationship ?? ""}
          onValueChange={handleSelectChange("relationship")}
          dir="rtl"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="בחר מצב משפחתי" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="רווק">רווק</SelectItem>
            <SelectItem value="נשוי">נשוי</SelectItem>
            <SelectItem value="גרוש">גרוש</SelectItem>
            <SelectItem value="אלמן">אלמן</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ארץ לידה */}
      <div className="space-y-1.5">
        <Label htmlFor="birthCountry" className="text-sm font-medium">
          ארץ לידה
        </Label>
        <Input
          id="birthCountry"
          value={formData.birthCountry ?? ""}
          onChange={handleInputChange("birthCountry")}
          placeholder="ארץ לידה"
          dir="rtl"
        />
      </div>

      {/* עיר לידה */}
      <div className="space-y-1.5">
        <Label htmlFor="birthCity" className="text-sm font-medium">
          עיר לידה
        </Label>
        <Input
          id="birthCity"
          value={formData.birthCity ?? ""}
          onChange={handleInputChange("birthCity")}
          placeholder="עיר לידה"
          dir="rtl"
        />
      </div>

      {/* מספר טלפון */}
      <div className="space-y-1.5">
        <Label htmlFor="phone_number" className="text-sm font-medium">
          מספר טלפון
        </Label>
        <Input
          id="phone_number"
          value={formData.phone_number ?? ""}
          onChange={handleInputChange("phone_number")}
          placeholder="מספר טלפון"
          dir="rtl"
        />
      </div>

      {/* דוא"ל */}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium">
          דוא&quot;ל
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email ?? ""}
          onChange={handleInputChange("email")}
          placeholder='דוא"ל'
          dir="rtl"
        />
      </div>

      {/* יישוב */}
      <div className="space-y-1.5">
        <Label htmlFor="cityOfResidence" className="text-sm font-medium">
          יישוב
        </Label>
        <Input
          id="cityOfResidence"
          value={formData.cityOfResidence ?? ""}
          onChange={handleInputChange("cityOfResidence")}
          placeholder="יישוב"
          dir="rtl"
        />
      </div>

      {/* כתובת */}
      <div className="space-y-1.5">
        <Label htmlFor="address" className="text-sm font-medium">
          כתובת
        </Label>
        <Input
          id="address"
          value={formData.address ?? ""}
          onChange={handleInputChange("address")}
          placeholder="כתובת"
          dir="rtl"
        />
      </div>

      {/* מספר דירה */}
      <div className="space-y-1.5">
        <Label htmlFor="apartmentNumber" className="text-sm font-medium">
          מספר דירה
        </Label>
        <Input
          id="apartmentNumber"
          value={formData.apartmentNumber ?? ""}
          onChange={handleInputChange("apartmentNumber")}
          placeholder="מספר דירה"
          dir="rtl"
        />
      </div>

      {/* מיקוד */}
      <div className="space-y-1.5">
        <Label htmlFor="zipCode" className="text-sm font-medium">
          מיקוד
        </Label>
        <Input
          id="zipCode"
          value={formData.zipCode ?? ""}
          onChange={handleInputChange("zipCode")}
          placeholder="מיקוד"
          dir="rtl"
        />
      </div>

      {/* תעסוקה */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">תעסוקה</Label>
        <Select
          value={formData.employment ?? ""}
          onValueChange={handleSelectChange("employment")}
          dir="rtl"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="בחר סוג תעסוקה" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="שכיר">שכיר</SelectItem>
            <SelectItem value="עצמאי">עצמאי</SelectItem>
            <SelectItem value="סטודנט">סטודנט</SelectItem>
            <SelectItem value="חבר קיבוץ">חבר קיבוץ</SelectItem>
            <SelectItem value="אברך">אברך</SelectItem>
            <SelectItem value="חייל בשירות חובה">חייל בשירות חובה</SelectItem>
            <SelectItem value="משרתת בשירות לאומי">משרתת בשירות לאומי</SelectItem>
            <SelectItem value="לא עובד/מובטל">לא עובד/מובטל</SelectItem>
            <SelectItem value="גמלאי">גמלאי</SelectItem>
            <SelectItem value="שכיר בעל שליטה">שכיר בעל שליטה</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* עיסוק */}
      <div className="space-y-1.5">
        <Label htmlFor="occupation" className="text-sm font-medium">
          עיסוק
        </Label>
        <Input
          id="occupation"
          value={formData.occupation ?? ""}
          onChange={handleInputChange("occupation")}
          placeholder="עיסוק"
          dir="rtl"
        />
      </div>

      {/* עיסוק לפני פרישה */}
      {formData.employment === "גמלאי" && (
        <div className="space-y-1.5">
          <Label htmlFor="preRetirementOccupation" className="text-sm font-medium">
            עיסוק לפני פרישה
          </Label>
          <Input
            id="preRetirementOccupation"
            value={formData.preRetirementOccupation ?? ""}
            onChange={handleInputChange("preRetirementOccupation")}
            placeholder="עיסוק לפני פרישה"
            dir="rtl"
          />
        </div>
      )}

      {/* שם מעסיק אחרון */}
      {formData.employment === "לא עובד/מובטל" && (
        <div className="space-y-1.5">
          <Label htmlFor="lastEmployerName" className="text-sm font-medium">
            שם מעסיק אחרון
          </Label>
          <Input
            id="lastEmployerName"
            value={formData.lastEmployerName ?? ""}
            onChange={handleInputChange("lastEmployerName")}
            placeholder="שם מעסיק אחרון"
            dir="rtl"
          />
        </div>
      )}

      {/* עיסוק אחרון */}
      {formData.employment === "לא עובד/מובטל" && (
        <div className="space-y-1.5">
          <Label htmlFor="lastOccupation" className="text-sm font-medium">
            עיסוק אחרון
          </Label>
          <Input
            id="lastOccupation"
            value={formData.lastOccupation ?? ""}
            onChange={handleInputChange("lastOccupation")}
            placeholder="עיסוק אחרון"
            dir="rtl"
          />
        </div>
      )}

      {/* שם העסק */}
      {formData.employment === "עצמאי" && (
        <div className="space-y-1.5">
          <Label htmlFor="businessName" className="text-sm font-medium">
            שם העסק
          </Label>
          <Input
            id="businessName"
            value={formData.businessName ?? ""}
            onChange={handleInputChange("businessName")}
            placeholder="שם העסק"
            dir="rtl"
          />
        </div>
      )}

      {/* מען העסק */}
      {formData.employment === "עצמאי" && (
        <div className="space-y-1.5">
          <Label htmlFor="businessAddress" className="text-sm font-medium">
            מען העסק
          </Label>
          <Input
            id="businessAddress"
            value={formData.businessAddress ?? ""}
            onChange={handleInputChange("businessAddress")}
            placeholder="מען העסק"
            dir="rtl"
          />
        </div>
      )}

      {/* מחזור הכנסות שנתי */}
      {formData.employment === "עצמאי" && (
        <div className="space-y-1.5">
          <Label htmlFor="businessYearlyRevenueCycle" className="text-sm font-medium">
            מחזור הכנסות שנתי
          </Label>
          <Input
            id="businessYearlyRevenueCycle"
            type="number"
            value={formData.businessYearlyRevenueCycle ?? ""}
            onChange={(e) => onFieldChange("businessYearlyRevenueCycle" as keyof IClientsEntity, e.target.value ? Number(e.target.value) as unknown as string : "" as unknown as string)}
            placeholder="מחזור הכנסות שנתי"
            dir="rtl"
          />
        </div>
      )}

      {/* מעסיק */}
      <div className="space-y-1.5">
        <Label htmlFor="employer" className="text-sm font-medium">
          מעסיק
        </Label>
        <Input
          id="employer"
          value={formData.employer ?? ""}
          onChange={handleInputChange("employer")}
          placeholder="מעסיק"
          dir="rtl"
        />
      </div>

      {/* ח.פ / ע.מ */}
      <div className="space-y-1.5">
        <Label htmlFor="companyId" className="text-sm font-medium">
          ח.פ / ע.מ
        </Label>
        <Input
          id="companyId"
          value={formData.companyId ?? ""}
          onChange={handleInputChange("companyId")}
          placeholder="ח.פ / ע.מ"
          dir="rtl"
        />
      </div>

      {/* סטאטוס לקוח */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">סטאטוס לקוח</Label>
        <Select
          value={formData.clientStatus ?? ""}
          onValueChange={handleSelectChange("clientStatus")}
          dir="rtl"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="בחר סטאטוס" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="פעיל">פעיל</SelectItem>
            <SelectItem value="טרום יעוץ">טרום יעוץ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* שם פרטי הורה 1 */}
      <div className="space-y-1.5">
        <Label htmlFor="parent1FirstName" className="text-sm font-medium">
          שם פרטי הורה 1
        </Label>
        <Input
          id="parent1FirstName"
          value={formData.parent1FirstName ?? ""}
          onChange={handleInputChange("parent1FirstName")}
          placeholder="שם פרטי הורה 1"
          dir="rtl"
        />
      </div>

      {/* שם משפחה הורה 1 */}
      <div className="space-y-1.5">
        <Label htmlFor="parent1LastName" className="text-sm font-medium">
          שם משפחה הורה 1
        </Label>
        <Input
          id="parent1LastName"
          value={formData.parent1LastName ?? ""}
          onChange={handleInputChange("parent1LastName")}
          placeholder="שם משפחה הורה 1"
          dir="rtl"
        />
      </div>

      {/* תאריך לידה הורה 1 */}
      <div className="space-y-1.5">
        <Label htmlFor="parent1DateOfBirth" className="text-sm font-medium">
          תאריך לידה הורה 1
        </Label>
        <Input
          id="parent1DateOfBirth"
          type="date"
          value={formData.parent1DateOfBirth ?? ""}
          onChange={handleInputChange("parent1DateOfBirth")}
          dir="rtl"
        />
      </div>

      {/* תאריך הנפקת ת״ז הורה 1 */}
      <div className="space-y-1.5">
        <Label htmlFor="parent1IssueDate" className="text-sm font-medium">
          תאריך הנפקת ת״ז הורה 1
        </Label>
        <Input
          id="parent1IssueDate"
          value={formData.parent1IssueDate ?? ""}
          onChange={handleInputChange("parent1IssueDate")}
          placeholder="תאריך הנפקת ת.ז. הורה 1"
          dir="rtl"
        />
      </div>

      {/* שם פרטי הורה 2 */}
      <div className="space-y-1.5">
        <Label htmlFor="parent2FirstName" className="text-sm font-medium">
          שם פרטי הורה 2
        </Label>
        <Input
          id="parent2FirstName"
          value={formData.parent2FirstName ?? ""}
          onChange={handleInputChange("parent2FirstName")}
          placeholder="שם פרטי הורה 2"
          dir="rtl"
        />
      </div>

      {/* שם משפחה הורה 2 */}
      <div className="space-y-1.5">
        <Label htmlFor="parent2LastName" className="text-sm font-medium">
          שם משפחה הורה 2
        </Label>
        <Input
          id="parent2LastName"
          value={formData.parent2LastName ?? ""}
          onChange={handleInputChange("parent2LastName")}
          placeholder="שם משפחה הורה 2"
          dir="rtl"
        />
      </div>

      {/* תאריך לידה הורה 2 */}
      <div className="space-y-1.5">
        <Label htmlFor="parent2DateOfBirth" className="text-sm font-medium">
          תאריך לידה הורה 2
        </Label>
        <Input
          id="parent2DateOfBirth"
          type="date"
          value={formData.parent2DateOfBirth ?? ""}
          onChange={handleInputChange("parent2DateOfBirth")}
          dir="rtl"
        />
      </div>

      {/* תאריך הנפקת ת״ז הורה 2 */}
      <div className="space-y-1.5">
        <Label htmlFor="parent2IssueDate" className="text-sm font-medium">
          תאריך הנפקת ת״ז הורה 2
        </Label>
        <Input
          id="parent2IssueDate"
          value={formData.parent2IssueDate ?? ""}
          onChange={handleInputChange("parent2IssueDate")}
          placeholder="תאריך הנפקת ת.ז. הורה 2"
          dir="rtl"
        />
      </div>

      {/* פרטי אזרחות */}
      <div className="col-span-1 md:col-span-2 rounded-md border border-border p-4 flex flex-col gap-3">
        <Label className="text-sm font-semibold">פרטי אזרחות</Label>
        <div className="flex items-center gap-2">
          <Checkbox
            id="bornInUSA"
            checked={formData.bornInUSA ?? false}
            onCheckedChange={handleCheckboxChange("bornInUSA")}
          />
          <Label htmlFor="bornInUSA" className="text-sm font-medium cursor-pointer">
            יליד ארה״ב
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="american"
            checked={formData.american ?? false}
            onCheckedChange={handleCheckboxChange("american")}
          />
          <Label htmlFor="american" className="text-sm font-medium cursor-pointer">
            אזרח אמריקאי
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="americanForTax"
            checked={formData.americanForTax ?? false}
            onCheckedChange={handleCheckboxChange("americanForTax")}
          />
          <Label htmlFor="americanForTax" className="text-sm font-medium cursor-pointer">
            תושב ארצות הברית לצורכי מס
          </Label>
        </div>
      </div>

      {/* מדינת מס */}
      <div className="space-y-1.5">
        <Label htmlFor="taxCountry" className="text-sm font-medium">
          מדינת מס באנגלית
        </Label>
        <Input
          id="taxCountry"
          value={formData.taxCountry ?? ""}
          onChange={handleInputChange("taxCountry")}
          placeholder="מדינת מס באנגלית"
          dir="rtl"
        />
      </div>

      {/* מספר TIN */}
      <div className="space-y-1.5">
        <Label htmlFor="tinNumber" className="text-sm font-medium">
          מספר TIN
        </Label>
        <Input
          id="tinNumber"
          value={formData.tinNumber ?? ""}
          onChange={handleInputChange("tinNumber")}
          placeholder="מספר TIN"
          dir="ltr"
        />
      </div>

      {/* שם פרטי אנגלית */}
      <div className="space-y-1.5">
        <Label htmlFor="englishFirstName" className="text-sm font-medium">
          שם פרטי אנגלית
        </Label>
        <Input
          id="englishFirstName"
          value={formData.englishFirstName ?? ""}
          onChange={handleInputChange("englishFirstName")}
          placeholder="First Name"
          dir="ltr"
        />
      </div>

      {/* שם משפחה אנגלית */}
      <div className="space-y-1.5">
        <Label htmlFor="englishLastName" className="text-sm font-medium">
          שם משפחה אנגלית
        </Label>
        <Input
          id="englishLastName"
          value={formData.englishLastName ?? ""}
          onChange={handleInputChange("englishLastName")}
          placeholder="Last Name"
          dir="ltr"
        />
      </div>

      {/* עיר אנגלית */}
      <div className="space-y-1.5">
        <Label htmlFor="englishCity" className="text-sm font-medium">
          עיר אנגלית
        </Label>
        <Input
          id="englishCity"
          value={formData.englishCity ?? ""}
          onChange={handleInputChange("englishCity")}
          placeholder="City"
          dir="ltr"
        />
      </div>

      {/* מדינה אנגלית */}
      <div className="space-y-1.5">
        <Label htmlFor="englishCountry" className="text-sm font-medium">
          מדינה אנגלית
        </Label>
        <Input
          id="englishCountry"
          value={formData.englishCountry ?? ""}
          onChange={handleInputChange("englishCountry")}
          placeholder="Country"
          dir="ltr"
        />
      </div>

      {/* רחוב באנגלית */}
      <div className="space-y-1.5">
        <Label htmlFor="englishStreet" className="text-sm font-medium">
          רחוב באנגלית
        </Label>
        <Input
          id="englishStreet"
          value={formData.englishStreet ?? ""}
          onChange={handleInputChange("englishStreet")}
          placeholder="Street"
          dir="ltr"
        />
      </div>

      {/* פרטי בנק */}
      <div className="col-span-1 md:col-span-2 rounded-md border border-border p-4 flex flex-col gap-3">
        <Label className="text-sm font-semibold">פרטי בנק</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="bankName" className="text-sm font-medium">שם בנק</Label>
            <Select value={formData.bankName ?? ""} onValueChange={(value) => {
                const newName = value === "__clear__" ? "" : value;
                onFieldChange("bankName", newName);
                const mapped = newName ? BANK_CODE_MAP[newName] : "";
                if (mapped !== undefined) onFieldChange("bankCode", mapped);
              }}>
              <SelectTrigger id="bankName" dir="rtl" className="text-right">
                <SelectValue placeholder="בחר בנק" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__clear__">ללא בחירה</SelectItem>
                {BANK_OPTIONS.map((bank) => (
                  <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bankCode" className="text-sm font-medium">קוד בנק</Label>
            <Select value={formData.bankCode ?? ""} onValueChange={(value) => {
                const newCode = value === "__clear__" ? "" : value;
                onFieldChange("bankCode", newCode);
                const mapped = newCode ? BANK_CODE_TO_NAME[newCode] : "";
                if (mapped !== undefined) onFieldChange("bankName", mapped);
              }}>
              <SelectTrigger id="bankCode" dir="rtl" className="text-right">
                <SelectValue placeholder="בחר קוד בנק" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__clear__">ללא בחירה</SelectItem>
                {BANK_CODE_OPTIONS.map((code) => (
                  <SelectItem key={code} value={code}>{code} - {BANK_CODE_TO_NAME[code]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="branchNumber" className="text-sm font-medium">מספר סניף</Label>
            <Input id="branchNumber" value={formData.branchNumber ?? ""} onChange={handleInputChange("branchNumber")} placeholder="מספר סניף" dir="rtl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="accountNumber" className="text-sm font-medium">מספר חשבון</Label>
            <Input id="accountNumber" value={formData.accountNumber ?? ""} onChange={handleInputChange("accountNumber")} placeholder="מספר חשבון" dir="rtl" />
          </div>
        </div>
      </div>

      {/* חלוקה בין מוטבים */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">חלוקה בין מוטבים</Label>
        <Select
          value={formData.beneficiariesDivide ?? ""}
          onValueChange={handleSelectChange("beneficiariesDivide")}
          dir="rtl"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="בחר חלוקה" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="חלקים שווים">חלקים שווים</SelectItem>
            <SelectItem value="יחסי לחלקם">יחסי לחלקם</SelectItem>
            <SelectItem value="יורשים חוקיים">יורשים חוקיים</SelectItem>
            <SelectItem value="אחר">אחר</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.beneficiariesDivide === "אחר" && (
        <div className="space-y-1.5">
          <Label htmlFor="beneficiariesDivideFree" className="text-sm font-medium">
            חלוקה בין מוטבים - אחר
          </Label>
          <Input
            id="beneficiariesDivideFree"
            value={formData.beneficiariesDivideFree ?? ""}
            onChange={handleInputChange("beneficiariesDivideFree")}
            placeholder="הזן חלוקה"
            dir="rtl"
          />
        </div>
      )}

      {/* הערות */}
      <div className="col-span-1 space-y-1.5 md:col-span-2">
        <Label htmlFor="notes" className="text-sm font-medium">
          הערות
        </Label>
        <Textarea
          id="notes"
          value={formData.notes ?? ""}
          onChange={handleInputChange("notes")}
          placeholder="הערות"
          rows={3}
          dir="rtl"
        />
      </div>
    </div>
  );
};