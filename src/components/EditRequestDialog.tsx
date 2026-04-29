import React from "react";
import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FundCombobox } from "@/components/FundCombobox";
import { getFieldLabel, STATIC_TRACK_KEYS } from "@/utils/fieldTranslations";
import {
  useEntityGetAll,
  useEntityUpdate,
  useExecuteAction,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import {
  ProvidersEntity,
  RequestSchemesEntity,
  FundsEntity,
  RequestsEntity,
  AutoProcessNewRequestAction,
} from "@/product-types";
import type { IRequestsEntity } from "@/product-types";
import { Pencil, SlidersHorizontal, Eraser, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { STATUS_VALUES } from "@/utils/StatusConfig";

interface EditRequestDialogProps {
  open: boolean;
  onClose: () => void;
  request: IRequestsEntity & { id: string };
  onSuccess: () => void;
}

export const EditRequestDialog = ({
  open,
  onClose,
  request,
  onSuccess,
}: EditRequestDialogProps) => {
  const [selectedFundId, setSelectedFundId] = useState("");
  const [selectedRequestTypeId, setSelectedRequestTypeId] = useState("");
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [tracksValues, setTracksValues] = useState<Record<string, string>>({});
  const [managementFee, setManagementFee] = useState<number | undefined>(undefined);
  const [choiceDuration, setChoiceDuration] = useState<string>("");
  const [transferType, setTransferType] = useState<string>("");
  const [kerenName, setKerenName] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [isTotalTransfer, setIsTotalTransfer] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("מעבד");
  const [selectedStanding, setSelectedStanding] = useState("");

  const { data: providers, isLoading: isLoadingProviders } = useEntityGetAll(ProvidersEntity);
  const { data: requestSchemes, isLoading: isLoadingRequestTypes } = useEntityGetAll(RequestSchemesEntity);
  const { data: allFunds, isLoading: isLoadingFunds } = useEntityGetAll(FundsEntity, {
    clientId: request?.clientId || "",
  }, { enabled: !!request?.clientId });

  const { updateFunction, isLoading: isSaving } = useEntityUpdate(RequestsEntity);
  const { executeFunction: executeProcessForms, isLoading: isProcessing } = useExecuteAction(AutoProcessNewRequestAction);
  const [savePhase, setSavePhase] = useState<"idle" | "saving" | "processing">("idle");

  const sortedProviders = useMemo(() => {
    if (!providers) return [];
    return [...providers].sort((a, b) => (a.provider_name || "").localeCompare(b.provider_name || ""));
  }, [providers]);

  const sortedRequestTypes = useMemo(() => {
    if (!requestSchemes) return [];
    return [...requestSchemes].sort((a, b) => (a.requestTypeName || "").localeCompare(b.requestTypeName || ""));
  }, [requestSchemes]);

  const sortedFunds = useMemo(() => {
    if (!allFunds) return [];
    return [...allFunds].sort((a, b) => (a.planName || "").localeCompare(b.planName || ""));
  }, [allFunds]);

  const tracksKeys = STATIC_TRACK_KEYS;

  // Populate form with request data when dialog opens
  useEffect(() => {
    if (!open) {
      return;
    }
    // Pre-populate from request
    setSelectedFundId(request.fundId ?? "");
    setSelectedRequestTypeId(request.requestTypeId ?? "");
    setSelectedProviderId(request.providerId ?? "");
    setSelectedStatus(request.status ?? "מעבד");
    setManagementFee(request.managementFee ?? undefined);
    setChoiceDuration(request.choiceDuration ?? "");
    setTransferType(request.transferType ?? "");
    setKerenName(request.kerenName ?? "");
    setSelectedStanding(request.standing ?? "");

    // Tracks
    if (request.tracks) {
      const tv: Record<string, string> = {};
      for (const [key, value] of Object.entries(request.tracks)) {
        tv[key] = String(value ?? "");
      }
      setTracksValues(tv);
    } else {
      setTracksValues({});
    }

    // Transfer amount
    if (request.isTotalTransfer !== undefined && request.isTotalTransfer !== null) {
      setIsTotalTransfer(request.isTotalTransfer);
      setTransferAmount(request.isTotalTransfer ? "" : (request.transferAmount ?? ""));
    } else {
      const ta = request.transferAmount ?? "";
      if (ta === "" || ta === "true") {
        setIsTotalTransfer(true);
        setTransferAmount("");
      } else {
        setIsTotalTransfer(false);
        setTransferAmount(ta);
      }
    }
  }, [open, request]);

  const handleTrackValue = (key: string, value: string) => {
    setTracksValues((prev) => ({ ...prev, [key]: value }));
  };

  const tracksSum = tracksKeys.reduce((sum, key) => {
    const val = parseFloat(tracksValues[key] ?? "");
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const TRACKS_SUM_EPSILON = 0.01;
  const isTracksSumValid = tracksSum === 0 || Math.abs(tracksSum - 100) < TRACKS_SUM_EPSILON;

  const isPartialAmountValid =
    isTotalTransfer ||
    (() => {
      const t = transferAmount.trim();
      if (t === "") return false;
      const n = parseFloat(t);
      return !isNaN(n) && n >= 0;
    })();

  const isValid = !!selectedRequestTypeId && !!selectedProviderId && isTracksSumValid && isPartialAmountValid;

  const handleSave = async () => {
    if (!isValid) return;

    const tracksObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(tracksValues)) {
      const num = parseFloat(value);
      tracksObj[key] = isNaN(num) ? value : num;
    }

    try {
      setSavePhase("saving");
      await updateFunction({
        id: request.id,
        data: {
          status: selectedStatus as any,
          providerId: selectedProviderId,
          requestTypeId: selectedRequestTypeId,
          fundId: selectedFundId || undefined,
          managementFee: managementFee ?? undefined,
          choiceDuration: (choiceDuration === "-" ? "" : choiceDuration) as any,
          transferType: (transferType === "-" ? "" : transferType) as any,
          kerenName: (kerenName === "-" ? "" : kerenName) as any,
          isTotalTransfer,
          transferAmount: isTotalTransfer ? undefined : transferAmount.trim(),
          tracks: tracksObj,
          standing: (selectedStanding === "-" || selectedStanding === "") ? undefined : selectedStanding as any,
        },
      });

      setSavePhase("processing");
      try {
        await executeProcessForms({ requestId: request.id });
        toast.success("הבקשה עודכנה ועובדה מחדש בהצלחה");
      } catch {
        toast.warning("הבקשה נשמרה אך עיבוד הטפסים נכשל");
      }
      onSuccess();
      onClose();
    } catch {
      toast.error("שגיאה בעדכון הבקשה");
    } finally {
      setSavePhase("idle");
    }
  };

  const onTrackFieldChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val !== "" && Number(val) < 0) return;
    handleTrackValue(key, val);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="p-0 overflow-hidden" dir="rtl" style={{ width: "90vw", maxWidth: "90vw", height: "85vh" }}>
        {/* Header Strip */}
        <div
          className="relative px-10 pt-10 pb-8 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(220 20% 30%) 100%)",
          }}
        >
          <div
            className="absolute -top-6 -left-6 size-32 rounded-full opacity-10"
            style={{ background: "hsl(var(--accent))" }}
          />
          <div
            className="absolute -bottom-4 left-16 size-20 rounded-full opacity-10"
            style={{ background: "hsl(var(--accent))" }}
          />
          <div className="relative flex items-center gap-4">
            <div
              className="flex-shrink-0 flex items-center justify-center size-14 rounded-2xl shadow-lg"
              style={{ background: "hsl(var(--accent))" }}
            >
              <Pencil className="size-7" style={{ color: "hsl(var(--primary))" }} />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold leading-tight" style={{ color: "hsl(var(--primary-foreground))" }}>
                עריכת בקשה
              </h2>
              <p className="text-sm font-normal opacity-75" style={{ color: "hsl(var(--primary-foreground))" }}>
                ערוך את פרטי הבקשה
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-10 pt-8 pb-4 overflow-y-auto" style={{ maxHeight: "calc(85vh - 280px)" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {/* Status */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-foreground">סטטוס</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus} dir="rtl">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="בחר סטטוס" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_VALUES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fund */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-foreground">מוצר</Label>
              {isLoadingFunds ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <FundCombobox
                  funds={sortedFunds}
                  selectedFundId={selectedFundId}
                  onSelectFund={setSelectedFundId}
                  disabled={sortedFunds.length === 0}
                />
              )}
            </div>

            {/* Request Type */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-foreground">
                סוג בקשה<span className="text-destructive mr-1">*</span>
              </Label>
              {isLoadingRequestTypes ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={selectedRequestTypeId} onValueChange={setSelectedRequestTypeId} dir="rtl">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="בחר סוג בקשה" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortedRequestTypes.map((rt) => (
                      <SelectItem key={rt.id} value={rt.id}>
                        {rt.requestTypeName || "סוג בקשה ללא שם"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Provider */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-foreground">
                יצרן<span className="text-destructive mr-1">*</span>
              </Label>
              {isLoadingProviders ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={selectedProviderId} onValueChange={setSelectedProviderId} dir="rtl">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="בחר יצרן" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortedProviders.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.provider_name || "יצרן ללא שם"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Management Fee */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-foreground">דמי ניהול</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={managementFee ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") { setManagementFee(undefined); return; }
                    const num = Number(val);
                    if (num < 0) return;
                    setManagementFee(num);
                  }}
                  placeholder="0.00"
                  dir="rtl"
                  min={0}
                  step={0.01}
                  onKeyDown={(e) => { if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault(); }}
                  className="pl-8"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">%</span>
              </div>
            </div>

            {/* Standing */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-foreground">מעמד</Label>
              <Select value={selectedStanding || "-"} onValueChange={setSelectedStanding} dir="rtl">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="ללא" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-">ללא</SelectItem>
                  <SelectItem value="שכיר">שכיר</SelectItem>
                  <SelectItem value="עצמאי">עצמאי</SelectItem>
                  <SelectItem value="שכיר בעל שליטה">שכיר בעל שליטה</SelectItem>
                  <SelectItem value="עצמאי באמצעות מעסיק">עצמאי באמצעות מעסיק</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Choice Duration & Transfer Type */}
          {selectedRequestTypeId && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-5">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-foreground">תקופת בחירה בחודשים</Label>
                <Select value={choiceDuration || "-"} onValueChange={setChoiceDuration} dir="rtl">
                  <SelectTrigger className="w-full"><SelectValue placeholder="ללא" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-">ללא</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-foreground">סוג העברה</Label>
                <Select value={transferType || "-"} onValueChange={setTransferType} dir="rtl">
                  <SelectTrigger className="w-full"><SelectValue placeholder="ללא" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-">ללא</SelectItem>
                    <SelectItem value="צבירה והפקדות">צבירה והפקדות</SelectItem>
                    <SelectItem value="צבירה בלבד">צבירה בלבד</SelectItem>
                    <SelectItem value="הפקדות בלבד">הפקדות בלבד</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Transfer Amount & Keren Name */}
          {selectedRequestTypeId && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-5">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-foreground">יתרת העברה</Label>
                <Select
                  value={isTotalTransfer ? "full" : "partial"}
                  onValueChange={(val) => {
                    if (val === "full") { setIsTotalTransfer(true); setTransferAmount(""); }
                    else { setIsTotalTransfer(false); }
                  }}
                  dir="rtl"
                >
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">סכום מלא</SelectItem>
                    <SelectItem value="partial">סכום חלקי</SelectItem>
                  </SelectContent>
                </Select>
                {!isTotalTransfer && (
                  <Input
                    type="number"
                    min={0}
                    step="any"
                    value={transferAmount}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "") { setTransferAmount(""); return; }
                      const n = parseFloat(v);
                      if (!isNaN(n) && n < 0) return;
                      setTransferAmount(v);
                    }}
                    placeholder="הכנס סכום"
                    dir="rtl"
                    className="mt-2"
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-foreground">שם קרן</Label>
                <Select value={kerenName || "-"} onValueChange={(val) => setKerenName(val === "-" ? "" : val)} dir="rtl">
                  <SelectTrigger className="w-full"><SelectValue placeholder="ללא" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-">ללא</SelectItem>
                    <SelectItem value="כללי">כללי</SelectItem>
                    <SelectItem value="אומגה">אומגה</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Tracks Section */}
          {selectedRequestTypeId && tracksKeys.length > 0 && (
            <div className="mt-6">
              <Separator className="mb-5" />
              <div className="rounded-lg p-4 flex flex-col gap-4" style={{ background: "hsl(var(--muted) / 0.4)" }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="size-4" style={{ color: "hsl(var(--accent-foreground))" }} />
                    <span className="text-sm font-bold text-foreground">מסלולים</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      const cleared: Record<string, string> = {};
                      for (const key of tracksKeys) cleared[key] = "";
                      setTracksValues(cleared);
                    }}
                  >
                    <Eraser className="size-3.5 ml-1" />
                    נקה הכל
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {tracksKeys.map((key) => (
                    <div key={key} className="flex flex-col gap-1.5">
                      <Label className="text-sm font-semibold text-foreground">{getFieldLabel(key)}</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          value={tracksValues[key] ?? ""}
                          onChange={onTrackFieldChange(key)}
                          placeholder="0.00"
                          dir="rtl"
                          className="pl-8"
                          onKeyDown={(e) => { if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault(); }}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">%</span>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {[0, 10, 15, 25, 33, 50, 66, 75, 85, 90, 100].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => handleTrackValue(key, pct === 0 ? "" : String(pct))}
                            className="px-2 py-0.5 text-xs rounded-md border border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {!isTracksSumValid && (
                  <div className="flex justify-end pt-2">
                    <span className="text-xs text-destructive">סכום האחוזים חייב להסתכם ל-100%</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-10 py-6 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between w-full gap-3">
            {selectedRequestTypeId && tracksKeys.length > 0 ? (
              <span
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm transition-colors ${
                  isTracksSumValid ? "bg-chart-5" : "bg-destructive"
                }`}
              >
                סה״כ: {tracksSum.toFixed(2)}%
              </span>
            ) : (
              <span />
            )}
            <div className="flex flex-row-reverse gap-3">
              <Button size="lg" onClick={handleSave} disabled={!isValid || savePhase !== "idle"} className="min-w-[140px]">
                {savePhase !== "idle" && <Loader2 className="animate-spin ml-2" />}
                {savePhase === "saving" ? "שומר..." : savePhase === "processing" ? "מעבד טפסים..." : "שמור שינויים"}
              </Button>
              <Button variant="outline" size="lg" onClick={onClose} disabled={savePhase !== "idle"}>
                ביטול
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};