import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { habits, moods } from "@/lib/constants";
import {
  Reflection,
  MoodSummary,
  HabitSummary,
  prepareMoodSummary,
  generateFakeReflections,
  DateFilter,
  prepareHabitSummaryWithFilter,
} from "@/lib/reflection-utils";

export function useReflections() {
  const { user } = useAuth();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>("week");
  const [moodSummary, setMoodSummary] = useState<MoodSummary[]>([]);
  const [habitSummary, setHabitSummary] = useState<HabitSummary[]>([]);
  const [editingReflectionIndex, setEditingReflectionIndex] = useState<
    number | null
  >(null);
  const [editingHabits, setEditingHabits] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(`reflections-${user?.id}`);
    let reflections: Reflection[] = [];

    if (stored) {
      reflections = JSON.parse(stored);
    } else {
      reflections = generateFakeReflections(habits, moods);
      localStorage.setItem(
        `reflections-${user?.id}`,
        JSON.stringify(reflections)
      );
    }

    setReflections(reflections);
    setMoodSummary(prepareMoodSummary(reflections, moods));
    setHabitSummary(
      prepareHabitSummaryWithFilter(reflections, habits, dateFilter)
    );
  }, [user?.id, dateFilter]);

  const handleFilterChange = (filter: DateFilter) => {
    setDateFilter(filter);
    setHabitSummary(prepareHabitSummaryWithFilter(reflections, habits, filter));
  };

  const addReflection = (newReflection: Reflection) => {
    const formattedDate = new Date(newReflection.date)
      .toISOString()
      .split("T")[0];
    const existingReflection = reflections.find(
      (r) => r.date.split("T")[0] === formattedDate
    );

    if (existingReflection) {
      toast.error("Une réflexion existe déjà pour cette date");
      return false;
    }

    const updatedReflections = [newReflection, ...reflections];
    setReflections(updatedReflections);
    localStorage.setItem(
      `reflections-${user?.id}`,
      JSON.stringify(updatedReflections)
    );

    setMoodSummary(prepareMoodSummary(updatedReflections, moods));
    setHabitSummary(
      prepareHabitSummaryWithFilter(updatedReflections, habits, dateFilter)
    );

    toast.success("Réflexion enregistrée avec succès !");
    return true;
  };

  const openHabitsDialog = (reflectionIndex: number) => {
    const reflection = reflections[reflectionIndex];
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

    setReflections((current) => {
      const updatedReflections = [...current];
      updatedReflections[editingReflectionIndex].habits = [...editingHabits];

      localStorage.setItem(
        `reflections-${user?.id}`,
        JSON.stringify(updatedReflections)
      );

      setMoodSummary(prepareMoodSummary(updatedReflections, moods));
      setHabitSummary(
        prepareHabitSummaryWithFilter(updatedReflections, habits, dateFilter)
      );

      return updatedReflections;
    });

    setEditingReflectionIndex(null);
    toast.success("Habitudes mises à jour avec succès");
  };

  const resetData = () => {
    const fakeReflections = generateFakeReflections(habits, moods);
    localStorage.setItem(
      `reflections-${user?.id}`,
      JSON.stringify(fakeReflections)
    );
    setReflections(fakeReflections);
    setMoodSummary(prepareMoodSummary(fakeReflections, moods));
    setHabitSummary(
      prepareHabitSummaryWithFilter(fakeReflections, habits, dateFilter)
    );
    toast.success("Données réinitialisées avec des exemples pour 15 jours");
  };

  const deleteAllData = () => {
    localStorage.removeItem(`reflections-${user?.id}`);
    setReflections([]);
    setMoodSummary(prepareMoodSummary([], moods));
    setHabitSummary(prepareHabitSummaryWithFilter([], habits, dateFilter));
    toast.success("Toutes les données ont été supprimées");
  };

  const deleteReflection = (index: number) => {
    const updatedReflections = [...reflections];
    updatedReflections.splice(index, 1);

    setReflections(updatedReflections);
    localStorage.setItem(
      `reflections-${user?.id}`,
      JSON.stringify(updatedReflections)
    );

    setMoodSummary(prepareMoodSummary(updatedReflections, moods));
    setHabitSummary(
      prepareHabitSummaryWithFilter(updatedReflections, habits, dateFilter)
    );

    toast.success("Réflexion supprimée avec succès");
  };

  return {
    reflections,
    moodSummary,
    habitSummary,
    dateFilter,
    editingHabits,
    handleFilterChange,
    addReflection,
    openHabitsDialog,
    handleHabitEditToggle,
    saveHabitsChanges,
    resetData,
    deleteAllData,
    deleteReflection,
  };
}
