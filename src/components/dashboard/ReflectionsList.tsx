import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { habits, moods } from "@/lib/constants";
import { Reflection } from "@/lib/reflection-utils";

interface ReflectionsListProps {
  reflections: Reflection[];
  editingHabits: string[];
  onOpenHabitsDialog: (index: number) => void;
  onHabitEditToggle: (habitId: string) => void;
  onSaveHabits: () => void;
}

export function ReflectionsList({
  reflections,
  editingHabits,
  onOpenHabitsDialog,
  onHabitEditToggle,
  onSaveHabits,
}: ReflectionsListProps) {
  return (
    <Card className="shadow-none border">
      <CardHeader>
        <CardTitle>Réflexions Précédentes</CardTitle>
      </CardHeader>
      <CardContent>
        {reflections.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Pas encore de réflexions. Commencez par en ajouter une !
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium">Date</th>
                  <th className="text-left py-2 px-3 font-medium">
                    Description
                  </th>
                  <th className="text-left py-2 px-3 font-medium">Humeur</th>
                  <th className="text-center py-2 px-3 font-medium">
                    Habitudes
                  </th>
                </tr>
              </thead>
              <tbody>
                {reflections.map((reflection, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-3 text-sm text-muted-foreground">
                      {format(new Date(reflection.date), "dd MMM yyyy", {
                        locale: fr,
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <p className="text-sm">{reflection.thoughts}</p>
                    </td>
                    <td className="py-3 px-3 text-2xl">
                      {moods.find((m) => m.label === reflection.mood)?.emoji}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex gap-2 items-center justify-center">
                        <div className="text-sm">
                          {reflection.habits.length} / {habits.length}
                        </div>
                        <Dialog>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => onOpenHabitsDialog(index)}
                          >
                            <Pencil2Icon className="h-4 w-4" />
                          </Button>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Habitudes du{" "}
                                {format(
                                  new Date(reflection.date),
                                  "dd MMMM yyyy",
                                  {
                                    locale: fr,
                                  }
                                )}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                {habits.map(({ id, label }) => (
                                  <div
                                    key={id}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={`edit-${id}`}
                                      checked={editingHabits.includes(id)}
                                      onCheckedChange={() =>
                                        onHabitEditToggle(id)
                                      }
                                    />
                                    <Label
                                      htmlFor={`edit-${id}`}
                                      className="text-sm font-normal"
                                    >
                                      {label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button onClick={onSaveHabits}>
                                  Enregistrer
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
