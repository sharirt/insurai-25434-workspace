import { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Pencil, Quote } from "lucide-react";
import type { PendingRequest } from "@/hooks/useNewMeetingWizard";
import { getFieldLabel } from "@/utils/fieldTranslations";
import { formatCurrency } from "@/utils/FormatUtils";

interface PendingRequestCardProps {
  request: PendingRequest;
  onRemove: (id: string) => void;
  onEdit?: (request: PendingRequest) => void;
  disabled?: boolean;
}

export const PendingRequestCard = ({
  request,
  onRemove,
  onEdit,
  disabled = false,
}: PendingRequestCardProps) => {
  const handleRemove = useCallback(() => {
    onRemove(request.id);
  }, [onRemove, request.id]);

  const handleEdit = useCallback(() => {
    onEdit?.(request);
  }, [onEdit, request]);

  const activeTracks = Object.entries(request.tracks ?? {}).filter(
    ([, value]) => value != null && value !== "" && value !== "0"
  );

  return (
    <Card className="transition-colors hover:bg-accent/50">
      <CardContent className="flex items-start justify-between p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold truncate">
              {request.requestTypeName}
            </h4>
            <Badge variant="secondary">{request.providerName}</Badge>
          </div>
          {request.sourceQuote && (
            <div className="border-r-2 border-accent bg-muted/40 rounded px-2.5 py-1.5 mt-2">
              <div className="flex items-center gap-1 mb-0.5">
                <Quote className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">ציטוט:</span>
              </div>
              <p className="text-sm italic text-muted-foreground">{request.sourceQuote}</p>
            </div>
          )}
          {request.fundName && (
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {request.fundName}
            </p>
          )}
          {request.fundId && (
            <div className="text-xs text-muted-foreground mt-1.5 flex flex-col gap-0.5">
              <p>
                <span className="font-medium text-foreground/80">מספר פוליסה: </span>
                <span className="font-mono tabular-nums">
                  {request.fundPolicyNumber || "—"}
                </span>
              </p>
              <p>
                <span className="font-medium text-foreground/80">יתרה כוללת: </span>
                <span className="tabular-nums">
                  {request.fundTotalBalance != null
                    ? formatCurrency(request.fundTotalBalance)
                    : "—"}
                </span>
              </p>
            </div>
          )}
          {request.managementFee != null && (
            <p className="text-xs text-muted-foreground mt-1">
              דמי ניהול מהפקדה: {request.managementFee}%
            </p>
          )}
          {activeTracks.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                מסלולים:
              </p>
              <div className="grid gap-0.5">
                {activeTracks.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-muted-foreground">
                      {getFieldLabel(key)}
                    </span>
                    <span className="font-medium tabular-nums">{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {request.missingFields && Object.keys(request.missingFields).length > 0 && (() => {
            const fieldLabels: Record<string, string> = {
              providerId: "יצרן",
              requestTypeId: "סוג בקשה",
              managementFee: "דמי ניהול מהפקדה",
              transferType: "סוג העברה",
              choiceDuration: "תקופת בחירה",
              kerenName: "שם קרן",
              transferAmount: "יתרת העברה",
              tracks: "מסלולים",
            };
            return (
              <div className="flex flex-wrap items-center gap-1 mt-2">
                <span className="text-xs text-amber-600">פרטים חסרים:</span>
                {Object.keys(request.missingFields!).map((key) => (
                  <span key={key} className="bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full">
                    {fieldLabels[key] || key}
                  </span>
                ))}
              </div>
            );
          })()}
        </div>
        <div className="flex items-center gap-1 shrink-0 mr-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              disabled={disabled}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <Pencil className="h-3.5 w-3.5 ml-1" />
              ערוך
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};