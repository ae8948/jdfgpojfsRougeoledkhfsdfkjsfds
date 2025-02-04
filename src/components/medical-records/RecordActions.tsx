import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Printer } from "lucide-react";

interface RecordActionsProps {
  onView: () => void;
  onEdit: () => void;
  onPrint: () => void;
  onDelete: () => void;
}

export const RecordActions = ({ onView, onEdit, onPrint, onDelete }: RecordActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onView}
        title="Voir"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
        title="Modifier"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrint}
        title="Imprimer"
      >
        <Printer className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        title="Supprimer"
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};