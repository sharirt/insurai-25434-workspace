import { useState, useMemo, useCallback } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Fund {
  id: string;
  planName?: string;
  policyNumber?: string;
}

interface FundComboboxProps {
  funds: Fund[];
  selectedFundId: string;
  onSelectFund: (fundId: string) => void;
  disabled?: boolean;
}

const getFundLabel = (fund: Fund): string => {
  const name = fund.planName || "קרן ללא שם";
  return fund.policyNumber ? `${name} - ${fund.policyNumber}` : name;
};

export const FundCombobox = ({
  funds,
  selectedFundId,
  onSelectFund,
  disabled = false,
}: FundComboboxProps) => {
  const [open, setOpen] = useState(false);

  const selectedFund = useMemo(
    () => funds.find((f) => f.id === selectedFundId),
    [funds, selectedFundId]
  );

  const triggerLabel = useMemo(() => {
    if (disabled) return "אין מוצרים ללקוח זה";
    if (selectedFund) return getFundLabel(selectedFund);
    return "בחר מוצר (אופציונלי)";
  }, [disabled, selectedFund]);

  const handleSelect = useCallback(
    (fundId: string) => {
      if (fundId === selectedFundId) {
        onSelectFund("");
      } else {
        onSelectFund(fundId);
      }
      setOpen(false);
    },
    [selectedFundId, onSelectFund]
  );

  const handleClearSelection = useCallback(() => {
    onSelectFund("");
    setOpen(false);
  }, [onSelectFund]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal h-10",
            !selectedFundId && !disabled && "text-muted-foreground"
          )}
        >
          <span className="truncate">{triggerLabel}</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command dir="rtl" filter={(value, search) => {
          const fund = funds.find((f) => f.id === value);
          if (!fund) return 0;
          const label = getFundLabel(fund).toLowerCase();
          if (label.includes(search.toLowerCase())) return 1;
          return 0;
        }}>
          <CommandInput placeholder="חיפוש מוצר..." className="text-right" dir="rtl" />
          <CommandList>
            <CommandEmpty>לא נמצאו מוצרים</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="__clear__"
                onSelect={handleClearSelection}
                className="text-muted-foreground"
              >
                <Check
                  className={cn(
                    "h-4 w-4 shrink-0",
                    !selectedFundId ? "opacity-100" : "opacity-0"
                  )}
                />
                <span>ללא מוצר</span>
              </CommandItem>
              {funds.map((fund) => (
                <CommandItem
                  key={fund.id}
                  value={fund.id}
                  onSelect={() => handleSelect(fund.id)}
                >
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      selectedFundId === fund.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>{getFundLabel(fund)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};