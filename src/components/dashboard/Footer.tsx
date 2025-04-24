import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface FooterProps {
  onResetData: () => void;
  onDeleteAllData: () => void;
}

export function Footer({ onResetData, onDeleteAllData }: FooterProps) {
  return (
    <footer className="border-t pt-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} - MindTrack - Projet ESGI M1 created by
          Axel Pointud, Maël Fantova, Théo Hanse, Eloïck Mickisz
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onResetData}>
            Générer des données d'exemple
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                Supprimer toutes les données
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Supprimer toutes les données ?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut pas être annulée. Cela supprimera
                  définitivement toutes vos réflexions et données associées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={onDeleteAllData}>
                  Continuer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </footer>
  );
}
