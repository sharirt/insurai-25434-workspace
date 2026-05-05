import { useEffect, useRef } from "react";
import { useAgentChat } from "@blocksdiy/react-common/agent-chat";

interface ChatAutoSenderProps {
  message: string;
}

export const ChatAutoSender = ({ message }: ChatAutoSenderProps) => {
  const { sendMessage, messages } = useAgentChat();
  const sentRef = useRef(false);

  useEffect(() => {
    if (message && !sentRef.current && messages.length === 0) {
      sentRef.current = true;
      sendMessage({ content: message });
    }
  }, [message, sendMessage, messages.length]);

  return null;
};