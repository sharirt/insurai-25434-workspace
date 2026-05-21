// ─── ask_user tool ──────────────────────────────────────────────────────────

import { cva } from 'class-variance-authority';
import { ArrowLeft, ArrowRight, Check, Pencil } from 'lucide-react';
import * as React from 'react';
import z from 'zod';

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
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

const askUserAnswersToFormState = (
  submittedAnswers: AskUserSubmittedAnswer[] | undefined,
) => {
  const answerValues: Record<string, string | string[]> = {};
  const otherAnswerValues: Record<string, string> = {};

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

// ─── Variants ───────────────────────────────────────────────────────────────

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
  'prose prose-p:my-0 max-w-none leading-[1.6] font-normal',
  {
    variants: {
      size: {
        sm: 'prose-sm',
        md: 'prose-base',
        lg: 'prose-lg',
      },
      invalid: {
        true: 'text-destructive/80',
        false: 'text-foreground',
      },
    },
    defaultVariants: { size: 'md', invalid: false },
  },
);

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

const askUserChipItemVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-1.5 rounded-full border border-input bg-background text-foreground transition-colors',
    'hover:bg-background hover:text-foreground hover:border-foreground',
    'data-[state=on]:bg-background data-[state=on]:text-foreground',
    'data-[state=on]:border-2 data-[state=on]:border-foreground data-[state=on]:-m-px',
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

