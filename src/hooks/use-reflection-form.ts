import { useState, FormEvent } from "react";
import { Reflection } from "@/lib/reflection-utils";

export function useReflectionForm(
  onSubmitReflection: (reflection: Reflection) => boolean
) {
  const [open, setOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [thoughts, setThoughts] = useState("");
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const handleHabitToggle = (habitId: string) => {
    setSelectedHabits((current) =>
      current.includes(habitId)
        ? current.filter((id) => id !== habitId)
        : [...current, habitId]
    );
  };

  const resetForm = () => {
    setSelectedMood(null);
    setThoughts("");
    setSelectedHabits([]);
    setSelectedDate(new Date());
    setOpen(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (selectedMood && thoughts && selectedDate) {
      const newReflection: Reflection = {
        date: selectedDate.toISOString(),
        mood: selectedMood,
        thoughts,
        habits: selectedHabits,
      };

      const success = onSubmitReflection(newReflection);

      if (success) {
        resetForm();
      }
    }
  };

  return {
    open,
    setOpen,
    selectedMood,
    setSelectedMood,
    thoughts,
    setThoughts,
    selectedHabits,
    selectedDate,
    setSelectedDate,
    handleHabitToggle,
    handleSubmit,
    resetForm,
  };
}
