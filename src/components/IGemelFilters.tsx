import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface IGemelFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  companies: string[];
  selectedCompany: string;
  onCompanyChange: (val: string) => void;
  tracks: string[];
  selectedTrack: string;
  onTrackChange: (val: string) => void;
}

export const IGemelFilters = ({
  search,
  onSearchChange,
  companies,
  selectedCompany,
  onCompanyChange,
  tracks,
  selectedTrack,
  onTrackChange,
}: IGemelFiltersProps) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="חיפוש לפי שם קופה..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-10"
        />
      </div>
      <Select value={selectedCompany} onValueChange={onCompanyChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="כל החברות" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">כל החברות</SelectItem>
          {companies.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedTrack} onValueChange={onTrackChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="כל המסלולים" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">כל המסלולים</SelectItem>
          {tracks.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};