import * as AgentChatPrimitive from '@blocksdiy/react-common/agent-chat';
import type {
  AskUserQuestionType,
  AskUserSubmittedAnswer,
  MessageItem,
} from '@blocksdiy/react-common/agent-chat';
import { cva, type VariantProps } from 'class-variance-authority';
import { ArrowLeft, ArrowRight, Check, Pencil } from 'lucide-react';
import * as React from 'react';

import {
  type AgentChatToolCardSize,
  type AgentChatToolCardVariant,
} from '@/components/ui/agent-chat-tool-card';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

export const ASK_USER_TOOL_NAME = 'ask_user';
export const ASK_USER_TOOL_TYPE = `tool-${ASK_USER_TOOL_NAME}`;

const OTHER_OPTION_ID = '__other__';

// ─── Types ──────────────────────────────────────────────────────────────────

interface AskUserQuestionOption {
  id: string;
  label: string;
  /**
   * Optional secondary copy. When ANY option in a question has a description,
   * the whole question renders as cards instead of chips.
   */
  description?: string;
}

interface AskUserQuestion {
  id: string;
  label: string;
  type: AskUserQuestionType;
  required?: boolean;
  placeholder?: string;
  options?: AskUserQuestionOption[];
  choices?: string[];
  allowOther?: boolean;
  /**
   * Agent-supplied label for the "type your own" affordance. Rendered as
   * accessibility-only (`aria-label`) — the visible affordance is a pencil
   * icon. We still expose the label so screen readers get something
   * meaningful in the agent's language.
   */
  otherLabel?: string;
  /**
   * Force `chips` or `cards` rendering. If absent, we infer cards when any
   * option carries a `description`.
   */
  presentation?: 'chips' | 'cards';
}

interface AskUserPayload {
  questions: AskUserQuestion[];
}

export interface AgentChatAskUserPartData {
  id?: string;
  type: string;
  state?: string;
  toolName?: string;
  toolCallId?: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
}

// ─── Variants ───────────────────────────────────────────────────────────────

// Outer wrapper sits flush in the AI message column — no card chrome, no
// border, no background. Per-question spacing has to be visibly larger than
// the intra-question gap, otherwise consecutive questions read as one block.
const askUserWrapperVariants = cva('flex w-full min-w-0 flex-col', {
  variants: {
    size: {
      sm: 'gap-6',
      md: 'gap-8',
      lg: 'gap-10',
    },
  },
  defaultVariants: { size: 'md' },
});

// Intra-question gap — between the Label and the answer surface. `Field`
// defaults to `gap-2` (8px) which is too tight against the chips on the
// canvas; this bumps it per size. Stays smaller than `askUserWrapperVariants`
// so the inter-question break is always the dominant visual rhythm.
const askUserQuestionGapVariants = cva('', {
  variants: {
    size: {
      sm: 'gap-4',
      md: 'gap-5',
      lg: 'gap-6',
    },
  },
  defaultVariants: { size: 'md' },
});

// Question label — uses the shadcn `Label` component. Calm foreground/90,
// never bolded; switches to destructive when validation fails. We lean on
// colour because any inline error copy would be in a fixed language.
//
// Overrides Label's base (`text-sm font-medium leading-none`):
//   - `font-medium` → `font-normal`   (calmer voice)
//   - `leading-none` → `leading-[1.6]` (matches AI message body line-height)
//   - `text-sm`     → per-size text scale
const askUserQuestionLabelVariants = cva('leading-[1.6] font-normal', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
    invalid: {
      true: 'text-destructive/80',
      false: 'text-foreground/90',
    },
  },
  defaultVariants: { size: 'md', invalid: false },
});

// Helper text under the question — only used when the agent supplies a
// `placeholder` for a non-text question.
const askUserHelperTextVariants = cva('text-muted-foreground/70 leading-snug', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-xs',
      lg: 'text-sm',
    },
  },
  defaultVariants: { size: 'md' },
});

