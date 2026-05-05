import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEntityUpdate } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { ClientsEntity } from "@/product-types";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

interface ClientData {
  id: string;
  first_name?: string;
  last_name?: string;
  national_id?: string;
  phone_number?: string;
  email?: string;
  dateOfBirth?: string;
  address?: string;
  cityOfResidence?: string;
}

interface WorkspaceClientDetailsProps {
  client: ClientData | null;
}

export const WorkspaceClientDetails = ({ client }: WorkspaceClientDetailsProps) => {
  const { updateFunction, isLoading } = useEntityUpdate(ClientsEntity);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    national_id: "",
    phone_number: "",
    email: "",
    dateOfBirth: "",
    address: "",
    cityOfResidence: "",
  });

  useEffect(() => {
    if (client) {
      setForm({
        first_name: client.first_name || "",
        last_name: client.last_name || "",
        national_id: client.national_id || "",
        phone_number: client.phone_number || "",
        email: client.email || "",
        dateOfBirth: client.dateOfBirth || "",
        address: client.address || "",
        cityOfResidence: client.cityOfResidence || "",
      });
    }
  }, [client]);

  const handleSave = async () => {
    if (!client) return;
    try {
      await updateFunction({ id: client.id, data: form });
      toast.success("פרטי הלקוח עודכנו בהצלחה");
    } catch {
      toast.error("שגיאה בעדכון פרטי הלקוח");
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (!client) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center size-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
              2
            </span>
            פרטי הלקוח
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">לא נמצא לקוח</p>
        </CardContent>
      </Card>
    );
  }

  const fields: { key: string; label: string; type?: string }[] = [
    { key: "first_name", label: "שם פרטי" },
    { key: "last_name", label: "שם משפחה" },
    { key: "national_id", label: "ת״ז" },
    { key: "phone_number", label: "טלפון" },
    { key: "email", label: "אימייל", type: "email" },
    { key: "dateOfBirth", label: "תאריך לידה", type: "date" },
    { key: "address", label: "כתובת" },
    { key: "cityOfResidence", label: "עיר" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex items-center justify-center size-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
            2
          </span>
          פרטי הלקוח
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.key} className="flex flex-col gap-1.5">
              <Label>{f.label}</Label>
              <Input
                type={f.type || "text"}
                value={(form as Record<string, string>)[f.key] || ""}
                onChange={(e) => updateField(f.key, e.target.value)}
                dir={f.type === "date" ? "ltr" : "rtl"}
              />
            </div>
          ))}
        </div>
        <Button onClick={handleSave} disabled={isLoading} className="self-start">
          {isLoading ? (
            <Loader2 className="animate-spin" data-icon="inline-start" />
          ) : (
            <Save data-icon="inline-start" />
          )}
          שמור פרטי לקוח
        </Button>
      </CardContent>
    </Card>
  );
};