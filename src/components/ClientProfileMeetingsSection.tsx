import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MeetingCard } from "@/components/MeetingCard";
import { ClientProfileMeetingsTable } from "@/components/ClientProfileMeetingsTable";
import { ViewModeToggle, type ViewMode } from "@/components/ViewModeToggle";
import { MeetingsEntity } from "@/product-types";
import { AlertCircle, Calendar } from "lucide-react";
import { useState } from "react";

type MeetingWithId = typeof MeetingsEntity["instanceType"] & { id: string };

interface ClientProfileMeetingsSectionProps {
  meetings: MeetingWithId[];
  isLoading: boolean;
  error: unknown;
  onDelete: (meeting: typeof MeetingsEntity["instanceType"]) => void;
}

const MeetingsTableSkeleton = ({ rows = 4 }: { rows?: number }) => (
  <div className="rounded-lg border overflow-x-auto" dir="rtl">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="text-right">תאריך ושעה</TableHead>
          <TableHead className="text-right">סטטוס</TableHead>
          <TableHead className="text-right">סוכן</TableHead>
          <TableHead className="text-right">בקשות</TableHead>
          <TableHead className="text-right">הערות</TableHead>
          <TableHead className="text-right">פעולות</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(rows)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-12" /></TableCell>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell><Skeleton className="h-8 w-20" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export const ClientProfileMeetingsSection = ({
  meetings,
  isLoading,
  error,
  onDelete,
}: ClientProfileMeetingsSectionProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">פגישות</h2>
        <ViewModeToggle value={viewMode} onValueChange={setViewMode} />
      </div>

      {isLoading ? (
        viewMode === "list" ? (
          <MeetingsTableSkeleton rows={4} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        )
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            שגיאה בטעינת פרטי הפגישות. אנא נסה שוב מאוחר יותר.
          </AlertDescription>
        </Alert>
      ) : meetings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">אין פגישות עדיין</h3>
            <p className="text-muted-foreground">לא נקבעו פגישות עבור לקוח זה</p>
          </div>
        </div>
      ) : viewMode === "list" ? (
        <ClientProfileMeetingsTable meetings={meetings} onDelete={onDelete} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} onDelete={onDelete} />
          ))}
        </div>
      )}
    </>
  );
};