// Chip toggle — outline pill that reads like a shadcn outline button
// (`border-input`), with a thicker foreground border when selected. We
// override `toggleVariants` defaults (which use `bg-muted`/`bg-accent`
// fills) so the chip stays calm against the canvas. Targets `data-state=on`
// from Radix's ToggleGroupItem.
const askUserChipItemVariants = cva(
  cn(
    // Layout / hit target
    'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-input bg-background text-foreground transition-colors',
    // Hover (override Toggle's hover:bg-muted; bump the border to full
    // foreground so the affordance reads clearly)
    'hover:bg-background hover:text-foreground hover:border-foreground',
    // Selected (override Toggle's data-[state=on]:bg-accent)
    'data-[state=on]:bg-background data-[state=on]:text-foreground',
    'data-[state=on]:border-2 data-[state=on]:border-foreground data-[state=on]:-m-px',
    // Focus + disabled handled by toggleVariants base; nothing to add.
  ),
  {
    variants: {
      size: {
        sm: 'h-7 min-w-7 px-3 text-xs',
        md: 'h-8 min-w-8 px-4 text-sm',
        lg: 'h-9 min-w-9 px-5 text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

// Pencil-icon ("type your own") variant of the chip — square hit target.
const askUserOtherChipItemVariants = cva(
  cn(
    'inline-flex shrink-0 items-center justify-center rounded-full border border-input bg-background text-muted-foreground transition-colors',
    'hover:bg-background hover:text-foreground hover:border-foreground',
    'data-[state=on]:bg-background data-[state=on]:text-foreground',
    'data-[state=on]:border-2 data-[state=on]:border-foreground data-[state=on]:-m-px',
  ),
  {
    variants: {
      size: {
        sm: 'size-7',
        md: 'size-8',
        lg: 'size-9',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

// Card toggle — large outline tile with title + optional description.
// Same `border-input` outline-button treatment as the chip, scaled up.
const askUserCardItemVariants = cva(
  cn(
    'group/card relative flex w-full items-start gap-3 rounded-lg border border-input bg-background text-left text-foreground transition-colors',
    'hover:bg-background hover:text-foreground hover:border-foreground',
    'data-[state=on]:bg-background data-[state=on]:text-foreground',
    'data-[state=on]:border-2 data-[state=on]:border-foreground data-[state=on]:-m-px',
    // Card titles can wrap; opt out of the toggleVariants `whitespace-nowrap`.
    'whitespace-normal',
  ),
  {
    variants: {
      size: {
        sm: 'h-auto min-h-12 px-3 py-2 text-sm',
        md: 'h-auto min-h-14 px-3 py-2.5 text-sm',
        lg: 'h-auto min-h-16 px-4 py-3 text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

const askUserCardTitleVariants = cva('font-semibold leading-tight', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: { size: 'md' },
});

const askUserCardDescriptionVariants = cva(
  'mt-0.5 text-muted-foreground leading-snug',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-sm',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

// Tiny check indicator for multi-select cards — uses theme `primary` so it
// matches the consumer app's brand colour (the one full-colour moment per
// Design Intent — same family as the Send button).
const askUserCardCheckIndicatorVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-md border transition-colors',
  {
    variants: {
      size: {
        sm: 'size-4',
        md: 'size-5',
        lg: 'size-5',
      },
      selected: {
        true: 'border-primary bg-primary text-primary-foreground',
        false: 'border-border bg-transparent',
      },
    },
    defaultVariants: { size: 'md', selected: false },
  },
);

const askUserCardCheckIconVariants = cva('', {
  variants: {
    size: {
      sm: 'size-3',
      md: 'size-3.5',
      lg: 'size-3.5',
    },
  },
  defaultVariants: { size: 'md' },
});

// Layout for the chip group — wrap horizontally.
const askUserChipsGroupClass =
  'flex w-full min-w-0 flex-wrap items-center justify-start';
// Layout for the cards group — vertical column.
const askUserCardsGroupClass =
  'flex w-full min-w-0 flex-col items-stretch justify-start';

// Action row holds the icon-only Send button and any future skip / type-own
// affordances. Right-aligned so it follows the answer surface.
const askUserActionRowVariants = cva('flex w-full items-center justify-end', {
  variants: {
    size: {
      sm: 'gap-1.5',
      md: 'gap-2',
      lg: 'gap-2',
    },
  },
  defaultVariants: { size: 'md' },
});

// Primary Send — uses theme `primary` so it picks up the consumer app's
// brand colour. Icon-only; the `aria-label` is the only English string and
// it's screen-reader-only.
const askUserSendButtonVariants = cva(
  cn(
    'inline-flex shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors',
    'hover:bg-primary/90',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ),
  {
    variants: {
      size: {
        sm: 'size-7',
        md: 'size-8',
        lg: 'size-9',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

const askUserSendButtonIconVariants = cva('', {
  variants: {
    size: {
      sm: 'size-3.5',
      md: 'size-4',
      lg: 'size-4',
    },
  },
  defaultVariants: { size: 'md' },
});

const askUserOtherIconVariants = cva('', {
  variants: {
    size: {
      sm: 'size-3.5',
      md: 'size-4',
      lg: 'size-4',
    },
  },
  defaultVariants: { size: 'md' },
});

// Plain back-arrow chip used to dismiss the inline textarea and return to
// the option list. Same outline-button treatment (`border-input`) as the
// option chips so the row reads as one family.
const askUserBackButtonVariants = cva(
  cn(
    'inline-flex shrink-0 items-center justify-center rounded-full border border-input bg-background text-muted-foreground transition-colors',
    'hover:text-foreground hover:border-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-60',
  ),
  {
    variants: {
      size: {
        sm: 'size-7',
        md: 'size-8',
        lg: 'size-9',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

const askUserBackButtonIconVariants = cva('', {
  variants: {
    size: {
      sm: 'size-3.5',
      md: 'size-4',
      lg: 'size-4',
    },
  },
  defaultVariants: { size: 'md' },
});

// NB: text inputs use the shared `Textarea` component as-is. The component
// already provides outline, padding, focus ring, placeholder colour, and a
// sensible `min-h-[80px]` default. We only attach a `flex-1` className when
// the textarea sits inside the inline back-arrow row (layout, not styling).

// ─── Payload normalisation ──────────────────────────────────────────────────

const normalizeAskUserOption = (
  option: unknown,
  index: number,
): AskUserQuestionOption | null => {
  if (typeof option === 'string') {
    return {
      id:
        option
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '') || `option_${index + 1}`,
      label: option,
    };
  }

  if (
    option &&
    typeof option === 'object' &&
    typeof (option as { label?: unknown }).label === 'string'
  ) {
    const source = option as {
      id?: unknown;
      label: string;
      description?: unknown;
    };
    return {
      id:
        typeof source.id === 'string' && source.id
          ? source.id
          : `option_${index + 1}`,
      label: source.label,
      description:
        typeof source.description === 'string' && source.description.trim()
          ? source.description
          : undefined,
    };
  }

  return null;
};

const normalizeAskUserQuestion = (
  question: unknown,
  index: number,
): AskUserQuestion | null => {
  if (!question || typeof question !== 'object') {
    return null;
  }

  const source = question as Record<string, unknown>;
  const label = source.label ?? source.question;
  if (typeof label !== 'string' || !label.trim()) {
    return null;
  }

  const rawOptions = Array.isArray(source.options)
    ? source.options
    : Array.isArray(source.choices)
      ? source.choices
      : [];
  const options = rawOptions
    .map((option, optionIndex) => normalizeAskUserOption(option, optionIndex))
    .filter((option): option is AskUserQuestionOption => Boolean(option));
  const requestedType: AskUserQuestionType =
    source.type === 'text' ||
    source.type === 'single_select' ||
    source.type === 'multi_select'
      ? source.type
      : options.length
        ? 'single_select'
        : 'text';
  const type =
    requestedType !== 'text' && options.length === 0 ? 'text' : requestedType;
  const presentation =
    source.presentation === 'cards' || source.presentation === 'chips'
      ? source.presentation
      : undefined;

  return {
    id:
      typeof source.id === 'string' && source.id
        ? source.id
        : `question_${index + 1}`,
    label,
    type,
    required: typeof source.required === 'boolean' ? source.required : true,
    placeholder:
      typeof source.placeholder === 'string' ? source.placeholder : undefined,
    options: options.length ? options : undefined,
    allowOther:
      typeof source.allowOther === 'boolean' ? source.allowOther : undefined,
    otherLabel:
      typeof source.otherLabel === 'string' ? source.otherLabel : undefined,
    presentation,
  };
};

const getAskUserPayload = (
  part: AgentChatAskUserPartData,
): AskUserPayload | null => {
  const candidate = part.input || part.output;
  if (!candidate) {
    return null;
  }

  if (Array.isArray(candidate.questions)) {
    const questions = candidate.questions
      .map((question, index) => normalizeAskUserQuestion(question, index))
      .filter((question): question is AskUserQuestion => Boolean(question));
    return questions.length ? { questions } : null;
  }

  const singleQuestion = normalizeAskUserQuestion(candidate, 0);
  return singleQuestion ? { questions: [singleQuestion] } : null;
};

const getQuestionOptionLabel = (question: AskUserQuestion, optionId: string) =>
  question.options?.find((option) => option.id === optionId)?.label ?? optionId;

const getMessageHiddenContent = (message: MessageItem) => {
  const msg = message.msg as {
    hiddenContent?: unknown;
    metadata?: { hiddenPrompt?: unknown };
  };
  const hiddenPrompt = msg.metadata?.hiddenPrompt;
  return typeof hiddenPrompt === 'string'
    ? hiddenPrompt
    : typeof msg.hiddenContent === 'string'
      ? msg.hiddenContent
      : undefined;
};

const parseAskUserAnswersFromHiddenContent = (
  hiddenContent: string | undefined,
  toolCallId?: string,
): AskUserSubmittedAnswer[] | null => {
  if (
    !hiddenContent?.includes('"tool_resume"') &&
    !hiddenContent?.includes('"ask_user_answers"')
  ) {
    return null;
  }

  const jsonStart = hiddenContent.indexOf('{');
  if (jsonStart === -1) {
    return null;
  }

  try {
    const payload = JSON.parse(hiddenContent.slice(jsonStart)) as {
      type?: unknown;
      resumeType?: unknown;
      toolName?: unknown;
      toolCallId?: unknown;
      answers?: unknown;
    };
    const isAskUserResume =
      payload.type === 'ask_user_answers' ||
      (payload.type === 'tool_resume' &&
        (payload.resumeType === 'ask_user' ||
          payload.toolName === ASK_USER_TOOL_NAME));
    if (!isAskUserResume) {
      return null;
    }
    if (toolCallId && payload.toolCallId !== toolCallId) {
      return null;
    }
    return Array.isArray(payload.answers)
      ? (payload.answers as AskUserSubmittedAnswer[])
      : null;
  } catch {
    return null;
  }
};

const findPersistedAskUserAnswers = (
  messages: MessageItem[],
  toolCallId?: string,
) => {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const answers = parseAskUserAnswersFromHiddenContent(
      getMessageHiddenContent(messages[index]),
      toolCallId,
    );
    if (answers?.length) {
      return answers;
    }
  }
  return null;
};

const getAskUserAnswersFromToolOutput = (
  output: AgentChatAskUserPartData['output'],
): AskUserSubmittedAnswer[] | null =>
  Array.isArray(output?.answers)
    ? (output.answers as AskUserSubmittedAnswer[])
    : null;

const getAskUserSkippedFromToolOutput = (
  output: AgentChatAskUserPartData['output'],
) => output?.skipped === true;

const askUserAnswersToFormState = (
  submittedAnswers: AskUserSubmittedAnswer[] | null,
) => {
  const answerValues: Record<string, string | string[]> = {};
  const otherAnswerValues: Record<string, string> = {};

  for (const answer of submittedAnswers || []) {
    if (answer.type === 'multi_select') {
      const values = [...(answer.values || [])];
      if (answer.other) {
        values.push(OTHER_OPTION_ID);
        otherAnswerValues[answer.questionId] = answer.other;
      }
      answerValues[answer.questionId] = values;
      continue;
    }

    if (answer.type === 'single_select') {
      if (answer.other) {
        answerValues[answer.questionId] = OTHER_OPTION_ID;
        otherAnswerValues[answer.questionId] = answer.other;
      } else if (answer.value) {
        answerValues[answer.questionId] = answer.value;
      }
      continue;
    }

    answerValues[answer.questionId] = answer.value || '';
  }

  return { answerValues, otherAnswerValues };
};

// Cards rendering: explicit `presentation: 'cards'` OR any option carries a
// description (the description simply doesn't fit a chip).
const shouldRenderAsCards = (question: AskUserQuestion) => {
  if (question.presentation === 'cards') return true;
  if (question.presentation === 'chips') return false;
  return Boolean(question.options?.some((option) => option.description));
};

// ─── Subcomponents ──────────────────────────────────────────────────────────

interface SendButtonProps extends VariantProps<
  typeof askUserSendButtonVariants
> {
  /** Screen-reader only label — never rendered visibly. */
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function SendButton({ size, label, onClick, disabled }: SendButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(askUserSendButtonVariants({ size }))}
    >
      {/* Right-pointing arrow reads as "go forward / submit this answer";
          composer Send (different control) uses up-arrow. */}
      <ArrowRight className={cn(askUserSendButtonIconVariants({ size }))} />
    </button>
  );
}

interface BackButtonProps extends VariantProps<
  typeof askUserBackButtonVariants
> {
  /** Screen-reader only label — never rendered visibly. */
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function BackButton({ size, label, onClick, disabled }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(askUserBackButtonVariants({ size }))}
    >
      <ArrowLeft className={cn(askUserBackButtonIconVariants({ size }))} />
    </button>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export function AgentChatAskUserPart({
  part,
  size = 'md',
  variant: _variant = 'bubble',
}: {
  part: AgentChatAskUserPartData;
  size?: AgentChatToolCardSize;
  variant?: AgentChatToolCardVariant;
}) {
  const payload = getAskUserPayload(part);
  const { isThinking, messages, submitAskUserAnswers } =
    AgentChatPrimitive.useAgentChat();
  // Stable id prefix so we can wire `htmlFor` on Label and `aria-labelledby`
  // on the ToggleGroup deterministically per-question.
  const formId = React.useId();
  const persistedSubmittedAnswers = React.useMemo(
    () =>
      getAskUserAnswersFromToolOutput(part.output) ||
      findPersistedAskUserAnswers(messages, part.toolCallId),
    [messages, part.output, part.toolCallId],
  );
  const persistedFormState = React.useMemo(
    () => askUserAnswersToFormState(persistedSubmittedAnswers),
    [persistedSubmittedAnswers],
  );
  const isSkipped = getAskUserSkippedFromToolOutput(part.output);
  const [answers, setAnswers] = React.useState<
    Record<string, string | string[]>
  >(persistedFormState.answerValues);
  const [otherAnswers, setOtherAnswers] = React.useState<
    Record<string, string>
  >(persistedFormState.otherAnswerValues);
  const [error, setError] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(
    isSkipped || Boolean(persistedSubmittedAnswers?.length),
  );
  const isAnswered =
    submitted || isSkipped || Boolean(persistedSubmittedAnswers?.length);
  const isDisabled = isThinking || isAnswered;

  React.useEffect(() => {
    if (isSkipped) {
      setSubmitted(true);
      return;
    }
    if (!persistedSubmittedAnswers?.length) {
      return;
    }
    setAnswers(persistedFormState.answerValues);
    setOtherAnswers(persistedFormState.otherAnswerValues);
    setSubmitted(true);
  }, [isSkipped, persistedSubmittedAnswers, persistedFormState]);

  // ── State helpers ───────────────────────────────────────────────────────

  const setSingleValue = React.useCallback(
    (questionId: string, value: string) => {
      setAnswers((current) => ({ ...current, [questionId]: value }));
    },
    [],
  );

  const setMultiValues = React.useCallback(
    (questionId: string, values: string[]) => {
      setAnswers((current) => ({ ...current, [questionId]: values }));
    },
    [],
  );

  // Build the submitted-answers payload from a given answer state. Accepting
  // overrides lets the auto-submit path pass a freshly-set value without
  // waiting for a `setState` round trip.
  const buildSubmittedAnswersFrom = React.useCallback(
    (
      sourceAnswers: Record<string, string | string[]>,
      sourceOtherAnswers: Record<string, string>,
    ): AskUserSubmittedAnswer[] => {
      if (!payload) return [];
      return payload.questions.map((question): AskUserSubmittedAnswer => {
        const answer = sourceAnswers[question.id];
        const otherAnswer = sourceOtherAnswers[question.id]?.trim();

        if (question.type === 'multi_select') {
          const values = Array.isArray(answer) ? answer : [];
          return {
            questionId: question.id,
            question: question.label,
            type: question.type,
            values: values.filter((value) => value !== OTHER_OPTION_ID),
            labels: values
              .filter((value) => value !== OTHER_OPTION_ID)
              .map((value) => getQuestionOptionLabel(question, value)),
            other: values.includes(OTHER_OPTION_ID) ? otherAnswer : undefined,
          };
        }

        if (question.type === 'single_select') {
          const value = typeof answer === 'string' ? answer : '';
          return {
            questionId: question.id,
            question: question.label,
            type: question.type,
            value: value === OTHER_OPTION_ID ? undefined : value,
            label:
              value && value !== OTHER_OPTION_ID
                ? getQuestionOptionLabel(question, value)
                : undefined,
            other: value === OTHER_OPTION_ID ? otherAnswer : undefined,
          };
        }

        return {
          questionId: question.id,
          question: question.label,
          type: question.type,
          value: typeof answer === 'string' ? answer.trim() : '',
        };
      });
    },
    [payload],
  );

  const validateAnswers = React.useCallback(
    (
      sourceAnswers: Record<string, string | string[]>,
      sourceOtherAnswers: Record<string, string>,
    ) => {
      if (!payload) return null;
      for (const question of payload.questions) {
        if (!question.required) continue;
        const answer = sourceAnswers[question.id];
        const otherAnswer = sourceOtherAnswers[question.id]?.trim();
        if (
          question.type === 'text' &&
          (typeof answer !== 'string' || !answer.trim())
        ) {
          return question.id;
        }
        if (
          question.type === 'single_select' &&
          (typeof answer !== 'string' || !answer)
        ) {
          return question.id;
        }
        if (
          question.type === 'multi_select' &&
          (!Array.isArray(answer) || answer.length === 0)
        ) {
          return question.id;
        }
        if (answer === OTHER_OPTION_ID && !otherAnswer) {
          return question.id;
        }
        if (
          Array.isArray(answer) &&
          answer.includes(OTHER_OPTION_ID) &&
          !otherAnswer
        ) {
          return question.id;
        }
      }
      return null;
    },
    [payload],
  );

  const submitWith = React.useCallback(
    async (
      sourceAnswers: Record<string, string | string[]>,
      sourceOtherAnswers: Record<string, string>,
    ) => {
      const invalidQuestionId = validateAnswers(
        sourceAnswers,
        sourceOtherAnswers,
      );
      if (invalidQuestionId) {
        setError(invalidQuestionId);
        return;
      }
      setError(null);
      setSubmitted(true);
      await submitAskUserAnswers({
        toolCallId: part.toolCallId,
        toolName: ASK_USER_TOOL_NAME,
        answers: buildSubmittedAnswersFrom(sourceAnswers, sourceOtherAnswers),
      });
    },
    [
      buildSubmittedAnswersFrom,
      part.toolCallId,
      submitAskUserAnswers,
      validateAnswers,
    ],
  );

  if (!payload) {
    return null;
  }

  // Auto-submit applies only to a single-question single-select chip with
  // no allowOther escape hatch — clicking IS the submit gesture.
  const isInstantSubmitFlow =
    payload.questions.length === 1 &&
    payload.questions[0].type === 'single_select' &&
    !payload.questions[0].allowOther &&
    !shouldRenderAsCards(payload.questions[0]);

  const handleSendClick = () => {
    if (isDisabled) return;
    void submitWith(answers, otherAnswers);
  };

  return (
    <FieldGroup
      className={cn(askUserWrapperVariants({ size }))}
      data-disabled={isDisabled || undefined}
    >
      {payload.questions.map((question) => {
        const isCards = shouldRenderAsCards(question);
        const isInvalid = error === question.id;
        const isMulti = question.type === 'multi_select';
        const isSingle = question.type === 'single_select';
        const isText = question.type === 'text';

        const currentAnswer = answers[question.id];
        const currentValues = Array.isArray(currentAnswer) ? currentAnswer : [];
        const currentSingleValue =
          typeof currentAnswer === 'string' ? currentAnswer : '';
        const isOtherSelected = isMulti
          ? currentValues.includes(OTHER_OPTION_ID)
          : currentSingleValue === OTHER_OPTION_ID;

        // Single-select with `type="single"`: Radix wants a plain string and
        // accepts `''` as "nothing selected". Multi-select wants `string[]`.
        const onSingleChange = (value: string) => {
          // Radix fires '' when the user re-clicks the active item to
          // deselect — preserve that.
          setSingleValue(question.id, value);
          if (isInstantSubmitFlow && value && value !== OTHER_OPTION_ID) {
            const next = { ...answers, [question.id]: value };
            void submitWith(next, otherAnswers);
          }
        };

        const onMultiChange = (values: string[]) => {
          setMultiValues(question.id, values);
        };

        const labelId = `${formId}-${question.id}-label`;
        const controlId = `${formId}-${question.id}-control`;

        return (
          <Field
            key={question.id}
            data-invalid={isInvalid || undefined}
            data-disabled={isDisabled || undefined}
            className={cn(askUserQuestionGapVariants({ size }))}
          >
            {/* Question text uses the shadcn `Label` component. For text
                questions the label is associated with the Textarea via
                `htmlFor`; for chip/card questions there's no single control
                so we wire the ToggleGroup with `aria-labelledby` instead. */}
            <Label
              id={labelId}
              htmlFor={isText ? controlId : undefined}
              className={cn(
                askUserQuestionLabelVariants({ size, invalid: isInvalid }),
              )}
            >
              {question.label}
            </Label>

            {/* Helper text — only when the agent supplies a placeholder for
                a non-text question. (For text questions the placeholder
                lives on the textarea itself.) */}
            {question.placeholder && !isText && (
              <FieldDescription
                className={cn(askUserHelperTextVariants({ size }))}
              >
                {question.placeholder}
              </FieldDescription>
            )}

            {/* TEXT type — plain `Textarea`, no styling overrides. */}
            {isText && (
              <Textarea
                id={controlId}
                value={currentSingleValue}
                onChange={(event) =>
                  setSingleValue(question.id, event.target.value)
                }
                placeholder={question.placeholder}
                disabled={isDisabled}
                aria-invalid={isInvalid || undefined}
              />
            )}

            {/* SELECT type — chips OR cards via ToggleGroup. */}
            {(isSingle || isMulti) && (
              <>
                {isMulti ? (
                  <ToggleGroup
                    type="multiple"
                    value={currentValues}
                    onValueChange={onMultiChange}
                    disabled={isDisabled}
                    aria-labelledby={labelId}
                    className={cn(
                      isCards ? askUserCardsGroupClass : askUserChipsGroupClass,
                      askUserGroupGapClass(size),
                    )}
                  >
                    {(question.options || []).map((option) => (
                      <ToggleGroupItem
                        key={option.id}
                        value={option.id}
                        // For cards, the description isn't read aloud as part
                        // of the visible label, so we surface it via
                        // aria-label. For chips, the visible textContent IS
                        // the label — adding aria-label would shadow it.
                        {...(isCards && option.description
                          ? {
                              'aria-label': `${option.label} — ${option.description}`,
                            }
                          : {})}
                        className={
                          isCards
                            ? cn(askUserCardItemVariants({ size }))
                            : cn(askUserChipItemVariants({ size }))
                        }
                      >
                        {isCards ? (
                          <CardItemChildren
                            option={option}
                            size={size}
                            multi
                            selected={currentValues.includes(option.id)}
                          />
                        ) : (
                          <span>{option.label}</span>
                        )}
                      </ToggleGroupItem>
                    ))}

                    {question.allowOther && (
                      <ToggleGroupItem
                        value={OTHER_OPTION_ID}
                        // Icon-only chip — needs a screen-reader label.
                        // Falls back to English `'Other'` (accessibility-only
                        // English is allowed). Agent can localise via
                        // `question.otherLabel`.
                        aria-label={question.otherLabel || 'Other'}
                        className={cn(askUserOtherChipItemVariants({ size }))}
                      >
                        <Pencil
                          className={cn(askUserOtherIconVariants({ size }))}
                        />
                      </ToggleGroupItem>
                    )}
                  </ToggleGroup>
                ) : (
                  <ToggleGroup
                    type="single"
                    value={currentSingleValue}
                    onValueChange={onSingleChange}
                    disabled={isDisabled}
                    aria-labelledby={labelId}
                    className={cn(
                      isCards ? askUserCardsGroupClass : askUserChipsGroupClass,
                      askUserGroupGapClass(size),
                    )}
                  >
                    {(question.options || []).map((option) => (
                      <ToggleGroupItem
                        key={option.id}
                        value={option.id}
                        {...(isCards && option.description
                          ? {
                              'aria-label': `${option.label} — ${option.description}`,
                            }
                          : {})}
                        className={
                          isCards
                            ? cn(askUserCardItemVariants({ size }))
                            : cn(askUserChipItemVariants({ size }))
                        }
                      >
                        {isCards ? (
                          <CardItemChildren
                            option={option}
                            size={size}
                            selected={currentSingleValue === option.id}
                          />
                        ) : (
                          <span>{option.label}</span>
                        )}
                      </ToggleGroupItem>
                    ))}

                    {question.allowOther && (
                      <ToggleGroupItem
                        value={OTHER_OPTION_ID}
                        aria-label={question.otherLabel || 'Other'}
                        className={cn(askUserOtherChipItemVariants({ size }))}
                      >
                        <Pencil
                          className={cn(askUserOtherIconVariants({ size }))}
                        />
                      </ToggleGroupItem>
                    )}
                  </ToggleGroup>
                )}

                {/* Inline "type your own" textarea — appears when the
                    OTHER_OPTION_ID is part of the current selection. The
                    options stay visible above so the user can still pick a
                    preset (matches image 5). Back-arrow deselects Other. */}
                {isOtherSelected && (
                  <div className="flex w-full items-start gap-2">
                    <BackButton
                      size={size}
                      // Screen-reader-only English fallback (accessibility
                      // exception). The visual is just an arrow icon.
                      label="Back"
                      disabled={isDisabled}
                      onClick={() => {
                        // Deselecting OTHER hides the textarea via the
                        // `isOtherSelected` derivation.
                        if (isMulti) {
                          setMultiValues(
                            question.id,
                            currentValues.filter((v) => v !== OTHER_OPTION_ID),
                          );
                        } else {
                          setSingleValue(question.id, '');
                        }
                      }}
                    />
                    <Textarea
                      value={otherAnswers[question.id] || ''}
                      onChange={(event) =>
                        setOtherAnswers((current) => ({
                          ...current,
                          [question.id]: event.target.value,
                        }))
                      }
                      placeholder={question.placeholder}
                      disabled={isDisabled}
                      aria-invalid={isInvalid || undefined}
                      aria-labelledby={labelId}
                      // `flex-1` is layout (sit next to the back-arrow),
                      // not a styling override of the Textarea itself.
                      className="flex-1"
                    />
                  </div>
                )}
              </>
            )}
          </Field>
        );
      })}

      {/* Send action — shown for everything EXCEPT the auto-submit flow.
          Right-aligned. Validation feedback comes from the question Label
          switching to destructive colour above (no inline error copy in any
          fixed language). */}
      {!isInstantSubmitFlow && !isAnswered && (
        <div className={cn(askUserActionRowVariants({ size }))}>
          {/* `label` is the screen-reader-only `aria-label`. English here is
              the accessibility-only kind the user explicitly OK'd. */}
          <SendButton
            size={size}
            label="Send"
            disabled={isDisabled}
            onClick={handleSendClick}
          />
        </div>
      )}
    </FieldGroup>
  );
}

// Card body subcomponent — keeps the option-mapping JSX above readable.
function CardItemChildren({
  option,
  size,
  multi,
  selected,
}: {
  option: AskUserQuestionOption;
  size: AgentChatToolCardSize;
  multi?: boolean;
  selected?: boolean;
}) {
  return (
    <>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={cn(askUserCardTitleVariants({ size }))}>
          {option.label}
        </span>
        {option.description && (
          <span className={cn(askUserCardDescriptionVariants({ size }))}>
            {option.description}
          </span>
        )}
      </span>
      {multi && (
        <span
          className={cn(askUserCardCheckIndicatorVariants({ size, selected }))}
          aria-hidden="true"
        >
          {selected && (
            <Check className={cn(askUserCardCheckIconVariants({ size }))} />
          )}
        </span>
      )}
    </>
  );
}

// Group gap helper — picks the inter-option spacing per size. Lives outside
// the `cva` because the same value is reused for chips (wrap row) and
// cards (vertical column).
function askUserGroupGapClass(size: AgentChatToolCardSize) {
  return size === 'sm' ? 'gap-1.5' : size === 'lg' ? 'gap-2.5' : 'gap-2';
}
