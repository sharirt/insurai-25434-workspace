import type { AssistantMessage } from '@blocksdiy/react-common/new-agent-chat';
import * as React from 'react';

export const DeepAgentChatAssistantMessageContext =
  React.createContext<AssistantMessage | null>(null);

export const useDeepAgentChatAssistantMessage = () =>
  React.useContext(DeepAgentChatAssistantMessageContext);
