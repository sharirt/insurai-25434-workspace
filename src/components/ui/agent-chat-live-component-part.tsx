import * as BlocksClientReactSdk from '@blocksdiy/blocks-client-sdk/reactSdk';
import { code as streamdownCode } from '@streamdown/code';
import { cva } from 'class-variance-authority';
import { Check, Code2, Copy } from 'lucide-react';
import * as React from 'react';
import { LiveError, LivePreview, LiveProvider } from 'react-live';
import * as Recharts from 'recharts';
import { Streamdown } from 'streamdown';

import * as AccordionUI from '@/components/ui/accordion';
import {
  AgentChatToolCard,
  type AgentChatToolCardSize,
  type AgentChatToolCardVariant,
  AgentChatToolContent,
  AgentChatToolContentInner,
  AgentChatToolControls,
  AgentChatToolHeader,
  AgentChatToolLeadChevron,
  AgentChatToolSecondaryAction,
  type AgentChatToolStatusIconValue,
  AgentChatToolTitle,
  agentChatToolTitleStateVariants,
} from '@/components/ui/agent-chat-tool-card';
import * as AlertUI from '@/components/ui/alert';
import * as AlertDialogUI from '@/components/ui/alert-dialog';
import * as AspectRatioUI from '@/components/ui/aspect-ratio';
import * as AvatarUI from '@/components/ui/avatar';
import * as BadgeUI from '@/components/ui/badge';
import * as BaseMarkdownUI from '@/components/ui/base-markdown/base-markdown';
import * as BaseMarkdownExtensionsUI from '@/components/ui/base-markdown/extensions';
import * as BaseMarkdownTextUI from '@/components/ui/base-markdown/text';
import * as BreadcrumbUI from '@/components/ui/breadcrumb';
import * as ButtonUI from '@/components/ui/button';
import * as CalendarUI from '@/components/ui/calendar';
import * as CardUI from '@/components/ui/card';
import * as CarouselUI from '@/components/ui/carousel';
import * as ChartUI from '@/components/ui/chart';
import * as CheckboxUI from '@/components/ui/checkbox';
import * as CollapsibleUI from '@/components/ui/collapsible';
import * as ComboboxUI from '@/components/ui/combobox';
import * as CommandUI from '@/components/ui/command';
import * as ContextMenuUI from '@/components/ui/context-menu';
import * as DialogUI from '@/components/ui/dialog';
import * as DrawerUI from '@/components/ui/drawer';
import * as DropdownMenuUI from '@/components/ui/dropdown-menu';
import * as EditableMarkdownUI from '@/components/ui/editable-markdown';
import * as EventsCalendarUI from '@/components/ui/events-calendar';
import * as FieldUI from '@/components/ui/field';
import * as FilePreviewerUI from '@/components/ui/file-previewer';
import * as FormUI from '@/components/ui/form';
import * as HoverCardUI from '@/components/ui/hover-card';
import * as InputUI from '@/components/ui/input';
import * as InputOtpUI from '@/components/ui/input-otp';
import * as LabelUI from '@/components/ui/label';
import * as LinkUI from '@/components/ui/link';
import * as LiveWaveformUI from '@/components/ui/live-waveform';
import * as MarkdownUI from '@/components/ui/markdown';
import * as MenubarUI from '@/components/ui/menubar';
import * as NavigationMenuUI from '@/components/ui/navigation-menu';
import * as PaginationUI from '@/components/ui/pagination';
import * as PdfViewerUI from '@/components/ui/pdf-viewer';
import * as PopoverUI from '@/components/ui/popover';
import * as ProgressUI from '@/components/ui/progress';
import * as RadioGroupUI from '@/components/ui/radio-group';
import * as ResizableUI from '@/components/ui/resizable';
import * as ScrollAreaUI from '@/components/ui/scroll-area';
import * as SelectUI from '@/components/ui/select';
import * as SeparatorUI from '@/components/ui/separator';
import * as SheetUI from '@/components/ui/sheet';
import * as SidebarUI from '@/components/ui/sidebar';
import * as SkeletonUI from '@/components/ui/skeleton';
import * as SliderUI from '@/components/ui/slider';
import * as SonnerUI from '@/components/ui/sonner';
import * as SwitchUI from '@/components/ui/switch';
import * as TableUI from '@/components/ui/table';
import * as TabsUI from '@/components/ui/tabs';
import * as TextareaUI from '@/components/ui/textarea';
import * as ToastUI from '@/components/ui/toast';
import * as ToasterUI from '@/components/ui/toaster';
import * as ToggleUI from '@/components/ui/toggle';
import * as ToggleGroupUI from '@/components/ui/toggle-group';
import * as TooltipUI from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import * as ProductTypes from '@/product-types';

