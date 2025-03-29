export interface Reflection {
  date: string;
  mood: string | null;
  thoughts: string;
  habits: string[];
}

export interface MoodSummary {
  label: string;
  value: number;
  color: string;
  emoji: string;
}

export interface HabitSummary {
  name: string;
  value: number;
  color: string;
}

export function prepareMoodSummary(
  reflections: Reflection[],
  moods: { emoji: string; label: string; value: number; color: string }[]
): MoodSummary[] {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const lastMonthReflections = reflections.filter(
    (r) => new Date(r.date) >= oneMonthAgo
  );

  return moods.map((mood) => {
    const count = lastMonthReflections.filter(
      (r) => r.mood === mood.label
    ).length;

    return {
      label: mood.label,
      value: count,
      color: mood.color,
      emoji: mood.emoji,
    };
  });
}

export function prepareHabitSummary(
  reflections: Reflection[],
  habits: { id: string; label: string }[]
): HabitSummary[] {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const lastMonthReflections = reflections.filter(
    (r) => new Date(r.date) >= oneMonthAgo
  );

  return habits.map((habit) => {
    const count = lastMonthReflections.reduce(
      (total, reflection) =>
        reflection.habits.includes(habit.id) ? total + 1 : total,
      0
    );

    const colors = ["#F472B6", "#A78BFA", "#60A5FA", "#34D399", "#FBBF24"];
    const colorIndex =
      habits.findIndex((h) => h.id === habit.id) % colors.length;

    return {
      name: habit.label,
      value: count,
      color: colors[colorIndex],
    };
  });
}
