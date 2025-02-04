import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RecordActions } from "./RecordActions";
import { StatusCell } from "./StatusCell";

interface Record {
  id: string;
  code: string;
  name: string;
  investigation_date: string;
  result: string | null;
}

interface RecordsTableProps {
  records: Record[];
  isLoading: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onPrint: (record: Record) => void;
  onDelete: (id: string) => void;
  onStatusClick: (record: Record, status: string) => void;
}

export const RecordsTable = ({
  records,
  isLoading,
  onView,
  onEdit,
  onPrint,
  onDelete,
  onStatusClick,
}: RecordsTableProps) => {
  return (
    <div className="relative">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10 border-b">
          <TableRow>
            <TableHead className="w-[200px]">Code Provincial</TableHead>
            <TableHead className="w-[250px]">Nom du Patient</TableHead>
            <TableHead className="w-[150px]">Date</TableHead>
            <TableHead className="w-[150px]">Statut</TableHead>
            <TableHead className="w-[200px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Chargement...
              </TableCell>
            </TableRow>
          ) : records && records.length > 0 ? (
            records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.code}</TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>
                  {new Date(record.investigation_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <StatusCell
                    result={record.result}
                    onStatusClick={(status) => onStatusClick(record, status)}
                  />
                </TableCell>
                <TableCell>
                  <RecordActions
                    onView={() => onView(record.id)}
                    onEdit={() => onEdit(record.id)}
                    onPrint={() => onPrint(record)}
                    onDelete={() => onDelete(record.id)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Aucun dossier trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};