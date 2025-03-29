export interface Reflection {
  id?: string;
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

export type DateFilter = "week" | "month" | "year";

export function prepareHabitSummaryWithFilter(
  reflections: Reflection[],
  habits: { id: string; label: string }[],
  filter: DateFilter = "week"
): HabitSummary[] {
  const cutoffDate = new Date();

  switch (filter) {
    case "week":
      cutoffDate.setDate(cutoffDate.getDate() - 7);
      break;
    case "month":
      cutoffDate.setMonth(cutoffDate.getMonth() - 1);
      break;
    case "year":
      cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
      break;
  }

  const filteredReflections = reflections.filter(
    (r) => new Date(r.date) >= cutoffDate
  );

  return habits.map((habit) => {
    const count = filteredReflections.reduce(
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

export function prepareHabitSummary(
  reflections: Reflection[],
  habits: { id: string; label: string }[]
): HabitSummary[] {
  return prepareHabitSummaryWithFilter(reflections, habits, "week");
}

// Function to generate fake reflections for 15 days fake data
export function generateFakeReflections(
  habits: { id: string; label: string }[],
  moods: { emoji: string; label: string; value: number; color: string }[]
): Reflection[] {
  const reflections: Reflection[] = [];
  const thoughts = [
    "Aujourd'hui était une journée formidable, j'ai beaucoup accompli.",
    "Journée assez moyenne, mais j'ai pu méditer un peu.",
    "Journée stressante au travail, mais j'ai bien géré.",
    "J'ai eu du mal à me concentrer aujourd'hui, mais la lecture a aidé.",
    "Excellente journée productive, je me sens satisfait.",
    "Journée difficile émotionnellement, mais j'ai fait de l'exercice.",
    "Beaucoup de défis aujourd'hui, mais j'ai gardé une alimentation saine.",
    "Une journée ordinaire, j'ai surtout travaillé sur mes projets.",
    "J'ai eu l'occasion de me détendre et de voir des amis.",
    "Journée fatigante mais j'ai bien dormi ensuite.",
    "J'ai pu faire du sport et me sentir énergique toute la journée.",
    "J'ai profité d'un moment calme pour réfléchir à mes objectifs.",
    "J'ai pris le temps de cuisiner un bon repas équilibré.",
    "Journée chargée mais productive, j'ai coché toutes les tâches de ma liste.",
    "J'ai passé du temps de qualité avec ma famille aujourd'hui.",
  ];

  for (let i = 0; i < 15; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const randomMoodIndex = Math.floor(Math.random() * moods.length);
    const randomMood = moods[randomMoodIndex].label;

    const randomHabitsCount = Math.floor(Math.random() * 4) + 1;
    const shuffledHabits = [...habits]
      .sort(() => 0.5 - Math.random())
      .slice(0, randomHabitsCount);
    const selectedHabits = shuffledHabits.map((habit) => habit.id);

    const randomThoughtsIndex = Math.floor(Math.random() * thoughts.length);

    const reflection: Reflection = {
      date: date.toISOString(),
      mood: randomMood,
      thoughts: thoughts[randomThoughtsIndex],
      habits: selectedHabits,
    };

    reflections.push(reflection);
  }

  return reflections;
}
