// ─── User-choice tool controls ───────────────────────────────────────────────

import { cva } from 'class-variance-authority';
import { ArrowRight, Check, Pencil, X } from 'lucide-react';
import * as React from 'react';
import z from 'zod';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// ─── Schema / types ─────────────────────────────────────────────────────────

export const GET_USER_CHOICE_TOOL_NAME = 'get_user_choice';
export const GET_USER_CHOICE_TOOL_DESCRIPTION =
  'Show a structured choice control in chat. Use this when the next step depends on the user selecting one or more options, not for open-ended text answers. If assistant text asks or introduces the choice, put that same exact user-facing question in `question` and the choices in `options`; the UI can hide the tool question label when assistant text is already visible, while still using `question` as the accessible label for the controls. Use `selectionMode="single"` for one choice and `selectionMode="multiple"` for pick-many. After calling this tool, wait for the submitted tool result before continuing; if the user replies in the composer instead, treat that as their answer.';

const GET_USER_CHOICE_OTHER_VALUE = '__other__';

const getUserChoiceOptionSchema = z.object({
  value: z
    .string()
    .min(1)
    .describe('Stable machine value returned in the answer.'),
  label: z.string().describe('Visible option text shown to the user.'),
  description: z
    .string()
    .optional()
    .describe('Optional secondary text for card-style options.'),
});

export const getUserChoiceParametersSchema = z.object({
  question: z
    .string()
    .min(1)
    .describe(
      'Exact question the user should answer. If assistant text asks this question too, repeat the same text here; the renderer may hide this label visually to avoid duplicate prompts but still uses it for accessibility.',
    ),
  selectionMode: z.enum(['single', 'multiple']).default('single'),
  options: z
    .array(getUserChoiceOptionSchema)
    .min(1)
    .refine(
      (options) =>
        options.every(
          (option) => option.value.trim() !== GET_USER_CHOICE_OTHER_VALUE,
        ),
      {
        message: `Option values must be non-empty and cannot be ${GET_USER_CHOICE_OTHER_VALUE}`,
      },
    )
    .refine(
      (options) => {
        const values = options.map((option) => option.value);
        return new Set(values).size === values.length;
      },
      {
        message: 'Option values must be unique',
      },
    ),
  allowOther: z.boolean().optional(),
  otherLabel: z.string().optional(),
  presentation: z.enum(['chips', 'cards']).optional(),
  submitButtonText: z.string().optional(),
});

export type GetUserChoiceParameters = z.infer<
  typeof getUserChoiceParametersSchema
>;
type GetUserChoiceParametersRenderInput = {
  question?: GetUserChoiceParameters['question'];
  selectionMode?: GetUserChoiceParameters['selectionMode'];
  options?: unknown;
  allowOther?: GetUserChoiceParameters['allowOther'];
  otherLabel?: GetUserChoiceParameters['otherLabel'];
  presentation?: GetUserChoiceParameters['presentation'];
  submitButtonText?: GetUserChoiceParameters['submitButtonText'];
};
type GetUserChoiceRenderableOption = {
  value: string;
  label: string;
  description?: string;
};

export type GetUserChoiceResult =
  | { status: 'skipped' }
  | {
      status: 'answered';
      selectionMode: 'single';
      value: string | null;
      label: string | null;
      other?: string;
    }
  | {
      status: 'answered';
      selectionMode: 'multiple';
      values: string[];
      labels: string[];
      other?: string;
    };

export type GetUserChoiceSize = 'sm' | 'md' | 'lg';

// ─── Payload helpers ────────────────────────────────────────────────────────

const getSelectionMode = (parameters: GetUserChoiceParametersRenderInput) =>
  parameters.selectionMode === 'multiple' ? 'multiple' : 'single';