export type AgentChatLiveComponentSize = AgentChatToolCardSize;
export type AgentChatLiveComponentVariant = AgentChatToolCardVariant;

interface AgentChatLiveComponentPartData {
  id?: string;
  state?: string;
  toolCallId?: string;
  output?: {
    title?: string;
    code?: string;
    componentProps?: Record<string, unknown>;
  };
}

const normalizeLiveCode = (code: string) => {
  const trimmed = code.trim();
  const fencedMatch = trimmed.match(
    /^```(?:tsx|jsx|typescript|javascript|ts|js)?\s*([\s\S]*?)\s*```$/,
  );
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  return trimmed
    .replace(/^```(?:tsx|jsx|typescript|javascript|ts|js)?\s*/, '')
    .replace(/\s*```$/, '')
    .trim();
};

const invalidLiveScopeNames = new Set([
  'default',
  'import',
  'export',
  'class',
  'function',
  'return',
  'const',
  'let',
  'var',
]);

const sanitizeLiveScope = (scope: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(scope).filter(
      ([key]) =>
        /^[A-Za-z_$][\w$]*$/.test(key) && !invalidLiveScopeNames.has(key),
    ),
  );

const formatDebugCodeBlock = (code: string) => `\`\`\`\`tsx\n${code}\n\`\`\`\``;

const getGenerateDynamicChatComponentPayload = (
  part: AgentChatLiveComponentPartData,
) =>
  part.state === 'output-available' && part.output?.code
    ? part.output
    : undefined;

