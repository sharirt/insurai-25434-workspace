import { cn } from "@/lib/utils";

interface WizardStepIndicatorProps {
  currentStep: 1 | 2 | 3;
  totalSteps: number;
}

export const WizardStepIndicator = ({
  currentStep,
  totalSteps,
}: WizardStepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNumber = i + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={stepNumber} className="flex items-center gap-3">
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