import {
  ToolActions as HeadlessToolActions,
  ToolCard as HeadlessToolCard,
  ToolCollapseTrigger as HeadlessToolCollapseTrigger,
  ToolContent as HeadlessToolContent,
  ToolHeader as HeadlessToolHeader,
  ToolTitle as HeadlessToolTitle,
  useToolCard as useHeadlessToolCard,
} from '@blocksdiy/react-common/agent-chat';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckCircle2, ChevronDown, CircleAlert, Loader2 } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const agentChatToolCardVariants = cva(
  'my-2 max-w-full overflow-hidden rounded-lg border text-foreground',
  {
    variants: {
      variant: {
        bubble: 'border-border bg-background shadow-sm',
        minimal: 'border-border/70 bg-background',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'bubble',
    },
  },
);

export const agentChatToolHeaderVariants = cva(
  'flex items-center data-[state=open]:border-b',
  {
    variants: {
      variant: {
        bubble: 'border-border',
        minimal: 'border-border/70',
      },
      size: {
        sm: 'gap-2 px-2 py-1.5',
        md: 'gap-3 px-3 py-2',
        lg: 'gap-4 px-4 py-3',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'bubble',
    },
  },
);

export const agentChatToolTitleVariants = cva(
  'flex min-w-0 flex-1 items-center truncate font-medium leading-7 text-foreground',
  {
    variants: {
      size: {
        sm: 'gap-2 text-sm',
        md: 'gap-3 text-base',
        lg: 'gap-4 text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const agentChatToolActionsVariants = cva('flex shrink-0 items-center', {
  variants: {
    size: {
      sm: 'gap-1',
      md: 'gap-1',
      lg: 'gap-1.5',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const agentChatToolIconVariants = cva('shrink-0', {
  variants: {
    size: {
      sm: 'size-3.5',
      md: 'size-4',
      lg: 'size-5',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const agentChatToolContentInnerVariants = cva('', {
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    padded: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    { size: 'sm', padded: true, className: 'p-2' },
    { size: 'md', padded: true, className: 'p-3' },
    { size: 'lg', padded: true, className: 'p-4' },
  ],
  defaultVariants: {
    size: 'md',
    padded: true,
  },
});

export type AgentChatToolCardSize = NonNullable<
  VariantProps<typeof agentChatToolCardVariants>['size']
>;
export type AgentChatToolCardVariant = NonNullable<
  VariantProps<typeof agentChatToolCardVariants>['variant']
>;
export type AgentChatToolStatusIconValue = 'loading' | 'completed' | 'failed';

export interface AgentChatToolStatusIconProps {
  value: AgentChatToolStatusIconValue;
  size?: AgentChatToolCardSize;
  className?: string;
}

export function AgentChatToolStatusIcon({
  value,
  size = 'md',
  className,
}: AgentChatToolStatusIconProps) {
  const iconClassName = cn(agentChatToolIconVariants({ size }), className);

  if (value === 'loading') {
    return <Loader2 className={cn(iconClassName, 'animate-spin')} />;
  }

  if (value === 'failed') {
    return <CircleAlert className={iconClassName} />;
  }

  return <CheckCircle2 strokeWidth={2} className={iconClassName} />;
}

export interface AgentChatToolCardProps
  extends
    React.ComponentProps<'div'>,
    VariantProps<typeof agentChatToolCardVariants> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AgentChatToolCard({
  size = 'md',
  variant = 'bubble',
  defaultOpen = false,
  className,
  ...props
}: AgentChatToolCardProps) {
  const resolvedSize = size ?? 'md';
  const resolvedVariant = variant ?? 'bubble';

  return (
    <HeadlessToolCard
      size={resolvedSize}
      variant={resolvedVariant}
      defaultOpen={defaultOpen}
      className={cn(agentChatToolCardVariants({ size, variant }), className)}
      {...props}
    />
  );
}

export interface AgentChatToolHeaderProps
  extends
    React.ComponentProps<'div'>,
    VariantProps<typeof agentChatToolHeaderVariants> {}

export function AgentChatToolHeader({
  size = 'md',
  variant = 'bubble',
  className,
  ...props
}: AgentChatToolHeaderProps) {
  return (
    <HeadlessToolHeader
      className={cn(agentChatToolHeaderVariants({ size, variant }), className)}
      {...props}
    />
  );
}

export interface AgentChatToolTitleProps
  extends
    React.ComponentProps<'div'>,
    VariantProps<typeof agentChatToolTitleVariants> {
  status?: React.ReactNode;
}

export function AgentChatToolTitle({
  size = 'md',
  className,
  ...props
}: AgentChatToolTitleProps) {
  return (
    <HeadlessToolTitle
      className={cn(agentChatToolTitleVariants({ size }), className)}
      {...props}
    />
  );
}

export interface AgentChatToolActionsProps
  extends
    React.ComponentProps<'div'>,
    VariantProps<typeof agentChatToolActionsVariants> {}

export function AgentChatToolActions({
  size = 'md',
  className,
  ...props
}: AgentChatToolActionsProps) {
  return (
    <HeadlessToolActions
      className={cn(agentChatToolActionsVariants({ size }), className)}
      {...props}
    />
  );
}

export interface AgentChatToolCollapseTriggerProps {
  className?: string;
}

export function AgentChatToolCollapseTrigger({
  className,
}: AgentChatToolCollapseTriggerProps) {
  const { open } = useHeadlessToolCard();

  return (
    <HeadlessToolCollapseTrigger asChild>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          'size-7 shrink-0 text-muted-foreground hover:text-foreground',
          className,
        )}
        aria-label={open ? 'Collapse tool call' : 'Expand tool call'}
        title={open ? 'Collapse tool call' : 'Expand tool call'}
      >
        <ChevronDown
          className={cn(
            'size-3.5 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </Button>
    </HeadlessToolCollapseTrigger>
  );
}

export interface AgentChatToolControlsProps
  extends
    React.ComponentProps<'div'>,
    VariantProps<typeof agentChatToolActionsVariants> {
  showCollapseTrigger?: boolean;
}

export function AgentChatToolControls({
  size = 'md',
  children,
  className,
  showCollapseTrigger = true,
}: AgentChatToolControlsProps) {
  return (
    <div className={cn(agentChatToolActionsVariants({ size }), className)}>
      <AgentChatToolActions size={size}>{children}</AgentChatToolActions>
      {showCollapseTrigger && <AgentChatToolCollapseTrigger />}
    </div>
  );
}

export interface AgentChatToolContentProps extends React.ComponentProps<'div'> {}

export function AgentChatToolContent({
  className,
  ...props
}: AgentChatToolContentProps) {
  return (
    <HeadlessToolContent
      className={cn(
        'grid overflow-hidden transition-[grid-template-rows] duration-200 data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]',
        className,
      )}
      {...props}
    />
  );
}

export interface AgentChatToolContentInnerProps extends React.ComponentProps<'div'> {
  size?: AgentChatToolCardSize;
  padded?: VariantProps<typeof agentChatToolContentInnerVariants>['padded'];
}

export function AgentChatToolContentInner({
  size = 'md',
  padded = true,
  className,
  children,
  ...props
}: AgentChatToolContentInnerProps) {
  return (
    <div className="min-h-0 overflow-hidden" {...props}>
      <div
        className={cn(
          agentChatToolContentInnerVariants({ size, padded }),
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
