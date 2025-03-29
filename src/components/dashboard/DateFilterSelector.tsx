import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { DateFilter } from "@/lib/reflection-utils";

interface DateFilterSelectorProps {
  value: DateFilter;
  onChange: (value: DateFilter) => void;
}

export function DateFilterSelector({
  value,
  onChange,
}: DateFilterSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Période:</span>
      <Select
        value={value}
        onValueChange={(val) => onChange(val as DateFilter)}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Sélectionner une période" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="week">7 jours</SelectItem>
          <SelectItem value="month">30 jours</SelectItem>
          <SelectItem value="year">1 an</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export type { DateFilter };