const getValidatedChoiceOptions = (
  options: unknown,
): GetUserChoiceRenderableOption[] => {
  if (!Array.isArray(options) || !options.length) {
    return [];
  }

  const seen = new Set<string>();
  const validatedOptions: GetUserChoiceRenderableOption[] = [];
  for (const option of options) {
    if (!option || typeof option !== 'object') {
      continue;
    }
    const typedOption = option as {
      value?: unknown;
      label?: unknown;
      description?: unknown;
    };
    const value =
      typeof typedOption.value === 'string' ? typedOption.value.trim() : '';
    const label =
      typeof typedOption.label === 'string' ? typedOption.label : '';
    const description =
      typeof typedOption.description === 'string'
        ? typedOption.description
        : undefined;
    if (
      !value ||
      !label ||
      value === GET_USER_CHOICE_OTHER_VALUE ||
      seen.has(value)
    ) {
      continue;
    }
    seen.add(value);
    validatedOptions.push({
      value,
      label,
      ...(description ? { description } : {}),
    });
  }

  return validatedOptions;
};

const shouldRenderAsCards = (
  parameters: GetUserChoiceParametersRenderInput,
  options: GetUserChoiceRenderableOption[],
) => {
  if (parameters.presentation === 'cards') {
    return true;
  }
  if (parameters.presentation === 'chips') {
    return false;
  }
  return options.some((option) => Boolean(option.description));
};

const getChoiceOptionLabel = (
  options: GetUserChoiceRenderableOption[],
  value: string,
) => options.find((option) => option.value === value)?.label ?? value;

const getResultFormState = (
  result: GetUserChoiceResult | undefined,
): { selectedValues: string[]; otherAnswer: string } => {
  if (!result || result.status !== 'answered') {
    return { selectedValues: [], otherAnswer: '' };
  }

  if (result.selectionMode === 'multiple') {
    return {
      selectedValues: [
        ...result.values,
        ...(result.other ? [GET_USER_CHOICE_OTHER_VALUE] : []),
      ],
      otherAnswer: result.other ?? '',
    };
  }

  return {
    selectedValues: [
      result.other ? GET_USER_CHOICE_OTHER_VALUE : result.value,
    ].filter((value): value is string => Boolean(value)),
    otherAnswer: result.other ?? '',
  };
};

const buildChoiceResult = (
  parameters: GetUserChoiceParametersRenderInput,
  options: GetUserChoiceRenderableOption[],
  selectedValues: string[],
  otherAnswer: string,
): GetUserChoiceResult => {
  const selectionMode = getSelectionMode(parameters);
  const trimmedOther = otherAnswer.trim();

  if (selectionMode === 'multiple') {
    const values = selectedValues.filter(
      (value) => value !== GET_USER_CHOICE_OTHER_VALUE,
    );
    return {
      status: 'answered',
      selectionMode: 'multiple',
      values,
      labels: values.map((value) => getChoiceOptionLabel(options, value)),
      ...(selectedValues.includes(GET_USER_CHOICE_OTHER_VALUE) && trimmedOther
        ? { other: trimmedOther }
        : {}),
    };
  }

  const value = selectedValues[0] ?? '';
  if (value === GET_USER_CHOICE_OTHER_VALUE) {
    return {
      status: 'answered',
      selectionMode: 'single',
      value: null,
      label: null,
      ...(trimmedOther ? { other: trimmedOther } : {}),
    };
  }

  return {
    status: 'answered',
    selectionMode: 'single',
    value,
    label: getChoiceOptionLabel(options, value),
  };
};

const isChoiceInvalid = (
  parameters: GetUserChoiceParametersRenderInput,
  selectedValues: string[],
  otherAnswer: string,
) => {
  if (selectedValues.length === 0) {
    return true;
  }
  if (
    selectedValues.includes(GET_USER_CHOICE_OTHER_VALUE) &&
    !otherAnswer.trim()
  ) {
    return true;
  }
  return (
    getSelectionMode(parameters) === 'single' && selectedValues.length !== 1
  );
};

// ─── Variants ───────────────────────────────────────────────────────────────

const getUserChoiceWrapperVariants = cva('flex w-full min-w-0 flex-col', {
  variants: {
    size: {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
    },
  },
  defaultVariants: { size: 'md' },
});

const getUserChoiceFieldVariants = cva('', {
  variants: {
    size: {
      sm: 'gap-2.5',
      md: 'gap-3',
      lg: 'gap-3.5',
    },
  },
  defaultVariants: { size: 'md' },
});

