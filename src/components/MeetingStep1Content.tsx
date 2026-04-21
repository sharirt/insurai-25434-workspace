import React from "react";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MeetingStep1ContentProps {
  meetingDate: string;
  setMeetingDate: (val: string) => void;
  selectedAgentId: string;
  setSelectedAgentId: (val: string) => void;
  meetingNotes: string;
  setMeetingNotes: (val: string) => void;
  isAgentAutoFilled: boolean;
  isLoadingAgents: boolean;
  sortedAgents: Array<{ id: string; firstName?: string; lastName?: string; agentName?: string; email?: string }>;
}

export const MeetingStep1Content = ({
  meetingDate,
  setMeetingDate,
  selectedAgentId,
  setSelectedAgentId,
  meetingNotes,
  setMeetingNotes,
  isAgentAutoFilled,
  isLoadingAgents,
  sortedAgents,
}: MeetingStep1ContentProps) => {
  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMeetingDate(e.target.value);
    },
    [setMeetingDate]
  );

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMeetingNotes(e.target.value);
    },
    [setMeetingNotes]
  );

  return (
    <div className="space-y-6">
      {/* Date & Time */}
      <div className="space-y-2">
        <Label htmlFor="meetingDate" className="text-base font-medium">
          תאריך ושעת פגישה
        </Label>
        <Input
          id="meetingDate"
          type="datetime-local"
          value={meetingDate}
          onChange={handleDateChange}
          dir="rtl"
        />
      </div>

      {/* Agent */}
      <div className="space-y-2">
        <Label className="text-base font-medium">סוכן</Label>
        {isLoadingAgents ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            value={selectedAgentId}
            onValueChange={setSelectedAgentId}
            disabled={isAgentAutoFilled}
            dir="rtl"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="בחר סוכן" />
            </SelectTrigger>
            <SelectContent>
              {sortedAgents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {[agent.firstName, agent.lastName].filter(Boolean).join(' ').trim() || "סוכן ללא שם"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {isAgentAutoFilled && (
          <Alert className="mt-2">
            <Info className="h-4 w-4" />
            <AlertDescription>
              הסוכן מולא אוטומטית על פי המשתמש המחובר
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="meetingNotes" className="text-base font-medium">
          הערות
        </Label>
        <Textarea
          id="meetingNotes"
          value={meetingNotes}
          onChange={handleNotesChange}
          placeholder="הזן הערות לפגישה (אופציונלי)"
          rows={4}
          dir="rtl"
        />
      </div>
    </div>
  );
};