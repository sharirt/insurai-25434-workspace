import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEntityCreate, useEntityUpdate, useEntityGetAll, useFileUpload } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { ClientsEntity, UsersEntity } from "@/product-types";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Upload, FileCheck, X, Loader2, ExternalLink } from "lucide-react";

interface ClientFormState {
  first_name: string;
  last_name: string;
  gender: string;
  national_id: string;
  idIssueDate: string;
  dateOfBirth: string;
  phone_number: string;
  email: string;
  cityOfResidence: string;
  address: string;
  apartmentNumber: string;
  homeNumber: string;
  zipCode: string;
  employment: string;
  occupation: string;
  employer: string;
  companyId: string;
  american: boolean;
  americanForTax: boolean;
  tinNumber: string;
  englishFirstName: string;
  englishLastName: string;
  englishCity: string;
  englishCountry: string;
  notes: string;
  relationship: string;
  clientStatus: string;
  parent1Id: string;
  parent2Id: string;
  parent1FirstName: string;
  parent1LastName: string;
  parent2FirstName: string;
  parent2LastName: string;
  parent1DateOfBirth: string;
  parent2DateOfBirth: string;
  birthCountry: string;
  birthCity: string;
  englishStreet: string;
  bornInUSA: boolean;
  smoker: boolean;
}

const INITIAL_FORM_STATE: ClientFormState = {
  first_name: "",
  last_name: "",
  gender: "",
  national_id: "",
  idIssueDate: "",
  dateOfBirth: "",
  phone_number: "",
  email: "",
  cityOfResidence: "",
  address: "",
  apartmentNumber: "",
  homeNumber: "",
  zipCode: "",
  employment: "",
  occupation: "",
  employer: "",
  companyId: "",
  american: false,
  americanForTax: false,
  tinNumber: "",
  englishFirstName: "",
  englishLastName: "",
  englishCity: "",
  englishCountry: "",
  notes: "",
  relationship: "",
  clientStatus: "",
  parent1Id: "",
  parent2Id: "",
  parent1FirstName: "",
  parent1LastName: "",
  parent2FirstName: "",
  parent2LastName: "",
  parent1DateOfBirth: "",
  parent2DateOfBirth: "",
  birthCountry: "",
  birthCity: "",
  englishStreet: "",
  bornInUSA: false,
  smoker: false,
};

