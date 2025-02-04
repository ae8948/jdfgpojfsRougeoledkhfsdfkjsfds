import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onExportClick: () => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export const SearchBar = ({
  searchQuery,
  onSearchChange,
  onExportClick,
  dateRange = { from: undefined, to: undefined },
  onDateRangeChange,
  statusFilter,
  onStatusFilterChange,
}: SearchBarProps) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <h2 className="text-xl font-semibold">Dossiers Récents</h2>
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher des dossiers..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">Cas suspect</SelectItem>
            <SelectItem value="positive">Positif</SelectItem>
            <SelectItem value="negative">Négatif</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange?.to ? (
                  <>
                    {format(dateRange.from, "P", { locale: fr })} -{" "}
                    {format(dateRange.to, "P", { locale: fr })}
                  </>
                ) : (
                  format(dateRange.from, "P", { locale: fr })
                )
              ) : (
                <span>Sélectionner une période</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={{ 
                from: dateRange?.from, 
                to: dateRange?.to 
              }}
              onSelect={(range: any) => onDateRangeChange(range || { from: undefined, to: undefined })}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Button onClick={onExportClick} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter CSV
        </Button>
      </div>
    </div>
  );
};