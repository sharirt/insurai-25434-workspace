import { useEntityGetAll, useEntityUpdate, useUser } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { AgentsEntity, AgentDashboard2Page } from "@/product-types";
import { useState, useEffect } from "react";
import { AgentProfileForm } from "@/components/AgentProfileForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, AlertCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { getPageUrl } from "@/lib/utils";

export default function AgentProfile() {
  const user = useUser();
  const { data: agents, isLoading } = useEntityGetAll(AgentsEntity);
  const { updateFunction, isLoading: isSaving } = useEntityUpdate(AgentsEntity);

  const agent = agents?.find(
    (a) => a.email?.toLowerCase() === user.email?.toLowerCase()
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    agentNumber: "",
    email: "",
  });

  useEffect(() => {
    if (agent) {
      setFormData({
        firstName: agent.firstName ?? "",
        lastName: agent.lastName ?? "",
        nationalId: agent.nationalId ?? "",
        agentNumber: agent.agentNumber ?? "",
        email: agent.email ?? "",
      });
    }
  }, [agent?.id]);

  const handleSave = async () => {
    if (!agent) return;
    try {
      await updateFunction({
        id: agent.id,
        data: formData,
      });
      toast.success("הפרופיל עודכן בהצלחה");
    } catch {
      toast.error("שגיאה בעדכון הפרופיל");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8" style={{ direction: "rtl" }}>
        <div className="w-full max-w-lg flex flex-col gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex justify-center p-8" style={{ direction: "rtl" }}>
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="size-12 text-muted-foreground" />
            </div>
            <CardTitle>לא נמצא פרופיל סוכן עבור המשתמש הנוכחי</CardTitle>
            <CardDescription>
              יש לוודא שהמשתמש רשום בטבלת הסוכנים עם כתובת האימייל המתאימה
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-8" style={{ direction: "rtl" }}>
      <div className="w-full max-w-lg flex flex-col gap-6">
        <div>
          <Button variant="outline" asChild>
            <Link to={getPageUrl(AgentDashboard2Page)}>
              <ArrowRight data-icon="inline-start" />חזרה לדף הסוכן</Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className="rounded-full bg-muted p-4">
                <User className="size-10 text-muted-foreground" />
              </div>
            </div>
            <CardTitle>
              {agent.firstName} {agent.lastName}
            </CardTitle>
          </CardHeader>
        </Card>

        <AgentProfileForm
          formData={formData}
          onChange={setFormData}
          onSave={handleSave}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}