import DashboardLayout from "@/components/DashboardLayout";
import MedicalRecordForm from "@/components/MedicalRecordForm";

const NewRecord = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">New Medical Record</h2>
        <MedicalRecordForm />
      </div>
    </DashboardLayout>
  );
};

export default NewRecord;