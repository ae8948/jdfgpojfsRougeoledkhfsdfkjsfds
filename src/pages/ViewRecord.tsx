import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowLeft, Printer } from "lucide-react";
import MedicalReport from "@/components/MedicalReport";
import { Json } from "@/integrations/supabase/types";

const ViewRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: record, isLoading } = useQuery({
    queryKey: ['medical-record', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          Chargement...
        </div>
      </DashboardLayout>
    );
  }

  if (!record) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          Dossier non trouvé
        </div>
      </DashboardLayout>
    );
  }

  const transformedRecord = {
    ...record,
    symptoms: record.symptoms as Record<string, boolean>
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 print:space-y-0">
        <div className="flex items-center justify-between no-print">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
        </div>

        <div className="print-form">
          <MedicalReport record={transformedRecord} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewRecord;