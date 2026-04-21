import React from "react";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { getFieldLabel } from "@/utils/fieldTranslations";
import type { PendingRequest } from "@/hooks/useNewMeetingWizard";
import { ClipboardPlus, SlidersHorizontal, Pencil, Eraser, Search } from "lucide-react";

interface MeetingAddRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (request: PendingRequest) => void;
  sortedProviders: Array<{ id: string; provider_name?: string }>;
  sortedRequestTypes: Array<{
    id: string;
    requestTypeName?: string;
    tracks?: Record<string, any>;
  }>;
  sortedFunds: Array<{
    id: string;
    planName?: string;
    policyNumber?: string;
    totalBalance?: number;
  }>;
  isLoadingProviders: boolean;
  isLoadingRequestTypes: boolean;
  isLoadingFunds: boolean;
  requestSchemes:
    | Array<{
        id: string;
        requestTypeName?: string;
        tracks?: Record<string, any>;
      }>
    | undefined;
  editingRequest?: PendingRequest;
}

export const MeetingAddRequestDialog = ({
  open,
  onClose,
  onAdd,
  sortedProviders,
  sortedRequestTypes,
  sortedFunds,
  isLoadingProviders,
  isLoadingRequestTypes,
  isLoadingFunds,
  requestSchemes,
  editingRequest,
}: MeetingAddRequestDialogProps) => {
  const isEditMode = !!editingRequest;
  const [selectedFundId, setSelectedFundId] = useState("");
  const [selectedRequestTypeId, setSelectedRequestTypeId] = useState("");
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [tracksValues, setTracksValues] = useState<Record<string, string>>({});
  const [managementFee, setManagementFee] = useState<number | undefined>(
    undefined
  );
  const [choiceDuration, setChoiceDuration] = useState<string>("");
  const [transferType, setTransferType] = useState<string>("צבירה והפקדות");
  const [kerenName, setKerenName] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [isTotalTransfer, setIsTotalTransfer] = useState(true);
  const [requestTypeSearch, setRequestTypeSearch] = useState("");
  const [providerSearch, setProviderSearch] = useState("");

  const lastInitializedRequestTypeIdRef = useRef<string | null>(null);

  const selectedScheme = useMemo(
    () => requestSchemes?.find((rt) => rt.id === selectedRequestTypeId),
    [requestSchemes, selectedRequestTypeId]
  );

  const filteredRequestTypes = sortedRequestTypes.filter((rt) =>
    (rt.requestTypeName || "סוג בקשה ללא שם")
      .toLowerCase()
      .includes(requestTypeSearch.toLowerCase())
  );

  const filteredProviders = sortedProviders.filter((p) =>
    (p.provider_name || "יצרן ללא שם")
      .toLowerCase()
      .includes(providerSearch.toLowerCase())
  );

  const tracksKeys = useMemo(() => {
    if (!selectedScheme?.tracks) return [];
    return Object.keys(selectedScheme.tracks as Record<string, any>);
  }, [selectedScheme]);

  useEffect(() => {
    if (lastInitializedRequestTypeIdRef.current === selectedRequestTypeId) {
      return;
    }
    lastInitializedRequestTypeIdRef.current = selectedRequestTypeId;
    if (selectedScheme?.tracks) {
      const changesObj = selectedScheme.tracks as Record<string, any>;
      const initial: Record<string, string> = {};
      for (const [key, value] of Object.entries(changesObj)) {
        initial[key] = String(value ?? "");
      }
      setTracksValues(initial);
    } else {
      setTracksValues({});
    }
  }, [selectedScheme, selectedRequestTypeId]);

  useEffect(() => {
    if (!open) {
      setSelectedFundId("");
      setSelectedRequestTypeId("");
      setSelectedProviderId("");
      setTracksValues({});
      setManagementFee(undefined);
      lastInitializedRequestTypeIdRef.current = null;
      setChoiceDuration("");
      setTransferType("צבירה והפקדות");
      setKerenName("");
      setTransferAmount("");
      setIsTotalTransfer(true);
      setRequestTypeSearch("");
      setProviderSearch("");
    } else if (open && editingRequest) {
      lastInitializedRequestTypeIdRef.current = editingRequest.requestTypeId ?? "";
      setSelectedFundId(editingRequest.fundId ?? "");
      setSelectedRequestTypeId(editingRequest.requestTypeId ?? "");
      setSelectedProviderId(editingRequest.providerId ?? "");
      setTracksValues(editingRequest.tracks ?? {});
      setManagementFee(editingRequest.managementFee);
      setChoiceDuration(editingRequest.choiceDuration ?? "");
      setTransferType(editingRequest.transferType || "צבירה והפקדות");
      setKerenName(editingRequest.kerenName ?? "");
      if (editingRequest.isTotalTransfer !== undefined) {
        setIsTotalTransfer(editingRequest.isTotalTransfer);
        if (editingRequest.isTotalTransfer === false) {
          setTransferAmount(editingRequest.transferAmount ?? "");
        } else {
          setTransferAmount("");
        }
      } else {
        const ta = editingRequest.transferAmount ?? "";
        if (ta === "" || ta === "true") {
          setIsTotalTransfer(true);
          setTransferAmount("");
        } else {
          setIsTotalTransfer(false);
          setTransferAmount(ta);
        }
      }
    }
  }, [open, editingRequest]);

  const handleTrackValue = useCallback((key: string, value: string) => {
    setTracksValues((prev) => ({ ...prev, [key]: value }));
  }, []);


  const tracksSum = tracksKeys.reduce((sum, key) => {
    const val = parseFloat(tracksValues[key] ?? "");
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const TRACKS_SUM_EPSILON = 0.01;
  const isTracksSumValid =
    tracksKeys.length === 0 ||
    Math.abs(tracksSum - 100) < TRACKS_SUM_EPSILON;

  const isPartialAmountValid =
    isTotalTransfer ||
    (() => {
      const t = transferAmount.trim();
      if (t === "") return false;
      const n = parseFloat(t);
      return !isNaN(n) && n >= 0;
    })();

  const isValid =
    !!selectedRequestTypeId &&
    !!selectedProviderId &&
    isTracksSumValid &&
    isPartialAmountValid;

  const handleAdd = useCallback(() => {
    if (!isValid) return;

    const provider = sortedProviders.find((p) => p.id === selectedProviderId);
    const requestType = sortedRequestTypes.find(
      (rt) => rt.id === selectedRequestTypeId
    );
    const fund = sortedFunds.find((f) => f.id === selectedFundId);

    const newRequest: PendingRequest = {
      id: isEditMode ? editingRequest!.id : crypto.randomUUID(),
      fundId: selectedFundId,
      requestTypeId: selectedRequestTypeId,
      requestTypeName: requestType?.requestTypeName || "סוג בקשה לא ידוע",
      providerId: selectedProviderId,
      providerName: provider?.provider_name || "יצרן לא ידוע",
      fundName: fund?.planName || "",
      ...(fund?.policyNumber != null && fund.policyNumber !== ""
        ? { fundPolicyNumber: fund.policyNumber }
        : {}),
      ...(fund?.totalBalance != null ? { fundTotalBalance: fund.totalBalance } : {}),
      tracks: tracksValues,
      tracksCount: tracksKeys.length,
      managementFee,
      choiceDuration,
      transferType,
      kerenName: kerenName === "-" ? "" : kerenName,
      isTotalTransfer,
      transferAmount: isTotalTransfer ? undefined : transferAmount.trim(),
    };

    onAdd(newRequest);
    onClose();
  }, [
    isValid,
    isEditMode,
    editingRequest,
    selectedFundId,
    selectedRequestTypeId,
    selectedProviderId,
    tracksValues,
    tracksKeys.length,
    managementFee,
    sortedProviders,
    sortedRequestTypes,
    sortedFunds,
    onAdd,
    onClose,
    choiceDuration,
    transferType,
    kerenName,
    transferAmount,
    isTotalTransfer,
  ]);

  const onTrackFieldChange = useCallback(
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val !== "" && Number(val) < 0) return;
      handleTrackValue(key, val);
    },
    [handleTrackValue]
  );

  const handleManagementFeeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val === "") {
        setManagementFee(undefined);
        return;
      }
      const num = Number(val);
      if (num < 0) return;
      setManagementFee(num);
    },
    []
  );

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="p-0 overflow-hidden" dir="rtl" style={{ width: '90vw', maxWidth: '90vw', height: '85vh' }}>
        {/* Prominent Header Strip */}
        <div
          className="relative px-10 pt-10 pb-8 overflow-hidden"
          style={{
            background: isEditMode
              ? "linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(220 20% 30%) 100%)"
              : "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(215 60% 28%) 100%)",
          }}
        >
          {/* Decorative background circles */}
          <div
            className="absolute -top-6 -left-6 w-32 h-32 rounded-full opacity-10"
            style={{ background: "hsl(var(--accent))" }}
          />
          <div
            className="absolute -bottom-4 left-16 w-20 h-20 rounded-full opacity-10"
            style={{ background: "hsl(var(--accent))" }}
          />

          <div className="relative flex items-center gap-4">
            {/* Icon badge */}
            <div
              className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg"
              style={{
                background: "hsl(var(--accent))",
              }}
            >
              {isEditMode ? (
                <Pencil
                  className="w-7 h-7"
                  style={{ color: "hsl(var(--primary))" }}
                />
              ) : (
                <ClipboardPlus
                  className="w-7 h-7"
                  style={{ color: "hsl(var(--primary))" }}
                />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <h2
                className="text-2xl font-bold leading-tight"
                style={{ color: "hsl(var(--primary-foreground))" }}
              >
                {isEditMode ? "עריכת בקשה" : "בקשה חדשה"}
              </h2>
              <p
                className="text-sm font-normal opacity-75"
                style={{ color: "hsl(var(--primary-foreground))" }}
              >
                {isEditMode ? "ערוך את פרטי הבקשה" : "הוסף בקשת ביטוח לפגישה"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-10 pt-8 pb-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 280px)' }}>
          {/* Main fields — 2-column grid on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {/* Fund */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                מוצר
              </Label>
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
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                סוג בקשה
                <span className="text-destructive mr-1">*</span>
              </Label>
              {isLoadingRequestTypes ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={selectedRequestTypeId}
                  onValueChange={(v) => { setSelectedRequestTypeId(v); setRequestTypeSearch(""); }}
                  dir="rtl"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="בחר סוג בקשה" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
                      <Search className="size-4 text-muted-foreground flex-shrink-0" />
                      <input
                        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        placeholder="חפש..."
                        value={requestTypeSearch}
                        onChange={(e) => setRequestTypeSearch(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="max-h-[200px] overflow-y-auto">
                      {filteredRequestTypes.length === 0 ? (
                        <div className="px-3 py-4 text-sm text-muted-foreground text-center">לא נמצאו תוצאות</div>
                      ) : (
                        filteredRequestTypes.map((rt) => (
                          <SelectItem key={rt.id} value={rt.id}>
                            {rt.requestTypeName || "סוג בקשה ללא שם"}
                          </SelectItem>
                        ))
                      )}
                    </div>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Provider */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                יצרן
                <span className="text-destructive mr-1">*</span>
              </Label>
              {isLoadingProviders ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={selectedProviderId}
                  onValueChange={(v) => { setSelectedProviderId(v); setProviderSearch(""); }}
                  dir="rtl"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="בחר יצרן" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
                      <Search className="size-4 text-muted-foreground flex-shrink-0" />
                      <input
                        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        placeholder="חפש..."
                        value={providerSearch}
                        onChange={(e) => setProviderSearch(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="max-h-[200px] overflow-y-auto">
                      {filteredProviders.length === 0 ? (
                        <div className="px-3 py-4 text-sm text-muted-foreground text-center">לא נמצאו תוצאות</div>
                      ) : (
                        filteredProviders.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id}>
                            {provider.provider_name || "יצרן ללא שם"}
                          </SelectItem>
                        ))
                      )}
                    </div>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Management Fee */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                דמי ניהול
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={managementFee ?? ""}
                  onChange={handleManagementFeeChange}
                  placeholder="0.00"
                  dir="rtl"
                  min={0}
                  step={0.01}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "E") {
                      e.preventDefault();
                    }
                  }}
                  className="pl-8"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Choice Duration & Transfer Type — visible only after request type selected */}
          {selectedRequestTypeId && <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-5">
            {/* Choice Duration */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                תקופת בחירה בחודשים
              </Label>
              <Select
                value={choiceDuration}
                onValueChange={setChoiceDuration}
                dir="rtl"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="ללא" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-">ללא</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transfer Type */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                סוג העברה
              </Label>
              <Select
                value={transferType}
                onValueChange={setTransferType}
                dir="rtl"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="ללא" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-">ללא</SelectItem>
                  <SelectItem value="צבירה והפקדות">צבירה והפקדות</SelectItem>
                  <SelectItem value="צבירה בלבד">צבירה בלבד</SelectItem>
                  <SelectItem value="הפקדות בלבד">הפקדות בלבד</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>}

          {/* יתרת העברה (col 1) + שם קרן (col 2) — visible only after request type selected */}
          {selectedRequestTypeId && <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-5">
            {/* יתרת העברה — LEFT column (col 1) */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                יתרת העברה
              </Label>
              <Select
                value={isTotalTransfer ? "full" : "partial"}
                onValueChange={(val) => {
                  if (val === "full") {
                    setIsTotalTransfer(true);
                    setTransferAmount("");
                  } else {
                    setIsTotalTransfer(false);
                  }
                }}
                dir="rtl"
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
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
                    if (v === "") {
                      setTransferAmount("");
                      return;
                    }
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

            {/* שם קרן — RIGHT column (col 2), visually under סוג העברה */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">סטנדרטי</Label>
              <Select
                value={kerenName || "כללי"}
                onValueChange={(val) => setKerenName(val)}
                dir="rtl"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="בחר" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="כללי">כללי</SelectItem>
                  <SelectItem value="אומגה">אומגה</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>}

          {/* Tracks Section */}
          {selectedRequestTypeId && tracksKeys.length > 0 && (
            <div className="mt-6">
              <Separator className="mb-5" />
              <div
                className="rounded-lg p-4 space-y-4"
                style={{ background: "hsl(var(--muted) / 0.4)" }}
              >
                {/* Tracks section header */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal
                      className="w-4 h-4"
                      style={{ color: "hsl(var(--accent-foreground))" }}
                    />
                    <span className="text-sm font-bold text-foreground">
                      מסלולים
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      const cleared: Record<string, string> = {};
                      for (const key of tracksKeys) {
                        cleared[key] = "";
                      }
                      setTracksValues(cleared);
                    }}
                  >
                    <Eraser className="w-3.5 h-3.5 ml-1" />
                    נקה הכל
                  </Button>
                </div>

                {/* Tracks — 2-column grid on md+ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {tracksKeys.map((key) => (
                    <div key={key} className="space-y-1.5">
                      <Label className="text-sm font-semibold text-foreground">
                        {getFieldLabel(key)}
                      </Label>
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
                          onKeyDown={(e) => {
                            if (e.key === "-" || e.key === "e" || e.key === "E") {
                              e.preventDefault();
                            }
                          }}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                          %
                        </span>
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

                {/* Inline error only — sum moved to footer */}
                {!isTracksSumValid && (
                  <div className="flex justify-end pt-2">
                    <span className="text-xs text-destructive">
                      סכום האחוזים חייב להסתכם ל-100%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hint text */}
        <div className="px-10 pt-3 pb-1">
          <p className="text-xs text-muted-foreground text-center">
            {isEditMode ? "השינויים יעודכנו ברשימת הבקשות" : "הבקשה תתווסף לפגישה לאחר האישור"}
          </p>
        </div>

        {/* Footer */}
        <DialogFooter className="px-10 py-6 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between w-full gap-3">
            {/* Total percentage pill — always visible in footer */}
            {selectedRequestTypeId && tracksKeys.length > 0 ? (
              <span
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors ${
                  isTracksSumValid
                    ? "bg-green-600"
                    : "bg-destructive"
                }`}
              >
                סה״כ: {tracksSum.toFixed(2)}%
              </span>
            ) : (
              <span />
            )}

            {/* Action buttons */}
            <div className="flex flex-row-reverse gap-3">
          <Button
            size="lg"
            onClick={handleAdd}
            disabled={!isValid}
            className="flex-1 sm:flex-none min-w-[140px]"
          >
            {isEditMode ? "שמור שינויים" : "הוסף לרשימה"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onClose}
            className="flex-1 sm:flex-none"
          >
            ביטול
          </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};