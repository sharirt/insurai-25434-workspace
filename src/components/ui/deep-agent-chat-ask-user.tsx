// ─── ask_user tool ──────────────────────────────────────────────────────────

import { cva } from 'class-variance-authority';
import { ArrowRight, Check, Pencil, X } from 'lucide-react';
import * as React from 'react';
import z from 'zod';

import { AgentChatLoadingDots } from '@/components/ui/agent-chat-loading-dots';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

// ─── Schema / types ─────────────────────────────────────────────────────────

export const ASK_USER_TOOL_NAME = 'ask_user';

const ASK_USER_OTHER_OPTION_ID = '__other__';

const askUserOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
});

const askUserQuestionSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['text', 'single_select', 'multi_select']),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  options: z.array(askUserOptionSchema).optional(),
  choices: z.array(z.string()).optional(),
  allowOther: z.boolean().optional(),
  otherLabel: z.string().optional(),
  presentation: z.enum(['chips', 'cards']).optional(),
});

export const askUserParametersSchema = z.object({
  questions: z.array(askUserQuestionSchema),
  submitButtonText: z.string().optional(),
});

export type AskUserParameters = z.infer<typeof askUserParametersSchema>;
export type AskUserQuestion = AskUserParameters['questions'][number];
export type AskUserQuestionOption = NonNullable<
  AskUserQuestion['options']
>[number];

export interface AskUserSubmittedAnswer {
  questionId: string;
  question: string;
  type: AskUserQuestion['type'];
  value?: string;
  values?: string[];
  label?: string;
  labels?: string[];
  other?: string;
}

export type AskUserSize = 'sm' | 'md' | 'lg';

type AskUserFormAnswers = Record<string, string | string[]>;
type AskUserOtherAnswers = Record<string, string>;

// ─── Payload helpers ────────────────────────────────────────────────────────

const normalizeAskUserOptions = (
  question: AskUserQuestion,
): AskUserQuestionOption[] => {
  if (question.options?.length) {
    return question.options;
  }
  if (question.choices?.length) {
    return question.choices.map((choice, index) => ({
      id:
        choice
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '') || `option_${index + 1}`,
      label: choice,
    }));
  }
  return [];
};

const shouldRenderAsCards = (
  question: AskUserQuestion,
  options: AskUserQuestionOption[],
) => {
  if (question.presentation === 'cards') {
    return true;
  }
  if (question.presentation === 'chips') {
    return false;
  }
  return options.some((option) => Boolean(option.description));
};

const getQuestionOptionLabel = (
  options: AskUserQuestionOption[],
  optionId: string,
) => options.find((option) => option.id === optionId)?.label ?? optionId;

const isAskUserQuestionRequired = (question: AskUserQuestion) =>
  question.required !== false;

