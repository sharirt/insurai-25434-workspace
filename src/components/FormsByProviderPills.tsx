import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProviderCount {
  id: string;
  name: string;
  count: number;
}

interface FormsByProviderPillsProps {
  forms: Array<{ providers?: string[] }> | undefined;
  providers: Array<{ id?: string; provider_name?: string }> | undefined;
  isLoading: boolean;
  filterProvider: string;
  onFilterChange: (providerId: string) => void;
}

export const FormsByProviderPills = ({
  forms,
  providers,
  isLoading,
  filterProvider,
  onFilterChange,
}: FormsByProviderPillsProps) => {
  const providerBreakdown = useMemo(() => {
    if (!forms || !providers) return [];

    const countMap = new Map<string, number>();
    let noProviderCount = 0;

    forms.forEach((form) => {
      if (!form.providers || form.providers.length === 0) {
        noProviderCount++;
      } else {
        form.providers.forEach((pid) => {
          countMap.set(pid, (countMap.get(pid) || 0) + 1);
        });
      }
    });

    const result: ProviderCount[] = [];

    providers.forEach((p) => {
      const count = countMap.get(p.id!);
      if (count && count > 0) {
        result.push({ id: p.id!, name: p.provider_name || "ללא שם", count });
      }
    });

    if (noProviderCount > 0) {
      result.push({ id: "__none__", name: "ללא יצרן", count: noProviderCount });
    }

    return result;
  }, [forms, providers]);

  if (isLoading) {
    return (
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">טפסים לפי יצרן</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className={cn("h-8 rounded-full", i % 2 === 0 ? "w-24" : "w-20")} />
          ))}
        </div>
      </div>
    );
  }

  if (providerBreakdown.length === 0) return null;

  const totalCount = forms?.length ?? 0;

  return (
    <div className="mb-4">
      <p className="text-xs text-muted-foreground mb-2">טפסים לפי יצרן</p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => onFilterChange("all")}
          className={cn(
            "shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer",
            filterProvider === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          הכל
          <Badge variant={filterProvider === "all" ? "secondary" : "outline"} className="text-xs px-1.5 py-0 min-w-[1.25rem] justify-center">
            {totalCount}
          </Badge>
        </button>

        {providerBreakdown.map((item) => {
          const isActive = filterProvider === item.id || (filterProvider === "__none__" && item.id === "__none__");
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onFilterChange(item.id)}
              className={cn(
                "shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.name}
              <Badge variant={isActive ? "secondary" : "outline"} className="text-xs px-1.5 py-0 min-w-[1.25rem] justify-center">
                {item.count}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
};