const askUserOtherChipItemVariants = cva(
  cn(
    'inline-flex items-center justify-center rounded-full border border-input bg-background text-muted-foreground transition-colors',
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

const askUserCardItemVariants = cva(
  cn(
    'group/card relative flex w-full items-start gap-3 rounded-lg border border-input bg-background text-left text-foreground transition-colors',
    'hover:bg-background hover:text-foreground hover:border-foreground',
    'data-[state=on]:bg-background data-[state=on]:text-foreground',
    'data-[state=on]:border-2 data-[state=on]:border-foreground data-[state=on]:-m-px',
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

const askUserSkeletonLabelVariants = cva('rounded-sm', {
  variants: {
    size: {
      sm: 'h-[1.4rem]',
      md: 'h-[1.6rem]',
      lg: 'h-[1.8rem]',
    },
  },
  defaultVariants: { size: 'md' },
});

const askUserSkeletonChipVariants = cva('rounded-full', {
  variants: {
    size: {
      sm: 'h-7',
      md: 'h-8',
      lg: 'h-9',
    },
  },
  defaultVariants: { size: 'md' },
});

const askUserSkeletonChipsRowGap: Record<AskUserSize, string> = {
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
};

const SKELETON_CHIP_WIDTHS = ['w-16', 'w-20', 'w-14'] as const;

// ─── Subcomponents ──────────────────────────────────────────────────────────

interface AskUserActionButtonProps {
  size: AskUserSize;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function SendArrowButton({
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
      className={cn(askUserSendButtonVariants({ size }))}
    >
      <ArrowRight className={cn(askUserIconVariants({ size }))} />
    </button>
  );
}

function BackArrowButton({
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
      <ArrowLeft className={cn(askUserIconVariants({ size }))} />
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
  answers?: AskUserSubmittedAnswer[];
  respond?: (result: unknown) => Promise<void>;
  size?: AskUserSize;
}

export function AskQuestionTool({
  questions,
  answers,
  respond,
  size = 'md',
}: AskQuestionToolProps) {
  const formId = React.useId();
  const initialFormState = React.useMemo(
    () => askUserAnswersToFormState(answers),
    [answers],
  );
  const [formAnswers, setFormAnswers] = React.useState<
    Record<string, string | string[]>
  >(initialFormState.answerValues);
  const [otherAnswers, setOtherAnswers] = React.useState<
    Record<string, string>
  >(initialFormState.otherAnswerValues);
  const [invalidQuestionId, setInvalidQuestionId] = React.useState<
    string | null
  >(null);
  const [submitted, setSubmitted] = React.useState(Boolean(answers?.length));

  React.useEffect(() => {
    if (!answers?.length) {
      return;
    }
    setFormAnswers(initialFormState.answerValues);
    setOtherAnswers(initialFormState.otherAnswerValues);
    setSubmitted(true);
  }, [answers, initialFormState]);

  const isDisabled = submitted || !respond;

  const setSingleValue = React.useCallback(
    (questionId: string, value: string) => {
      setFormAnswers((current) => ({ ...current, [questionId]: value }));
    },
    [],
  );

  const setMultiValues = React.useCallback(
    (questionId: string, values: string[]) => {
      setFormAnswers((current) => ({ ...current, [questionId]: values }));
    },
    [],
  );

  const buildSubmittedAnswers = React.useCallback(
    (
      sourceAnswers: Record<string, string | string[]>,
      sourceOtherAnswers: Record<string, string>,
    ): AskUserSubmittedAnswer[] =>
      questions.map((question): AskUserSubmittedAnswer => {
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
            labels: realValues.map((value) =>
              getQuestionOptionLabel(options, value),
            ),
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
      }),
    [questions],
  );

  const validateAnswers = React.useCallback(
    (
      sourceAnswers: Record<string, string | string[]>,
      sourceOtherAnswers: Record<string, string>,
    ) => {
      for (const question of questions) {
        if (!question.required) {
          continue;
        }
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
        if (answer === ASK_USER_OTHER_OPTION_ID && !otherAnswer) {
          return question.id;
        }
        if (
          Array.isArray(answer) &&
          answer.includes(ASK_USER_OTHER_OPTION_ID) &&
          !otherAnswer
        ) {
          return question.id;
        }
      }
      return null;
    },
    [questions],
  );

  const submitWith = React.useCallback(
    async (
      sourceAnswers: Record<string, string | string[]>,
      sourceOtherAnswers: Record<string, string>,
    ) => {
      if (!respond) {
        return;
      }
      const invalid = validateAnswers(sourceAnswers, sourceOtherAnswers);
      if (invalid) {
        setInvalidQuestionId(invalid);
        return;
      }
      setInvalidQuestionId(null);
      setSubmitted(true);
      await respond({
        answers: buildSubmittedAnswers(sourceAnswers, sourceOtherAnswers),
      });
    },
    [buildSubmittedAnswers, respond, validateAnswers],
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

  const handleSendClick = () => {
    if (isDisabled) {
      return;
    }
    void submitWith(formAnswers, otherAnswers);
  };

  return (
    <FieldGroup
      className={cn(
        askUserWrapperVariants({ size }),
        '[container-type:normal]',
      )}
    >
      {questions.map((question) => {
        const options = normalizeAskUserOptions(question);
        const isCards = shouldRenderAsCards(question, options);
        const isInvalid = invalidQuestionId === question.id;
        const isMulti = question.type === 'multi_select';
        const isSingle = question.type === 'single_select';
        const isText = question.type === 'text';

        const currentAnswer = formAnswers[question.id];
        const currentValues = Array.isArray(currentAnswer) ? currentAnswer : [];
        const currentSingleValue =
          typeof currentAnswer === 'string' ? currentAnswer : '';
        const isOtherSelected = isMulti
          ? currentValues.includes(ASK_USER_OTHER_OPTION_ID)
          : currentSingleValue === ASK_USER_OTHER_OPTION_ID;

        const onSingleChange = (value: string) => {
          setSingleValue(question.id, value);
          if (
            isInstantSubmitFlow &&
            value &&
            value !== ASK_USER_OTHER_OPTION_ID
          ) {
            const next = { ...formAnswers, [question.id]: value };
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
            className={cn(askUserQuestionGapVariants({ size }))}
          >
            <FieldLabel
              id={labelId}
              htmlFor={isText ? controlId : undefined}
              className={cn(
                'w-full cursor-text opacity-100',
                askUserQuestionLabelVariants({ size, invalid: isInvalid }),
              )}
            >
              {question.label}
            </FieldLabel>

            {question.placeholder && !isText && (
              <FieldDescription
                className={cn(askUserHelperTextVariants({ size }))}
              >
                {question.placeholder}
              </FieldDescription>
            )}

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
                    )}
                  >
                    {options.map((option) => (
                      <ToggleGroupItem
                        key={option.id}
                        value={option.id}
                        {...(isCards && option.description
                          ? {
                              'aria-label': `${option.label} — ${option.description}`,
                            }
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
                        value={ASK_USER_OTHER_OPTION_ID}
                        aria-label={question.otherLabel || 'Other'}
                        className={cn(askUserOtherChipItemVariants({ size }))}
                      >
                        <Pencil className={cn(askUserIconVariants({ size }))} />
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
                    )}
                  >
                    {options.map((option) => (
                      <ToggleGroupItem
                        key={option.id}
                        value={option.id}
                        {...(isCards && option.description
                          ? {
                              'aria-label': `${option.label} — ${option.description}`,
                            }
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
                            selected={currentSingleValue === option.id}
                          />
                        ) : (
                          <span>{option.label}</span>
                        )}
                      </ToggleGroupItem>
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
                )}

                {isOtherSelected && (
                  <div className="flex w-full items-start gap-2">
                    <BackArrowButton
                      size={size}
                      label="Back"
                      disabled={isDisabled}
                      onClick={() => {
                        if (isMulti) {
                          setMultiValues(
                            question.id,
                            currentValues.filter(
                              (v) => v !== ASK_USER_OTHER_OPTION_ID,
                            ),
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
                      className="flex-1"
                    />
                  </div>
                )}
              </>
            )}
          </Field>
        );
      })}

      {!isInstantSubmitFlow && !isDisabled && (
        <div className={cn(askUserActionRowVariants({ size }))}>
          <SendArrowButton
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

export function AskQuestionToolSkeleton({
  size = 'md',
  questionCount = 2,
}: {
  size?: AskUserSize;
  questionCount?: number;
}) {
  const safeCount = Math.max(1, questionCount);
  return (
    <FieldGroup
      className={cn(
        askUserWrapperVariants({ size }),
        '[container-type:normal]',
      )}
      aria-label="Generating questions"
      data-disabled
    >
      {Array.from({ length: safeCount }).map((_, questionIndex) => (
        <Field
          key={questionIndex}
          className={cn(askUserQuestionGapVariants({ size }))}
        >
          <Skeleton
            className={cn(askUserSkeletonLabelVariants({ size }), 'w-3/4')}
          />
          <div
            className={cn('flex flex-wrap', askUserSkeletonChipsRowGap[size])}
          >
            {SKELETON_CHIP_WIDTHS.map((widthClass, chipIndex) => (
              <Skeleton
                key={chipIndex}
                className={cn(
                  askUserSkeletonChipVariants({ size }),
                  widthClass,
                )}
              />
            ))}
          </div>
        </Field>
      ))}
    </FieldGroup>
  );
}
