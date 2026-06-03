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
import { motion, MotionProps } from 'motion/react';
import * as React from 'react';
import { Streamdown } from 'streamdown';
import { z } from 'zod';

import {
  AgentChatProductTypesProvider,
  ChatCodeComponent,
} from '@/components/ui/agent-chat-code-component';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DeepAgentChatAssistantMessageContext } from '@/components/ui/deep-agent-chat-assistant-message-context';
import {
  GET_USER_CHOICE_TOOL_DESCRIPTION,
  GET_USER_CHOICE_TOOL_NAME,
  getUserChoiceParametersSchema,
  GetUserChoiceToolResult,
} from '@/components/ui/deep-agent-chat-get-user-choice';
import { ToolCallFallback } from '@/components/ui/deep-agent-chat-tool-fallback';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export const agentChatContentVariants = cva(
  'flex flex-col overflow-hidden h-full w-full',
  {
    variants: {
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
  },
  defaultVariants: {
    size: 'md',
  },
});

export const agentChatMessageVariants = cva(
  'group relative flex transition-colors',
  {
    variants: {
      size: {
        sm: 'px-2 pb-3 gap-x-1',
        md: 'px-2 pb-3 gap-x-1',
        lg: 'px-3 pb-4 gap-x-1.5',
      },
      role: {
        user: 'flex-row-reverse',
        assistant: 'flex-row',
      },
    },
    defaultVariants: {
      size: 'md',
      role: 'assistant',
    },
  },
);

export const agentChatMessagePartVariants = cva('relative flex flex-col', {
  variants: {
    size: {
      sm: 'py-1.5 px-2',
      md: 'py-1.5 px-2',
      lg: 'py-2 px-2',
    },
    role: {
      user: 'bg-primary text-primary-foreground rounded-lg max-w-full',
      assistant: 'max-w-full',
    },
  },
  defaultVariants: {
    size: 'md',
    role: 'assistant',
  },
});

