import { useAgentChat as useAgentChatSDK } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { AgentChatSimple } from "@/components/ui/agent-chat";
import { MeetingAssistantAgentChat } from "@/product-types";
import { Bot } from "lucide-react";
import { useEffect, useRef } from "react";

interface WorkspaceChatPanelProps {
  clientId: string;
  clientName: string;
  agentEmail: string;
  meetingDate: string;
  meetingSummary?: string;
  initialHistory?: Array<{ role: string; content: string }>;
}

export const WorkspaceChatPanel = ({
  clientId,
  clientName,
  agentEmail,
  meetingDate,
  meetingSummary,
  initialHistory,
}: WorkspaceChatPanelProps) => {
  const agentChat = useAgentChatSDK(MeetingAssistantAgentChat);
  const hasSentRef = useRef(false);

  useEffect(() => {
    if (initialHistory && initialHistory.length > 0) return;
    if (hasSentRef.current || !meetingSummary) return;
    const timer = setTimeout(() => {
      if (!hasSentRef.current) {
        hasSentRef.current = true;
        agentChat.sendMessage({ content: meetingSummary });
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [meetingSummary, agentChat, initialHistory]);

  return (
    <div
      className="flex flex-col h-full border-l border-border bg-sidebar"
      style={{ width: 380, minWidth: 380 }}
    >
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <Bot className="text-primary" />
        <h2 className="text-lg font-bold text-primary">עוזר הפגישה</h2>
      </div>
      <div className="flex-1 overflow-hidden">
        <AgentChatSimple
          agentChat={agentChat}
          variant="bubble"
          size="md"
          chatId="meeting-workspace"
          noPersistency
          initialMessages={initialHistory && initialHistory.length > 0 ? initialHistory : undefined}
          chatContext={{
            clientId,
            clientName,
            agentEmail,
            meetingDate,
          }}
        />
      </div>
    </div>
  );
};