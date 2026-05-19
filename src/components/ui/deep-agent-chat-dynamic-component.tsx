// ─── generate_dynamic_chat_component tool ───────────────────────────────────

import { cva } from "class-variance-authority";
import * as React from "react";
import { LiveError, LivePreview, LiveProvider } from "react-live";
import * as Recharts from "recharts";
import z from "zod";

import * as AccordionUI from "@/components/ui/accordion";
import * as AlertUI from "@/components/ui/alert";
import * as AlertDialogUI from "@/components/ui/alert-dialog";
import * as AspectRatioUI from "@/components/ui/aspect-ratio";
import * as AvatarUI from "@/components/ui/avatar";
import * as BadgeUI from "@/components/ui/badge";
import * as ButtonUI from "@/components/ui/button";
import * as CalendarUI from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import * as CardUI from "@/components/ui/card";
import * as CarouselUI from "@/components/ui/carousel";
import * as ChartUI from "@/components/ui/chart";
import * as CheckboxUI from "@/components/ui/checkbox";
import * as ComboboxUI from "@/components/ui/combobox";
import * as CommandUI from "@/components/ui/command";
import * as ContextMenuUI from "@/components/ui/context-menu";
import * as DialogUI from "@/components/ui/dialog";
import * as DropdownMenuUI from "@/components/ui/dropdown-menu";
import * as FieldUI from "@/components/ui/field";
import * as FormUI from "@/components/ui/form";
import * as HoverCardUI from "@/components/ui/hover-card";
import * as InputUI from "@/components/ui/input";
import * as InputOtpUI from "@/components/ui/input-otp";
import * as LabelUI from "@/components/ui/label";
import * as MarkdownUI from "@/components/ui/markdown";
import * as NavigationMenuUI from "@/components/ui/navigation-menu";
import * as PopoverUI from "@/components/ui/popover";
import * as ProgressUI from "@/components/ui/progress";
import * as RadioGroupUI from "@/components/ui/radio-group";
import * as ResizableUI from "@/components/ui/resizable";
import * as ScrollAreaUI from "@/components/ui/scroll-area";
import * as SelectUI from "@/components/ui/select";
import * as SeparatorUI from "@/components/ui/separator";
import * as SheetUI from "@/components/ui/sheet";
import * as SidebarUI from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import * as SkeletonUI from "@/components/ui/skeleton";
import * as SliderUI from "@/components/ui/slider";
import * as SwitchUI from "@/components/ui/switch";
import * as TableUI from "@/components/ui/table";
import * as TabsUI from "@/components/ui/tabs";
import * as TextareaUI from "@/components/ui/textarea";
import * as ToggleUI from "@/components/ui/toggle";
import * as ToggleGroupUI from "@/components/ui/toggle-group";
import * as TooltipUI from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// ─── Schema / types ─────────────────────────────────────────────────────────

export const GENERATE_DYNAMIC_CHAT_COMPONENT_TOOL_NAME = "generate_dynamic_chat_component";

export const generateDynamicChatComponentParametersSchema = z.object({
  prompt: z.string().optional(),
});

export type GenerateDynamicChatComponentArgs = z.infer<typeof generateDynamicChatComponentParametersSchema>;

export interface GenerateDynamicChatComponentResult {
  title?: string;
  code?: string;
  chatComponent?: boolean;
  componentProps?: Record<string, unknown>;
}

export type LiveComponentSize = "sm" | "md" | "lg";

// ─── Helpers ────────────────────────────────────────────────────────────────

const normalizeLiveCode = (code: string) => {
  const trimmed = code.trim();
  const fencedMatch = trimmed.match(/^```(?:tsx|jsx|typescript|javascript|ts|js)?\s*([\s\S]*?)\s*```$/);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }
  return trimmed
    .replace(/^```(?:tsx|jsx|typescript|javascript|ts|js)?\s*/, "")
    .replace(/\s*```$/, "")
    .trim();
};

const INVALID_LIVE_SCOPE_NAMES = new Set([
  "default",
  "import",
  "export",
  "class",
  "function",
  "return",
  "const",
  "let",
  "var",
]);

const sanitizeLiveScope = (scope: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(scope).filter(([key]) => /^[A-Za-z_$][\w$]*$/.test(key) && !INVALID_LIVE_SCOPE_NAMES.has(key)),
  );

const buildLiveScope = (componentProps: Record<string, unknown>) =>
  sanitizeLiveScope({
    props: componentProps,
    React,
    Recharts,
    cn,
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

const liveComponentCardVariants = cva("overflow-hidden py-0");

const liveComponentPreviewVariants = cva("min-w-0 max-w-full overflow-x-auto", {
  variants: {
    size: {
      sm: "p-2",
      md: "p-3",
      lg: "p-4",
    },
  },
  defaultVariants: { size: "md" },
});

const liveComponentSkeletonVariants = cva("w-full", {
  variants: {
    size: {
      sm: "h-32 min-w-56",
      md: "h-40 min-w-64",
      lg: "h-48 min-w-72",
    },
  },
  defaultVariants: { size: "md" },
});

const liveComponentErrorVariants = cva("whitespace-pre-wrap font-sans text-sm leading-relaxed text-destructive/80", {
  variants: {
    size: {
      sm: "px-2 pb-2",
      md: "px-3 pb-3",
      lg: "px-4 pb-4",
    },
  },
  defaultVariants: { size: "md" },
});

// ─── Main component ─────────────────────────────────────────────────────────

interface GenerateDynamicChatComponentToolProps {
  /** LLM-provided args. We don't render `prompt`; it's here for future use. */
  args?: GenerateDynamicChatComponentArgs;
  /** Parsed tool result. `undefined` until the tool completes. */
  result?: GenerateDynamicChatComponentResult;
  /** `true` once the tool has returned (status === "complete"). */
  isComplete: boolean;
  /** `true` if parsing the tool result failed. */
  isFailed?: boolean;
  size?: LiveComponentSize;
}

export function GenerateDynamicChatComponentTool({
  result,
  isComplete,
  isFailed = false,
  size = "md",
}: GenerateDynamicChatComponentToolProps) {
  const rawCode = result?.code ?? "";
  const displayCode = rawCode ? normalizeLiveCode(rawCode) : "";
  // Memoised so `?? {}` doesn't break the `scope` memo's stable deps.
  const componentProps = React.useMemo(() => result?.componentProps ?? {}, [result?.componentProps]);
  const scope = React.useMemo(() => buildLiveScope(componentProps), [componentProps]);

  const isCodeReady = isComplete && Boolean(displayCode) && !isFailed;

  if (!isCodeReady && !isFailed) {
    return <Skeleton className={cn(liveComponentSkeletonVariants({ size }))} aria-label="Generating component" />;
  }

  if (isFailed) {
    return <div className={cn(liveComponentErrorVariants({ size }))}>Failed to render component</div>;
  }

  return (
    <Card className={cn(liveComponentCardVariants())}>
      <CardContent className={cn(liveComponentPreviewVariants({ size }))}>
        <LiveProvider code={displayCode} scope={scope} noInline>
          <LivePreview />
          <LiveError className={cn(liveComponentErrorVariants({ size }))} />
        </LiveProvider>
      </CardContent>
    </Card>
  );
}
