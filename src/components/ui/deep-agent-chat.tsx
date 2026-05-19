import { AgentChat as SDKAgentChat } from '@blocksdiy/blocks-client-sdk';
import { useClient } from '@blocksdiy/blocks-client-sdk/reactSdk';
import * as AgentChatPrimitive from '@blocksdiy/react-common/new-agent-chat';
import { cva, type VariantProps } from 'class-variance-authority';
import { format } from 'date-fns';
import {
  File,
  FileImage,
  FileText,
  Loader2,
  Paperclip,
  Send,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import { Streamdown } from 'streamdown';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ASK_USER_TOOL_NAME,
  AskQuestionTool,
  AskQuestionToolSkeleton,
  askUserParametersSchema,
  type AskUserSubmittedAnswer,
} from '@/components/ui/deep-agent-chat-ask-user';
import {
  GENERATE_DYNAMIC_CHAT_COMPONENT_TOOL_NAME,
  generateDynamicChatComponentParametersSchema,
  type GenerateDynamicChatComponentResult,
  GenerateDynamicChatComponentTool,
} from '@/components/ui/deep-agent-chat-dynamic-component';
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

export const agentChatMessageTimestampVariants = cva('flex items-center', {
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
});

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
      className: 'h-7 w-7',
    },
    {
      userPosition: 'side',
      size: 'md',
      className: 'h-9 w-9',
    },
    {
      userPosition: 'side',
      size: 'lg',
      className: 'h-11 w-11',
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
        className: 'gap-2',
      },
      {
        variant: 'bubble',
        size: 'md',
        className: 'gap-2',
      },
      {
        variant: 'bubble',
        size: 'lg',
        className: 'gap-3',
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
  'resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none',
  {
    variants: {
      size: {
        sm: 'p-4 text-sm md:text-sm',
        md: 'p-4 text-sm md:text-base',
        lg: 'p-6 text-lg md:text-lg',
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

// Sized to roughly match the bubble's text glyph height per variant size.
const streamingSpinnerSizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const streamingSpinnerLineHeightClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-5',
  md: 'h-6',
  lg: 'h-7',
};

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

interface MessageTextContentProps {
  /** Raw `message.content` — string, multi-modal array, or undefined. */
  content: unknown;
  /** True while the agent is actively producing this turn's tokens. */
  isStreaming: boolean;
  /**
   * True when the message has other in-bubble activity to show (tool calls,
   * attachments, etc.). Suppresses the empty-state spinner so the agent
   * isn't displaying two "working on it" indicators at once.
   */
  hasOtherContent?: boolean;
  size: NonNullable<VariantProps<typeof messageVariants>['size']>;
  className?: string;
}

function MessageTextContent({
  content,
  isStreaming,
  hasOtherContent,
  size,
  className,
}: MessageTextContentProps) {
  const text = extractMessageText(content);

  if (!text) {
    if (!isStreaming || hasOtherContent) {
      return null;
    }
    return (
      <div
        className={cn(
          'flex items-center',
          streamingSpinnerLineHeightClasses[size],
        )}
      >
        <Loader2
          className={cn(
            'animate-spin text-muted-foreground',
            streamingSpinnerSizeClasses[size],
          )}
          aria-label="Loading"
        />
      </div>
    );
  }

  return (
    <Streamdown
      mode={isStreaming ? 'streaming' : 'static'}
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
  showTimestamp = true,
  dateFormat = 'HH:mm',
  className,
  ...props
}: AgentChatMessageComponentProps) {
  const client = useClient();
  const user = client.getUser();
  const { messages, isThinking } = useAgentChat();
  const renderToolCall = AgentChatPrimitive.useRenderToolCall();

  const messageContent =
    variant === 'minimal' && userPosition === 'side'
      ? `**${message.role === 'user' ? user.firstName || 'You' : 'AI'}:** ${extractMessageText(message.content)}`
      : message.content;
  const isStreamingMessage = isThinking && message.role === 'assistant';
  const toolMessages = messages.filter((m) => m.role === 'tool');

  if (message.role !== 'user' && message.role !== 'assistant') {
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
      {variant === 'bubble' && userPosition === 'side' && (
        <AgentChatAvatar
          role={message.role}
          size={size}
          userPosition={userPosition}
          // Hide the avatar when the message it sits in is preceded by
          // another message of the same role — only the first of a group
          // shows the avatar, the rest invisibly hold the indent.
          className={cn(
            '[[data-message-role=user]+[data-message-role=user]_&]:invisible',
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
            messageContentVariants({ size, role: message.role, variant }),
          )}
        >
          <MessageTextContent
            content={messageContent}
            isStreaming={isStreamingMessage}
            hasOtherContent={
              message.role === 'assistant' && Boolean(message.toolCalls?.length)
            }
            size={size ?? 'md'}
            className={cn(
              'prose-p:my-0',
              message.role === 'user' &&
                variant === 'bubble' &&
                'text-primary-foreground [&_[data-streamdown=link].text-primary]:!text-primary-foreground [&_[data-streamdown=link]]:underline-offset-2 [&_code]:bg-primary-foreground/15 [&_code]:text-primary-foreground',
            )}
          />
          {message.role === 'assistant' &&
            message.toolCalls?.map((toolCall) => {
              const toolMessage = toolMessages.find(
                (m) => m.toolCallId === toolCall.id,
              );
              const toolCallElement = renderToolCall({
                toolCall,
                toolMessage,
              });

              return toolCallElement;
            })}
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
        {showTimestamp && (
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
              '[[data-message-role=user]:has(+[data-message-role=user])_&]:hidden',
              '[[data-message-role=assistant]:has(+[data-message-role=assistant])_&]:hidden',
            )}
          >
            {userPosition === 'bottom' && (
              <AgentChatAvatar
                role={message.role}
                size={size}
                userPosition={userPosition}
              />
            )}
            <span className="text-xs text-muted-foreground">
              {getMessageCreatedAt(message)
                ? format(
                    new Date(getMessageCreatedAt(message) || ''),
                    dateFormat,
                  )
                : 'Invalid date'}
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

export function AgentChatThinking({
  size = 'md',
  variant = 'bubble',
  userPosition = 'side',
  className,
  ...props
}: AgentChatThinkingComponentProps) {
  const { isThinking, messages } = useAgentChat();

  if (!isThinking) {
    return null;
  }

  // The streaming AI message already shows its own avatar with a spinner badge;
  // skip the placeholder to avoid stacking two loading indicators.
  const lastMessage = messages[messages.length - 1];
  if (lastMessage && lastMessage.role === 'assistant') {
    return null;
  }

  // Pre-stream placeholder: show only the agent avatar with its loading badge,
  // matching the row layout of a regular AI message — no bubble, no text.
  if (variant !== 'bubble' || userPosition !== 'side') {
    return null;
  }

  return (
    <AgentChatPrimitive.AgentChatThinking asChild>
      <div
        className={cn(
          messageVariants({ size, role: 'assistant', variant }),
          className,
        )}
        {...props}
      >
        <AgentChatAvatar
          role="assistant"
          size={size}
          userPosition={userPosition}
        />
        <div
          className={cn(
            messageContentVariants({ size, role: 'assistant', variant }),
            'flex items-center',
          )}
        >
          <Loader2
            className={cn(
              'animate-spin text-muted-foreground',
              streamingSpinnerSizeClasses[size ?? 'md'],
            )}
          />
        </div>
      </div>
    </AgentChatPrimitive.AgentChatThinking>
  );
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
        'absolute inset-0 bg-background/80 backdrop-blur-sm',
        'flex items-center justify-center',
        className,
      )}
      {...props}
    >
      <div className={agentChatFetchingContentVariants({ size })}>
        <Loader2 className="animate-spin text-muted-foreground" />
        <span className="text-muted-foreground">Loading messages...</span>
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
  };
  const { agentChatId, agentId, agentHarness, appId, token } = agentChatProps;

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
      {...props}
    />
  );
}

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

  AgentChatPrimitive.useRenderTool(
    {
      name: GENERATE_DYNAMIC_CHAT_COMPONENT_TOOL_NAME,
      parameters: generateDynamicChatComponentParametersSchema,
      render: ({ parameters, status, result }) => {
        if (status !== 'complete') {
          return (
            <GenerateDynamicChatComponentTool
              args={parameters}
              isComplete={false}
            />
          );
        }

        // The tool returns a JSON string of `{title, code, chatComponent?, componentProps?}`.
        // Parse defensively — if the agent ever returns a non-JSON error
        // string we surface the failure state instead of crashing the chat.
        let parsedResult: GenerateDynamicChatComponentResult | undefined;
        let isFailed = false;
        try {
          const parsed = JSON.parse(
            result,
          ) as GenerateDynamicChatComponentResult;
          parsedResult =
            typeof parsed === 'object' && parsed !== null ? parsed : undefined;
        } catch {
          isFailed = true;
        }

        return (
          <GenerateDynamicChatComponentTool
            args={parameters}
            result={parsedResult}
            isComplete
            isFailed={isFailed}
          />
        );
      },
    },
    [],
  );

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
      render: ({ args, status, result, respond }) => {
        const askUserArgs = args as {
          questions?: Parameters<typeof AskQuestionTool>[0]['questions'];
        };

        if (status === 'inProgress') {
          return (
            <AskQuestionToolSkeleton
              questionCount={askUserArgs.questions?.length || undefined}
            />
          );
        }

        if (status === 'executing') {
          return (
            <AskQuestionTool
              questions={askUserArgs.questions || []}
              respond={respond}
            />
          );
        }

        // status === "complete": the tool returned a JSON string of
        // `{"answers":[...]}` — parse so we can re-render the form
        // read-only with the user's original picks.
        let persistedAnswers: AskUserSubmittedAnswer[] | undefined;
        try {
          const parsed = JSON.parse(result) as {
            answers?: AskUserSubmittedAnswer[];
          };
          persistedAnswers = Array.isArray(parsed.answers)
            ? parsed.answers
            : undefined;
        } catch {
          persistedAnswers = undefined;
        }

        return (
          <AskQuestionTool
            questions={askUserArgs.questions || []}
            answers={persistedAnswers}
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
      )}
      {...props}
    />
  );
}

export interface AgentChatMessagesProps {
  showTimestamps?: boolean;
  dateFormat?: string;
  userPosition?: 'side' | 'bottom';
}

export type AgentChatMessagesComponentProps = AgentChatMessagesProps &
  VariantProps<typeof messageVariants> &
  React.ComponentProps<'div'>;

export function AgentChatMessages({
  variant = 'bubble',
  size = 'md',
  userPosition = 'side',
  showTimestamps = true,
  dateFormat = 'HH:mm',
  className,
  ...props
}: AgentChatMessagesComponentProps) {
  const { messages } = useAgentChat();

  return (
    <AgentChatPrimitive.AgentChatMessages
      scrollAreaClassName="flex-1"
      autoScroll
      asChild
    >
      <div
        className={cn(agentChatMessagesVariants({ variant, size }), className)}
        {...props}
      >
        {messages.map((message, index) => {
          return (
            <AgentChatMessage
              key={message.id}
              message={message}
              index={index}
              variant={variant}
              size={size}
              userPosition={userPosition}
              showTimestamp={showTimestamps}
              dateFormat={dateFormat}
            />
          );
        })}

        <AgentChatFetching size={size} />
      </div>
    </AgentChatPrimitive.AgentChatMessages>
  );
}

export interface AgentChatInputProps {
  acceptFiles?: boolean;
  sendOnEnter?: boolean;
}

export type AgentChatInputComponentProps = AgentChatInputProps &
  VariantProps<typeof agentChatInputVariants> &
  React.ComponentProps<'textarea'>;

export function AgentChatInput({
  className,
  onSubmit,
  sendOnEnter = true,
  placeholder = 'Type a message...',
  ...props
}: AgentChatInputComponentProps) {
  return (
    <AgentChatPrimitive.AgentChatInput asChild>
      <Textarea
        placeholder={placeholder}
        className={cn(agentChatInputVariants({ size: props.size }), className)}
        onSubmit={sendOnEnter ? undefined : onSubmit}
        {...props}
      />
    </AgentChatPrimitive.AgentChatInput>
  );
}

export interface AgentChatFooterProps {
  hideAttachmentButton?: boolean;
  withVoice?: boolean;
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
  hideAttachmentButton = false,
  // withVoice = false,
  children,
  ...props
}: AgentChatFooterComponentProps) {
  const { attachments, isThinking, removeAttachment } = useAgentChat();
  // const { isConnected, isConnecting, isSpeaking, stream, startVoiceCall, endVoiceCall } =
  //   AgentChatPrimitive.useAgentChatVoice();

  // const isVoiceActive = withVoice && (isConnected || isConnecting);
  const iconSize = 'icon';
  const isVoiceActive = false;

  return (
    <div
      className={cn(agentChatFooterVariants({ size, className }))}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isVoiceActive ? (
          <motion.div
            key="voice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
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
          </motion.div>
        ) : (
          <motion.div
            key="text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {attachments.length > 0 && (
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
                'flex items-center',
                size === 'lg' ? 'gap-3 p-3' : 'gap-2 p-2',
              )}
            >
              <AgentChatInput size={size} className="flex-1 min-w-0" />

              {!hideAttachmentButton && (
                <AgentChatPrimitive.AgentChatAttachmentTrigger asChild>
                  <Button size={iconSize} variant="outline">
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
                <Button size={iconSize} variant="default">
                  {isThinking ? <Loader2 className="animate-spin" /> : <Send />}
                  <span className="sr-only">Send message</span>
                </Button>
              </AgentChatPrimitive.AgentChatSendTrigger>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        />
        <AgentChatFooter size={props.size} withVoice={withVoice} />
      </AgentChatContent>
    </AgentChat>
  );
}

export type AgentChatSimpleProps = AgentChatProps & {
  withVoice?: boolean;
} & VariantProps<typeof agentChatContentVariants> &
  React.ComponentProps<'div'>;

export const useAgentChat = AgentChatPrimitive.useAgentChat;

export { AgentChatPrimitive };
