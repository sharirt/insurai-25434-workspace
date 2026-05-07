import * as BlocksClientReactSdk from '@blocksdiy/blocks-client-sdk/reactSdk';
import { code as streamdownCode } from '@streamdown/code';
import { Check, Code2, Copy } from 'lucide-react';
import * as React from 'react';
import { LiveError, LivePreview, LiveProvider } from 'react-live';
import * as Recharts from 'recharts';
import { Streamdown } from 'streamdown';

import * as AccordionUI from '@/components/ui/accordion';
import * as AlertUI from '@/components/ui/alert';
import * as AlertDialogUI from '@/components/ui/alert-dialog';
import * as AspectRatioUI from '@/components/ui/aspect-ratio';
import * as AvatarUI from '@/components/ui/avatar';
import * as BadgeUI from '@/components/ui/badge';
import * as BaseMarkdownUI from '@/components/ui/base-markdown/base-markdown';
import * as BaseMarkdownExtensionsUI from '@/components/ui/base-markdown/extensions';
import * as BaseMarkdownTextUI from '@/components/ui/base-markdown/text';
import * as BreadcrumbUI from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
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
import {
  AgentChatToolCard,
  AgentChatToolContent,
  AgentChatToolContentInner,
  AgentChatToolControls,
  AgentChatToolHeader,
  AgentChatToolStatusIcon,
  AgentChatToolTitle,
  agentChatToolContentInnerVariants,
  type AgentChatToolCardSize,
  type AgentChatToolCardVariant,
  type AgentChatToolStatusIconValue,
} from '@/components/ui/agent-chat-tool-card';
import { cn } from '@/lib/utils';
import * as ProductTypes from '@/product-types';

export type AgentChatLiveComponentSize = AgentChatToolCardSize;
export type AgentChatLiveComponentVariant = AgentChatToolCardVariant;

type AgentChatLiveComponentPartData = {
  id?: string;
  state?: string;
  toolCallId?: string;
  output?: {
    title?: string;
    code?: string;
  };
};

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

function AgentChatLiveComponentCreating({
  size,
}: {
  size?: AgentChatLiveComponentSize;
}) {
  return (
    <div className={agentChatToolContentInnerVariants({ size })}>
      <SkeletonUI.Skeleton className="h-24 w-full" />
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
  const payload = getGenerateDynamicChatComponentPayload(part);
  const code = payload?.code ? normalizeLiveCode(payload.code) : '';
  const displayCode = code;
  const debugCode = displayCode;
  const title = payload?.title || 'Generated component';
  const [isCodeCopied, setIsCodeCopied] = React.useState(false);
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
    [scopeExtras],
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
      className="w-full min-w-0"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <AgentChatToolHeader size={size} variant={variant}>
        <AgentChatToolTitle
          size={size}
          status={<AgentChatToolStatusIcon value={statusValue} size={size} />}
        >
          {title}
        </AgentChatToolTitle>
        <AgentChatToolControls size={size}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-foreground"
            onClick={handleCopyCode}
            disabled={!debugCode}
            aria-label="Copy generated code"
            title="Copy generated code"
          >
            {isCodeCopied ? (
              <Check className="size-3.5" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </Button>
          <DialogUI.Dialog>
            <DialogUI.DialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground hover:text-foreground"
                disabled={!debugCode}
                aria-label="View generated code"
                title="View generated code"
              >
                <Code2 className="size-3.5" />
              </Button>
            </DialogUI.DialogTrigger>
            <DialogUI.DialogContent className="max-w-4xl">
              <DialogUI.DialogHeader>
                <DialogUI.DialogTitle>Generated Code</DialogUI.DialogTitle>
                <DialogUI.DialogDescription>
                  Raw TSX rendered by the chat component.
                </DialogUI.DialogDescription>
              </DialogUI.DialogHeader>
              {debugCode ? (
                <Streamdown
                  mode="static"
                  className="max-h-[65vh] overflow-auto prose max-w-none dark:prose-invert prose-pre:my-0 prose-pre:bg-transparent prose-pre:p-0 prose-code:bg-transparent prose-code:p-0"
                  plugins={{ code: streamdownCode }}
                >
                  {formatDebugCodeBlock(debugCode)}
                </Streamdown>
              ) : (
                <code className="text-muted-foreground">
                  Waiting for generated TSX...
                </code>
              )}
            </DialogUI.DialogContent>
          </DialogUI.Dialog>
        </AgentChatToolControls>
      </AgentChatToolHeader>
      <AgentChatToolContent>
        <AgentChatToolContentInner padded={false}>
          {isCodeReady ? (
            <LiveProvider code={displayCode} scope={scope} noInline>
              <div
                className={cn(
                  agentChatToolContentInnerVariants({ size }),
                  'min-w-0 max-w-full overflow-x-auto',
                )}
              >
                <LivePreview />
              </div>
              <LiveError
                className={cn(
                  'mt-0 whitespace-pre-wrap rounded-md border border-destructive/40 bg-destructive/10 text-xs text-destructive',
                  size === 'sm'
                    ? 'm-2 p-2'
                    : size === 'lg'
                      ? 'm-4 p-4'
                      : 'm-3 p-3',
                )}
              />
            </LiveProvider>
          ) : showCreatingSkeleton ? (
            <AgentChatLiveComponentCreating size={size} />
          ) : (
            <div
              className={cn(
                agentChatToolContentInnerVariants({ size }),
                'text-sm text-muted-foreground',
              )}
            >
              <div className="h-7" />
            </div>
          )}
        </AgentChatToolContentInner>
      </AgentChatToolContent>
    </AgentChatToolCard>
  );
}
