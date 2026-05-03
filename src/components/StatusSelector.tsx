import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STATUS_VALUES, getStatusLabel, getStatusVariant } from "@/utils/StatusConfig";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusSelectorProps {
  currentStatus?: string;
  onStatusChange: (newStatus: string) => void;
  isLoading?: boolean;
}

export const StatusSelector = ({
  currentStatus,
  onStatusChange,
  isLoading,
}: StatusSelectorProps) => {
  const label = getStatusLabel(currentStatus);
  const variant = getStatusVariant(currentStatus);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <button className="cursor-pointer focus:outline-none" disabled={isLoading}>
          <Badge variant={variant} className="flex items-center gap-1.5">
            {isLoading && <Loader2 className="animate-spin" />}
            {label}
          </Badge>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" dir="rtl">
        <DropdownMenuGroup>
          {STATUS_VALUES.map((status) => {
            const isSelected = status === currentStatus;
            return (
              <DropdownMenuItem
                key={status}
                onClick={() => {
                  if (!isSelected) onStatusChange(status);
                }}
                className={cn("flex items-center gap-2", isSelected && "bg-accent")}
              >
                <Badge variant={getStatusVariant(status)} className="text-xs">
                  {getStatusLabel(status)}
                </Badge>
                {isSelected && <Check className="mr-auto" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};