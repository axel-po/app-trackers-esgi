import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  disabledDates?: Date[];
  placeholder?: string;
}

export function DatePicker({
  date,
  setDate,
  disabledDates,
  placeholder = "Sélectionner une date",
}: DatePickerProps) {
  // Fonction pour vérifier si une date est désactivée
  const isDateDisabled = (date: Date): boolean => {
    return !!disabledDates?.some(
      (disabledDate) =>
        format(disabledDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "dd MMMM yyyy", { locale: fr })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={isDateDisabled}
          initialFocus
          locale={fr}
        />
      </PopoverContent>
    </Popover>
  );
}
