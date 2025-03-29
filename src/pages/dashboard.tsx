import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const habits = [
  { id: "exercise", label: "Exercice" },
  { id: "meditation", label: "Méditation" },
  { id: "reading", label: "Lecture" },
  { id: "healthy-eating", label: "Alimentation saine" },
  { id: "sleep", label: "Bon rythme de sommeil" },
];

const moods = [
  { emoji: "😔", label: "Triste", value: 1, color: "hsl(var(--chart-1))" },
  { emoji: "😐", label: "Neutre", value: 2, color: "hsl(var(--chart-2))" },
  { emoji: "😁", label: "Heureux", value: 3, color: "hsl(var(--chart-3))" },
];

interface Reflection {
  date: string;
  mood: string | null;
  thoughts: string;
  habits: string[];
}

function prepareMoodData(reflections: Reflection[]) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, "yyyy-MM-dd");
  }).reverse();

  const data = last7Days.map((date) => {
    const dayReflections = reflections.filter(
      (r) => format(new Date(r.date), "yyyy-MM-dd") === date
    );

    const moodCounts = moods.reduce(
      (acc, mood) => ({
        ...acc,
        [mood.label]:
          dayReflections.filter((r) => r.mood === mood.label).length || 0,
      }),
      {}
    );

    return {
      date: format(new Date(date), "dd/MM", { locale: fr }),
      ...moodCounts,
    };
  });

  return data;
}

export function Dashboard() {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [thoughts, setThoughts] = useState("");
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [previousReflections, setPreviousReflections] = useState<Reflection[]>(
    []
  );
  const [moodData, setMoodData] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(`reflections-${user?.id}`);
    if (stored) {
      const reflections = JSON.parse(stored);
      setPreviousReflections(reflections);
      setMoodData(prepareMoodData(reflections));
    }
  }, [user?.id]);

  const handleHabitToggle = (habitId: string) => {
    setSelectedHabits((current) =>
      current.includes(habitId)
        ? current.filter((id) => id !== habitId)
        : [...current, habitId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMood) {
      toast.error("Veuillez sélectionner votre humeur");
      return;
    }

    if (!thoughts.trim()) {
      toast.error("Veuillez partager vos pensées");
      return;
    }

    const newReflection: Reflection = {
      date: new Date().toISOString(),
      mood: selectedMood,
      thoughts,
      habits: selectedHabits,
    };

    const updatedReflections = [newReflection, ...previousReflections];
    localStorage.setItem(
      `reflections-${user?.id}`,
      JSON.stringify(updatedReflections)
    );
    setPreviousReflections(updatedReflections);
    setMoodData(prepareMoodData(updatedReflections));

    setSelectedMood(null);
    setThoughts("");
    setSelectedHabits([]);

    toast.success("Réflexion enregistrée avec succès");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Réflexion Quotidienne</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Comment vous sentez-vous aujourd'hui ?</Label>
              <div className="flex gap-4">
                <TooltipProvider>
                  {moods.map(({ emoji, label }) => (
                    <Tooltip key={label}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            selectedMood === label ? "default" : "outline"
                          }
                          className="text-2xl h-12 w-12"
                          onClick={() => setSelectedMood(label)}
                          type="button"
                        >
                          {emoji}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{label}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thoughts">Partagez vos pensées</Label>
              <Textarea
                id="thoughts"
                placeholder="Qu'avez-vous en tête aujourd'hui ?"
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Habitudes Quotidiennes</Label>
              <div className="grid gap-4 sm:grid-cols-2">
                {habits.map(({ id, label }) => (
                  <div key={id} className="flex items-center space-x-2">
                    <Checkbox
                      id={id}
                      checked={selectedHabits.includes(id)}
                      onCheckedChange={() => handleHabitToggle(id)}
                    />
                    <Label htmlFor={id} className="text-sm font-normal">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Enregistrer la réflexion
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des Humeurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={moodData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  {moods.map((mood) => (
                    <Area
                      key={mood.label}
                      type="monotone"
                      dataKey={mood.label}
                      stackId="1"
                      stroke={mood.color}
                      fill={mood.color}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {moods.map((mood) => (
                <div key={mood.label} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: mood.color }}
                  />
                  <span className="text-sm">
                    {mood.emoji} {mood.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Réflexions Précédentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {previousReflections.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Pas encore de réflexions. Commencez par en ajouter une !
                </p>
              ) : (
                previousReflections.map((reflection, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(reflection.date), "PPP", {
                              locale: fr,
                            })}
                          </span>
                          <span className="text-2xl">
                            {
                              moods.find((m) => m.label === reflection.mood)
                                ?.emoji
                            }
                          </span>
                        </div>
                        <p className="text-sm">{reflection.thoughts}</p>
                        {reflection.habits.length > 0 && (
                          <div className="pt-2">
                            <p className="text-sm font-medium mb-1">
                              Habitudes :
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {reflection.habits.map((habit) => (
                                <span
                                  key={habit}
                                  className="text-xs bg-secondary px-2 py-1 rounded-md"
                                >
                                  {habits.find((h) => h.id === habit)?.label}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
