import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DialogsProps {
  isExportDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  exportPassword: string;
  deletePassword: string;
  onExportDialogChange: (open: boolean) => void;
  onDeleteDialogChange: (open: boolean) => void;
  onExportPasswordChange: (value: string) => void;
  onDeletePasswordChange: (value: string) => void;
  onExport: () => void;
  onDelete: () => void;
}

export const Dialogs = ({
  isExportDialogOpen,
  isDeleteDialogOpen,
  exportPassword,
  deletePassword,
  onExportDialogChange,
  onDeleteDialogChange,
  onExportPasswordChange,
  onDeletePasswordChange,
  onExport,
  onDelete,
}: DialogsProps) => {
  const [showExportPassword, setShowExportPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  return (
    <>
      <Dialog open={isExportDialogOpen} onOpenChange={onExportDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation d'export</DialogTitle>
            <DialogDescription>
              Veuillez entrer le mot de passe administrateur pour continuer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Mot de passe administrateur</Label>
              <div className="relative">
                <Input
                  type={showExportPassword ? "text" : "password"}
                  placeholder="Entrez le mot de passe..."
                  value={exportPassword}
                  onChange={(e) => onExportPasswordChange(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowExportPassword(!showExportPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showExportPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onExportDialogChange(false)}>
              Annuler
            </Button>
            <Button onClick={onExport}>Exporter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={onDeleteDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation de suppression</DialogTitle>
            <DialogDescription>
              Veuillez entrer le mot de passe administrateur pour continuer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Mot de passe administrateur</Label>
              <div className="relative">
                <Input
                  type={showDeletePassword ? "text" : "password"}
                  placeholder="Entrez le mot de passe..."
                  value={deletePassword}
                  onChange={(e) => onDeletePasswordChange(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showDeletePassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onDeleteDialogChange(false)}>
              Annuler
            </Button>
            <Button onClick={onDelete} variant="destructive">
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};