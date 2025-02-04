import { ScrollArea } from "@/components/ui/scroll-area";
import { RecordsTable } from "./RecordsTable";
import { SearchBar } from "./SearchBar";

interface Record {
  id: string;
  code: string;
  name: string;
  investigation_date: string;
  result: string | null;
}

interface RecordsListProps {
  records: Record[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onExportClick: () => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onPrint: (record: Record) => void;
  onDelete: (id: string) => void;
  onStatusClick: (record: Record, status: string) => void;
}

export const RecordsList = ({
  records,
  isLoading,
  searchQuery,
  onSearchChange,
  onExportClick,
  dateRange = { from: undefined, to: undefined },
  onDateRangeChange,
  statusFilter,
  onStatusFilterChange,
  onView,
  onEdit,
  onPrint,
  onDelete,
  onStatusClick,
}: RecordsListProps) => {
  return (
    <div className="space-y-4">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onExportClick={onExportClick}
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
      />
      
      <ScrollArea className="h-[400px] rounded-md border">
        <RecordsTable
          records={records}
          isLoading={isLoading}
          onView={onView}
          onEdit={onEdit}
          onPrint={onPrint}
          onDelete={onDelete}
          onStatusClick={onStatusClick}
        />
      </ScrollArea>
    </div>
  );
};