// ─── agent chat component renderer ──────────────────────────────────────────

import * as BlocksClientReactSdk from '@blocksdiy/blocks-client-sdk/reactSdk';
import * as AgentChatPrimitive from '@blocksdiy/react-common/new-agent-chat';
import { cva } from 'class-variance-authority';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import { LiveError, LivePreview, LiveProvider } from 'react-live';
import * as Recharts from 'recharts';

import { AgentChatLoadingDots } from '@/components/ui/agent-chat-loading-dots';
import * as AccordionUI from '@/components/ui/accordion';
import * as AlertUI from '@/components/ui/alert';
import * as AlertDialogUI from '@/components/ui/alert-dialog';
import * as AspectRatioUI from '@/components/ui/aspect-ratio';
import * as AvatarUI from '@/components/ui/avatar';
import * as BadgeUI from '@/components/ui/badge';
import * as ButtonUI from '@/components/ui/button';
import * as CalendarUI from '@/components/ui/calendar';
import * as CardUI from '@/components/ui/card';
import * as CarouselUI from '@/components/ui/carousel';
import * as ChartUI from '@/components/ui/chart';
import * as CheckboxUI from '@/components/ui/checkbox';
import * as ComboboxUI from '@/components/ui/combobox';
import * as CommandUI from '@/components/ui/command';
import * as ContextMenuUI from '@/components/ui/context-menu';
import * as DialogUI from '@/components/ui/dialog';
import * as DropdownMenuUI from '@/components/ui/dropdown-menu';
import * as FieldUI from '@/components/ui/field';
import * as FormUI from '@/components/ui/form';
import * as HoverCardUI from '@/components/ui/hover-card';
import * as InputUI from '@/components/ui/input';
import * as InputOtpUI from '@/components/ui/input-otp';
import * as LabelUI from '@/components/ui/label';
import * as MarkdownUI from '@/components/ui/markdown';
import * as NavigationMenuUI from '@/components/ui/navigation-menu';
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
import * as SwitchUI from '@/components/ui/switch';
import * as TableUI from '@/components/ui/table';
import * as TabsUI from '@/components/ui/tabs';
import * as TextareaUI from '@/components/ui/textarea';
import * as ToggleUI from '@/components/ui/toggle';
import * as ToggleGroupUI from '@/components/ui/toggle-group';
import * as TooltipUI from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import * as ProductTypes from '@/product-types';

export type ChatComponentSize = 'sm' | 'md' | 'lg';

const ProductTypesContext = React.createContext<Record<string, unknown>>(
  ProductTypes as unknown as Record<string, unknown>,
);

export const AgentChatProductTypesProvider = ProductTypesContext.Provider;

// ─── Helpers ────────────────────────────────────────────────────────────────

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

const INVALID_LIVE_SCOPE_NAMES = new Set([
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
        /^[A-Za-z_$][\w$]*$/.test(key) && !INVALID_LIVE_SCOPE_NAMES.has(key),
    ),
  );

const buildLiveScope = (
  componentProps: Record<string, unknown>,
  sendMessage: AgentChatPrimitive.AgentChatContextValue['sendMessage'],
  productTypes: Record<string, unknown>,
) =>
  sanitizeLiveScope({
    props: componentProps,
    React,
    Recharts,
    sendMessage,
    cn,
    BlocksClientReactSdk,
    ProductTypes: productTypes,
    ...AccordionUI,
    ...AlertUI,
    ...AlertDialogUI,
    ...AspectRatioUI,
    ...AvatarUI,
    ...BadgeUI,
    ...ButtonUI,
    ...CalendarUI,
    ...CardUI,
    ...CarouselUI,
    ...ChartUI,
    ...CheckboxUI,
    ...ComboboxUI,
    ...CommandUI,
    ...ContextMenuUI,
    ...DialogUI,
    ...DropdownMenuUI,
    ...FieldUI,
    ...FormUI,
    ...HoverCardUI,
    ...InputUI,
    ...InputOtpUI,
    ...LabelUI,
    ...MarkdownUI,
    ...NavigationMenuUI,
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
    ...SwitchUI,
    ...TableUI,
    ...TabsUI,
    ...TextareaUI,
    ...ToggleUI,
    ...ToggleGroupUI,
    ...TooltipUI,
  });

// ─── Variants ───────────────────────────────────────────────────────────────

const chatComponentErrorVariants = cva(
  'whitespace-pre-wrap font-sans text-sm leading-relaxed text-destructive/80',
  {
    variants: {
      size: {
        sm: 'px-2 pb-2',
        md: 'px-3 pb-3',
        lg: 'px-4 pb-4',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

// ─── Main component ─────────────────────────────────────────────────────────

export type ChatComponentStatus = 'loading' | 'completed' | 'failed';

interface ChatCodeComponentProps {
  code?: string;
  props?: Record<string, unknown>;
  status: AgentChatPrimitive.ToolCallStatus;
  size?: ChatComponentSize;
}

export function ChatCodeComponent({
  code,
  props,
  status,
  size = 'md',
}: ChatCodeComponentProps) {
  const { sendMessage: sendMessageToAgent } = AgentChatPrimitive.useAgentChat();
  const sendMessageRef =
    React.useRef<typeof sendMessageToAgent>(sendMessageToAgent);

  React.useEffect(() => {
    sendMessageRef.current = sendMessageToAgent;
  }, [sendMessageToAgent]);

  const sendMessage = React.useCallback(
    (props: Parameters<typeof sendMessageToAgent>[0]) => {
      return sendMessageRef.current(props);
    },
    [],
  );

  const productTypes = React.useContext(ProductTypesContext);
  const rawCode = code ?? '';
  const displayCode = rawCode ? normalizeLiveCode(rawCode) : '';
  // Memoised so `?? {}` doesn't break the `scope` memo's stable deps.
  const liveProps = React.useMemo(() => props ?? {}, [props]);
  const scope = React.useMemo(
    () => buildLiveScope(liveProps, sendMessage, productTypes),
    [liveProps, productTypes, sendMessage],
  );

  const isCodeReady =
    status === AgentChatPrimitive.ToolCallStatus.Complete &&
    Boolean(displayCode);

  return (
    <AnimatePresence initial={false}>
      {isCodeReady ? (
        <motion.div
          key="live-preview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <LiveProvider code={displayCode} scope={scope} noInline>
            <LivePreview />
            <LiveError className={cn(chatComponentErrorVariants({ size }))} />
          </LiveProvider>
        </motion.div>
      ) : (
        <AgentChatLoadingDots key="loading" className="text-[2px]" />
      )}
    </AnimatePresence>
  );
}