export const agentChatLoadingDotsWrapperVariants = cva('flex items-center', {
  variants: {
    size: {
      sm: 'h-5',
      md: 'h-6',
      lg: 'h-7',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const agentChatLoadingDotsVariants = cva(
  "text-[2px] relative mx-[3.5em] inline-block size-[2.5em] animate-bubble-loader rounded-full text-muted-foreground/70 indent-[-9999em] transform-[translateZ(0)_translateY(-2.5em)] [animation-delay:-0.16s] [animation-fill-mode:both] before:absolute before:left-[-3.5em] before:top-0 before:size-[2.5em] before:animate-bubble-loader before:rounded-full before:content-[''] before:[animation-delay:-0.32s] before:[animation-fill-mode:both] after:absolute after:left-[3.5em] after:top-0 after:size-[2.5em] after:animate-bubble-loader after:rounded-full after:content-[''] after:[animation-fill-mode:both]",
  {
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
  },
);

export const agentChatMessageAvatarVariants = cva('shrink-0', {
  variants: {
    role: {
      user: '',
      assistant: '',
    },
    size: {
      sm: 'h-6 w-6',
      md: 'h-8 w-8',
      lg: 'h-10 w-10',
    },
  },
  defaultVariants: {
    role: 'assistant',
    size: 'md',
  },
});

export const agentChatMessageAvatarFallbackVariants = cva('', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const agentChatMessageTimestampVariants = cva(
  'flex items-center opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100',
  {
    variants: {
      role: {
        user: 'flex-row-reverse',
        assistant: 'flex-row',
      },
      size: {
        sm: 'px-2 py-1',
        md: 'px-3 py-1.5',
        lg: 'px-4 py-2',
      },
    },
    defaultVariants: {
      role: 'assistant',
      size: 'md',
    },
  },
);

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

const agentChatMessageAttachmentsVariants = cva('flex flex-wrap', {
  variants: {
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
      role: 'assistant',
      className: 'flex-row',
    },
    {
      role: 'user',
      className: 'flex-row-reverse',
    },
  ],
  defaultVariants: {
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
  'field-sizing-content [field-sizing:content] min-h-[auto] bg-transparent resize-none border-none shadow-none hover:shadow-none focus:shadow-none focus-visible:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0',
  {
    variants: {
      size: {
        sm: 'p-2 text-sm md:text-sm leading-4',
        md: 'p-2 text-sm md:text-base leading-6',
        lg: 'p-4 text-lg md:text-lg leading-6',
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

function AttachmentFileIcon({ fileType }: { fileType: string }) {
  if (fileType.startsWith('image/')) {
    return <FileImage className="shrink-0" />;
  }

  if (fileType.includes('pdf') || fileType.includes('doc')) {
    return <FileText className="shrink-0" />;
  }

  return <File className="shrink-0" />;
}

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
  return (
    <Badge
      variant="outline"
      className={cn(
        'group/attachment',
        agentChatAttachmentBadgeVariants({ size }),
        className,
      )}
    >
      <AttachmentFileIcon fileType={attachment.fileType} />
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

function AgentChatAvatar({
  role = 'assistant',
  size = 'md',
  className,
}: VariantProps<typeof agentChatMessageAvatarVariants> & {
  className?: string;
}) {
  const client = useClient();
  const user = client.getUser();
  const { agent } = useAgentChat();

  const displayName = React.useMemo(() => {
    if (role === 'assistant') {
      if (agent?.title) {
        return agent.title
          .split(' ')
          .map((word) => word[0])
          .join('')
          .toUpperCase();
      }
      return 'AI';
    }

    if (!user) {
      return 'U';
    }

    const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`;
    return initials || 'U';
  }, [role, user, agent?.title]);

  return (
    <Avatar
      className={cn(agentChatMessageAvatarVariants({ role, size, className }))}
    >
      <AvatarImage
        src={role === 'user' ? user.profileImageUrl : agent?.photoUrl}
      />
      <AvatarFallback
        className={agentChatMessageAvatarFallbackVariants({ size })}
      >
        {displayName}
      </AvatarFallback>
    </Avatar>
  );
}

export function AgentChatLoadingDots({
  show,
  size = 'md',
  ...props
}: MotionProps &
  VariantProps<typeof agentChatLoadingDotsWrapperVariants> & {
    show: boolean;
  }) {
  return (
    <motion.div
      className={cn(agentChatLoadingDotsWrapperVariants({ size }))}
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      exit={{ opacity: 0, transition: { duration: 0 } }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      {...props}
    >
      <span
        aria-hidden={!show}
        aria-label="Is agent thinking"
        className={cn(
          agentChatLoadingDotsVariants({ size }),
          !show && 'paused before:paused after:paused',
        )}
      />
    </motion.div>
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

const dedupeMessagesById = (messages: AgentChatPrimitive.Message[]) => {
  // CopilotKit/AG-UI can briefly provide overlapping live + replayed messages
  // with the same id. Render one message per id and keep React keys stable.
  const byId = new Map<string, AgentChatPrimitive.Message>();
  for (const message of messages) {
    byId.set(message.id, message);
  }
  return Array.from(byId.values());
};

const GENERATE_DYNAMIC_CHAT_COMPONENT_TOOL_NAME =
  'generate_dynamic_chat_component';

const chatComponentParametersSchema = z.object({}).loose();
type ChatComponentJsonSchemaInput = Parameters<typeof z.fromJSONSchema>[0];

const parseChatComponentInputSchema = (
  input: AgentChatComponent['input'] | string | undefined,
): ChatComponentJsonSchemaInput | undefined => {
  if (!input) {
    return undefined;
  }

  if (typeof input !== 'string') {
    return input as ChatComponentJsonSchemaInput;
  }

  const normalizedInput = input
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  try {
    const parsed = JSON.parse(normalizedInput) as unknown;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as ChatComponentJsonSchemaInput)
      : undefined;
  } catch {
    return undefined;
  }
};

const getChatComponentParametersSchema = (component: AgentChatComponent) => {
  const inputSchema = parseChatComponentInputSchema(component.input);
  if (!inputSchema) {
    return chatComponentParametersSchema;
  }

  try {
    return z.fromJSONSchema(
      inputSchema,
    ) as typeof chatComponentParametersSchema;
  } catch {
    return chatComponentParametersSchema;
  }
};

interface AgentChatMessageProps {
  message: Message;
  index: number;
  showTimestamp?: boolean;
  dateFormat?: string;
  hideAvatar?: boolean;
  renderToolCall: ReturnType<typeof AgentChatPrimitive.useRenderToolCall>;
}

const GenerateDynamicChatComponentToolResult = ({
  status,
  result,
  size = 'md',
}: {
  toolCallId: string;
  result: string;
  status: AgentChatPrimitive.ToolCallStatus;
  parameters: Record<string, unknown>;
  size?: 'sm' | 'md' | 'lg';
}) => {
  let parsedResult: {
    code?: string;
    props?: Record<string, unknown>;
  };

  try {
    parsedResult = JSON.parse(result) as typeof parsedResult;
  } catch (error) {
    const message =
      result ||
      (error instanceof Error ? error.message : 'Invalid component result');
    return (
      <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
        {message}
      </div>
    );
  }

  return (
    <ChatCodeComponent
      status={status}
      code={parsedResult.code}
      props={parsedResult.props}
      size={size}
    />
  );
};

const ChatComponentToolResult = ({
  status,
  component,
  parameters,
}: {
  status: AgentChatPrimitive.ToolCallStatus;
  component: AgentChatComponent;
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

interface MessageTextContentProps {
  text?: string;
  isStreaming: boolean;
}

function AgentChatMessageTextPart({
  text,
  isStreaming,
  ...props
}: VariantProps<typeof agentChatMessagePartVariants> &
  MessageTextContentProps) {
  if (!text) {
    return null;
  }

  return (
    <AgentChatMessagePart {...props}>
      <Streamdown
        mode={isStreaming ? 'streaming' : 'static'}
        animated={{ animation: 'fadeIn' }}
        isAnimating={isStreaming}
        className={
          'text-inherit [&_[data-streamdown=link].text-primary]:!text-inherit [&_[data-streamdown=link]]:underline-offset-2 [&_code]:bg-primary/15 [&_code]:text-primary'
        }
      >
        {text}
      </Streamdown>
    </AgentChatMessagePart>
  );
}

function AgentChatMessagePart({
  children,
  className,
  size,
  role = 'assistant',
}: {
  children: React.ReactNode;
  className?: string;
} & VariantProps<typeof agentChatMessagePartVariants>) {
  return (
    <div
      data-slot="agent-chat-message-part"
      className={cn(agentChatMessagePartVariants({ size, role, className }))}
    >
      {children}
    </div>
  );
}

export function AgentChatMessage({
  message,
  index,
  size = 'md',
  hideAvatar = false,
  showTimestamp = true,
  dateFormat = 'HH:mm',
  renderToolCall,
  className,
  ...props
}: AgentChatMessageProps &
  VariantProps<typeof agentChatMessageVariants> &
  React.ComponentProps<'div'>) {
  const { messages, isThinking } = useAgentChat();

  if (message.role !== 'user' && message.role !== 'assistant') {
    return null;
  }

  const nextMessage = messages[index + 1];
  const isLastAssistantMessageInGroup =
    message.role === 'assistant' && nextMessage?.role !== 'assistant';
  const assistantMessages = messages.filter((m) => m.role === 'assistant');
  const isLastAssistantMessageOverall =
    assistantMessages[assistantMessages.length - 1]?.id === message.id;
  const isCurrentAssistantTurn = Boolean(
    isThinking && isLastAssistantMessageOverall,
  );
  const messageAttachments = getMessageAttachments(message);
  const hasAttachments = messageAttachments.length > 0;
  const createdAtValue = getMessageCreatedAt(message);
  const createdAt = createdAtValue ? new Date(createdAtValue) : null;
  const hasValidCreatedAt = Boolean(
    createdAt && !Number.isNaN(createdAt.getTime()),
  );
  const timestampText =
    hasValidCreatedAt && createdAt ? format(createdAt, dateFormat) : '';
  const toolMessages = messages.filter((m) => m.role === 'tool');

  return (
    <AgentChatPrimitive.AgentChatMessage
      message={message}
      index={index}
      className={cn(
        agentChatMessageVariants({ size, role: message.role }),
        // Tighten the bottom gap when the next message is in the same role
        // group (consecutive user / assistant turns sit closer together).
        '[&[data-message-role=user]:has(+[data-message-role=user])]:pb-0',
        '[&[data-message-role=assistant]:has(+[data-message-role=assistant])]:pb-0',
        className,
      )}
      {...props}
    >
      <DeepAgentChatAssistantMessageContext.Provider
        value={message.role === 'assistant' ? message : null}
      >
        {!hideAvatar && message.role === 'assistant' && (
          <AgentChatAvatar
            role={message.role}
            size={size}
            className={cn(
              '[[data-message-role=assistant]+[data-message-role=assistant]_&]:invisible',
            )}
          />
        )}
        <div className="flex flex-col">
          {message.content ? (
            typeof message.content === 'string' ? (
              <AgentChatMessageTextPart
                size={size}
                role={message.role}
                text={message.content}
                isStreaming={isCurrentAssistantTurn}
              />
            ) : (
              message.content.map((part) => {
                return (
                  <React.Fragment
                    key={`message-${message.id}-part-${part.type}-${index}`}
                  >
                    {part.type === 'text' && (
                      <AgentChatMessageTextPart
                        size={size}
                        role={message.role}
                        text={part.text}
                        isStreaming={isCurrentAssistantTurn}
                      />
                    )}
                  </React.Fragment>
                );
              })
            )
          ) : null}
          {message.role === 'assistant' &&
            message.toolCalls?.map((toolCall) => {
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

          {hasAttachments && (
            <div
              data-slot="agent-chat-message-attachments"
              className={agentChatMessageAttachmentsVariants({
                size,
                role: message.role,
              })}
            >
              {messageAttachments.map((attachment, i) => (
                <AgentChatAttachmentBadge
                  key={i}
                  attachment={attachment}
                  size={size}
                />
              ))}
            </div>
          )}
          {isLastAssistantMessageInGroup &&
            showTimestamp &&
            hasValidCreatedAt && (
              <div
                data-slot="agent-chat-message-timestamp"
                className={cn(
                  agentChatMessageTimestampVariants({
                    size,
                    role: message.role,
                  }),
                  message.role === 'assistant' && 'opacity-100',
                  '[[data-message-role=user]:has(+[data-message-role=user])_&]:hidden',
                  '[[data-message-role=assistant]:has(+[data-message-role=assistant])_&]:hidden',
                )}
              >
                {!hideAvatar && message.role === 'assistant' && (
                  <AgentChatAvatar role={message.role} size={size} />
                )}
                <span
                  className={cn(
                    'text-xs text-muted-foreground',
                    message.role === 'assistant' &&
                      'opacity-0 transition-opacity group-hover:opacity-100',
                  )}
                >
                  {timestampText}
                </span>
              </div>
            )}
          {isLastAssistantMessageInGroup && (
            <AgentChatMessagePart size={size} role={message.role}>
              <AgentChatLoadingDots show={isCurrentAssistantTurn} size={size} />
            </AgentChatMessagePart>
          )}
        </div>
      </DeepAgentChatAssistantMessageContext.Provider>
    </AgentChatPrimitive.AgentChatMessage>
  );
}

export function AgentChatFetching({
  size = 'md',
  className,
  ...props
}: VariantProps<typeof agentChatFetchingContentVariants> &
  React.ComponentProps<'div'>) {
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

const ToolCall = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  AgentChatPrimitive.useDefaultRenderTool({
    render: ({ name, parameters, status, result }) => (
      <AgentChatMessagePart size={size}>
        <ToolCallFallback
          name={name}
          parameters={parameters}
          status={status}
          result={result}
          size={size}
        />
      </AgentChatMessagePart>
    ),
  });

  return null;
};

const GetUserChoiceToolRegistration = ({
  size = 'md',
}: {
  size?: 'sm' | 'md' | 'lg';
}) => {
  AgentChatPrimitive.useHumanInTheLoop(
    {
      name: GET_USER_CHOICE_TOOL_NAME,
      description: GET_USER_CHOICE_TOOL_DESCRIPTION,
      parameters: getUserChoiceParametersSchema,
      render: (renderProps) => {
        return (
          <AgentChatMessagePart size={size} role="assistant">
            <GetUserChoiceToolResult
              args={renderProps.args}
              result={renderProps.result}
              respond={renderProps.respond}
            />
          </AgentChatMessagePart>
        );
      },
    },
    [],
  );

  return null;
};

const GenerateDynamicChatComponentToolCall = ({
  size = 'md',
}: {
  size?: 'sm' | 'md' | 'lg';
}) => {
  AgentChatPrimitive.useRenderTool(
    {
      name: GENERATE_DYNAMIC_CHAT_COMPONENT_TOOL_NAME,
      parameters: z.object({}).loose(),
      render: ({ toolCallId, status, result, parameters }) => {
        if (status !== AgentChatPrimitive.ToolCallStatus.Complete || !result) {
          return <></>;
        }

        return (
          <AgentChatMessagePart size={size}>
            <GenerateDynamicChatComponentToolResult
              toolCallId={toolCallId}
              status={status as AgentChatPrimitive.ToolCallStatus}
              result={result}
              parameters={parameters}
              size={size}
            />
          </AgentChatMessagePart>
        );
      },
    },
    [],
  );

  return null;
};

const ChatComponentToolCall = ({
  size = 'md',
  component,
}: {
  size?: 'sm' | 'md' | 'lg';
  component: AgentChatComponent;
}) => {
  const parametersSchema = React.useMemo(
    () => getChatComponentParametersSchema(component),
    [component],
  );
  const toolName = `show-component-${AgentChatPrimitive.getAgentChatComponentToolName(
    component.name,
  )}`;

  AgentChatPrimitive.useFrontendTool(
    {
      name: toolName,
      description: component.description,
      parameters: parametersSchema,
      handler: async () =>
        `<prebuilt_chat_component_rendered tool="${toolName}" component="${component.name}" status="success" />`,
      render: ({ status, args }) => {
        return (
          <AgentChatMessagePart size={size} role="assistant">
            <ChatComponentToolResult
              status={status as AgentChatPrimitive.ToolCallStatus}
              component={component}
              parameters={args as Record<string, unknown>}
            />
          </AgentChatMessagePart>
        );
      },
    },
    [component, parametersSchema, size],
  );

  return null;
};

export function AgentChatContent({
  size = 'md',
  className,
  ...props
}: VariantProps<typeof agentChatContentVariants> &
  React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="agent-chat-content"
      className={cn(agentChatContentVariants({ size, className }), 'relative')}
      {...props}
    />
  );
}

export interface AgentChatMessagesProps {
  showTimestamps?: boolean;
  dateFormat?: string;
  hideAvatar?: boolean;
  messageClassName?: string;
}

export type AgentChatMessagesComponentProps = AgentChatMessagesProps &
  VariantProps<typeof agentChatMessagesVariants> &
  React.ComponentProps<'div'>;

export function AgentChatMessages({
  size = 'md',
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
  const chatComponents = (components ?? []).filter((component) =>
    Boolean(
      component.name?.trim() &&
      component.description?.trim() &&
      component.code?.trim(),
    ),
  );
  const resolvedSize = size ?? 'md';

  return (
    <AgentChatPrimitive.AgentChatMessages
      scrollAreaClassName="flex-1 relative"
      className={cn(
        agentChatMessagesVariants({ size: resolvedSize }),
        className,
      )}
      {...props}
    >
      {displayMessages.map((message, index) => (
        <AgentChatMessage
          key={message.id}
          message={message}
          index={index}
          size={resolvedSize}
          hideAvatar={hideAvatar}
          showTimestamp={showTimestamps}
          dateFormat={dateFormat}
          renderToolCall={renderToolCall}
          className={messageClassName}
        />
      ))}
      <GetUserChoiceToolRegistration size={resolvedSize} />
      {!agentChat || agentChat.hideToolsUi === true ? null : (
        <ToolCall size={resolvedSize} />
      )}
      {!agentChat ||
      agentChat.disableGeneratingDynamicChatComponent === true ? null : (
        <GenerateDynamicChatComponentToolCall size={resolvedSize} />
      )}
      {chatComponents.map((component) => (
        <ChatComponentToolCall
          size={resolvedSize}
          component={component}
          key={`chat-component-tool-call-${component.id}`}
        />
      ))}
    </AgentChatPrimitive.AgentChatMessages>
  );
}

interface AgentChatInputProps {
  sendOnEnter?: boolean;
}

export function AgentChatInput({
  className,
  onSubmit,
  sendOnEnter = true,
  placeholder = 'Type a message...',
  ...props
}: AgentChatInputProps &
  VariantProps<typeof agentChatInputVariants> &
  React.ComponentProps<'textarea'>) {
  return (
    <AgentChatPrimitive.AgentChatInput asChild>
      <Textarea
        placeholder={placeholder}
        className={cn(
          agentChatInputVariants({ size: props.size }),
          className,
          'shadow-none hover:shadow-none focus:shadow-none focus-visible:shadow-none',
        )}
        onSubmit={sendOnEnter ? undefined : onSubmit}
        {...props}
      />
    </AgentChatPrimitive.AgentChatInput>
  );
}

interface AgentChatFooterProps {
  withVoice?: boolean;
  inputClassName?: string;
  sendButtonClassName?: string;
  attachmentButtonClassName?: string;
}

export function AgentChatFooter({
  withVoice = false,
  ...props
}: AgentChatFooterProps &
  VariantProps<typeof agentChatFooterVariants> &
  React.ComponentProps<'div'>) {
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
}: AgentChatFooterProps &
  VariantProps<typeof agentChatFooterVariants> &
  React.ComponentProps<'div'>) {
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
                {/* <span className="sr-only">{isThinking ? "Stop run" : "Send message"}</span> */}
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
          size={props.size}
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
