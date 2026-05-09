import { useState } from "react";
import { Check, ChevronsUpDown, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";
import type { IClientsEntity } from "@/product-types";

interface ClientSelectionSectionProps {
  clients: (IClientsEntity & { id: string })[];
  onContinue: (selectedClientId: string | null, createNew: boolean) => void;
}

export const ClientSelectionSection = ({
  clients,
  onContinue,
}: ClientSelectionSectionProps) => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [createNewClient, setCreateNewClient] = useState(false);
  const [open, setOpen] = useState(false);

  const selectedClient = selectedClientId
    ? clients?.find((c) => c.id === selectedClientId)
    : null;

  const selectedClientName = selectedClient
    ? [selectedClient.first_name, selectedClient.last_name]
        .filter(Boolean)
        .join(" ")
    : "";

  const canContinue = !!selectedClientId || createNewClient;

  return (
    <div className="animate-in fade-in duration-500">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="text-primary" />
            <CardTitle className="text-xl">זיהוי לקוח</CardTitle>
          </div>
          <CardDescription>
            לא זוהה לקוח אוטומטית. בחר לקוח קיים או צור לקוח חדש.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className={cn(createNewClient && "opacity-50 pointer-events-none")}>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !selectedClientId && "text-muted-foreground"
                  )}
                >
                  {selectedClientId
                    ? selectedClientName || "לקוח נבחר"
                    : "בחר לקוח..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[--radix-popover-trigger-width] p-0"
                align="start"
              >
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
                              setSelectedClientId(client.id);
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
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="create-new-client"
              checked={createNewClient}
              onCheckedChange={(checked) => {
                setCreateNewClient(checked === true);
                if (checked) {
                  setSelectedClientId(null);
                }
              }}
            />
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="create-new-client" className="text-sm font-medium cursor-pointer">
                צור לקוח חדש
              </Label>
              <p className="text-xs text-muted-foreground">
                לקוח חדש ייווצר על בסיס הפרטים שחולצו מהסיכום
              </p>
            </div>
          </div>

          <Button
            onClick={() => onContinue(selectedClientId, createNewClient)}
            disabled={!canContinue}
            className="w-full"
          >
            המשך
            <ArrowLeft data-icon="inline-end" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};