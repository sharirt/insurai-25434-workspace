import { type IIGemelFundsEntity } from '@/product-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { type SortField, type SortDir, formatReturn, formatAum, formatFee, formatSharpe } from '@/utils/IGemelUtils';

interface IGemelTableProps {
  funds: IIGemelFundsEntity[];
  isLoading: boolean;
  sortField: SortField;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
}

const COLUMNS: { key: SortField; label: string }[] = [
  { key: 'name', label: 'שם הקופה' },
  { key: 'company', label: 'חברה מנהלת' },
  { key: 'track', label: 'מסלול' },
  { key: 'ret1y', label: 'תשואה שנה' },
  { key: 'ret3y', label: 'תשואה 3 שנים' },
  { key: 'ret5y', label: 'תשואה 5 שנים' },
  { key: 'retTotal', label: 'תשואה מצטברת' },
  { key: 'mgmtFee', label: 'דמי ניהול' },
  { key: 'aumMn', label: 'גודל קופה' },
  { key: 'sharpe', label: 'שארפ' },
];

export const IGemelTable = ({ funds, isLoading, sortField, sortDir, onSort }: IGemelTableProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (funds.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        לא נמצאו קרנות התואמות לחיפוש
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted">
          <TableRow>
            {COLUMNS.map((col) => (
              <TableHead
                key={col.key}
                className="cursor-pointer select-none whitespace-nowrap text-right"
                onClick={() => onSort(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {sortField === col.key && (
                    sortDir === 'asc' ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
                  )}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {funds.map((fund, idx) => {
            const ret1y = formatReturn(fund.ret1y);
            const ret3y = formatReturn(fund.ret3y);
            const ret5y = formatReturn(fund.ret5y);
            const retTotal = formatReturn(fund.retTotal);
            return (
              <TableRow key={fund.fundId ?? idx} className="hover:bg-muted/50">
                <TableCell className="whitespace-nowrap">
                  {fund.fundUrl ? (
                    <a
                      href={fund.fundUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {fund.name ?? '—'}
                    </a>
                  ) : (
                    fund.name ?? '—'
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap">{fund.company ?? '—'}</TableCell>
                <TableCell className="whitespace-nowrap">{fund.track ?? '—'}</TableCell>
                <TableCell className={ret1y.className}>{ret1y.text}</TableCell>
                <TableCell className={ret3y.className}>{ret3y.text}</TableCell>
                <TableCell className={ret5y.className}>{ret5y.text}</TableCell>
                <TableCell className={retTotal.className}>{retTotal.text}</TableCell>
                <TableCell>{formatFee(fund.mgmtFee)}</TableCell>
                <TableCell className="whitespace-nowrap">{formatAum(fund.aumMn)}</TableCell>
                <TableCell>{formatSharpe(fund.sharpe)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};