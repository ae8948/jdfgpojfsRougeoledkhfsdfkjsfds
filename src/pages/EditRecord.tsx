import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import MedicalRecordForm from "@/components/MedicalRecordForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const EditRecord = () => {
  const { id } = useParams();

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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Modifier le Dossier Médical</h2>
        <MedicalRecordForm initialData={record} mode="edit" />
      </div>
    </DashboardLayout>
  );
};

export default EditRecord;