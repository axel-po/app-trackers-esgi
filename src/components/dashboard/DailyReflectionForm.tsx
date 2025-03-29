import { FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { habits, moods } from "@/lib/constants";

interface DailyReflectionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMood: string | null;
  setSelectedMood: (mood: string | null) => void;
  thoughts: string;
  setThoughts: (thoughts: string) => void;
  selectedHabits: string[];
  onHabitToggle: (habitId: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function DailyReflectionForm({
  open,
  onOpenChange,
  selectedMood,
  setSelectedMood,
  thoughts,
  setThoughts,
  selectedHabits,
  onHabitToggle,
  onSubmit,
}: DailyReflectionFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle réflexion quotidienne</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Comment vous sentez-vous aujourd'hui ?</Label>
            <div className="flex gap-4">
              <TooltipProvider>
                {moods.map(({ emoji, label }) => (
                  <Tooltip key={label}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={selectedMood === label ? "default" : "outline"}
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
                    onCheckedChange={() => onHabitToggle(id)}
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
      </DialogContent>
    </Dialog>
  );
}