const askUserAnswersToFormState = (
  submittedAnswers: AskUserSubmittedAnswer[] | undefined,
) => {
  const answerValues: AskUserFormAnswers = {};
  const otherAnswerValues: AskUserOtherAnswers = {};

  for (const answer of submittedAnswers || []) {
    if (answer.type === 'multi_select') {
      const values = [...(answer.values || [])];
      if (answer.other) {
        values.push(ASK_USER_OTHER_OPTION_ID);
        otherAnswerValues[answer.questionId] = answer.other;
      }
      answerValues[answer.questionId] = values;
      continue;
    }

    if (answer.type === 'single_select') {
      if (answer.other) {
        answerValues[answer.questionId] = ASK_USER_OTHER_OPTION_ID;
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

const buildSubmittedAnswer = (
  question: AskUserQuestion,
  sourceAnswers: AskUserFormAnswers,
  sourceOtherAnswers: AskUserOtherAnswers,
): AskUserSubmittedAnswer => {
  const options = normalizeAskUserOptions(question);
  const answer = sourceAnswers[question.id];
  const otherAnswer = sourceOtherAnswers[question.id]?.trim();

  if (question.type === 'multi_select') {
    const values = Array.isArray(answer) ? answer : [];
    const realValues = values.filter(
      (value) => value !== ASK_USER_OTHER_OPTION_ID,
    );
    return {
      questionId: question.id,
      question: question.label,
      type: question.type,
      values: realValues,
      labels: realValues.map((value) => getQuestionOptionLabel(options, value)),
      other: values.includes(ASK_USER_OTHER_OPTION_ID)
        ? otherAnswer
        : undefined,
    };
  }

  if (question.type === 'single_select') {
    const value = typeof answer === 'string' ? answer : '';
    return {
      questionId: question.id,
      question: question.label,
      type: question.type,
      value: value === ASK_USER_OTHER_OPTION_ID ? undefined : value,
      label:
        value && value !== ASK_USER_OTHER_OPTION_ID
          ? getQuestionOptionLabel(options, value)
          : undefined,
      other: value === ASK_USER_OTHER_OPTION_ID ? otherAnswer : undefined,
    };
  }

  return {
    questionId: question.id,
    question: question.label,
    type: question.type,
    value: typeof answer === 'string' ? answer.trim() : '',
  };
};

const isQuestionInvalid = (
  question: AskUserQuestion,
  sourceAnswers: AskUserFormAnswers,
  sourceOtherAnswers: AskUserOtherAnswers,
) => {
  if (!isAskUserQuestionRequired(question)) {
    return false;
  }

  const answer = sourceAnswers[question.id];
  const otherAnswer = sourceOtherAnswers[question.id]?.trim();
  if (question.type === 'text') {
    return typeof answer !== 'string' || !answer.trim();
  }
  if (question.type === 'single_select') {
    return (
      typeof answer !== 'string' ||
      !answer ||
      (answer === ASK_USER_OTHER_OPTION_ID && !otherAnswer)
    );
  }
  return (
    !Array.isArray(answer) ||
    answer.length === 0 ||
    (answer.includes(ASK_USER_OTHER_OPTION_ID) && !otherAnswer)
  );
};

// ─── Variants ───────────────────────────────────────────────────────────────

const askUserWrapperVariants = cva('flex w-full min-w-0 flex-col', {
  variants: {
    size: {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
    },
  },
  defaultVariants: { size: 'md' },
});

const askUserQuestionGapVariants = cva('', {
  variants: {
    size: {
      sm: 'gap-2.5',
      md: 'gap-3',
      lg: 'gap-3.5',
    },
  },
  defaultVariants: { size: 'md' },
});

const askUserQuestionLabelVariants = cva(
  'prose-p:my-0 text-base font-normal leading-normal',
  {
    variants: {
      size: {
        sm: '',
        md: '',
        lg: '',
      },
      invalid: {
        true: 'text-destructive/80',
        false: '',
      },
    },
    defaultVariants: { size: 'md', invalid: false },
  },
);

const askUserHelperTextVariants = cva(
  'text-base font-normal leading-normal text-muted-foreground/70',
  {
    variants: {
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

const askUserChipItemVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-1.5 rounded-full border border-input bg-background text-base font-normal leading-normal text-foreground transition-colors',
    'hover:bg-background hover:text-foreground hover:border-foreground',
    'data-[state=on]:bg-background data-[state=on]:text-foreground',
    'data-[state=on]:border-2 data-[state=on]:border-foreground data-[state=on]:-m-px',
  ),
  {
    variants: {
      size: {
        sm: 'h-7 min-w-7 px-3',
        md: 'h-8 min-w-8 px-4',
        lg: 'h-9 min-w-9 px-5',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

const askUserOtherChipItemVariants = cva(
  cn(
    'inline-flex items-center justify-center rounded-full border border-input bg-background text-base font-normal leading-normal text-muted-foreground transition-colors',
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

const askUserOtherTextareaVariants = cva(
  'w-1/2 resize-none overflow-hidden rounded-full text-base font-normal leading-normal',
  {
    variants: {
      size: {
        sm: 'h-7 min-h-7 px-3 py-0.5',
        md: 'h-8 min-h-8 px-4 py-1',
        lg: 'h-9 min-h-9 px-5 py-1.5',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

const askUserCardItemVariants = cva(
  cn(
    'group/card relative flex w-full items-start gap-3 rounded-lg border border-input bg-background text-left text-base font-normal leading-normal text-foreground transition-colors',
    'hover:bg-background hover:text-foreground hover:border-foreground',
    'data-[state=on]:bg-background data-[state=on]:text-foreground',
    'data-[state=on]:border-2 data-[state=on]:border-foreground data-[state=on]:-m-px',
    'whitespace-normal',
  ),
  {
    variants: {
      size: {
        sm: 'h-auto min-h-12 px-3 py-2',
        md: 'h-auto min-h-14 px-3 py-2.5',
        lg: 'h-auto min-h-16 px-4 py-3',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

const askUserCardTitleVariants = cva('text-base font-normal leading-normal', {
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    invalid: {
      true: 'text-destructive/80',
      false: '',
    },
  },
  defaultVariants: { size: 'md', invalid: false },
});

const askUserCardDescriptionVariants = cva(
  'mt-0.5 text-base font-normal leading-normal text-muted-foreground',
  {
    variants: {
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

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

const askUserChipsGroupClass =
  'flex w-full min-w-0 flex-wrap items-center justify-start';
const askUserCardsGroupClass =
  'flex w-full min-w-0 flex-col items-stretch justify-start';

const askUserActionRowVariants = cva('flex w-full items-center justify-start', {
  variants: {
    size: {
      sm: 'gap-1.5',
      md: 'gap-2',
      lg: 'gap-2',
    },
  },
  defaultVariants: { size: 'md' },
});

const askUserIconVariants = cva('', {
  variants: {
    size: {
      sm: 'size-3.5',
      md: 'size-4',
      lg: 'size-4',
    },
  },
  defaultVariants: { size: 'md' },
});

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

const askUserGroupSpacing = (size: AskUserSize): number =>
  size === 'sm' ? 1.5 : size === 'lg' ? 2.5 : 2;

// ─── Subcomponents ──────────────────────────────────────────────────────────

interface AskUserActionButtonProps {
  size: AskUserSize;
  label: string;
  text?: string;
  onClick: () => void;
  disabled?: boolean;
}

function SendArrowButton({
  label,
  text,
  onClick,
  disabled,
}: AskUserActionButtonProps) {
  const buttonText = text?.trim();
  return (
    <Button
      type="button"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      aria-label={buttonText || label}
    >
      {buttonText ? <span>{buttonText}</span> : null}
      <ArrowRight />
    </Button>
  );
}

function ClearOtherButton({
  size,
  label,
  onClick,
  disabled,
}: AskUserActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(askUserBackButtonVariants({ size }))}
    >
      <X className={cn(askUserIconVariants({ size }))} />
    </button>
  );
}

function CardItemChildren({
  option,
  size,
  multi,
  selected,
}: {
  option: AskUserQuestionOption;
  size: AskUserSize;
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

// ─── Main component ─────────────────────────────────────────────────────────

interface AskQuestionToolProps {
  questions: AskUserQuestion[];
  submitButtonText?: string;
  answers?: AskUserSubmittedAnswer[];
  respond?: (result: unknown) => Promise<void>;
  onSubmittedAnswers?: (answers: AskUserSubmittedAnswer[]) => void;
  isWaitingForAgentAfterSubmit?: boolean;
  size?: AskUserSize;
}

export function AskQuestionSkipped({
  questions,
  submitButtonText,
  size = 'md',
}: {
  questions: AskUserQuestion[];
  submitButtonText?: string;
  size?: AskUserSize;
}) {
  // `answers` being defined puts the form in submitted/read-only mode.
  return (
    <AskQuestionTool
      questions={questions}
      submitButtonText={submitButtonText}
      answers={[]}
      size={size}
    />
  );
}

interface AskQuestionItemProps {
  question: AskUserQuestion;
  formId: string;
  formAnswers: AskUserFormAnswers;
  otherAnswers: AskUserOtherAnswers;
  isInvalid: boolean;
  isReadOnly: boolean;
  isInteractionLocked: boolean;
  isInstantSubmitFlow: boolean;
  size: AskUserSize;
  setAnswerValue: (questionId: string, value: string | string[]) => void;
  setOtherAnswers: React.Dispatch<React.SetStateAction<AskUserOtherAnswers>>;
  submitWith: (
    sourceAnswers: AskUserFormAnswers,
    sourceOtherAnswers: AskUserOtherAnswers,
  ) => Promise<void>;
}

interface TextQuestionInputProps {
  question: AskUserQuestion;
  controlId: string;
  value: string;
  isInvalid: boolean;
  isReadOnly: boolean;
  setAnswerValue: (questionId: string, value: string | string[]) => void;
}

function TextQuestionInput({
  question,
  controlId,
  value,
  isInvalid,
  isReadOnly,
  setAnswerValue,
}: TextQuestionInputProps) {
  return (
    <Textarea
      id={controlId}
      value={value}
      onChange={(event) => setAnswerValue(question.id, event.target.value)}
      placeholder={question.placeholder}
      disabled={isReadOnly}
      aria-invalid={isInvalid || undefined}
      className="text-base font-normal leading-normal"
    />
  );
}

interface ToggleQuestionOptionProps {
  option: AskUserQuestionOption;
  isCards: boolean;
  isMulti?: boolean;
  isSelected: boolean;
  size: AskUserSize;
}

function ToggleQuestionOption({
  option,
  isCards,
  isMulti,
  isSelected,
  size,
}: ToggleQuestionOptionProps) {
  return (
    <ToggleGroupItem
      value={option.id}
      {...(isCards && option.description
        ? { 'aria-label': `${option.label} — ${option.description}` }
        : {})}
      className={cn(
        isCards
          ? askUserCardItemVariants({ size })
          : askUserChipItemVariants({ size }),
      )}
    >
      {isCards ? (
        <CardItemChildren
          option={option}
          size={size}
          multi={isMulti}
          selected={isSelected}
        />
      ) : (
        <span>{option.label}</span>
      )}
    </ToggleGroupItem>
  );
}

interface MultiSelectQuestionInputProps {
  question: AskUserQuestion;
  labelId: string;
  options: AskUserQuestionOption[];
  values: string[];
  isCards: boolean;
  isReadOnly: boolean;
  size: AskUserSize;
  onChange: (values: string[]) => void;
}

function MultiSelectQuestionInput({
  question,
  labelId,
  options,
  values,
  isCards,
  isReadOnly,
  size,
  onChange,
}: MultiSelectQuestionInputProps) {
  return (
    <ToggleGroup
      type="multiple"
      value={values}
      onValueChange={onChange}
      disabled={isReadOnly}
      aria-labelledby={labelId}
      spacing={askUserGroupSpacing(size)}
      className={cn(isCards ? askUserCardsGroupClass : askUserChipsGroupClass)}
    >
      {options.map((option) => (
        <ToggleQuestionOption
          key={option.id}
          option={option}
          isCards={isCards}
          isMulti
          isSelected={values.includes(option.id)}
          size={size}
        />
      ))}

      {question.allowOther && (
        <ToggleGroupItem
          value={ASK_USER_OTHER_OPTION_ID}
          aria-label={question.otherLabel || 'Other'}
          className={cn(askUserOtherChipItemVariants({ size }))}
        >
          <Pencil className={cn(askUserIconVariants({ size }))} />
        </ToggleGroupItem>
      )}
    </ToggleGroup>
  );
}

interface SingleSelectQuestionInputProps {
  question: AskUserQuestion;
  labelId: string;
  options: AskUserQuestionOption[];
  value: string;
  isCards: boolean;
  isReadOnly: boolean;
  size: AskUserSize;
  onChange: (value: string) => void;
}

function SingleSelectQuestionInput({
  question,
  labelId,
  options,
  value,
  isCards,
  isReadOnly,
  size,
  onChange,
}: SingleSelectQuestionInputProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={onChange}
      disabled={isReadOnly}
      aria-labelledby={labelId}
      spacing={askUserGroupSpacing(size)}
      className={cn(isCards ? askUserCardsGroupClass : askUserChipsGroupClass)}
    >
      {options.map((option) => (
        <ToggleQuestionOption
          key={option.id}
          option={option}
          isCards={isCards}
          isSelected={value === option.id}
          size={size}
        />
      ))}

      {question.allowOther && (
        <ToggleGroupItem
          value={ASK_USER_OTHER_OPTION_ID}
          aria-label={question.otherLabel || 'Other'}
          className={cn(askUserOtherChipItemVariants({ size }))}
        >
          <Pencil className={cn(askUserIconVariants({ size }))} />
        </ToggleGroupItem>
      )}
    </ToggleGroup>
  );
}

interface OtherAnswerInputProps {
  question: AskUserQuestion;
  labelId: string;
  values: string[];
  isMulti: boolean;
  isInvalid: boolean;
  isReadOnly: boolean;
  isInteractionLocked: boolean;
  otherAnswers: AskUserOtherAnswers;
  size: AskUserSize;
  setAnswerValue: (questionId: string, value: string | string[]) => void;
  setOtherAnswers: React.Dispatch<React.SetStateAction<AskUserOtherAnswers>>;
}

function OtherAnswerInput({
  question,
  labelId,
  values,
  isMulti,
  isInvalid,
  isReadOnly,
  isInteractionLocked,
  otherAnswers,
  size,
  setAnswerValue,
  setOtherAnswers,
}: OtherAnswerInputProps) {
  return (
    <div className="flex w-full items-start gap-2">
      <Textarea
        rows={1}
        value={otherAnswers[question.id] || ''}
        onChange={(event) =>
          setOtherAnswers((current) =>
            isInteractionLocked
              ? current
              : { ...current, [question.id]: event.target.value },
          )
        }
        placeholder={question.placeholder}
        disabled={isReadOnly}
        aria-invalid={isInvalid || undefined}
        aria-labelledby={labelId}
        className={cn(askUserOtherTextareaVariants({ size }))}
      />
      <ClearOtherButton
        size={size}
        label="Clear other answer"
        disabled={isReadOnly}
        onClick={() => {
          if (isMulti) {
            setAnswerValue(
              question.id,
              values.filter((v) => v !== ASK_USER_OTHER_OPTION_ID),
            );
          } else {
            setAnswerValue(question.id, '');
          }
        }}
      />
    </div>
  );
}

function AskQuestionItem({
  question,
  formId,
  formAnswers,
  otherAnswers,
  isInvalid,
  isReadOnly,
  isInteractionLocked,
  isInstantSubmitFlow,
  size,
  setAnswerValue,
  setOtherAnswers,
  submitWith,
}: AskQuestionItemProps) {
  const options = normalizeAskUserOptions(question);
  const isCards = shouldRenderAsCards(question, options);
  const currentAnswer = formAnswers[question.id];
  const currentValues = Array.isArray(currentAnswer) ? currentAnswer : [];
  const currentSingleValue =
    typeof currentAnswer === 'string' ? currentAnswer : '';
  const labelId = `${formId}-${question.id}-label`;
  const controlId = `${formId}-${question.id}-control`;
  const isOtherSelected =
    question.type === 'multi_select'
      ? currentValues.includes(ASK_USER_OTHER_OPTION_ID)
      : currentSingleValue === ASK_USER_OTHER_OPTION_ID;

  const onSingleChange = (value: string) => {
    setAnswerValue(question.id, value);
    if (isInstantSubmitFlow && value && value !== ASK_USER_OTHER_OPTION_ID) {
      const next = { ...formAnswers, [question.id]: value };
      void submitWith(next, otherAnswers);
    }
  };

  return (
    <Field
      data-invalid={isInvalid || undefined}
      className={cn(askUserQuestionGapVariants({ size }))}
    >
      <FieldLabel
        id={labelId}
        htmlFor={question.type === 'text' ? controlId : undefined}
        className={cn(
          'w-full cursor-text opacity-100',
          askUserQuestionLabelVariants({ size, invalid: isInvalid }),
        )}
      >
        {question.label}
      </FieldLabel>

      {question.placeholder && question.type !== 'text' && (
        <FieldDescription className={cn(askUserHelperTextVariants({ size }))}>
          {question.placeholder}
        </FieldDescription>
      )}

      {question.type === 'text' && (
        <TextQuestionInput
          question={question}
          controlId={controlId}
          value={currentSingleValue}
          isInvalid={isInvalid}
          isReadOnly={isReadOnly}
          setAnswerValue={setAnswerValue}
        />
      )}

      {question.type === 'multi_select' && (
        <MultiSelectQuestionInput
          question={question}
          labelId={labelId}
          options={options}
          values={currentValues}
          isCards={isCards}
          isReadOnly={isReadOnly}
          size={size}
          onChange={(values) => setAnswerValue(question.id, values)}
        />
      )}

      {question.type === 'single_select' && (
        <SingleSelectQuestionInput
          question={question}
          labelId={labelId}
          options={options}
          value={currentSingleValue}
          isCards={isCards}
          isReadOnly={isReadOnly}
          size={size}
          onChange={onSingleChange}
        />
      )}

      {isOtherSelected && question.type !== 'text' && (
        <OtherAnswerInput
          question={question}
          labelId={labelId}
          values={currentValues}
          isMulti={question.type === 'multi_select'}
          isInvalid={isInvalid}
          isReadOnly={isReadOnly}
          isInteractionLocked={isInteractionLocked}
          otherAnswers={otherAnswers}
          size={size}
          setAnswerValue={setAnswerValue}
          setOtherAnswers={setOtherAnswers}
        />
      )}
    </Field>
  );
}

export function AskQuestionTool({
  questions,
  submitButtonText,
  answers,
  respond,
  onSubmittedAnswers,
  isWaitingForAgentAfterSubmit = false,
  size = 'md',
}: AskQuestionToolProps) {
  const formId = React.useId();
  const initialFormState = React.useMemo(
    () => askUserAnswersToFormState(answers),
    [answers],
  );
  const [formAnswers, setFormAnswers] = React.useState<AskUserFormAnswers>(
    initialFormState.answerValues,
  );
  const [otherAnswers, setOtherAnswers] = React.useState<AskUserOtherAnswers>(
    initialFormState.otherAnswerValues,
  );
  const [invalidQuestionIds, setInvalidQuestionIds] = React.useState<
    Set<string>
  >(() => new Set());
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isSubmittedState = answers !== undefined;

  React.useEffect(() => {
    if (!isSubmittedState) {
      return;
    }
    setFormAnswers(initialFormState.answerValues);
    setOtherAnswers(initialFormState.otherAnswerValues);
    setIsSubmitting(false);
  }, [isSubmittedState, initialFormState]);

  const isReadOnly = isSubmittedState || !respond;
  const isInteractionLocked = isReadOnly || isSubmitting;

  const setAnswerValue = React.useCallback(
    (questionId: string, value: string | string[]) => {
      if (isInteractionLocked) {
        return;
      }
      setFormAnswers((current) => ({ ...current, [questionId]: value }));
    },
    [isInteractionLocked],
  );

  const buildSubmittedAnswers = React.useCallback(
    (
      sourceAnswers: AskUserFormAnswers,
      sourceOtherAnswers: AskUserOtherAnswers,
    ): AskUserSubmittedAnswer[] =>
      questions.map((question) =>
        buildSubmittedAnswer(question, sourceAnswers, sourceOtherAnswers),
      ),
    [questions],
  );

  const validateAnswers = React.useCallback(
    (
      sourceAnswers: AskUserFormAnswers,
      sourceOtherAnswers: AskUserOtherAnswers,
    ) => {
      return new Set(
        questions
          .filter((question) =>
            isQuestionInvalid(question, sourceAnswers, sourceOtherAnswers),
          )
          .map((question) => question.id),
      );
    },
    [questions],
  );

  const currentInvalidQuestionIds = React.useMemo(
    () => validateAnswers(formAnswers, otherAnswers),
    [formAnswers, otherAnswers, validateAnswers],
  );
  const isSendDisabled =
    isSubmitting || isReadOnly || currentInvalidQuestionIds.size > 0;

  const submitWith = React.useCallback(
    async (
      sourceAnswers: AskUserFormAnswers,
      sourceOtherAnswers: AskUserOtherAnswers,
    ) => {
      if (!respond || isSubmitting) {
        return;
      }
      const invalid = validateAnswers(sourceAnswers, sourceOtherAnswers);
      if (invalid.size > 0) {
        setInvalidQuestionIds(invalid);
        return;
      }
      setInvalidQuestionIds(new Set());
      setIsSubmitting(true);
      const submittedAnswers = buildSubmittedAnswers(
        sourceAnswers,
        sourceOtherAnswers,
      );
      onSubmittedAnswers?.(submittedAnswers);
      try {
        await respond({
          answers: submittedAnswers,
        });
      } catch (error) {
        setIsSubmitting(false);
        throw error;
      }
    },
    [
      buildSubmittedAnswers,
      isSubmitting,
      onSubmittedAnswers,
      respond,
      validateAnswers,
    ],
  );

  const firstQuestion = questions[0];
  const firstQuestionOptions = firstQuestion
    ? normalizeAskUserOptions(firstQuestion)
    : [];
  const isInstantSubmitFlow =
    questions.length === 1 &&
    firstQuestion?.type === 'single_select' &&
    !firstQuestion.allowOther &&
    !shouldRenderAsCards(firstQuestion, firstQuestionOptions);
  const showSubmitButton =
    !isInstantSubmitFlow && (Boolean(respond) || isSubmittedState);

  const handleSendClick = () => {
    if (isSendDisabled) {
      return;
    }
    void submitWith(formAnswers, otherAnswers);
  };

  return (
    <FieldGroup
      className={cn(
        askUserWrapperVariants({ size }),
        '@container-normal',
        isSubmitting && 'pointer-events-none',
      )}
    >
      {questions.map((question) => (
        <AskQuestionItem
          key={question.id}
          question={question}
          formId={formId}
          formAnswers={formAnswers}
          otherAnswers={otherAnswers}
          isInvalid={invalidQuestionIds.has(question.id)}
          isReadOnly={isReadOnly}
          isInteractionLocked={isInteractionLocked}
          isInstantSubmitFlow={isInstantSubmitFlow}
          size={size}
          setAnswerValue={setAnswerValue}
          setOtherAnswers={setOtherAnswers}
          submitWith={submitWith}
        />
      ))}

      {showSubmitButton && (
        <div className={cn(askUserActionRowVariants({ size }))}>
          <SendArrowButton
            size={size}
            label="Send"
            text={submitButtonText}
            disabled={isSendDisabled}
            onClick={handleSendClick}
          />
        </div>
      )}
      {isWaitingForAgentAfterSubmit && (
        <div
          className={cn(
            'flex items-center',
            size === 'lg' ? 'min-h-9' : size === 'sm' ? 'min-h-7' : 'min-h-8',
          )}
        >
          <AgentChatLoadingDots className="text-[2px]" />
        </div>
      )}
    </FieldGroup>
  );
}
