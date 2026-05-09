import { cn } from "@/lib/utils";

interface WizardStepIndicatorProps {
  currentStep: 1 | 2 | 3;
  totalSteps: number;
  stepLabels?: string[];
}

export const WizardStepIndicator = ({
  currentStep,
  totalSteps,
  stepLabels,
}: WizardStepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNumber = i + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={stepNumber} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  isActive &&
                    "bg-primary text-primary-foreground",
                  isCompleted &&
                    "bg-primary/20 text-primary",
                  !isActive &&
                    !isCompleted &&
                    "bg-muted text-muted-foreground"
                )}
              >
                {stepNumber}
              </div>
              {stepLabels?.[i] && (
                <span
                  className={cn(
                    "text-xs",
                    isActive ? "font-medium text-foreground" : "text-muted-foreground"
                  )}
                >
                  {stepLabels[i]}
                </span>
              )}
            </div>
            {stepNumber < totalSteps && (
              <div
                className={cn(
                  "h-0.5 w-12 rounded-full transition-colors",
                  isCompleted ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};