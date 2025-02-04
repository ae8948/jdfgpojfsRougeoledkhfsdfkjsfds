import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusCellProps {
  result: string | null;
  onStatusClick: (status: string) => void;
}

export const StatusCell = ({ result, onStatusClick }: StatusCellProps) => {
  return (
    <div className="flex items-center gap-2">
      {result ? (
        <Select value={result} onValueChange={onStatusClick}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Cas suspect" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Cas suspect">Cas suspect</SelectItem>
            <SelectItem value="Positif">Positif</SelectItem>
            <SelectItem value="Négatif">Négatif</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Select onValueChange={onStatusClick}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Cas suspect" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Cas suspect">Cas suspect</SelectItem>
            <SelectItem value="Positif">Positif</SelectItem>
            <SelectItem value="Négatif">Négatif</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};