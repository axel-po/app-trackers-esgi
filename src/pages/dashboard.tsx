import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

import { DailyReflectionForm } from "@/components/dashboard/DailyReflectionForm";
import { ReflectionsList } from "@/components/dashboard/ReflectionsList";
import { MoodChart } from "@/components/dashboard/MoodChart";
import { HabitTracker } from "@/components/dashboard/HabitTracker";
import { habits, moods } from "@/lib/constants";
import {
  Reflection,
  MoodSummary,
  HabitSummary,
  prepareMoodSummary,
  prepareHabitSummary,
} from "@/lib/reflection-utils";

export function Dashboard() {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [thoughts, setThoughts] = useState("");
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [previousReflections, setPreviousReflections] = useState<Reflection[]>(
    []
  );
  const [moodSummary, setMoodSummary] = useState<MoodSummary[]>([]);
  const [habitSummary, setHabitSummary] = useState<HabitSummary[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReflectionIndex, setEditingReflectionIndex] = useState<
    number | null
  >(null);
  const [editingHabits, setEditingHabits] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(`reflections-${user?.id}`);
    if (stored) {
      const reflections = JSON.parse(stored);
      setPreviousReflections(reflections);
      setMoodSummary(prepareMoodSummary(reflections, moods));
      setHabitSummary(prepareHabitSummary(reflections, habits));
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
    setMoodSummary(prepareMoodSummary(updatedReflections, moods));
    setHabitSummary(prepareHabitSummary(updatedReflections, habits));

    setSelectedMood(null);
    setThoughts("");
    setSelectedHabits([]);
    setDialogOpen(false);

    toast.success("Réflexion enregistrée avec succès");
  };

  const openHabitsDialog = (reflectionIndex: number) => {
    const reflection = previousReflections[reflectionIndex];
    setEditingReflectionIndex(reflectionIndex);
    setEditingHabits([...reflection.habits]);
  };

  const handleHabitEditToggle = (habitId: string) => {
    setEditingHabits((current) =>
      current.includes(habitId)
        ? current.filter((id) => id !== habitId)
        : [...current, habitId]
    );
  };

  const saveHabitsChanges = () => {
    if (editingReflectionIndex === null) return;

    setPreviousReflections((current) => {
      const updatedReflections = [...current];
      updatedReflections[editingReflectionIndex].habits = [...editingHabits];

      localStorage.setItem(
        `reflections-${user?.id}`,
        JSON.stringify(updatedReflections)
      );

      setMoodSummary(prepareMoodSummary(updatedReflections, moods));
      setHabitSummary(prepareHabitSummary(updatedReflections, habits));

      return updatedReflections;
    });

    setEditingReflectionIndex(null);
    toast.success("Habitudes mises à jour avec succès");
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            Bonjour {user?.email ? user.email.split("@")[0] : "Axel"} 👋
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div className="mt-4">
            <Button
              size="sm"
              className="h-9"
              onClick={() => setDialogOpen(true)}
            >
              <PlusIcon className="h-4 w-4 mr-1" /> Ajouter
            </Button>
          </div>
        </div>
      </div>

      <ReflectionsList
        reflections={previousReflections}
        editingHabits={editingHabits}
        onOpenHabitsDialog={openHabitsDialog}
        onHabitEditToggle={handleHabitEditToggle}
        onSaveHabits={saveHabitsChanges}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MoodChart moodSummary={moodSummary} />
        <HabitTracker habitSummary={habitSummary} />
      </div>

      <DailyReflectionForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedMood={selectedMood}
        setSelectedMood={setSelectedMood}
        thoughts={thoughts}
        setThoughts={setThoughts}
        selectedHabits={selectedHabits}
        onHabitToggle={handleHabitToggle}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
