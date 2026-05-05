import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  useEntityGetAll,
  useUser,
  useAgentChat,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import {
  ClientsEntity,
  MeetingChatWorkspacePage,
  MeetingAssistantAgentChat,
} from "@/product-types";
import { getPageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ClientCombobox } from "@/components/ClientCombobox";
import { Calendar, ArrowRight, Send, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";

export default function MeetingChatLanding() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useUser();
  const urlClientId = searchParams.get("clientId") || "";

  const { data: clients, isLoading: isLoadingClients } =
    useEntityGetAll(ClientsEntity);

  const agentChat = useAgentChat(MeetingAssistantAgentChat);

  const [selectedClientId, setSelectedClientId] = useState(urlClientId);
  const [summary, setSummary] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [assistantCountAtSend, setAssistantCountAtSend] = useState<number | null>(null);

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

  // Watch for assistant response
  useEffect(() => {
    if (assistantCountAtSend === null) return;
    if (agentChat.isProcessing) return;

    const messages = agentChat.messages || [];
    const assistantMessages = messages.filter(
      (m: any) => m.role === "assistant"
    );

    if (assistantMessages.length > assistantCountAtSend) {
      // Agent has responded - save chat history and navigate
      const chatHistory = messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      }));

      sessionStorage.setItem("meetingSummary", summary);
      sessionStorage.setItem("meetingClientId", selectedClientId);
      sessionStorage.setItem("meetingDate", meetingDate);
      sessionStorage.setItem("meetingChatHistory", JSON.stringify(chatHistory));

      const targetUrl = getPageUrl(MeetingChatWorkspacePage);
      navigate(targetUrl);
    }
  }, [
    agentChat.messages,
    agentChat.isProcessing,
    assistantCountAtSend,
    summary,
    selectedClientId,
    meetingDate,
    navigate,
  ]);

  const isDisabled = !summary.trim() || isProcessing;

  const handleSubmit = () => {
    const clientName =
      clients?.find((c) => c.id === selectedClientId)
        ? [
            clients.find((c) => c.id === selectedClientId)?.first_name,
            clients.find((c) => c.id === selectedClientId)?.last_name,
          ]
            .filter(Boolean)
            .join(" ")
        : "";

    setIsProcessing(true);
    const assistantMsgs = (agentChat.messages || []).filter((m: any) => m.role === "assistant");
    setAssistantCountAtSend(assistantMsgs.length);

    agentChat.sendMessage({
      content: summary,
      chatContext: {
        clientId: selectedClientId,
        clientName,
        agentEmail: user?.email || "",
        meetingDate,
      },
    });
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
        <div className="flex flex-col gap-1.5">
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

        <div
          className={
            isProcessing
              ? "rounded-xl border border-border bg-card p-6 flex flex-col gap-4 opacity-50 pointer-events-none"
              : "rounded-xl border border-border bg-card p-6 flex flex-col gap-4"
          }
        >
          <div className="rounded-lg p-4 bg-primary text-primary-foreground animate-in fade-in duration-500">
            <p className="text-sm leading-relaxed">
              שלום! אני כאן לעזור לך לעבד את סיכום הפגישה. שלח לי את הסיכום
              ואני אזין את הבקשות למערכת אוטומטית
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
              <Button size="lg" onClick={handleSubmit} disabled={isDisabled}>
                {isProcessing ? (
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                ) : (
                  <Send data-icon="inline-start" />
                )}
                {isProcessing ? "מעבד סיכום..." : "שלח סיכום"}
              </Button>
            </div>
          </div>
        </div>

        {isProcessing && (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center flex flex-col items-center gap-2">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="font-semibold text-foreground">
              הסוכן מנתח את הסיכום...
            </p>
            <p className="text-sm text-muted-foreground">
              אנא המתן, זה עשוי לקחת מספר שניות
            </p>
          </div>
        )}
      </div>
    </div>
  );
}