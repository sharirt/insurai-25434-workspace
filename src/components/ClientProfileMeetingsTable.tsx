import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MeetingsEntity } from "@/product-types";
import { ClientProfileMeetingTableRow } from "@/components/ClientProfileMeetingTableRow";

interface ClientProfileMeetingsTableProps {
  meetings: (typeof MeetingsEntity["instanceType"] & { id: string })[];
  onDelete?: (meeting: typeof MeetingsEntity["instanceType"]) => void;
}

export const ClientProfileMeetingsTable = ({
  meetings,
  onDelete,
}: ClientProfileMeetingsTableProps) => {
  return (
    <div className="rounded-lg border overflow-x-auto" dir="rtl">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-right whitespace-nowrap">תאריך ושעה</TableHead>
            <TableHead className="text-right whitespace-nowrap">סטטוס</TableHead>
            <TableHead className="text-right whitespace-nowrap">סוכן</TableHead>
            <TableHead className="text-right whitespace-nowrap">בקשות</TableHead>
            <TableHead className="text-right whitespace-nowrap">הערות</TableHead>
            <TableHead className="text-right whitespace-nowrap w-[1%]">פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meetings.map((meeting) => (
            <ClientProfileMeetingTableRow
              key={meeting.id}
              meeting={meeting}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};