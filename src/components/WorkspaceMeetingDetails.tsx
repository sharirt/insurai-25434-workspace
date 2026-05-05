import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface Agent {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface WorkspaceMeetingDetailsProps {
  meetingDate: string;
  onMeetingDateChange: (val: string) => void;
  selectedAgentId: string;
  onAgentChange: (val: string) => void;
  notes: string;
  onNotesChange: (val: string) => void;
  agents: Agent[];
  isLoadingAgents: boolean;
}

export const WorkspaceMeetingDetails = ({
  meetingDate,
  onMeetingDateChange,
  selectedAgentId,
  onAgentChange,
  notes,
  onNotesChange,
  agents,
  isLoadingAgents,
}: WorkspaceMeetingDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex items-center justify-center size-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
            1
          </span>
          פרטי הפגישה
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="meeting-date">תאריך ושעה</Label>
          <Input
            id="meeting-date"
            type="datetime-local"
            value={meetingDate}
            onChange={(e) => onMeetingDateChange(e.target.value)}
            dir="ltr"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="meeting-agent">סוכן</Label>
          {isLoadingAgents ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={selectedAgentId} onValueChange={onAgentChange} dir="rtl">
              <SelectTrigger>
                <SelectValue placeholder="בחר סוכן" />
              </SelectTrigger>
              <SelectContent>
                {agents?.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {[agent.firstName, agent.lastName].filter(Boolean).join(" ") || agent.email || "סוכן"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="meeting-notes">הערות</Label>
          <Textarea
            id="meeting-notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="הערות לפגישה..."
            dir="rtl"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};