export const ClientFormDialog = ({
  open,
  onClose,
  client
}: {
  open: boolean;
  onClose: () => void;
  client: typeof ClientsEntity['instanceType'] | null;
}) => {
  const { createFunction, isLoading: isCreating } = useEntityCreate(ClientsEntity);
  const { updateFunction, isLoading: isUpdating } = useEntityUpdate(ClientsEntity);
  const { data: allUsers, isLoading: usersLoading } = useEntityGetAll(UsersEntity);

  const { uploadFunction, isLoading: isUploading } = useFileUpload();

  const [formState, setFormState] = useState<ClientFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedOfficeEmails, setSelectedOfficeEmails] = useState<string[]>([]);
  const [idDocumentationUrl, setIdDocumentationUrl] = useState("");

  const isEditMode = !!client;
  const isLoading = isCreating || isUpdating || isUploading;

  const officeUsers = (allUsers ?? []).filter(
    (u: any) => u.role === "office"
  );

  useEffect(() => {
    if (client) {
      setFormState({
        first_name: client.first_name || "",
        last_name: client.last_name || "",
        gender: client.gender || "",
        national_id: client.national_id || "",
        idIssueDate: client.idIssueDate || "",
        dateOfBirth: client.dateOfBirth || "",
        phone_number: client.phone_number || "",
        email: client.email || "",
        cityOfResidence: client.cityOfResidence || "",
        address: client.address || "",
        apartmentNumber: client.apartmentNumber || "",
        homeNumber: client.homeNumber || "",
        zipCode: client.zipCode || "",
        employment: client.employment || "",
        occupation: client.occupation || "",
        employer: client.employer || "",
        companyId: client.companyId || "",
        american: client.american || false,
        americanForTax: client.americanForTax || false,
        tinNumber: client.tinNumber || "",
        englishFirstName: client.englishFirstName || "",
        englishLastName: client.englishLastName || "",
        englishCity: client.englishCity || "",
        englishCountry: client.englishCountry || "",
        notes: client.notes || "",
        relationship: client.relationship || "",
        clientStatus: client.clientStatus || "",
        parent1Id: client.parent1Id || "",
        parent2Id: client.parent2Id || "",
        parent1FirstName: client.parent1FirstName || "",
        parent1LastName: client.parent1LastName || "",
        parent2FirstName: client.parent2FirstName || "",
        parent2LastName: client.parent2LastName || "",
        parent1DateOfBirth: client.parent1DateOfBirth || "",
        parent2DateOfBirth: client.parent2DateOfBirth || "",
        birthCountry: client.birthCountry || "",
        birthCity: client.birthCity || "",
        englishStreet: client.englishStreet || "",
        bornInUSA: client.bornInUSA || false,
        smoker: client.smoker || false,
      });
      setSelectedOfficeEmails(client.assignedOfficeEmails ?? []);
      setIdDocumentationUrl(client.idDocumentationUrl || "");
    } else {
      setFormState(INITIAL_FORM_STATE);
      setSelectedOfficeEmails([]);
      setIdDocumentationUrl("");
    }
    setErrors({});
  }, [client, open]);

  const handleChange = useCallback((field: keyof ClientFormState, value: string | boolean) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  }, []);

  const toggleOfficeEmail = useCallback((email: string) => {
    setSelectedOfficeEmails(prev =>
      prev.includes(email)
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formState.first_name.trim()) {
      newErrors.first_name = "שם פרטי הוא שדה חובה";
    }

    if (!formState.last_name.trim()) {
      newErrors.last_name = "שם משפחה הוא שדה חובה";
    }

    if (!formState.national_id.trim()) {
      newErrors.national_id = "תעודת זהות היא שדה חובה";
    }

    if (formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = "כתובת דוא״ל לא תקינה";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formState.first_name, formState.last_name, formState.national_id, formState.email]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const data: Record<string, any> = {
        first_name: formState.first_name.trim(),
        last_name: formState.last_name.trim(),
      };

      // Only include non-empty optional fields
      if (formState.gender) data.gender = formState.gender;
      if (formState.national_id.trim()) data.national_id = formState.national_id.trim();
      if (formState.idIssueDate) data.idIssueDate = formState.idIssueDate;
      if (formState.dateOfBirth) data.dateOfBirth = formState.dateOfBirth;
      if (formState.phone_number.trim()) data.phone_number = formState.phone_number.trim();
      if (formState.email.trim()) data.email = formState.email.trim();
      if (formState.cityOfResidence.trim()) data.cityOfResidence = formState.cityOfResidence.trim();
      if (formState.address.trim()) data.address = formState.address.trim();
      if (formState.apartmentNumber.trim()) data.apartmentNumber = formState.apartmentNumber.trim();
      if (formState.homeNumber.trim()) data.homeNumber = formState.homeNumber.trim();
      if (formState.zipCode.trim()) data.zipCode = formState.zipCode.trim();
      if (formState.employment) data.employment = formState.employment;
      if (formState.occupation.trim()) data.occupation = formState.occupation.trim();
      if (formState.employer.trim()) data.employer = formState.employer.trim();
      if (formState.companyId.trim()) data.companyId = formState.companyId.trim();
      data.american = formState.american;
      data.americanForTax = formState.americanForTax;
      if (formState.tinNumber.trim()) data.tinNumber = formState.tinNumber.trim();
      if (formState.englishFirstName.trim()) data.englishFirstName = formState.englishFirstName.trim();
      if (formState.englishLastName.trim()) data.englishLastName = formState.englishLastName.trim();
      if (formState.englishCity.trim()) data.englishCity = formState.englishCity.trim();
      if (formState.englishCountry.trim()) data.englishCountry = formState.englishCountry.trim();
      if (formState.parent1Id.trim()) data.parent1Id = formState.parent1Id.trim();
      if (formState.parent2Id.trim()) data.parent2Id = formState.parent2Id.trim();
      if (formState.parent1FirstName.trim()) data.parent1FirstName = formState.parent1FirstName.trim();
      if (formState.parent1LastName.trim()) data.parent1LastName = formState.parent1LastName.trim();
      if (formState.parent2FirstName.trim()) data.parent2FirstName = formState.parent2FirstName.trim();
      if (formState.parent2LastName.trim()) data.parent2LastName = formState.parent2LastName.trim();
      if (formState.parent1DateOfBirth) data.parent1DateOfBirth = formState.parent1DateOfBirth;
      if (formState.parent2DateOfBirth) data.parent2DateOfBirth = formState.parent2DateOfBirth;
      if (formState.notes.trim()) data.notes = formState.notes.trim();
      if (formState.birthCountry.trim()) data.birthCountry = formState.birthCountry.trim();
      if (formState.birthCity.trim()) data.birthCity = formState.birthCity.trim();
      if (formState.englishStreet.trim()) data.englishStreet = formState.englishStreet.trim();
      data.bornInUSA = formState.bornInUSA;
      data.smoker = formState.smoker;
      if (formState.relationship) data.relationship = formState.relationship;
      if (formState.clientStatus) data.clientStatus = formState.clientStatus;

      data.assignedOfficeEmails = selectedOfficeEmails;
      if (idDocumentationUrl) {
        data.idDocumentationUrl = idDocumentationUrl;
      } else {
        data.idDocumentationUrl = undefined;
      }

      if (isEditMode && client) {
        await updateFunction({
          id: client.id,
          data
        });
        toast.success("הלקוח עודכן בהצלחה");
      } else {
        await createFunction({ data });
        toast.success("הלקוח נוצר בהצלחה");
      }

      onClose();
    } catch (error) {
      toast.error(isEditMode ? "שגיאה בעדכון הלקוח" : "שגיאה ביצירת הלקוח");
    }
  }, [formState, selectedOfficeEmails, isEditMode, client, validateForm, updateFunction, createFunction, onClose]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl lg:max-w-3xl"
        dir="rtl"
        style={{ direction: "rtl" }}
      >
        <DialogHeader className="shrink-0 space-y-1.5 px-6 pb-2 pt-6 text-right sm:text-right">
          <DialogTitle className="w-full text-right">
            {isEditMode ? "עריכת לקוח" : "לקוח חדש"}
          </DialogTitle>
        </DialogHeader>
        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={handleSubmit}
        >
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-2">
            <div className="space-y-6 pb-4">
              {/* Personal Info Section */}
              <div className="space-y-4">
                <h3 className="border-b pb-2 text-right text-sm font-semibold text-muted-foreground">
                  פרטים אישיים
                </h3>

                {/* Row 1: First Name | Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      שם פרטי <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      value={formState.first_name}
                      onChange={(e) => handleChange("first_name", e.target.value)}
                      placeholder="הזן שם פרטי"
                      disabled={isLoading}
                    />
                    {errors.first_name && (
                      <p className="text-sm text-destructive">{errors.first_name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      שם משפחה <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      value={formState.last_name}
                      onChange={(e) => handleChange("last_name", e.target.value)}
                      placeholder="הזן שם משפחה"
                      disabled={isLoading}
                    />
                    {errors.last_name && (
                      <p className="text-sm text-destructive">{errors.last_name}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: National ID | Birth Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nationalId">
                      תעודת זהות <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="nationalId"
                      value={formState.national_id}
                      onChange={(e) => handleChange("national_id", e.target.value)}
                      placeholder="הזן מספר תעודת זהות"
                      disabled={isLoading}
                    />
                    {errors.national_id && (
                      <p className="text-sm text-destructive">{errors.national_id}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idIssueDate">תאריך הנפקה</Label>
                    <Input
                      id="idIssueDate"
                      type="date"
                      value={formState.idIssueDate}
                      onChange={(e) => handleChange("idIssueDate", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Row 2b: Birth Date | Gender */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">תאריך לידה</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formState.dateOfBirth}
                      onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>מין</Label>
                    <Select
                      value={formState.gender}
                      onValueChange={(value) => handleChange("gender", value)}
                      disabled={isLoading}
                      dir="rtl"
                    >
                      <SelectTrigger dir="rtl">
                        <SelectValue placeholder="בחר מין" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        <SelectItem value="זכר">זכר</SelectItem>
                        <SelectItem value="נקבה">נקבה</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthCountry">ארץ לידה</Label>
                    <Input
                      id="birthCountry"
                      value={formState.birthCountry}
                      onChange={(e) => handleChange("birthCountry", e.target.value)}
                      placeholder="הזן ארץ לידה"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthCity">עיר לידה</Label>
                    <Input
                      id="birthCity"
                      value={formState.birthCity}
                      onChange={(e) => handleChange("birthCity", e.target.value)}
                      placeholder="הזן עיר לידה"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Row: Gender | Relationship */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>מצב משפחתי</Label>
                    <Select
                      value={formState.relationship}
                      onValueChange={(value) => handleChange("relationship", value)}
                      disabled={isLoading}
                      dir="rtl"
                    >
                      <SelectTrigger dir="rtl">
                        <SelectValue placeholder="בחר מצב משפחתי" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        <SelectItem value="רווק">רווק</SelectItem>
                        <SelectItem value="נשוי">נשוי</SelectItem>
                        <SelectItem value="גרוש">גרוש</SelectItem>
                        <SelectItem value="אלמן">אלמן</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Contact Info Section */}
              <div className="space-y-4">
                <h3 className="border-b pb-2 text-right text-sm font-semibold text-muted-foreground">
                  פרטי קשר
                </h3>

                {/* Row 4: Phone Number | Email Address */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">מספר טלפון</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formState.phone_number}
                      onChange={(e) => handleChange("phone_number", e.target.value)}
                      placeholder="הזן מספר טלפון"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">מייל</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formState.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="הזן כתובת מייל"
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Row 5: City | Address */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">יישוב</Label>
                    <Input
                      id="city"
                      value={formState.cityOfResidence}
                      onChange={(e) => handleChange("cityOfResidence", e.target.value)}
                      placeholder="הזן יישוב"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">כתובת</Label>
                    <Input
                      id="address"
                      value={formState.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      placeholder="הזן כתובת"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Row 5b: Apartment Number | Home Number */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apartmentNumber">מספר דירה</Label>
                    <Input
                      id="apartmentNumber"
                      value={formState.apartmentNumber}
                      onChange={(e) => handleChange("apartmentNumber", e.target.value)}
                      placeholder="הזן מספר דירה"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="homeNumber">מספר בית</Label>
                    <Input
                      id="homeNumber"
                      value={formState.homeNumber}
                      onChange={(e) => handleChange("homeNumber", e.target.value)}
                      placeholder="הזן מספר בית"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Row 6: Zip Code | Client Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">מיקוד</Label>
                    <Input
                      id="zipCode"
                      value={formState.zipCode}
                      onChange={(e) => handleChange("zipCode", e.target.value)}
                      placeholder="הזן מיקוד"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>סטאטוס לקוח</Label>
                    <Select
                      value={formState.clientStatus}
                      onValueChange={(value) => handleChange("clientStatus", value)}
                      disabled={isLoading}
                      dir="rtl"
                    >
                      <SelectTrigger dir="rtl">
                        <SelectValue placeholder="בחר סטאטוס" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        <SelectItem value="פעיל">פעיל</SelectItem>
                        <SelectItem value="טרום יעוץ">טרום יעוץ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Employment Info Section */}
              <div className="space-y-4">
                <h3 className="border-b pb-2 text-right text-sm font-semibold text-muted-foreground">
                  פרטי תעסוקה
                </h3>

                {/* Row 7: Employment | Occupation */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>תעסוקה</Label>
                    <Select
                      value={formState.employment}
                      onValueChange={(value) => handleChange("employment", value)}
                      disabled={isLoading}
                      dir="rtl"
                    >
                      <SelectTrigger dir="rtl">
                        <SelectValue placeholder="בחר תעסוקה" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
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
                  <div className="space-y-2">
                    <Label htmlFor="occupation">עיסוק</Label>
                    <Input
                      id="occupation"
                      value={formState.occupation}
                      onChange={(e) => handleChange("occupation", e.target.value)}
                      placeholder="הזן עיסוק"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Row 8: Employer | Company ID */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employer">מעסיק</Label>
                    <Input
                      id="employer"
                      value={formState.employer}
                      onChange={(e) => handleChange("employer", e.target.value)}
                      placeholder="הזן שם מעסיק"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyId">ח.פ / ע.מ</Label>
                    <Input
                      id="companyId"
                      value={formState.companyId}
                      onChange={(e) => handleChange("companyId", e.target.value)}
                      placeholder="הזן מספר חברה"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Parents Info Section */}
              <div className="space-y-4">
                <h3 className="border-b pb-2 text-right text-sm font-semibold text-muted-foreground">
                  פרטי הורים
                </h3>

                {/* Parent 1: First Name | Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent1FirstName">שם פרטי הורה 1</Label>
                    <Input
                      id="parent1FirstName"
                      value={formState.parent1FirstName}
                      onChange={(e) => handleChange("parent1FirstName", e.target.value)}
                      placeholder="הזן שם פרטי הורה 1"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent1LastName">שם משפחה הורה 1</Label>
                    <Input
                      id="parent1LastName"
                      value={formState.parent1LastName}
                      onChange={(e) => handleChange("parent1LastName", e.target.value)}
                      placeholder="הזן שם משפחה הורה 1"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Parent 1: ID | Date of Birth */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent1Id">ת.ז. הורה 1</Label>
                    <Input
                      id="parent1Id"
                      value={formState.parent1Id}
                      onChange={(e) => handleChange("parent1Id", e.target.value)}
                      placeholder="הזן ת.ז. הורה 1"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent1DateOfBirth">תאריך לידה הורה 1</Label>
                    <Input
                      id="parent1DateOfBirth"
                      type="date"
                      value={formState.parent1DateOfBirth}
                      onChange={(e) => handleChange("parent1DateOfBirth", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Parent 2: First Name | Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent2FirstName">שם פרטי הורה 2</Label>
                    <Input
                      id="parent2FirstName"
                      value={formState.parent2FirstName}
                      onChange={(e) => handleChange("parent2FirstName", e.target.value)}
                      placeholder="הזן שם פרטי הורה 2"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent2LastName">שם משפחה הורה 2</Label>
                    <Input
                      id="parent2LastName"
                      value={formState.parent2LastName}
                      onChange={(e) => handleChange("parent2LastName", e.target.value)}
                      placeholder="הזן שם משפחה הורה 2"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Parent 2: ID | Date of Birth */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent2Id">ת.ז. הורה 2</Label>
                    <Input
                      id="parent2Id"
                      value={formState.parent2Id}
                      onChange={(e) => handleChange("parent2Id", e.target.value)}
                      placeholder="הזן ת.ז. הורה 2"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent2DateOfBirth">תאריך לידה הורה 2</Label>
                    <Input
                      id="parent2DateOfBirth"
                      type="date"
                      value={formState.parent2DateOfBirth}
                      onChange={(e) => handleChange("parent2DateOfBirth", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Info Section */}
              <div className="space-y-4">
                <h3 className="border-b pb-2 text-right text-sm font-semibold text-muted-foreground">
                  מידע נוסף
                </h3>

                {/* Row 9: American (checkbox, full width) */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="american"
                    checked={formState.american}
                    onCheckedChange={(checked) => handleChange("american", !!checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="american" className="cursor-pointer">אזרח אמריקאי</Label>
                </div>

                {/* americanForTax checkbox */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="bornInUSA"
                    checked={formState.bornInUSA}
                    onCheckedChange={(checked) => handleChange("bornInUSA", !!checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="bornInUSA" className="cursor-pointer">יליד ארה״ב</Label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="americanForTax"
                    checked={formState.americanForTax}
                    onCheckedChange={(checked) => handleChange("americanForTax", !!checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="americanForTax" className="cursor-pointer">תושב ארצות הברית לצורכי מס</Label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="smoker"
                    checked={formState.smoker}
                    onCheckedChange={(checked) => handleChange("smoker", !!checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="smoker" className="cursor-pointer">מעשן</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tinNumber">מספר TIN</Label>
                  <Input
                    id="tinNumber"
                    value={formState.tinNumber}
                    onChange={(e) => handleChange("tinNumber", e.target.value)}
                    placeholder="הזן מספר TIN"
                    disabled={isLoading}
                  />
                </div>

                {/* ID Documentation Upload */}
                <div className="space-y-2">
                  <Label>תיעוד תעודת זהות</Label>
                  {idDocumentationUrl ? (
                    <div className="flex items-center gap-3 rounded-md border border-border p-3">
                      <FileCheck className="shrink-0 text-primary" />
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <p className="truncate text-sm font-medium">
                          {idDocumentationUrl.split("/").pop() || "קובץ"}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(idDocumentationUrl, "_blank")}
                          >
                            <ExternalLink data-icon="inline-start" />
                            פתח קובץ
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => setIdDocumentationUrl("")}
                          >
                            <X data-icon="inline-start" />
                            הסר
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : isUploading ? (
                    <div className="flex items-center justify-center gap-2 rounded-md border border-dashed border-border p-6">
                      <Loader2 className="animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">מעלה...</span>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed border-border p-6 transition-colors hover:border-primary hover:bg-accent/50">
                      <Upload className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">לחץ להעלאת קובץ תיעוד ת.ז.</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const url = await uploadFunction(file);
                              setIdDocumentationUrl(url);
                            } catch {
                              toast.error("שגיאה בהעלאת הקובץ");
                            }
                          }
                          e.target.value = "";
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* Row 10: Notes (textarea, full width) */}
                <div className="space-y-2">
                  <Label htmlFor="notes">הערות</Label>
                  <Textarea
                    id="notes"
                    value={formState.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="הזן הערות"
                    disabled={isLoading}
                    rows={3}
                    className="resize-y"
                  />
                </div>
              </div>

              {/* English Details Section */}
              <div className="space-y-4">
                <h3 className="border-b pb-2 text-right text-sm font-semibold text-muted-foreground">
                  פרטים באנגלית
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="englishFirstName">שם פרטי אנגלית</Label>
                    <Input
                      id="englishFirstName"
                      value={formState.englishFirstName}
                      onChange={(e) => handleChange("englishFirstName", e.target.value)}
                      placeholder="First Name"
                      disabled={isLoading}
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="englishLastName">שם משפחה אנגלית</Label>
                    <Input
                      id="englishLastName"
                      value={formState.englishLastName}
                      onChange={(e) => handleChange("englishLastName", e.target.value)}
                      placeholder="Last Name"
                      disabled={isLoading}
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="englishCity">עיר אנגלית</Label>
                    <Input
                      id="englishCity"
                      value={formState.englishCity}
                      onChange={(e) => handleChange("englishCity", e.target.value)}
                      placeholder="City"
                      disabled={isLoading}
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="englishCountry">מדינה אנגלית</Label>
                    <Input
                      id="englishCountry"
                      value={formState.englishCountry}
                      onChange={(e) => handleChange("englishCountry", e.target.value)}
                      placeholder="Country"
                      disabled={isLoading}
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="englishStreet">רחוב באנגלית</Label>
                    <Input
                      id="englishStreet"
                      value={formState.englishStreet}
                      onChange={(e) => handleChange("englishStreet", e.target.value)}
                      placeholder="Street"
                      disabled={isLoading}
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Office User Assignment Section */}
              <div className="space-y-4">
                <h3 className="border-b pb-2 text-right text-sm font-semibold text-muted-foreground">
                  שיוך משתמשי משרד
                </h3>

                {usersLoading ? (
                  <div className="flex flex-col gap-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : officeUsers.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    אין משתמשי משרד במערכת
                  </p>
                ) : (
                  <div className="rounded-md border border-border">
                    <ScrollArea className="max-h-48">
                      <div className="flex flex-col gap-0">
                        {officeUsers.map((officeUser: any) => {
                          const userEmail = officeUser.email ?? "";
                          const isSelected = selectedOfficeEmails.includes(userEmail);
                          return (
                            <label
                              key={officeUser.id}
                              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent/50 border-b border-border last:border-b-0"
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleOfficeEmail(userEmail)}
                                disabled={isLoading}
                              />
                              <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="text-sm font-medium truncate">
                                  {officeUser.name || `${officeUser.firstName ?? ""} ${officeUser.lastName ?? ""}`.trim() || userEmail}
                                </span>
                                <span className="text-xs text-muted-foreground truncate">
                                  {userEmail}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex shrink-0 flex-row-reverse flex-wrap justify-start gap-2 border-t px-6 pb-6 pt-4 sm:flex-row-reverse sm:justify-start sm:space-x-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              ביטול
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "שומר..." : isEditMode ? "שמור שינויים" : "צור לקוח"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};