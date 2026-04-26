import React, { useCallback, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FundCombobox } from "@/components/FundCombobox";

interface WizardStep1ContentProps {
  selectedProviderId: string;
  setSelectedProviderId: (val: string) => void;
  selectedRequestTypeId: string;
  setSelectedRequestTypeId: (val: string) => void;
  selectedFundId: string;
  setSelectedFundId: (val: string) => void;
  managementFee: number | undefined;
  setManagementFee: (val: number | undefined) => void;
  choiceDuration: string;
  setChoiceDuration: (val: string) => void;
  transferType: string;
  setTransferType: (val: string) => void;
  kerenName: string;
  setKerenName: (val: string) => void;
  transferAmount: string;
  setTransferAmount: (val: string) => void;
  standing: string;
  setStanding: (val: string) => void;
  isLoadingProviders: boolean;
  isLoadingRequestTypes: boolean;
  isLoadingFunds: boolean;
  sortedProviders: Array<{ id: string; provider_name?: string }>;
  sortedRequestTypes: Array<{ id: string; requestTypeName?: string }>;
  sortedFunds: Array<{ id: string; planName?: string; policyNumber?: string }>;
}

export const WizardStep1Content = ({
  selectedProviderId,
  setSelectedProviderId,
  selectedRequestTypeId,
  setSelectedRequestTypeId,
  selectedFundId,
  setSelectedFundId,
  managementFee,
  setManagementFee,
  choiceDuration,
  setChoiceDuration,
  transferType,
  setTransferType,
  kerenName,
  setKerenName,
  transferAmount,
  setTransferAmount,
  standing,
  setStanding,
  isLoadingProviders,
  isLoadingRequestTypes,
  isLoadingFunds,
  sortedProviders,
  sortedRequestTypes,
  sortedFunds,
}: WizardStep1ContentProps) => {
  const [transferAmountMode, setTransferAmountMode] = useState<"none" | "all" | "partial">(() => {
    if (transferAmount === "true") return "all";
    if (transferAmount && transferAmount !== "") return "partial";
    return "none";
  });

  const handleManagementFeeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setManagementFee(val === "" ? undefined : Number(val));
    },
    [setManagementFee]
  );

  const handleChoiceDurationChange = useCallback(
    (val: string) => {
      setChoiceDuration(val === "-" ? "" : val);
    },
    [setChoiceDuration]
  );

  const handleTransferTypeChange = useCallback(
    (val: string) => {
      setTransferType(val === "-" ? "" : val);
    },
    [setTransferType]
  );

  const handleKerenNameChange = useCallback(
    (val: string) => {
      setKerenName(val === "-" ? "" : val);
    },
    [setKerenName]
  );

  const handleTransferAmountModeChange = useCallback(
    (val: string) => {
      if (val === "-") {
        setTransferAmountMode("none");
        setTransferAmount("");
      } else if (val === "true") {
        setTransferAmountMode("all");
        setTransferAmount("true");
      } else {
        setTransferAmountMode("partial");
        setTransferAmount("");
      }
    },
    [setTransferAmount]
  );

  const handlePartialAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTransferAmount(e.target.value);
    },
    [setTransferAmount]
  );

  const transferAmountSelectValue =
    transferAmountMode === "all"
      ? "true"
      : transferAmountMode === "partial"
      ? "partial"
      : "-";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-medium">מוצר</Label>
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

      <div className="space-y-2">
        <Label className="text-base font-medium">סוג בקשה</Label>
        {isLoadingRequestTypes ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            value={selectedRequestTypeId}
            onValueChange={setSelectedRequestTypeId}
            dir="rtl"
          >
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

      <div className="space-y-2">
        <Label className="text-base font-medium">יצרן</Label>
        {isLoadingProviders ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            value={selectedProviderId}
            onValueChange={setSelectedProviderId}
            dir="rtl"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="בחר יצרן" />
            </SelectTrigger>
            <SelectContent>
              {sortedProviders.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.provider_name || "יצרן ללא שם"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium">דמי ניהול</Label>
        <Input
          type="number"
          value={managementFee ?? ""}
          onChange={handleManagementFeeChange}
          placeholder="הזן דמי ניהול (אופציונלי)"
          dir="rtl"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium">תקופת בחירה בחודשים</Label>
        <Select
          value={choiceDuration || "-"}
          onValueChange={handleChoiceDurationChange}
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

      <div className="space-y-2">
        <Label className="text-base font-medium">סוג העברה</Label>
        <Select
          value={transferType || "-"}
          onValueChange={handleTransferTypeChange}
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

      <div className="space-y-2">
        <Label className="text-base font-medium">שם קרן</Label>
        <Select
          value={kerenName || "-"}
          onValueChange={handleKerenNameChange}
          dir="rtl"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="ללא" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-">ללא</SelectItem>
            <SelectItem value="כללי">כללי</SelectItem>
            <SelectItem value="אומגה">אומגה</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium">מעמד</Label>
        <Select value={standing || "-"} onValueChange={(val) => setStanding(val === "-" ? "" : val)} dir="rtl">
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

      <div className="space-y-2">
        <Label className="text-base font-medium">יתרת העברה</Label>
        <Select
          value={transferAmountSelectValue}
          onValueChange={handleTransferAmountModeChange}
          dir="rtl"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="ללא" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-">ללא</SelectItem>
            <SelectItem value="true">כל הסכום</SelectItem>
            <SelectItem value="partial">סכום חלקי</SelectItem>
          </SelectContent>
        </Select>
        {transferAmountMode === "partial" && (
          <Input
            type="text"
            value={transferAmount}
            onChange={handlePartialAmountChange}
            onKeyDown={(e) => {
              const allowed = [
                "0","1","2","3","4","5","6","7","8","9",".",
                "Backspace","Delete","ArrowLeft","ArrowRight","Tab","Home","End",
              ];
              if (!allowed.includes(e.key)) {
                e.preventDefault();
              }
            }}
            placeholder="הכנס סכום"
            dir="rtl"
            className="mt-2"
          />
        )}
      </div>
    </div>
  );
};