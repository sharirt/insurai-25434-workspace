import 'streamdown/styles.css';

import { AgentChat as SDKAgentChat } from '@blocksdiy/blocks-client-sdk';
import { useClient } from '@blocksdiy/blocks-client-sdk/reactSdk';
import type { AgentChatComponent } from '@blocksdiy/react-common/new-agent-chat';
import * as AgentChatPrimitive from '@blocksdiy/react-common/new-agent-chat';
import { cva, type VariantProps } from 'class-variance-authority';
import { format } from 'date-fns';
import {
  ArrowUp,
  File,
  FileImage,
  FileText,
  Loader2,
  Paperclip,
  X,
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import * as React from 'react';
import { Streamdown } from 'streamdown';
import { z } from 'zod';

import { ChatCodeComponent } from '@/components/ui/agent-chat-code-component';
import { AgentChatLoadingDots } from '@/components/ui/agent-chat-loading-dots';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ASK_USER_TOOL_NAME,
  AskQuestionSkipped,
  AskQuestionTool,
  type AskUserParameters,
  type AskUserSubmittedAnswer,
  askUserParametersSchema,
} from '@/components/ui/deep-agent-chat-ask-user';
import { ToolCallFallback } from '@/components/ui/deep-agent-chat-tool-fallback';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export const agentChatContentVariants = cva(
  'flex flex-col overflow-hidden h-full w-full',
  {
    variants: {
      variant: {
        bubble: '',
        minimal: '',
      },
      userPosition: {
        side: '',
        bottom: '',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    defaultVariants: {
      variant: 'bubble',
      userPosition: 'side',
      size: 'md',
    },
  },
);

export const agentChatMessagesVariants = cva('flex flex-col', {
  variants: {
    size: {
      sm: 'p-2',
      md: 'p-2',
      lg: 'p-3',
    },
    variant: {
      bubble: '',
      minimal: '',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'bubble',
  },
});

export const agentChatMessageTimestampVariants = cva(
  'flex items-center opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100',
  {
    variants: {
      variant: {
        bubble: '',
        minimal: '',
      },
      role: {
        user: '',
        assistant: '',
      },
      userPosition: {
        side: '',
        bottom: '',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    compoundVariants: [
      {
        variant: 'bubble',
        size: 'sm',
        className: 'px-2 py-1',
      },
      {
        variant: 'bubble',
        size: 'md',
        className: 'px-3 py-1.5',
      },
      {
        variant: 'bubble',
        size: 'lg',
        className: 'px-4 py-2',
      },
      {
        userPosition: 'bottom',
        size: 'sm',
        className: 'gap-2',
      },
      {
        userPosition: 'bottom',
        size: 'md',
        className: 'gap-2',
      },
      {
        userPosition: 'bottom',
        size: 'lg',
        className: 'gap-3',
      },
      {
        variant: 'bubble',
        role: 'assistant',
        className: 'flex-row',
      },
      {
        variant: 'bubble',
        role: 'user',
        className: 'flex-row-reverse',
      },
    ],
    defaultVariants: {
      variant: 'bubble',
      userPosition: 'side',
      size: 'md',
      role: 'assistant',
    },
  },
);

export const messageVariants = cva('group relative flex transition-colors', {
  variants: {
    variant: {
      bubble: '',
      minimal: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    role: {
      user: '',
      assistant: '',
    },
  },
  compoundVariants: [
    {
      variant: 'bubble',
      size: 'sm',
      className: 'p-2 gap-2',
    },
    {
      variant: 'bubble',
      size: 'md',
      className: 'p-2 gap-2',
    },
    {
      variant: 'bubble',
      size: 'lg',
      className: 'p-3 gap-3',
    },
    {
      variant: 'bubble',
      role: 'assistant',
      className: 'flex-row',
    },
    {
      variant: 'bubble',
      role: 'user',
      className: 'flex-row-reverse',
    },
  ],
  defaultVariants: {
    variant: 'bubble',
    size: 'md',
    role: 'assistant',
  },
});

export const messageContentVariants = cva('relative flex flex-col', {
  variants: {
    variant: {
      bubble: '',
      minimal: 'max-w-none',
    },
    size: {
      sm: 'gap-y-2',
      md: 'gap-y-3',
      lg: 'gap-y-4',
    },
    role: {
      user: '',
      assistant: '',
    },
  },
  compoundVariants: [
    {
      role: 'user',
      variant: 'bubble',
      className:
        'bg-primary text-primary-foreground rounded-lg max-w-full md:max-w-[70%]',
    },
    {
      role: 'assistant',
      variant: 'bubble',
      className: 'max-w-full',
    },
    {
      variant: 'bubble',
      size: 'sm',
      className: 'px-2 py-1',
    },
    {
      variant: 'bubble',
      size: 'md',
      className: 'px-3 py-1.5',
    },
    {
      variant: 'bubble',
      size: 'lg',
      className: 'px-4 py-2',
    },
    {
      variant: 'minimal',
      className: '!px-0 !py-0 !ml-0 !mr-0',
    },
    {
      size: 'sm',
      className: 'min-h-8',
    },
    {
      size: 'md',
      className: 'min-h-9',
    },
    {
      size: 'lg',
      className: 'min-h-10',
    },
  ],
  defaultVariants: {
    size: 'md',
    variant: 'bubble',
  },
});

export const agentChatFooterVariants = cva('flex flex-col border-t shrink-0', {
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const agentChatFetchingContentVariants = cva(
  'flex flex-col items-center',
  {
    variants: {
      size: {
        sm: 'gap-2 [&>svg]:h-7 [&>svg]:w-7 [&>span]:text-sm',
        md: 'gap-2 [&>svg]:h-9 [&>svg]:w-9 [&>span]:text-base',
        lg: 'gap-3 [&>svg]:h-11 [&>svg]:w-11 [&>span]:text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const agentChatAvatarVariants = cva('shrink-0', {
  variants: {
    role: {
      user: '',
      assistant: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    userPosition: {
      side: '',
      bottom: 'h-7 w-7',
    },
  },
  compoundVariants: [
    {
      userPosition: 'side',
      size: 'sm',
      className: 'h-6 w-6',
    },
    {
      userPosition: 'side',
      size: 'md',
      className: 'h-8 w-8',
    },
    {
      userPosition: 'side',
      size: 'lg',
      className: 'h-10 w-10',
    },
  ],
  defaultVariants: {
    role: 'assistant',
    size: 'md',
    userPosition: 'side',
  },
});

export const agentChatAvatarFallbackVariants = cva('', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
    userPosition: {
      side: '',
      bottom: 'text-sm',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const agentChatMessageContentWrapperVariants = cva(
  'flex flex-col flex-1',
  {
    variants: {
      variant: {
        bubble: '',
        minimal: '',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
      role: {
        user: '',
        assistant: '',
      },
    },
    compoundVariants: [
      {
        variant: 'minimal',
        size: 'md',
        className: 'gap-1',
      },
      {
        variant: 'minimal',
        size: 'lg',
        className: 'gap-1',
      },
      {
        variant: 'bubble',
        size: 'sm',
        className: '',
      },
      {
        variant: 'bubble',
        size: 'md',
        className: '',
      },
      {
        variant: 'bubble',
        size: 'lg',
        className: '',
      },
      {
        role: 'user',
        variant: 'bubble',
        className: 'items-end',
      },
      {
        role: 'assistant',
        variant: 'bubble',
        className: 'items-start',
      },
    ],
    defaultVariants: {
      variant: 'bubble',
      size: 'md',
      role: 'assistant',
    },
  },
);

const agentChatMessageAttachmentsVariants = cva('flex flex-wrap', {
  variants: {
    variant: {
      bubble: '',
      minimal: '',
    },
    role: {
      user: '',
      assistant: '',
    },
    size: {
      sm: 'gap-2',
      md: 'gap-2',
      lg: 'gap-3',
    },
  },
  compoundVariants: [
    {
      variant: 'bubble',
      role: 'assistant',
      className: 'flex-row',
    },
    {
      variant: 'bubble',
      role: 'user',
      className: 'flex-row-reverse',
    },
  ],
  defaultVariants: {
    variant: 'bubble',
    role: 'assistant',
    size: 'md',
  },
});

const agentChatFooterAttachmentsVariants = cva('flex overflow-auto pb-0', {
  variants: {
    size: {
      sm: 'gap-2 p-2',
      md: 'gap-2 p-2',
      lg: 'gap-3 p-3',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const agentChatAttachmentBadgeVariants = cva(
  'inline-flex items-center justify-center [&>svg]:h-4 [&>svg]:w-4 shrink-0',
  {
    variants: {
      size: {
        sm: 'text-sm gap-1 px-2 h-7 max-w-[150px]',
        md: 'text-base gap-1.5 px-3 h-9 max-w-[200px]',
        lg: 'text-lg gap-2 px-4 h-11 max-w-[250px]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const agentChatInputVariants = cva(
  'resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none [field-sizing:content] min-h-[auto]',
  {
    variants: {
      size: {
        sm: 'p-2 text-sm md:text-sm leading-4',
        md: 'p-2 text-sm md:text-base leading-6',
        lg: 'p-2 text-lg md:text-lg leading-6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) {
    return FileImage;
  }

  if (fileType.includes('pdf') || fileType.includes('doc')) {
    return FileText;
  }

  return File;
};

export type Message = AgentChatPrimitive.Message;
export type Attachment = AgentChatPrimitive.Attachment;

interface AgentChatAttachmentBadgeProps extends VariantProps<
  typeof agentChatAttachmentBadgeVariants
> {
  attachment: Attachment;
  onRemove?: () => void;
  className?: string;
}

function AgentChatAttachmentBadge({
  attachment,
  onRemove,
  size = 'md',
  className,
}: AgentChatAttachmentBadgeProps) {
  const Icon = getFileIcon(attachment.fileType);

  return (
    <Badge
      variant="outline"
      className={cn(
        'group/attachment',
        agentChatAttachmentBadgeVariants({ size }),
        className,
      )}
    >
      <Icon className="shrink-0" />
      <span className="font-normal truncate grow">{attachment.fileName}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="shrink-0 hover:bg-accent rounded-full p-1 -m-1 [&>svg]:h-4 [&>svg]:w-4 invisible group-hover/attachment:visible"
          aria-label="Remove attachment"
        >
          <X />
          <span className="sr-only">Remove attachment</span>
        </button>
      )}
    </Badge>
  );
}

export interface AgentChatMessageProps {
  message: Message;
  index: number;
  showTimestamp?: boolean;
  dateFormat?: string;
  userPosition?: 'side' | 'bottom';
  hideAvatar?: boolean;
  renderToolCall: ReturnType<typeof AgentChatPrimitive.useRenderToolCall>;
}

function AgentChatAvatar({
  role = 'assistant',
  size = 'md',
  userPosition = 'side',
  className,
}: VariantProps<typeof agentChatAvatarVariants> & {
  className?: string;
}) {
  const client = useClient();
  const user = client.getUser();
  const { agent } = useAgentChat();

  const displayName = React.useMemo(() => {
    if (role === 'assistant') {
      if (agent?.title) {
        const agentChatInitials = agent.title
          .split(' ')
          .map((word) => word[0])
          .join('')
          .toUpperCase();
        return agentChatInitials;
      }
      return 'AI';
    }

    if (!user) {
      return 'U';
    }

    const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`;
    return initials || 'U';
  }, [role, user.firstName, user.lastName, agent?.title]);

  return (
    <Avatar
      className={cn(
        agentChatAvatarVariants({
          role,
          size,
          userPosition,
          className,
        }),
      )}
    >
      <AvatarImage
        src={role === 'user' ? user.profileImageUrl : agent?.photoUrl}
      />
      <AvatarFallback
        className={agentChatAvatarFallbackVariants({
          size,
          userPosition,
        })}
      >
        {displayName}
      </AvatarFallback>
    </Avatar>
  );
}

const getMessageAttachments = (message: Message): Attachment[] => {
  const attachmentsValue = (
    message as { attachments?: Attachment[] | { attachments?: Attachment[] } }
  ).attachments;
  if (Array.isArray(attachmentsValue)) {
    return attachmentsValue;
  }
  return attachmentsValue?.attachments || [];
};

const getMessageCreatedAt = (message: Message): string | undefined => {
  return (message as { createdAt?: string }).createdAt;
};

const extractMessageText = (content: unknown): string => {
  if (!content) {
    return '';
  }
  if (typeof content === 'string') {
    return content;
  }
  if (!Array.isArray(content)) {
    return '';
  }
  return content
    .map((part) => {
      if (!part || typeof part !== 'object') {
        return '';
      }
      const typed = part as { type?: unknown; text?: unknown };
      if (typed.type !== 'text') {
        return '';
      }
      return typeof typed.text === 'string' ? typed.text : '';
    })
    .join('');
};

type ToolCallForDisplay = NonNullable<
  Extract<AgentChatPrimitive.Message, { role: 'assistant' }>['toolCalls']
>[number];

const dedupeMessagesById = (messages: AgentChatPrimitive.Message[]) => {
  // CopilotKit/AG-UI can briefly provide overlapping live + replayed messages
  // with the same id. Render one message per id and keep React keys stable.
  const byId = new Map<string, AgentChatPrimitive.Message>();
  for (const message of messages) {
    byId.set(message.id, message);
  }
  return Array.from(byId.values());
};

const chatComponentParametersSchema = z.object({}).loose();

const GENERATE_DYNAMIC_CHAT_COMPONENT_TOOL_NAME =
  'generate_dynamic_chat_component';

type ChatComponentWithToolName = AgentChatComponent & { toolName?: string };

const getChatComponentToolName = (component: ChatComponentWithToolName) => {
  return (
    component.toolName ??
    component.name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()
  );
};

const parseAskUserToolResult = (
  result?: string,
):
  | {
      status?: 'answered' | 'skipped';
      answers?: AskUserSubmittedAnswer[];
    }
  | undefined => {
  if (!result) {
    return undefined;
  }
  try {
    return JSON.parse(result) as {
      status?: 'answered' | 'skipped';
      answers?: AskUserSubmittedAnswer[];
    };
  } catch {
    return undefined;
  }
};

function useAskUserSubmissionState({
  answers,
  isThinking,
  messages,
  toolCallId,
}: {
  answers?: AskUserSubmittedAnswer[];
  isThinking: boolean;
  messages: AgentChatPrimitive.Message[];
  toolCallId?: string;
}) {
  const [submittedAnswers, setSubmittedAnswers] = React.useState<
    AskUserSubmittedAnswer[] | undefined
  >();
  const [isPostSubmitWaitComplete, setIsPostSubmitWaitComplete] =
    React.useState(false);
  const [hasObservedPostSubmitThinking, setHasObservedPostSubmitThinking] =
    React.useState(false);
  const visibleAnswers = answers ?? submittedAnswers;
  const toolCallOwnerIndex = toolCallId
    ? messages.findIndex(
        (message) =>
          message.role === 'assistant' &&
          (message as { toolCalls?: { id?: string }[] }).toolCalls?.some(
            (toolCall) => toolCall.id === toolCallId,
          ),
      )
    : -1;
  const hasNewerAssistantMessage =
    toolCallOwnerIndex >= 0 &&
    messages
      .slice(toolCallOwnerIndex + 1)
      .some((message) => message.role === 'assistant');
  const isWaitingForAgentAfterSubmit = Boolean(
    submittedAnswers && !hasNewerAssistantMessage && !isPostSubmitWaitComplete,
  );

  React.useEffect(() => {
    if (!submittedAnswers) {
      return;
    }
    if (isThinking) {
      setHasObservedPostSubmitThinking(true);
      return;
    }
    if (hasNewerAssistantMessage || hasObservedPostSubmitThinking) {
      setIsPostSubmitWaitComplete(true);
    }
  }, [
    hasNewerAssistantMessage,
    hasObservedPostSubmitThinking,
    isThinking,
    submittedAnswers,
  ]);

  const handleSubmittedAnswers = React.useCallback(
    (nextAnswers: AskUserSubmittedAnswer[]) => {
      setSubmittedAnswers(nextAnswers);
      setHasObservedPostSubmitThinking(false);
      setIsPostSubmitWaitComplete(false);
    },
    [],
  );

  return {
    visibleAnswers,
    isWaitingForAgentAfterSubmit,
    handleSubmittedAnswers,
  };
}

const AskUserToolResult = ({
  status,
  result,
  args,
  respond,
  toolCallId,
}: {
  result?: string;
  status: AgentChatPrimitive.ToolCallStatus;
  args: AskUserParameters;
  respond?: (result: unknown) => Promise<void>;
  toolCallId?: string;
}) => {
  const { messages, isThinking } = useAgentChat();
  const questions = args?.questions || [];
  const submitButtonText = args?.submitButtonText;
  const parsedResult = parseAskUserToolResult(result);
  const answers = parsedResult?.answers;
  const {
    visibleAnswers,
    isWaitingForAgentAfterSubmit,
    handleSubmittedAnswers,
  } = useAskUserSubmissionState({
    answers,
    isThinking,
    messages,
    toolCallId,
  });

  if (
    status === AgentChatPrimitive.ToolCallStatus.InProgress &&
    questions.length === 0
  ) {
    return <AgentChatLoadingDots className="text-[2px]" />;
  }

  if (parsedResult?.status === 'skipped') {
    return (
      <AskQuestionSkipped
        questions={questions}
        submitButtonText={submitButtonText}
      />
    );
  }

  return (
    <AskQuestionTool
      questions={questions}
      submitButtonText={submitButtonText}
      answers={visibleAnswers}
      respond={respond}
      onSubmittedAnswers={handleSubmittedAnswers}
      isWaitingForAgentAfterSubmit={isWaitingForAgentAfterSubmit}
    />
  );
};

const GenerateDynamicChatComponentToolResult = ({
  status,
  result,
}: {
  toolCallId: string;
  result?: string;
  status: AgentChatPrimitive.ToolCallStatus;
  parameters: Record<string, unknown>;
}) => {
  const { code, props } = result
    ? JSON.parse(result)
    : { code: undefined, props: undefined };
  return <ChatCodeComponent status={status} code={code} props={props} />;
};

const ChatComponentToolResult = ({
  status,
  component,
  parameters,
}: {
  status: AgentChatPrimitive.ToolCallStatus;
  toolCallId: string;
  component: ChatComponentWithToolName;
  parameters: Record<string, unknown>;
}) => {
  return (
    <ChatCodeComponent
      status={status}
      code={component.code}
      props={parameters}
    />
  );
};

const isVisibleToolCall = (
  toolCall: ToolCallForDisplay,
  agentChat: AgentChatPrimitive.AgentChat | null,
  components: AgentChatComponent[],
) => {
  const toolCallName = toolCall.function.name;
  const isToolCallChatComponent = components.some(
    (component) => getChatComponentToolName(component) === toolCallName,
  );
  if (isToolCallChatComponent) {
    return true;
  }

  switch (toolCallName) {
    case ASK_USER_TOOL_NAME:
    case GENERATE_DYNAMIC_CHAT_COMPONENT_TOOL_NAME:
      return true;
    default: {
      if (agentChat?.hideToolsUi === true) {
        return false;
      }

      return true;
    }
  }
};

interface MessageTextContentProps {
  /** Raw `message.content` — string, multi-modal array, or undefined. */
  content: unknown;
  /** True while the agent is actively producing this turn's tokens. */
  isStreaming: boolean;
  className?: string;
}

function MessageTextContent({
  content,
  isStreaming,
  className,
}: MessageTextContentProps) {
  const text = extractMessageText(content);

  if (!text) {
    return null;
  }

  return (
    <Streamdown
      mode={isStreaming ? 'streaming' : 'static'}
      animated={{ animation: 'fadeIn' }}
      isAnimating={isStreaming}
      className={className}
    >
      {text}
    </Streamdown>
  );
}

export type AgentChatMessageComponentProps = AgentChatMessageProps &
  VariantProps<typeof messageVariants> &
  React.ComponentProps<'div'>;

export function AgentChatMessage({
  message,
  index,
  variant = 'bubble',
  size = 'md',
  userPosition = 'side',
  hideAvatar = false,
  showTimestamp = true,
  dateFormat = 'HH:mm',
  renderToolCall,
  className,
  ...props
}: AgentChatMessageComponentProps) {
  const client = useClient();
  const user = client.getUser();
  const { messages, isThinking, agentChat, components } = useAgentChat();

  if (message.role !== 'user' && message.role !== 'assistant') {
    return null;
  }

  const messageContent =
    variant === 'minimal' && userPosition === 'side'
      ? `**${message.role === 'user' ? user.firstName || 'You' : 'AI'}:** ${extractMessageText(message.content)}`
      : message.content;
  const latestAssistantMessage = [...messages]
    .reverse()
    .find((m) => m.role === 'assistant');
  const toolMessages = messages.filter((m) => m.role === 'tool');
  const visibleToolCalls =
    message.role === 'assistant'
      ? message.toolCalls?.filter((toolCall) =>
          isVisibleToolCall(toolCall, agentChat, components ?? []),
        )
      : undefined;
  const hasVisibleToolCalls = Boolean(visibleToolCalls?.length);
  const hasMessageText = Boolean(extractMessageText(message.content));
  const isStreamingMessage = Boolean(
    isThinking &&
    latestAssistantMessage?.id === message.id &&
    hasMessageText &&
    !hasVisibleToolCalls,
  );
  const hasAttachments = getMessageAttachments(message).length > 0;
  const isAssistantPlaceholder = Boolean(
    message.role === 'assistant' &&
    isThinking &&
    latestAssistantMessage?.id === message.id &&
    !hasMessageText &&
    !hasAttachments &&
    !hasVisibleToolCalls,
  );
  const createdAt = getMessageCreatedAt(message)
    ? new Date(getMessageCreatedAt(message) || '')
    : null;
  const timestampText =
    createdAt && !Number.isNaN(createdAt.getTime())
      ? format(createdAt, dateFormat)
      : 'Invalid date';

  if (
    message.role === 'assistant' &&
    !isStreamingMessage &&
    !isAssistantPlaceholder &&
    !hasMessageText &&
    !hasAttachments &&
    !hasVisibleToolCalls
  ) {
    return null;
  }

  return (
    <AgentChatPrimitive.AgentChatMessage
      message={message}
      index={index}
      className={cn(
        messageVariants({ size, role: message.role }),
        // Tighten the bottom gap when the next message is in the same role
        // group (consecutive user / assistant turns sit closer together).
        '[&[data-message-role=user]:has(+[data-message-role=user])]:pb-0',
        '[&[data-message-role=assistant]:has(+[data-message-role=assistant])]:pb-0',
        className,
      )}
      {...props}
    >
      {!hideAvatar &&
        variant === 'bubble' &&
        userPosition === 'side' &&
        message.role === 'assistant' && (
          <AgentChatAvatar
            role={message.role}
            size={size}
            userPosition={userPosition}
            className={cn(
              '[[data-message-role=assistant]+[data-message-role=assistant]_&]:invisible',
            )}
          />
        )}

      <div
        className={agentChatMessageContentWrapperVariants({
          size,
          variant,
          role: message.role,
        })}
      >
        <div
          data-slot="agent-chat-message-content"
          className={cn(
            messageContentVariants({
              size,
              role: message.role,
              variant,
            }),
          )}
        >
          <MessageTextContent
            content={messageContent}
            isStreaming={isStreamingMessage}
            className={cn(
              'prose-p:my-0',
              message.role === 'user' &&
                variant === 'bubble' &&
                'text-primary-foreground [&_[data-streamdown=link].text-primary]:!text-primary-foreground [&_[data-streamdown=link]]:underline-offset-2 [&_code]:bg-primary-foreground/15 [&_code]:text-primary-foreground',
            )}
          />
          {visibleToolCalls?.map((toolCall) => {
            const toolMessage = toolMessages.find(
              (m) => m.toolCallId === toolCall.id,
            );
            const toolCallElement = renderToolCall({
              toolCall,
              toolMessage,
            });

            return (
              <React.Fragment key={toolCall.id}>
                {toolCallElement}
              </React.Fragment>
            );
          })}
          <AnimatePresence initial={false}>
            {isAssistantPlaceholder && (
              <AgentChatLoadingDots
                key="assistant-loading"
                className={cn(
                  'absolute top-1/2 -translate-y-1/2',
                  size === 'sm'
                    ? 'left-2 text-[2px]'
                    : size === 'lg'
                      ? 'left-4 text-[2px]'
                      : 'left-3 text-[2px]',
                )}
              />
            )}
          </AnimatePresence>
        </div>

        {getMessageAttachments(message).length > 0 && (
          <div
            data-slot="agent-chat-message-attachments"
            className={agentChatMessageAttachmentsVariants({
              size,
              variant,
              role: message.role,
            })}
          >
            {getMessageAttachments(message).map((attachment, i) => (
              <AgentChatAttachmentBadge
                key={i}
                attachment={attachment}
                size={size}
              />
            ))}
          </div>
        )}
        {showTimestamp &&
          (hasMessageText ||
            hasVisibleToolCalls ||
            hasAttachments ||
            isAssistantPlaceholder) && (
            <div
              data-slot="agent-chat-message-timestamp"
              // Visible only on the last message of a same-role group — when
              // the message has another same-role message immediately after,
              // remove the timestamp from layout entirely; the group's tail
              // surfaces its own.
              className={cn(
                agentChatMessageTimestampVariants({
                  variant,
                  userPosition,
                  size,
                  role: message.role,
                }),
                message.role === 'assistant' &&
                  userPosition === 'side' &&
                  'opacity-100',
                '[[data-message-role=user]:has(+[data-message-role=user])_&]:hidden',
                '[[data-message-role=assistant]:has(+[data-message-role=assistant])_&]:hidden',
              )}
            >
              {!hideAvatar &&
                userPosition === 'bottom' &&
                message.role === 'assistant' && (
                  <AgentChatAvatar
                    role={message.role}
                    size={size}
                    userPosition={userPosition}
                  />
                )}
              <span
                className={cn(
                  'text-xs text-muted-foreground',
                  message.role === 'assistant' &&
                    userPosition === 'side' &&
                    'opacity-0 transition-opacity group-hover:opacity-100',
                  !(createdAt && !Number.isNaN(createdAt.getTime())) &&
                    'invisible',
                )}
              >
                {timestampText}
              </span>
            </div>
          )}
      </div>
    </AgentChatPrimitive.AgentChatMessage>
  );
}

export interface AgentChatThinkingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'bubble' | 'minimal';
  userPosition?: 'side' | 'bottom';
}

export type AgentChatThinkingComponentProps = AgentChatThinkingProps &
  React.ComponentProps<'div'>;

export function AgentChatThinking(_props: AgentChatThinkingComponentProps) {
  return null;
}

export type AgentChatFetchingProps = VariantProps<
  typeof agentChatFetchingContentVariants
> &
  React.ComponentProps<'div'>;

export function AgentChatFetching({
  size = 'md',
  className,
  ...props
}: AgentChatFetchingProps) {
  return (
    <AgentChatPrimitive.AgentChatFetching
      className={cn(
        'absolute inset-0 bg-background',
        'flex items-center justify-center',
        'transition-opacity duration-200 ease-out',
        'data-[state=open]:opacity-100 data-[state=closed]:opacity-0',
        'data-[state=open]:pointer-events-auto data-[state=closed]:pointer-events-none',
        className,
      )}
      {...props}
    >
      <div className={agentChatFetchingContentVariants({ size })}>
        <Loader2 className="animate-spin text-muted-foreground/60" />
      </div>
    </AgentChatPrimitive.AgentChatFetching>
  );
}

export interface AgentChatProps {
  agentChat: SDKAgentChat;
  chatId?: string;
  defaultThreadId?: string;
  noPersistency?: boolean;
  chatContext?: any;
  chatContextFiles?: Attachment[];
  useAgentBlockDirectChat?: boolean;
  children?: React.ReactNode;
}

export function AgentChat({
  agentChat,
  chatContext,
  noPersistency,
  useAgentBlockDirectChat,
  ...props
}: AgentChatProps) {
  const client = useClient();
  const user = client.getUser();
  const agentChatProps = agentChat.getAgentChatComponentProps() as ReturnType<
    typeof agentChat.getAgentChatComponentProps
  > & {
    agentId?: string;
    agentHarness?: string;
    componentIds?: string[];
  };
  const { agentChatId, agentId, agentHarness, componentIds, appId, token } =
    agentChatProps;

  const finalChatContext = {
    currentUserData: user,
    chatContext,
  };

  return (
    <AgentChatPrimitive.AgentChatRoot
      appId={appId}
      token={token}
      agentId={agentId}
      agentHarness={agentHarness}
      useAgentBlockDirectChat={useAgentBlockDirectChat}
      agentChatId={agentChatId}
      noPersistency={noPersistency || !user.isAuthenticated}
      chatContext={finalChatContext}
      componentIds={componentIds}
      {...props}
    />
  );
}

const ToolCall = () => {
  AgentChatPrimitive.useDefaultRenderTool({
    render: ({ name, parameters, status, result }) => (
      <ToolCallFallback
        name={name}
        parameters={parameters}
        status={status}
        result={result}
      />
    ),
  });

  return null;
};

const GenerateDynamicChatComponentToolCall = () => {
  AgentChatPrimitive.useRenderTool(
    {
      name: GENERATE_DYNAMIC_CHAT_COMPONENT_TOOL_NAME,
      parameters: z.object({}).loose(),
      render: ({ toolCallId, status, result, parameters }) => {
        return (
          <GenerateDynamicChatComponentToolResult
            toolCallId={toolCallId}
            status={status as AgentChatPrimitive.ToolCallStatus}
            result={result}
            parameters={parameters}
          />
        );
      },
    },
    [],
  );

  return null;
};

const ChatComponentToolCall = ({
  component,
}: {
  component: ChatComponentWithToolName;
}) => {
  AgentChatPrimitive.useRenderTool(
    {
      name: getChatComponentToolName(component),
      parameters: chatComponentParametersSchema,
      render: ({ toolCallId, status, parameters }) => {
        return (
          <ChatComponentToolResult
            toolCallId={toolCallId}
            status={status as AgentChatPrimitive.ToolCallStatus}
            component={component}
            parameters={parameters}
          />
        );
      },
    },
    [],
  );

  return null;
};

export type AgentChatContentProps = VariantProps<
  typeof agentChatContentVariants
> &
  React.ComponentProps<'div'>;

export function AgentChatContent({
  variant = 'bubble',
  size = 'md',
  userPosition = 'side',
  className,
  ...props
}: AgentChatContentProps) {
  // ============================================================================
  // MIGRATION CANDIDATE — tool-call HITL, replace with interrupt-based HITL
  // ============================================================================
  //
  // `ask_user` is registered as FRONTEND TOOL-CALL HITL (Model A) only
  // because our postgres checkpointer is feature-flag-gated off (see
  // `apps/wf-actions-py/src/actions/ai/services/checkpointer_resolver.py`).
  // The "skeleton-on-refresh" fix for this model lives in
  // `apps/wf-actions-py/src/actions/ai/services/agent_chat_connect_action.py`
  // — that whole module is also a removal candidate; see its header
  // for the joint migration plan and full file set.
  //
  // TRIGGER FOR MIGRATION: when the checkpointer becomes always-on,
  // replace this block with ONE of:
  //   B1. Add `interrupt_on={"ask_user": True}` to the DeepAgents
  //       config on the BE. This hook can stay mostly the same but
  //       the form would render from an interrupt event instead of
  //       the tool's `executing` status. Smaller change.
  //   B2. Rewrite `ask_user` as a graph node that calls
  //       `langgraph.types.interrupt(...)` directly, and replace this
  //       `useHumanInTheLoop` with `useLangGraphInterrupt`. More
  //       idiomatic LangGraph; larger change.
  //
  // Either path unlocks native `Command(resume=...)` (no re-prompting
  // the model with stale context) and lets
  // `ag_ui_langgraph.prepare_stream` re-emit the pending question on
  // connect natively — at which point the custom connect action is
  // deletable too.
  //
  // DO NOT preemptively send `forwarded_props.command.resume` from the
  // FE on answer — until B1/B2 is done there's no paused task to feed
  // it into, so it's a no-op.
  AgentChatPrimitive.useHumanInTheLoop(
    {
      name: ASK_USER_TOOL_NAME,
      parameters: askUserParametersSchema,
      render: (renderProps) => {
        return (
          <AskUserToolResult
            args={renderProps.args as AskUserParameters}
            status={renderProps.status}
            result={renderProps.result}
            respond={renderProps.respond}
            toolCallId={(renderProps as { toolCallId?: string }).toolCallId}
          />
        );
      },
    },
    [],
  );

  return (
    <div
      data-slot="agent-chat-content"
      className={cn(
        agentChatContentVariants({ variant, size, userPosition, className }),
        'relative',
      )}
      {...props}
    />
  );
}

export interface AgentChatMessagesProps {
  showTimestamps?: boolean;
  dateFormat?: string;
  userPosition?: 'side' | 'bottom';
  hideAvatar?: boolean;
  messageClassName?: string;
}

export type AgentChatMessagesComponentProps = AgentChatMessagesProps &
  VariantProps<typeof messageVariants> &
  React.ComponentProps<'div'>;

export function AgentChatMessages({
  variant = 'bubble',
  size = 'md',
  userPosition = 'side',
  hideAvatar = false,
  showTimestamps = true,
  dateFormat = 'HH:mm',
  messageClassName,
  className,
  ...props
}: AgentChatMessagesComponentProps) {
  const { messages, agentChat, components } = useAgentChat();
  const renderToolCall = AgentChatPrimitive.useRenderToolCall();
  const displayMessages = dedupeMessagesById(messages);

  return (
    <AgentChatPrimitive.AgentChatMessages
      scrollAreaClassName="flex-1 relative"
      className={cn(agentChatMessagesVariants({ variant, size }), className)}
      {...props}
    >
      {displayMessages.map((message, index) => (
        <AgentChatMessage
          key={message.id}
          message={message}
          index={index}
          variant={variant}
          size={size}
          userPosition={userPosition}
          hideAvatar={hideAvatar}
          showTimestamp={showTimestamps}
          dateFormat={dateFormat}
          renderToolCall={renderToolCall}
          className={messageClassName}
        />
      ))}
      {agentChat?.hideToolsUi === true ? null : <ToolCall />}
      {agentChat?.disableGeneratingDynamicChatComponent === true ? null : (
        <GenerateDynamicChatComponentToolCall />
      )}
      {components.map((component) => (
        <ChatComponentToolCall
          key={`chat-component-tool-call-${component.id}`}
          component={component}
        />
      ))}
    </AgentChatPrimitive.AgentChatMessages>
  );
}

export interface AgentChatInputProps {
  sendOnEnter?: boolean;
}

export type AgentChatInputComponentProps = AgentChatInputProps &
  VariantProps<typeof agentChatInputVariants> &
  React.ComponentProps<'textarea'>;

export function AgentChatInput({
  className,
  onSubmit,
  size = 'md',
  sendOnEnter = true,
  placeholder = 'Type a message...',
  ...props
}: AgentChatInputComponentProps) {
  return (
    <AgentChatPrimitive.AgentChatInput asChild>
      <Textarea
        placeholder={placeholder}
        className={cn(agentChatInputVariants({ size }), className)}
        onSubmit={sendOnEnter ? undefined : onSubmit}
        {...props}
      />
    </AgentChatPrimitive.AgentChatInput>
  );
}

export interface AgentChatFooterProps {
  withVoice?: boolean;
  inputClassName?: string;
  sendButtonClassName?: string;
  attachmentButtonClassName?: string;
}

export type AgentChatFooterComponentProps = AgentChatFooterProps &
  VariantProps<typeof agentChatFooterVariants> &
  React.ComponentProps<'div'>;

export function AgentChatFooter({
  withVoice = false,
  ...props
}: AgentChatFooterComponentProps) {
  if (withVoice) {
    return <AgentChatFooterInner withVoice {...props} />;
  }

  return <AgentChatFooterInner {...props} />;
}

export function AgentChatFooterInner({
  size = 'md',
  className,
  inputClassName,
  sendButtonClassName,
  attachmentButtonClassName,
  // withVoice = false,
  children,
  ...props
}: AgentChatFooterComponentProps) {
  const { attachments, removeAttachment, agentChat } = useAgentChat();
  const disableAttachments = agentChat
    ? agentChat.disableAttachments === true
    : true;
  // const { isConnected, isConnecting, isSpeaking, stream, startVoiceCall, endVoiceCall } =
  //   AgentChatPrimitive.useAgentChatVoice();

  // const isVoiceActive = withVoice && (isConnected || isConnecting);
  const iconSize = 'icon';
  const iconButtonClassName = cn(
    size === 'sm' && 'h-9 w-9 [&_svg]:size-4',
    size === 'md' && '[&_svg]:size-5',
    size === 'lg' && 'h-11 w-11 [&_svg]:size-5',
  );
  const isVoiceActive = false;

  return (
    <div
      className={cn(agentChatFooterVariants({ size, className }))}
      {...props}
    >
      {isVoiceActive ? (
        <div
          className={cn(
            'flex items-center',
            size === 'lg' ? 'gap-3 p-3' : 'gap-2 p-2',
          )}
        >
          {/* <LiveWaveform
              active={isConnected && !isSpeaking}
              processing={isConnecting || isSpeaking}
              stream={stream}
              mode="scrolling"
              height={size === "lg" ? 76 : 64}
              barWidth={3}
              barGap={2}
              fadeEdges
              style={{
                transition: "color 0.2s ease-in-out",
                color: isSpeaking
                  ? "var(--muted-foreground)"
                  : !isConnected || isConnecting
                    ? "var(--muted-foreground)"
                    : "var(--primary)",
              }}
            />
            <Button
              onClick={endVoiceCall}
              variant="outline"
              size={size === "sm" || size === "md" ? "sm" : "md"}
            >
              <X />
              <span>{isConnecting ? "Connecting..." : "Voice mode"}</span>
            </Button> */}
        </div>
      ) : (
        <>
          {!disableAttachments && attachments.length > 0 && (
            <div className={agentChatFooterAttachmentsVariants({ size })}>
              {attachments.map((attachment) => (
                <AgentChatAttachmentBadge
                  key={attachment.url}
                  attachment={attachment}
                  size={size}
                  onRemove={() => removeAttachment(attachment.url)}
                />
              ))}
            </div>
          )}

          <div
            className={cn(
              'flex items-end',
              size === 'lg' ? 'gap-3 p-3' : 'gap-2 p-2',
            )}
          >
            <AgentChatInput
              size={size}
              className={cn('flex-1 min-w-0', inputClassName)}
            />

            {!disableAttachments && (
              <AgentChatPrimitive.AgentChatAttachmentTrigger asChild>
                <Button
                  size={iconSize}
                  variant="outline"
                  className={cn(iconButtonClassName, attachmentButtonClassName)}
                >
                  <Paperclip />
                  <span className="sr-only">Attach file</span>
                </Button>
              </AgentChatPrimitive.AgentChatAttachmentTrigger>
            )}

            {/* {withVoice && (
                <Button size={iconSize} variant="outline" onClick={startVoiceCall}>
                  <Mic />
                  <span className="sr-only">Start voice mode</span>
                </Button>
              )} */}

            <AgentChatPrimitive.AgentChatSendTrigger asChild>
              <Button
                size={iconSize}
                variant="default"
                className={cn(iconButtonClassName, sendButtonClassName)}
              >
                <ArrowUp />
                {/* {isThinking ? <Square className="fill-current" /> : <ArrowUp />} */}
                <span className="sr-only">Send message</span>
                {/* <span className="sr-only">{isThinking ? 'Stop run' : 'Send message'}</span> */}
              </Button>
            </AgentChatPrimitive.AgentChatSendTrigger>
          </div>
        </>
      )}

      {children}
    </div>
  );
}

export function AgentChatSimple({
  agentChat,
  chatId,
  defaultThreadId,
  noPersistency,
  chatContext,
  chatContextFiles,
  withVoice = false,
  hideAvatar = false,
  messagesContainerClassName,
  messageClassName,
  footerClassName,
  inputClassName,
  sendButtonClassName,
  attachmentButtonClassName,
  ...props
}: AgentChatSimpleProps) {
  return (
    <AgentChat
      agentChat={agentChat}
      chatId={chatId}
      defaultThreadId={defaultThreadId}
      noPersistency={noPersistency}
      chatContext={chatContext}
      chatContextFiles={chatContextFiles}
    >
      <AgentChatContent {...props}>
        <AgentChatMessages
          variant={props.variant}
          size={props.size}
          userPosition={props.userPosition || undefined}
          hideAvatar={hideAvatar}
          className={messagesContainerClassName}
          messageClassName={messageClassName}
        />
        <AgentChatFooter
          size={props.size}
          withVoice={withVoice}
          className={footerClassName}
          inputClassName={inputClassName}
          sendButtonClassName={sendButtonClassName}
          attachmentButtonClassName={attachmentButtonClassName}
        />
        <AgentChatFetching size={props.size} />
      </AgentChatContent>
    </AgentChat>
  );
}

export type AgentChatSimpleProps = AgentChatProps & {
  withVoice?: boolean;
  hideAvatar?: boolean;
  messagesContainerClassName?: string;
  messageClassName?: string;
  footerClassName?: string;
  inputClassName?: string;
  sendButtonClassName?: string;
  attachmentButtonClassName?: string;
} & VariantProps<typeof agentChatContentVariants> &
  React.ComponentProps<'div'>;

export const useAgentChat = AgentChatPrimitive.useAgentChat;

export { AgentChatPrimitive };