const getUserChoiceLabelVariants = cva(
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

const getUserChoiceChipItemVariants = cva(
  cn(
    'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-input bg-transparent text-base font-normal leading-normal text-foreground transition-colors disabled:cursor-default',
    'hover:bg-transparent hover:text-foreground hover:border-foreground',
    'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
    'data-[state=on]:border-2 data-[state=on]:border-primary data-[state=on]:-m-px',
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

const getUserChoiceOtherChipItemVariants = cva(
  cn(
    'inline-flex cursor-pointer items-center justify-center rounded-full border border-input bg-transparent text-base font-normal leading-normal text-muted-foreground transition-colors disabled:cursor-default',
    'hover:bg-transparent hover:text-foreground hover:border-foreground',
    'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
    'data-[state=on]:border-2 data-[state=on]:border-primary data-[state=on]:-m-px',
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

const getUserChoiceOtherTextareaVariants = cva(
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

const getUserChoiceCardItemVariants = cva(
  cn(
    'group/card relative flex w-full cursor-pointer items-start gap-3 rounded-lg border border-input bg-background text-left text-base font-normal leading-normal text-foreground transition-colors disabled:cursor-default',
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

const getUserChoiceCardTitleVariants = cva(
  'text-base font-normal leading-normal',
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

const getUserChoiceCardDescriptionVariants = cva(
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

const getUserChoiceCardCheckIndicatorVariants = cva(
  'inline-flex shrink-0 items-center justify-center border transition-colors',
  {
    variants: {
      size: {
        sm: 'size-4',
        md: 'size-5',
        lg: 'size-5',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

const getUserChoiceCardCheckIconVariants = cva('', {
  variants: {
    size: {
      sm: 'size-3',
      md: 'size-3.5',
      lg: 'size-3.5',
    },
  },
  defaultVariants: { size: 'md' },
});

const getUserChoiceCardRadioDotVariants = cva('rounded-full bg-primary', {
  variants: {
    size: {
      sm: 'size-2',
      md: 'size-2.5',
      lg: 'size-2.5',
    },
  },
  defaultVariants: { size: 'md' },
});

const getUserChoiceChipsGroupClass =
  'flex w-full min-w-0 flex-wrap items-center justify-start';
const getUserChoiceCardsGroupClass =
  'flex w-full min-w-0 flex-col items-stretch justify-start';

const getUserChoiceActionRowVariants = cva(
  'flex w-full items-center justify-start',
  {
    variants: {
      size: {
        sm: 'gap-1.5',
        md: 'gap-2',
        lg: 'gap-2',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

const getUserChoiceIconVariants = cva('', {
  variants: {
    size: {
      sm: 'size-3.5',
      md: 'size-4',
      lg: 'size-4',
    },
  },
  defaultVariants: { size: 'md' },
});

const getUserChoiceClearButtonVariants = cva(
  cn(
    'inline-flex shrink-0 items-center justify-center rounded-full border border-input bg-background text-muted-foreground transition-colors',
    'hover:text-foreground hover:border-foreground',
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

const getUserChoiceGroupSpacing = (size: GetUserChoiceSize): string =>
  size === 'sm' ? 'gap-1.5' : size === 'lg' ? 'gap-2.5' : 'gap-2';

// ─── Subcomponents ──────────────────────────────────────────────────────────

function SendArrowButton({
  size,
  label,
  text,
  onClick,
  disabled,
}: {
  size: GetUserChoiceSize;
  label: string;
  text?: string;
  onClick: () => void;
  disabled?: boolean;
}) {
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
      <ArrowRight className={cn(getUserChoiceIconVariants({ size }))} />
    </Button>
  );
}

function CardOptionContent({
  option,
  selectionMode,
  size,
  selected,
}: {
  option: Pick<GetUserChoiceRenderableOption, 'label' | 'description'>;
  selectionMode: 'single' | 'multiple';
  size: GetUserChoiceSize;
  selected: boolean;
}) {
  return (
    <>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={cn(getUserChoiceCardTitleVariants({ size }))}>
          {option.label}
        </span>
        {option.description && (
          <span className={cn(getUserChoiceCardDescriptionVariants({ size }))}>
            {option.description}
          </span>
        )}
      </span>
      <span
        className={cn(
          getUserChoiceCardCheckIndicatorVariants({ size }),
          selectionMode === 'single' ? 'rounded-full' : 'rounded-md',
          selected
            ? selectionMode === 'single'
              ? 'border-primary bg-transparent'
              : 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-transparent',
        )}
        aria-hidden="true"
      >
        {selected &&
          (selectionMode === 'single' ? (
            <span className={cn(getUserChoiceCardRadioDotVariants({ size }))} />
          ) : (
            <Check
              className={cn(getUserChoiceCardCheckIconVariants({ size }))}
            />
          ))}
      </span>
    </>
  );
}

function ChoiceOptionButton({
  option,
  selectionMode,
  isCards,
  isSelected,
  isReadOnly,
  size,
  onSelect,
}: {
  option: GetUserChoiceRenderableOption;
  selectionMode: 'single' | 'multiple';
  isCards: boolean;
  isSelected: boolean;
  isReadOnly: boolean;
  size: GetUserChoiceSize;
  onSelect: (value: string) => void;
}) {
  return (
    <Button
      type="button"
      variant="primary-ghost"
      size="sm"
      role={selectionMode === 'single' ? 'radio' : 'checkbox'}
      aria-checked={isSelected}
      aria-label={
        isCards && option.description
          ? `${option.label}: ${option.description}`
          : undefined
      }
      data-state={isSelected ? 'on' : 'off'}
      disabled={isReadOnly}
      className={cn(
        isCards
          ? getUserChoiceCardItemVariants({ size })
          : getUserChoiceChipItemVariants({ size }),
      )}
      onClick={() => onSelect(option.value)}
    >
      {isCards ? (
        <CardOptionContent
          option={option}
          selectionMode={selectionMode}
          size={size}
          selected={isSelected}
        />
      ) : (
        <span>{option.label}</span>
      )}
    </Button>
  );
}

function OtherOptionButton({
  otherLabel,
  selectionMode,
  isCards,
  isSelected,
  isReadOnly,
  size,
  onSelect,
}: {
  otherLabel?: string;
  selectionMode: 'single' | 'multiple';
  isCards: boolean;
  isSelected: boolean;
  isReadOnly: boolean;
  size: GetUserChoiceSize;
  onSelect: (value: string) => void;
}) {
  const label = otherLabel || 'Other';
  return (
    <Button
      type="button"
      variant="primary-ghost"
      size="sm"
      role={selectionMode === 'single' ? 'radio' : 'checkbox'}
      aria-checked={isSelected}
      aria-label={label}
      data-state={isSelected ? 'on' : 'off'}
      disabled={isReadOnly}
      className={cn(
        isCards
          ? getUserChoiceCardItemVariants({ size })
          : getUserChoiceOtherChipItemVariants({ size }),
      )}
      onClick={() => onSelect(GET_USER_CHOICE_OTHER_VALUE)}
    >
      {isCards ? (
        <CardOptionContent
          option={{ label, description: undefined }}
          selectionMode={selectionMode}
          size={size}
          selected={isSelected}
        />
      ) : (
        <Pencil className={cn(getUserChoiceIconVariants({ size }))} />
      )}
    </Button>
  );
}

function OtherAnswerInput({
  labelId,
  otherLabel,
  value,
  isInvalid,
  isReadOnly,
  size,
  onChange,
  onClear,
}: {
  labelId: string;
  otherLabel?: string;
  value: string;
  isInvalid: boolean;
  isReadOnly: boolean;
  size: GetUserChoiceSize;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex w-full items-start gap-2">
      <Textarea
        rows={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={otherLabel || 'Other'}
        disabled={isReadOnly}
        aria-invalid={isInvalid || undefined}
        aria-labelledby={labelId}
        className={cn(getUserChoiceOtherTextareaVariants({ size }))}
      />
      <Button
        type="button"
        variant="primary-ghost"
        size="icon-sm"
        disabled={isReadOnly}
        aria-label="Clear other answer"
        className={cn(getUserChoiceClearButtonVariants({ size }))}
        onClick={onClear}
      >
        <X className={cn(getUserChoiceIconVariants({ size }))} />
      </Button>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

interface GetUserChoiceToolProps {
  parameters: GetUserChoiceParametersRenderInput;
  result?: GetUserChoiceResult;
  hideQuestionLabel?: boolean;
  respond?: (result: unknown) => Promise<void>;
  size?: GetUserChoiceSize;
}

export function GetUserChoiceSkipped({
  parameters,
  hideQuestionLabel,
  size = 'md',
}: {
  parameters: GetUserChoiceParametersRenderInput;
  hideQuestionLabel?: boolean;
  size?: GetUserChoiceSize;
}) {
  return (
    <GetUserChoiceTool
      parameters={parameters}
      result={{ status: 'skipped' }}
      hideQuestionLabel={hideQuestionLabel}
      size={size}
    />
  );
}

export function GetUserChoiceTool({
  parameters,
  result,
  hideQuestionLabel = false,
  respond,
  size = 'md',
}: GetUserChoiceToolProps) {
  const formId = React.useId();
  const options = React.useMemo(
    () => getValidatedChoiceOptions(parameters.options),
    [parameters.options],
  );
  const [submittedResult, setSubmittedResult] = React.useState<
    GetUserChoiceResult | undefined
  >();
  const visibleResult = result ?? submittedResult;
  const initialFormState = React.useMemo(
    () => getResultFormState(visibleResult),
    [visibleResult],
  );
  const [selectedValues, setSelectedValues] = React.useState<string[]>(
    initialFormState.selectedValues,
  );
  const [otherAnswer, setOtherAnswer] = React.useState(
    initialFormState.otherAnswer,
  );
  const [hasSubmittedInvalidAnswer, setHasSubmittedInvalidAnswer] =
    React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const selectionMode = getSelectionMode(parameters);
  const isCards = shouldRenderAsCards(parameters, options);
  const isSubmittedState = visibleResult !== undefined;
  const isReadOnly = isSubmittedState || !respond;
  const isInteractionLocked = isReadOnly || isSubmitting;
  const isOtherSelected = selectedValues.includes(GET_USER_CHOICE_OTHER_VALUE);
  const isInvalid = isChoiceInvalid(parameters, selectedValues, otherAnswer);
  const showInvalid = hasSubmittedInvalidAnswer && isInvalid;
  const isInstantSubmitFlow =
    options.length > 0 &&
    selectionMode === 'single' &&
    !parameters.allowOther &&
    !isCards;
  const showSubmitButton = options.length > 0 && !isInstantSubmitFlow;
  const question = parameters.question?.trim();
  const isQuestionLabelHidden = !question || hideQuestionLabel;
  const controlAccessibleLabel = question || 'Choose an option';
  const labelId = `${formId}-get-user-choice-label`;

  React.useEffect(() => {
    if (!isSubmittedState) {
      return;
    }

    setSelectedValues(initialFormState.selectedValues);
    setOtherAnswer(initialFormState.otherAnswer);
    setIsSubmitting(false);
  }, [initialFormState, isSubmittedState]);

  if (!question && options.length === 0) {
    return null;
  }

  const selectValue = (value: string) => {
    if (isInteractionLocked) {
      return;
    }

    if (selectionMode === 'multiple') {
      setSelectedValues((current) =>
        current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      );
      return;
    }

    const nextValues = [value];
    setSelectedValues(nextValues);
    if (isInstantSubmitFlow && value !== GET_USER_CHOICE_OTHER_VALUE) {
      void submitWith(nextValues, otherAnswer);
    }
  };

  const clearOtherAnswer = () => {
    if (isInteractionLocked) {
      return;
    }
    setSelectedValues((current) =>
      current.filter((value) => value !== GET_USER_CHOICE_OTHER_VALUE),
    );
    setOtherAnswer('');
  };

  const submitWith = async (
    nextSelectedValues: string[],
    nextOtherAnswer: string,
  ) => {
    if (!respond || isSubmitting) {
      return;
    }
    if (isChoiceInvalid(parameters, nextSelectedValues, nextOtherAnswer)) {
      setHasSubmittedInvalidAnswer(true);
      return;
    }

    setHasSubmittedInvalidAnswer(false);
    setIsSubmitting(true);
    const nextResult = buildChoiceResult(
      parameters,
      options,
      nextSelectedValues,
      nextOtherAnswer,
    );
    setSubmittedResult(nextResult);
    try {
      await respond(nextResult);
    } catch (error) {
      setIsSubmitting(false);
      throw error;
    }
  };

  const handleSendClick = () => {
    if (isInvalid || isSubmitting) {
      setHasSubmittedInvalidAnswer(true);
      return;
    }
    void submitWith(selectedValues, otherAnswer);
  };

  return (
    <FieldGroup
      className={cn(
        getUserChoiceWrapperVariants({ size }),
        '@container-normal',
        isSubmitting && 'pointer-events-none',
      )}
    >
      <Field
        data-invalid={showInvalid || undefined}
        className={cn(getUserChoiceFieldVariants({ size }))}
      >
        <FieldLabel
          id={labelId}
          className={cn(
            'w-full cursor-text opacity-100',
            getUserChoiceLabelVariants({ size, invalid: showInvalid }),
            isQuestionLabelHidden && 'sr-only',
          )}
        >
          {question}
          {!question ? controlAccessibleLabel : null}
        </FieldLabel>

        {options.length > 0 && (
          <div
            role={selectionMode === 'single' ? 'radiogroup' : 'group'}
            aria-labelledby={labelId}
            aria-invalid={showInvalid || undefined}
            data-slot={
              selectionMode === 'single' ? 'radio-group' : 'checkbox-group'
            }
            className={cn(
              getUserChoiceGroupSpacing(size),
              isCards
                ? getUserChoiceCardsGroupClass
                : getUserChoiceChipsGroupClass,
            )}
          >
            {options.map((option) => (
              <ChoiceOptionButton
                key={option.value}
                option={option}
                selectionMode={selectionMode}
                isCards={isCards}
                isSelected={selectedValues.includes(option.value)}
                isReadOnly={isReadOnly}
                size={size}
                onSelect={selectValue}
              />
            ))}

            {parameters.allowOther && (
              <OtherOptionButton
                otherLabel={parameters.otherLabel}
                selectionMode={selectionMode}
                isCards={isCards}
                isSelected={isOtherSelected}
                isReadOnly={isReadOnly}
                size={size}
                onSelect={selectValue}
              />
            )}
          </div>
        )}

        {isOtherSelected && (
          <OtherAnswerInput
            labelId={labelId}
            otherLabel={parameters.otherLabel}
            value={otherAnswer}
            isInvalid={showInvalid}
            isReadOnly={isReadOnly}
            size={size}
            onChange={(value) => {
              if (!isInteractionLocked) {
                setOtherAnswer(value);
              }
            }}
            onClear={clearOtherAnswer}
          />
        )}
      </Field>

      {showSubmitButton && (
        <div className={cn(getUserChoiceActionRowVariants({ size }))}>
          <SendArrowButton
            size={size}
            label="Send"
            text={parameters.submitButtonText}
            disabled={isInteractionLocked || isInvalid}
            onClick={handleSendClick}
          />
        </div>
      )}
    </FieldGroup>
  );
}

const parseGetUserChoiceToolResult = (
  result?: string,
): GetUserChoiceResult | undefined => {
  if (!result) {
    return undefined;
  }
  try {
    return JSON.parse(result) as GetUserChoiceResult;
  } catch {
    return undefined;
  }
};

export function GetUserChoiceToolResult({
  result,
  args,
  hideQuestionLabel,
  respond,
}: {
  result?: string;
  args: GetUserChoiceParametersRenderInput;
  hideQuestionLabel?: boolean;
  respond?: (result: unknown) => Promise<void>;
}) {
  const parsedResult = parseGetUserChoiceToolResult(result);
  const hasOptions = Array.isArray(args?.options) && args.options.length > 0;

  if (!args?.question && !hasOptions) {
    return null;
  }

  if (parsedResult?.status === 'skipped') {
    return (
      <GetUserChoiceSkipped
        parameters={args}
        hideQuestionLabel={hideQuestionLabel}
      />
    );
  }

  return (
    <GetUserChoiceTool
      parameters={args}
      result={parsedResult}
      hideQuestionLabel={hideQuestionLabel}
      respond={respond}
    />
  );
}
