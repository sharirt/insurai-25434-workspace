import { useState, useEffect } from "react";
import {
  useEntityGetAll,
  useEntityUpdate,
  useEntityCreate,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import { AgencyEntity } from "@/product-types";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export const AgencyDetailsCard = () => {
  const { data: agencies, isLoading } = useEntityGetAll(AgencyEntity);
  const { updateFunction, isLoading: isUpdating } = useEntityUpdate(AgencyEntity);
  const { createFunction, isLoading: isCreating } = useEntityCreate(AgencyEntity);

  const agency = agencies?.[0];

  const [agencyName, setAgencyName] = useState("");
  const [agentNumber, setAgentNumber] = useState("");

  useEffect(() => {
    if (agency) {
      setAgencyName(agency.agencyName || "");
      setAgentNumber(agency.agentNumber || "");
    }
  }, [agency]);

  const handleSave = async () => {
    try {
      if (agency) {
        await updateFunction({
          id: agency.id,
          data: { agencyName, agentNumber },
        });
      } else {
        await createFunction({
          data: { agencyName, agentNumber },
        });
      }
      toast.success("פרטי הסוכנות נשמרו בהצלחה");
    } catch {
      toast.error("שגיאה בשמירת פרטי הסוכנות");
    }
  };

  const isSaving = isUpdating || isCreating;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>פרטי הסוכנות</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="agencyName">שם הסוכנות</Label>
            <Input
              id="agencyName"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              placeholder="הזן שם סוכנות"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="agentNumber">מספר סוכן</Label>
            <Input
              id="agentNumber"
              value={agentNumber}
              onChange={(e) => setAgentNumber(e.target.value)}
              placeholder="הזן מספר סוכן"
            />
          </div>
        </div>
        <div className="flex justify-start">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="animate-spin" data-icon="inline-start" />}
            שמור שינויים
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};