// The live preview is the rendered component itself — it shouldn't sit
// inside the indented "description rail" used by activity tool descriptions.
// Plain padding so the chart/UI fills its container naturally.
const liveComponentPreviewVariants = cva('min-w-0 max-w-full overflow-x-auto', {
  variants: {
    size: {
      sm: 'p-2',
      md: 'p-3',
      lg: 'p-4',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const liveComponentSkeletonWrapperVariants = cva('', {
  variants: {
    size: {
      sm: 'p-2',
      md: 'p-3',
      lg: 'p-4',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// Body skeleton — taller per size so the loading state has visual weight
// matching the eventual rendered preview (charts, dashboards, etc. are
// rarely as short as a 96px strip). `w-full` is enforced by the wrapper.
const liveComponentSkeletonShapeVariants = cva('w-full', {
  variants: {
    size: {
      sm: 'h-32',
      md: 'h-40',
      lg: 'h-48',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// Title-bar skeleton placeholder shown until the agent emits the actual
// title. Sized to look like a short text run, aligned to the title's
// line-height so it doesn't shift the row when the real text arrives.
const liveComponentTitleSkeletonVariants = cva('rounded-sm', {
  variants: {
    size: {
      sm: 'h-3.5 w-28',
      md: 'h-4 w-40',
      lg: 'h-5 w-48',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const liveComponentEmptyStateVariants = cva('text-sm text-muted-foreground', {
  variants: {
    size: {
      sm: 'p-2',
      md: 'p-3',
      lg: 'p-4',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// `react-live` defaults LiveError to monospace; we explicitly force `font-sans`
// here to match the calm typography of a normal description, only the color
// differs (destructive/80).
const liveComponentErrorVariants = cva(
  'whitespace-pre-wrap font-sans text-sm leading-relaxed text-destructive/80',
  {
    variants: {
      size: {
        sm: 'px-2 pb-2',
        md: 'px-3 pb-3',
        lg: 'px-4 pb-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

// "View generated code" dialog body. Compact prose with neutralised pre/code
// surfaces because the syntax highlighter (`@streamdown/code`) supplies its
// own block styling.
const liveComponentDebugCodeVariants = cva(
  'max-h-[65vh] overflow-auto prose max-w-none dark:prose-invert prose-pre:my-0 prose-pre:bg-transparent prose-pre:p-0 prose-code:bg-transparent prose-code:p-0',
);

function AgentChatLiveComponentCreating({
  size,
}: {
  size?: AgentChatLiveComponentSize;
}) {
  return (
    <div className={cn(liveComponentSkeletonWrapperVariants({ size }))}>
      <SkeletonUI.Skeleton
        className={cn(liveComponentSkeletonShapeVariants({ size }))}
      />
    </div>
  );
}

export function AgentChatLiveComponentPart({
  part,
  size,
  variant,
  scopeExtras,
}: {
  part: AgentChatLiveComponentPartData;
  size?: AgentChatLiveComponentSize;
  variant?: AgentChatLiveComponentVariant;
  scopeExtras?: Record<string, unknown>;
}) {
  const componentProps = part.output?.componentProps || {};
  const payload = getGenerateDynamicChatComponentPayload(part);
  const code = payload?.code ? normalizeLiveCode(payload.code) : '';
  const displayCode = code;
  const debugCode = displayCode;
  // Title comes from the agent (in whatever language it generated). When the
  // agent doesn't supply one, we render an empty title rather than a fixed
  // English fallback — the chevron + the rendered preview already
  // communicate that this is a generated component.
  const title = payload?.title ?? '';
  const [isCodeCopied, setIsCodeCopied] = React.useState(false);
  // Live components are the one tool we *do* auto-open while streaming, so the
  // user can watch the preview build. We never auto-open on failure though —
  // an inline destructive box on collapse would be loud; the chevron stays
  // available and the user can opt in.
  const [open, setOpen] = React.useState(true);
  const [hasOpened, setHasOpened] = React.useState(true);
  const copyResetTimeoutRef = React.useRef<number | undefined>(undefined);

  React.useEffect(
    () => () => {
      if (copyResetTimeoutRef.current) {
        window.clearTimeout(copyResetTimeoutRef.current);
      }
    },
    [],
  );

  const handleCopyCode = React.useCallback(async () => {
    if (!debugCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(debugCode);
    } catch {
      return;
    }

    setIsCodeCopied(true);

    if (copyResetTimeoutRef.current) {
      window.clearTimeout(copyResetTimeoutRef.current);
    }
    copyResetTimeoutRef.current = window.setTimeout(() => {
      setIsCodeCopied(false);
    }, 1500);
  }, [debugCode]);

  const scope = React.useMemo(
    () =>
      sanitizeLiveScope({
        props: componentProps,
        React,
        Recharts,
        BlocksClientReactSdk,
        ProductTypes,
        cn,
        ...scopeExtras,
        ...AccordionUI,
        ...AlertUI,
        ...AlertDialogUI,
        ...AspectRatioUI,
        ...AvatarUI,
        ...BadgeUI,
        ...BaseMarkdownUI,
        ...BaseMarkdownExtensionsUI,
        ...BaseMarkdownTextUI,
        ...BreadcrumbUI,
        ...ButtonUI,
        ...CalendarUI,
        ...CardUI,
        ...CarouselUI,
        ...ChartUI,
        ...CheckboxUI,
        ...CollapsibleUI,
        ...ComboboxUI,
        ...CommandUI,
        ...ContextMenuUI,
        ...DialogUI,
        ...DrawerUI,
        ...DropdownMenuUI,
        ...EditableMarkdownUI,
        ...EventsCalendarUI,
        ...FieldUI,
        ...FilePreviewerUI,
        ...FormUI,
        ...HoverCardUI,
        ...InputUI,
        ...InputOtpUI,
        ...LabelUI,
        ...LinkUI,
        ...LiveWaveformUI,
        ...MarkdownUI,
        ...MenubarUI,
        ...NavigationMenuUI,
        ...PaginationUI,
        ...PdfViewerUI,
        ...PopoverUI,
        ...ProgressUI,
        ...RadioGroupUI,
        ...ResizableUI,
        ...ScrollAreaUI,
        ...SelectUI,
        ...SeparatorUI,
        ...SheetUI,
        ...SidebarUI,
        ...SkeletonUI,
        ...SliderUI,
        ...SonnerUI,
        ...SwitchUI,
        ...TableUI,
        ...TabsUI,
        ...TextareaUI,
        ...ToastUI,
        ...ToasterUI,
        ...ToggleUI,
        ...ToggleGroupUI,
        ...TooltipUI,
      }),
    [componentProps, scopeExtras],
  );

  const isCodeReady = Boolean(displayCode && part.state === 'output-available');
  const isCodeFailed = part.state === 'output-error';
  const statusValue: AgentChatToolStatusIconValue = isCodeFailed
    ? 'failed'
    : isCodeReady
      ? 'completed'
      : 'loading';
  const showCreatingSkeleton = hasOpened && !isCodeReady && !isCodeFailed;

  React.useEffect(() => {
    if (isCodeReady) {
      setOpen(true);
    }
  }, [isCodeReady]);

  // Spec: do NOT auto-expand on failure. The chevron stays clickable so the
  // user can opt in to read the error.

  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setHasOpened(true);
    }
  }, []);

  return (
    <AgentChatToolCard
      size={size}
      variant={variant}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <AgentChatToolHeader size={size} variant={variant}>
        <AgentChatToolLeadChevron status={statusValue} size={size} />
        <AgentChatToolTitle
          size={size}
          className={cn(
            agentChatToolTitleStateVariants({ status: statusValue }),
          )}
        >
          {title ? (
            title
          ) : (
            // Agent hasn't streamed the title yet — show a short skeleton
            // text placeholder. Sized to match the title line-height so the
            // row doesn't shift when the real text arrives.
            <SkeletonUI.Skeleton
              className={cn(liveComponentTitleSkeletonVariants({ size }))}
              aria-hidden="true"
            />
          )}
        </AgentChatToolTitle>
        <AgentChatToolControls size={size}>
          {/* No visible labels or tooltips — only screen-reader `aria-label`
              via `label` prop. Consumers can wrap in their own localised
              <Tooltip> if they want a visible hover hint. */}
          <AgentChatToolSecondaryAction
            size={size}
            icon={isCodeCopied ? Check : Copy}
            label={isCodeCopied ? 'Copied' : 'Copy code'}
            onClick={handleCopyCode}
            disabled={!debugCode}
          />
          <DialogUI.Dialog>
            <DialogUI.DialogTrigger asChild>
              <AgentChatToolSecondaryAction
                size={size}
                icon={Code2}
                label="View code"
                disabled={!debugCode}
              />
            </DialogUI.DialogTrigger>
            <DialogUI.DialogContent className="max-w-4xl">
              {/* DialogTitle is required by Radix for accessibility but
                  we don't want it visible (English in any-language app);
                  `sr-only` keeps it for screen readers only. We omit
                  DialogDescription entirely — it would render visibly. */}
              <DialogUI.DialogHeader className="sr-only">
                <DialogUI.DialogTitle>Generated code</DialogUI.DialogTitle>
              </DialogUI.DialogHeader>
              {debugCode ? (
                <Streamdown
                  mode="static"
                  className={liveComponentDebugCodeVariants()}
                  plugins={{ code: streamdownCode }}
                >
                  {formatDebugCodeBlock(debugCode)}
                </Streamdown>
              ) : (
                // Visible "Waiting…" copy would be a fixed language; a
                // Skeleton communicates the same waiting state without text.
                <SkeletonUI.Skeleton className="h-32 w-full" />
              )}
            </DialogUI.DialogContent>
          </DialogUI.Dialog>
        </AgentChatToolControls>
      </AgentChatToolHeader>
      <AgentChatToolContent>
        <AgentChatToolContentInner padded={false}>
          {isCodeReady ? (
            <LiveProvider code={displayCode} scope={scope} noInline>
              <div className={cn(liveComponentPreviewVariants({ size }))}>
                <LivePreview />
              </div>
              <LiveError className={cn(liveComponentErrorVariants({ size }))} />
            </LiveProvider>
          ) : showCreatingSkeleton ? (
            <AgentChatLiveComponentCreating size={size} />
          ) : (
            <div className={cn(liveComponentEmptyStateVariants({ size }))}>
              <div className="h-7" />
            </div>
          )}
        </AgentChatToolContentInner>
      </AgentChatToolContent>
    </AgentChatToolCard>
  );
}
