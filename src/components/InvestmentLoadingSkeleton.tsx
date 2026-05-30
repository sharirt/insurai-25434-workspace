import { Skeleton } from "@/components/ui/skeleton";

export const InvestmentLoadingSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
};