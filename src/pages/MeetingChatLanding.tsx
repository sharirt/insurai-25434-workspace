import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useEntityGetAll } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { ClientsEntity, MeetingChatWorkspacePage } from "@/product-types";
import { getPageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClientCombobox } from "@/components/ClientCombobox";
import { Calendar, ArrowRight, Send } from "lucide-react";
import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";

export default function MeetingChatLanding() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlClientId = searchParams.get("clientId") || "";

  const { data: clients, isLoading: isLoadingClients } = useEntityGetAll(ClientsEntity);

  const [selectedClientId, setSelectedClientId] = useState(urlClientId);
  const [summary, setSummary] = useState("");

  const now = new Date();
  const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  const [meetingDate, setMeetingDate] = useState(localIso);

  useEffect(() => {
    if (urlClientId && !selectedClientId) {
      setSelectedClientId(urlClientId);
    }
  }, [urlClientId, selectedClientId]);

  const isDisabled = !selectedClientId || !summary.trim();

  const handleSubmit = () => {
    sessionStorage.setItem("meetingSummary", summary);
    sessionStorage.setItem("meetingClientId", selectedClientId);
    sessionStorage.setItem("meetingDate", meetingDate);
    navigate(getPageUrl(MeetingChatWorkspacePage));
  };

  const clientsManagerUrl = "/ClientsManager";

  return (
    <div className="min-h-screen bg-background" style={{ direction: "rtl" }}>
      <div className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto flex items-center gap-3 px-6 py-4">
          <Link to={clientsManagerUrl}>
            <Button variant="ghost" size="sm">
              <ArrowRight data-icon="inline-start" />
              חזרה
            </Button>
          </Link>
          <Calendar className="text-primary" />
          <h1 className="text-xl font-bold">פגישה חדשה</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1.5">
            <Label>לקוח</Label>
            {isLoadingClients ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <ClientCombobox
                clients={clients || []}
                selectedClientId={selectedClientId}
                onSelectClient={setSelectedClientId}
              />
            )}
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <Label>תאריך ושעה</Label>
            <Input
              type="datetime-local"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              dir="ltr"
            />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4">
          <div
            className="rounded-lg p-4 bg-primary text-primary-foreground animate-in fade-in duration-500"
          >
            <p className="text-sm leading-relaxed">
              שלום! אני כאן לעזור לך לעבד את סיכום הפגישה. שלח לי את הסיכום ואני אזין את הבקשות למערכת אוטומטית
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="הכנס כאן את סיכום הפגישה... לדוגמה: 'לקוח ישראל ישראלי, ניוד קרן פנסיה מהפניקס לאלטשולר שחם, מסלול מניות, דמי ניהול 0.1%'"
              dir="rtl"
              className="min-h-[120px]"
              rows={5}
            />
            <div className="flex justify-start">
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={isDisabled}
              >
                <Send data-icon="inline-start" />
                שלח סיכום
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}