import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface AgentProfileFormProps {
  formData: {
    firstName: string;
    lastName: string;
    nationalId: string;
    agentNumber: string;
    email: string;
  };
  onChange: (data: AgentProfileFormProps["formData"]) => void;
  onSave: () => void;
  isSaving: boolean;
}

export const AgentProfileForm = ({ formData, onChange, onSave, isSaving }: AgentProfileFormProps) => {
  const update = (field: keyof typeof formData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>עריכת פרופיל</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="firstName">שם פרטי</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => update("firstName", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lastName">שם משפחה</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => update("lastName", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="nationalId">תעודת זהות</Label>
            <Input
              id="nationalId"
              value={formData.nationalId}
              onChange={(e) => update("nationalId", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="agentNumber">מספר סוכן</Label>
            <Input
              id="agentNumber"
              value={formData.agentNumber}
              onChange={(e) => update("agentNumber", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">דוא"ל</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} disabled={isSaving} className="w-full">
          {isSaving ? (
            <>
              <Loader2 data-icon="inline-start" className="animate-spin" />
              שומר...
            </>
          ) : (
            "שמור"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};