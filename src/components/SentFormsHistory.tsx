import { useEntityGetAll } from '@blocksdiy/blocks-client-sdk/reactSdk';
import { ClientFormTokensEntity, ClientProfilePage } from '@/product-types';
import { getPageUrl } from '@/lib/utils';
import { Link } from 'react-router';
import { format } from 'date-fns';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { ClientFormTokensEntityStatusEnum } from '@/product-types';

const statusConfig: Record<
  ClientFormTokensEntityStatusEnum,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  pending: { label: 'ממתין', variant: 'default' },
  submitted: { label: 'הוגש', variant: 'secondary' },
  expired: { label: 'פג תוקף', variant: 'outline' },
};

export const SentFormsHistory = () => {
  const { data: tokens, isLoading, refetch } = useEntityGetAll(ClientFormTokensEntity);

  const sorted = [...(tokens ?? [])].sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  );

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return format(new Date(dateStr), 'dd/MM/yyyy HH:mm');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>היסטוריית טפסים שנשלחו</CardTitle>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw data-icon="inline-start" />
            רענן
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : sorted.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            טרם נשלחו טפסים
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם נמען</TableHead>
                  <TableHead>טלפון</TableHead>
                  <TableHead>אימייל</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>תאריך שליחה</TableHead>
                  <TableHead>תאריך הגשה</TableHead>
                  <TableHead>פרופיל</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((token) => {
                  const status = token.status ?? 'pending';
                  const config = statusConfig[status] ?? statusConfig.pending;
                  const linkedClientId = token.createdClientId ?? token.clientId;

                  return (
                    <TableRow key={token.id}>
                      <TableCell className="font-medium">
                        {token.recipientName ?? '-'}
                      </TableCell>
                      <TableCell dir="ltr">{token.recipientPhone ?? '-'}</TableCell>
                      <TableCell>{token.recipientEmail ?? '-'}</TableCell>
                      <TableCell>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(token.createdAt)}</TableCell>
                      <TableCell>{formatDate(token.submittedAt)}</TableCell>
                      <TableCell>
                        {status === 'submitted' && linkedClientId ? (
                          <Link
                            to={getPageUrl(ClientProfilePage, {
                              id: linkedClientId,
                            })}
                          >
                            <Button variant="ghost" size="sm">
                              <ExternalLink data-icon="inline-start" />
                              צפה
                            </Button>
                          </Link>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};