import { useEffect, useRef } from "react";
import { useAgentChat } from "@blocksdiy/react-common/agent-chat";

interface ChatAutoSenderProps {
  message: string;
}

export const ChatAutoSender = ({ message }: ChatAutoSenderProps) => {
  const { sendMessage } = useAgentChat();
  const sentRef = useRef(false);

  useEffect(() => {
    if (message && !sentRef.current) {
      sentRef.current = true;
      const timer = setTimeout(() => {
        sendMessage({ content: message });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [message, sendMessage]);

  return null;
};