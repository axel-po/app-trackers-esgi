import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

import { DailyReflectionForm } from "@/components/dashboard/DailyReflectionForm";
import { ReflectionsList } from "@/components/dashboard/ReflectionsList";
import { MoodChart } from "@/components/dashboard/MoodChart";
import { HabitTracker } from "@/components/dashboard/HabitTracker";
import { DateFilterSelector } from "@/components/dashboard/DateFilterSelector";
import { Footer } from "@/components/dashboard/Footer";
import { useReflections } from "@/hooks/use-reflections";
import { useReflectionForm } from "@/hooks/use-reflection-form";

export function Dashboard() {
  const { user } = useAuth();
  const username = user?.email ? user.email.split("@")[0] : "Axel";
  const formattedDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const {
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
  } = useReflections();

  const {
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
  } = useReflectionForm(addReflection);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <span>👋</span> Bonjour {username}
      </h1>
      <p className="text-muted-foreground">{formattedDate}</p>

      <div className="flex justify-between items-center">
        <Button onClick={() => setOpen(true)} className="bg-primary">
          <PlusIcon className="mr-2 h-4 w-4" />
          Nouvelle réflexion quotidienne
        </Button>
        <DateFilterSelector value={dateFilter} onChange={handleFilterChange} />
      </div>

      <ReflectionsList
        reflections={reflections}
        editingHabits={editingHabits}
        onOpenHabitsDialog={openHabitsDialog}
        onHabitEditToggle={handleHabitEditToggle}
        onSaveHabits={saveHabitsChanges}
        onDeleteReflection={deleteReflection}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MoodChart moodSummary={moodSummary} />
        <HabitTracker
          habitSummary={habitSummary}
          onFilterChange={handleFilterChange}
          currentFilter={dateFilter}
        />
      </div>

      <Footer onResetData={resetData} onDeleteAllData={deleteAllData} />

      <DailyReflectionForm
        open={open}
        onOpenChange={setOpen}
        selectedMood={selectedMood}
        setSelectedMood={setSelectedMood}
        thoughts={thoughts}
        setThoughts={setThoughts}
        selectedHabits={selectedHabits}
        onHabitToggle={handleHabitToggle}
        onSubmit={handleSubmit}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        existingReflections={reflections}
      />
    </div>
  );
}
