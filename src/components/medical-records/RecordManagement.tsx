import { useState } from "react";
import { toast } from "sonner";
import { Dialogs } from "@/components/medical-records/Dialogs";
import { getSecret } from "@/utils/secretUtils";

interface Record {
  id: string;
  code: string;
  name: string;
  birthdate: string;
  gender: string;
  address: string;
  phone: string;
  symptoms: any;
  medical_notes: string;
  investigation_date: string;
  investigator: string;
  location: string;
  result: string;
  specimen_type: string;
  collection_date: string;
  lab_reception_date: string;
  created_at: string;
}

interface RecordManagementProps {
  records: Record[];
  isExportDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  setExportDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  onDeleteConfirm: () => void;
}

export const RecordManagement = ({
  records,
  isExportDialogOpen,
  isDeleteDialogOpen,
  setExportDialogOpen,
  setDeleteDialogOpen,
  onDeleteConfirm,
}: RecordManagementProps) => {
  const [exportPassword, setExportPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  const handleExport = async () => {
    try {
      const correctPassword = await getSecret('ADMIN_EXPORT_PASSWORD');
      if (exportPassword !== correctPassword) {
        toast.error("Mot de passe incorrect");
        return;
      }

      if (!records || records.length === 0) {
        toast.error("Aucune donnée à exporter");
        return;
      }

      const headers = [
        "Code",
        "Nom",
        "Date de naissance",
        "Sexe",
        "Adresse",
        "Téléphone",
        "Symptômes",
        "Notes médicales",
        "Date d'investigation",
        "Investigateur",
        "Lieu",
        "Résultat",
        "Type de spécimen",
        "Date de collecte",
        "Date de réception au laboratoire",
        "Date de création"
      ];

      const csvContent = [
        headers.join(","),
        ...records.map(record => [
          record.code || "",
          record.name || "",
          record.birthdate || "",
          record.gender || "",
          record.address || "",
          record.phone || "",
          JSON.stringify(record.symptoms || {}).replace(/,/g, ";"),
          (record.medical_notes || "").replace(/,/g, ";"),
          record.investigation_date || "",
          record.investigator || "",
          record.location || "",
          record.result || "",
          record.specimen_type || "",
          record.collection_date || "",
          record.lab_reception_date || "",
          record.created_at || ""
        ].map(field => `"${field}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `medical_records_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportDialogOpen(false);
      setExportPassword("");
      toast.success("Export réussi");
    } catch (error) {
      console.error('Error during export:', error);
      toast.error("Une erreur est survenue lors de l'export");
    }
  };

  return (
    <Dialogs
      isExportDialogOpen={isExportDialogOpen}
      isDeleteDialogOpen={isDeleteDialogOpen}
      exportPassword={exportPassword}
      deletePassword={deletePassword}
      onExportDialogChange={setExportDialogOpen}
      onDeleteDialogChange={setDeleteDialogOpen}
      onExportPasswordChange={setExportPassword}
      onDeletePasswordChange={setDeletePassword}
      onExport={handleExport}
      onDelete={onDeleteConfirm}
    />
  );
};