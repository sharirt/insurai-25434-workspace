import { Users, Calendar, FileText, User, Clock, ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEntityGetOne } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { ClientsEntity } from "@/product-types";

interface MeetingSummaryReviewProps {
  processedResult: any;
  resolvedClientId: string | null;
  isExistingClient: boolean;
  onContinue: () => void;
  onBack: () => void;
}

export const MeetingSummaryReview = ({
  processedResult,
  resolvedClientId,
  isExistingClient,
  onContinue,
  onBack,
}: MeetingSummaryReviewProps) => {
  const { data: clientData } = useEntityGetOne(
    ClientsEntity,
    { id: resolvedClientId || "" },
    { enabled: !!resolvedClientId && isExistingClient }
  );

  const clientUpdates = processedResult?.clientUpdates;

  const clientFields = isExistingClient && clientData
    ? {
        fullName: [clientData.first_name, clientData.last_name].filter(Boolean).join(" "),
        nationalId: clientData.national_id,
        phone: clientData.phone_number,
        email: clientData.email,
        city: clientData.cityOfResidence,
        address: clientData.address,
      }
    : {
        fullName: [clientUpdates?.first_name, clientUpdates?.last_name].filter(Boolean).join(" "),
        nationalId: clientUpdates?.national_id,
        phone: clientUpdates?.phone_number,
        email: clientUpdates?.email,
        city: clientUpdates?.cityOfResidence,
        address: clientUpdates?.address,
      };

  const fieldLabels: { key: keyof typeof clientFields; label: string }[] = [
    { key: "fullName", label: "שם מלא" },
    { key: "nationalId", label: "תעודת זהות" },
    { key: "phone", label: "טלפון" },
    { key: "email", label: "אימייל" },
    { key: "city", label: "עיר" },
    { key: "address", label: "כתובת" },
  ];

  const visibleFields = fieldLabels.filter((f) => clientFields[f.key]);

  const requests = processedResult?.requests || [];

  return (
    <div className="animate-in fade-in duration-500 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-primary" />
          <h2 className="text-lg font-semibold">סיכום עיבוד הפגישה</h2>
        </div>
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowRight data-icon="inline-start" />
          חזור לעריכה
        </Button>
      </div>

      {/* Client Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="text-primary" />
            <CardTitle className="text-base">פרטי לקוח</CardTitle>
            {isExistingClient ? (
              <Badge variant="secondary">לקוח קיים</Badge>
            ) : (
              <Badge variant="outline">לקוח חדש</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {visibleFields.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {visibleFields.map((f) => (
                <div key={f.key} className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">{f.label}</span>
                  <span className="text-sm font-medium">{clientFields[f.key]}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">לא נמצאו פרטי לקוח</p>
          )}
        </CardContent>
      </Card>

      {/* Meeting Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="text-primary" />
            <CardTitle className="text-base">פרטי הפגישה</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <User className="text-muted-foreground" />
              <span className="text-sm">
                {processedResult?.agentName || <span className="text-muted-foreground">לא צוין</span>}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-muted-foreground" />
              <span className="text-sm">
                {processedResult?.meetingDate ? (
                  new Date(processedResult.meetingDate).toLocaleDateString("he-IL")
                ) : (
                  <span className="text-muted-foreground">לא צוין</span>
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="text-primary" />
            <CardTitle className="text-base">בקשות הפגישה</CardTitle>
            <Badge>{requests.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {requests.length > 0 ? (
            requests.map((req: any, idx: number) => (
              <div key={idx} className="rounded-md border p-3 flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold">{req.providerName || "—"}</span>
                  <span className="text-sm text-muted-foreground">{req.requestTypeName || ""}</span>
                  {req.managementFee != null && (
                    <Badge variant="outline">{req.managementFee}%</Badge>
                  )}
                  {req.tracks?.length > 0 && (
                    <Badge variant="secondary">מסלולים: {req.tracks.length}</Badge>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">לא זוהו בקשות בסיכום</p>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <Button onClick={onContinue} className="w-full">
          המשך לאשף
          <ArrowLeft data-icon="inline-end" />
        </Button>
        <Button variant="outline" onClick={onBack} className="w-full">
          חזור לעריכה
        </Button>
      </div>
    </div>
  );
};