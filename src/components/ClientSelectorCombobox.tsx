import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, User, X, Info, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IClientsEntity } from "@/product-types";

interface ClientSelectorComboboxProps {
  clients: (IClientsEntity & { id: string })[];
  isLoading: boolean;
  selectedClientId: string;
  onSelectClient: (id: string | null) => void;
}

export const ClientSelectorCombobox = ({
  clients,
  isLoading,
  selectedClientId,
  onSelectClient,
}: ClientSelectorComboboxProps) => {
  const [open, setOpen] = useState(false);

  const selectedClient = selectedClientId
    ? clients?.find((c) => c.id === selectedClientId)
    : null;

  const selectedClientName = selectedClient
    ? [selectedClient.first_name, selectedClient.last_name]
        .filter(Boolean)
        .join(" ")
    : "";

  if (isLoading) {
    return (
      <div className="rounded-lg bg-muted p-4 flex flex-col gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-muted p-4 flex flex-col gap-3">
      <label className="text-sm font-medium text-foreground">בחר לקוח</label>
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between bg-background",
                !selectedClientId && "text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-2 truncate">
                {selectedClientId ? (
                  <>
                    <User data-icon="inline-start" />
                    <span className="truncate font-medium">
                      {selectedClientName}
                    </span>
                  </>
                ) : (
                  <>
                    <Search data-icon="inline-start" />
                    <span>חפש או בחר לקוח...</span>
                  </>
                )}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command dir="rtl">
              <CommandInput placeholder="חפש לפי שם או ת.ז..." />
              <CommandList>
                <CommandEmpty>לא נמצאו לקוחות</CommandEmpty>
                <CommandGroup>
                  {clients?.map((client) => {
                    const fullName = [client.first_name, client.last_name]
                      .filter(Boolean)
                      .join(" ");
                    return (
                      <CommandItem
                        key={client.id}
                        value={`${fullName} ${client.national_id ?? ""}`}
                        onSelect={() => {
                          onSelectClient(client.id);
                          setOpen(false);
                        }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {fullName || "ללא שם"}
                          </span>
                          {client.national_id && (
                            <span className="text-xs text-muted-foreground">
                              ת.ז: {client.national_id}
                            </span>
                          )}
                        </div>
                        {client.id === selectedClientId && (
                          <Check className="text-primary" />
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {selectedClientId && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSelectClient(null)}
            className="shrink-0"
          >
            <X />
          </Button>
        )}
      </div>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Info className="size-3.5 shrink-0" />
        בחירת לקוח קיים תמלא את הפרטים אוטומטית
      </p>
    </div>
  );
};