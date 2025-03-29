import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HabitSummary } from "@/lib/reflection-utils";

interface HabitTrackerProps {
  habitSummary: HabitSummary[];
}

export function HabitTracker({ habitSummary }: HabitTrackerProps) {
  const sortedHabits = [...habitSummary].sort((a, b) => b.value - a.value);

  const maxValue = Math.max(...habitSummary.map((habit) => habit.value), 1);

  return (
    <Card className="shadow-none border">
      <CardHeader>
        <CardTitle>Suivi des Habitudes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedHabits.map((habit) => (
            <div key={habit.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{habit.name}</span>
                <span className="text-sm text-muted-foreground">
                  {habit.value} jour{habit.value > 1 ? "s" : ""}
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
            Nombre de jours où l'habitude a été pratiquée ce mois-ci
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
