import { type IIGemelFundsEntity } from '@/product-types';

export const CATEGORY_ORDER = [
  'קרנות השתלמות',
  'קופות גמל',
  'קופת גמל להשקעה',
  'פנסיה',
  'פוליסות חיסכון',
  'חיסכון לכל ילד',
] as const;

export type SortField = 'ret1y' | 'ret3y' | 'ret5y' | 'retTotal' | 'mgmtFee' | 'aumMn' | 'sharpe' | 'name' | 'company' | 'track';
export type SortDir = 'asc' | 'desc';

export function sortFunds(
  funds: IIGemelFundsEntity[],
  field: SortField,
  dir: SortDir
): IIGemelFundsEntity[] {
  return [...funds].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return dir === 'asc' ? aVal - bVal : bVal - aVal;
    }
    const aStr = String(aVal);
    const bStr = String(bVal);
    return dir === 'asc' ? aStr.localeCompare(bStr, 'he') : bStr.localeCompare(aStr, 'he');
  });
}

export function formatReturn(val: number | undefined | null): { text: string; className: string } {
  if (val == null) return { text: '—', className: 'text-muted-foreground' };
  const text = val.toFixed(2) + '%';
  if (val > 0) return { text, className: 'text-green-600' };
  if (val < 0) return { text, className: 'text-red-500' };
  return { text, className: 'text-muted-foreground' };
}

export function formatAum(val: number | undefined | null): string {
  if (val == null) return '—';
  return val.toLocaleString('he-IL') + ' מ׳';
}

export function formatFee(val: number | undefined | null): string {
  if (val == null) return '—';
  return val.toFixed(2) + '%';
}

export function formatSharpe(val: number | undefined | null): string {
  if (val == null) return '—';
  return val.toFixed(2);
}