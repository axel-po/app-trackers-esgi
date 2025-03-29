import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { habits, moods } from "@/lib/constants";
import { Reflection } from "@/lib/reflection-utils";

interface ReflectionsListProps {
  reflections: Reflection[];
  editingHabits: string[];
  onOpenHabitsDialog: (index: number) => void;
  onHabitEditToggle: (habitId: string) => void;
  onSaveHabits: () => void;
  onDeleteReflection?: (index: number) => void;
}

export function ReflectionsList({
  reflections,
  editingHabits,
  onOpenHabitsDialog,
  onHabitEditToggle,
  onSaveHabits,
  onDeleteReflection,
}: ReflectionsListProps) {
  const ITEMS_PER_PAGE = 7;
  const [currentPage, setCurrentPage] = useState(1);

  const sortedReflections = [...reflections].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalPages = Math.ceil(sortedReflections.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentReflections = sortedReflections.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const generatePaginationLinks = () => {
    const links = [];

    const maxLinks = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxLinks / 2));
    const endPage = Math.min(totalPages, startPage + maxLinks - 1);

    if (endPage - startPage + 1 < maxLinks && startPage > 1) {
      startPage = Math.max(1, endPage - maxLinks + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => goToPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return links;
  };

  return (
    <Card className="shadow-none border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Réflexions Précédentes</CardTitle>
        {sortedReflections.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Affichage {startIndex + 1}-
            {Math.min(endIndex, sortedReflections.length)} sur{" "}
            {sortedReflections.length}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {sortedReflections.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Pas encore de réflexions. Commencez par en ajouter une !
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium">Date</th>
                    <th className="text-left py-2 px-3 font-medium">Humeur</th>
                    <th className="text-left py-2 px-3 font-medium">
                      Description
                    </th>
                    <th className="text-center py-2 px-3 font-medium">
                      Habitudes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentReflections.map((reflection) => {
                    const globalIndex = sortedReflections.findIndex(
                      (r) => r.date === reflection.date
                    );
                    return (
                      <tr key={globalIndex} className="border-b">
                        <td className="py-3 px-3 text-sm text-muted-foreground">
                          {format(new Date(reflection.date), "dd MMM yyyy", {
                            locale: fr,
                          })}
                        </td>
                        <td className="py-3 px-3 text-2xl">
                          {
                            moods.find((m) => m.label === reflection.mood)
                              ?.emoji
                          }
                        </td>
                        <td className="py-3 px-3">
                          <p className="text-sm">{reflection.thoughts}</p>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex gap-2 items-center justify-center">
                            <div className="text-sm">
                              {reflection.habits.length} / {habits.length}
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0 relative z-20"
                                  onClick={() =>
                                    onOpenHabitsDialog(globalIndex)
                                  }
                                >
                                  <Pencil2Icon className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="z-50">
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

                            {onDeleteReflection && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 relative z-20 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Supprimer cette réflexion ?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Êtes-vous sûr de vouloir supprimer la
                                      réflexion du{" "}
                                      {format(
                                        new Date(reflection.date),
                                        "dd MMMM yyyy",
                                        {
                                          locale: fr,
                                        }
                                      )}
                                      ? Cette action ne peut pas être annulée.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Annuler
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        onDeleteReflection(globalIndex)
                                      }
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Supprimer
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => goToPage(Math.max(1, currentPage - 1))}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      >
                        Précédent
                      </PaginationPrevious>
                    </PaginationItem>

                    {generatePaginationLinks()}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          goToPage(Math.min(totalPages, currentPage + 1))
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      >
                        Suivant
                      </PaginationNext>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
