import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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

interface Client {
  id: string;
  first_name?: string;
  last_name?: string;
  national_id?: string;
}

interface ClientComboboxProps {
  clients: Client[];
  selectedClientId: string;
  onSelectClient: (clientId: string) => void;
  disabled?: boolean;
}

export const ClientCombobox = ({
  clients,
  selectedClientId,
  onSelectClient,
  disabled,
}: ClientComboboxProps) => {
  const [open, setOpen] = useState(false);

  const selectedClient = clients?.find((c) => c.id === selectedClientId);
  const displayName = selectedClient
    ? [selectedClient.first_name, selectedClient.last_name].filter(Boolean).join(" ")
    : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {displayName || "בחר לקוח..."}
          <ChevronsUpDown className="opacity-50" data-icon="inline-end" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command dir="rtl">
          <CommandInput placeholder="חפש לפי שם או ת״ז..." />
          <CommandList>
            <CommandEmpty>לא נמצאו לקוחות</CommandEmpty>
            <CommandGroup>
              {clients?.map((client) => {
                const name = [client.first_name, client.last_name]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <CommandItem
                    key={client.id}
                    value={`${name} ${client.national_id || ""}`}
                    onSelect={() => {
                      onSelectClient(client.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "ml-2",
                        selectedClientId === client.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span>{name || "לקוח ללא שם"}</span>
                    {client.national_id && (
                      <span className="text-muted-foreground text-xs mr-2">
                        {client.national_id}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};