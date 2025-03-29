import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HabitSummary, DateFilter } from "@/lib/reflection-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HabitTrackerProps {
  habitSummary: HabitSummary[];
  onFilterChange: (filter: DateFilter) => void;
  currentFilter: DateFilter;
}

export function HabitTracker({
  habitSummary,
  onFilterChange,
  currentFilter,
}: HabitTrackerProps) {
  const sortedHabits = [...habitSummary].sort((a, b) => b.value - a.value);

  let defaultMaxValue = 7;
  if (currentFilter === "month") defaultMaxValue = 30;
  if (currentFilter === "year") defaultMaxValue = 365;

  const actualMaxValue = Math.max(
    ...habitSummary.map((habit) => habit.value),
    1
  );
  const maxValue = Math.max(defaultMaxValue, actualMaxValue);

  const filterLabels = {
    week: "7 derniers jours",
    month: "30 derniers jours",
    year: "365 derniers jours",
  };

  return (
    <Card className="shadow-none border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Suivi des Habitudes</CardTitle>
        <Select
          value={currentFilter}
          onValueChange={(value) => onFilterChange(value as DateFilter)}
        >
          <SelectTrigger className="w-[180px] h-8">
            <SelectValue placeholder="Sélectionner une période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">7 derniers jours</SelectItem>
            <SelectItem value="month">30 derniers jours</SelectItem>
            <SelectItem value="year">365 derniers jours</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedHabits.map((habit) => (
            <div key={habit.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{habit.name}</span>
                <span className="text-sm text-muted-foreground">
                  {habit.value}/{defaultMaxValue} jour
                  {habit.value > 1 ? "s" : ""}
                </span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${(habit.value / maxValue) * 100}%`,
                    backgroundColor: habit.color,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Nombre de jours où l'habitude a été pratiquée sur les{" "}
            {filterLabels[currentFilter]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
