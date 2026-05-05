import { useAgentChat as useAgentChatSDK } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { AgentChatSimple } from "@/components/ui/agent-chat";
import { MeetingAssistantAgentChat } from "@/product-types";
import { Bot } from "lucide-react";

interface ChatContext {
  clientId: string;
  clientName: string;
  agentEmail: string;
  meetingDate: string;
}

interface WorkspaceChatPanelProps {
  chatContext?: ChatContext;
}

export const WorkspaceChatPanel = ({
  chatContext,
}: WorkspaceChatPanelProps) => {
  const agentChat = useAgentChatSDK(MeetingAssistantAgentChat);

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
          chatContext={chatContext}
        />
      </div>
    </div>
  );
};