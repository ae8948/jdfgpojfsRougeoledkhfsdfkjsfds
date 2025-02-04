import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { RecordsList } from "@/components/medical-records/RecordsList";
import { DashboardCharts } from "@/components/medical-records/DashboardCharts";
import { RecordManagement } from "@/components/medical-records/RecordManagement";
import { toast } from "sonner";
import { startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { getSecret } from "@/utils/secretUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [editPassword, setEditPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  const { data: records, isLoading } = useQuery({
    queryKey: ['medical-records', search, statusFilter, dateRange],
    queryFn: async () => {
      let query = supabase
        .from('medical_records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (search) {
        query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.filter((record) => {
        const matchesStatus = statusFilter === 'all' || 
          (statusFilter === 'pending' && (!record.result || record.result === 'Cas suspect')) ||
          (statusFilter === 'positive' && record.result === 'Positif') ||
          (statusFilter === 'negative' && record.result === 'Négatif');

        const recordDate = new Date(record.investigation_date);
        const matchesDate = !dateRange.from || !dateRange.to || 
          isWithinInterval(recordDate, {
            start: startOfDay(dateRange.from),
            end: endOfDay(dateRange.to)
          });

        return matchesStatus && matchesDate;
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('medical_records')
        .update({ result: status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-records'] });
      toast.success("Statut mis à jour avec succès");
    },
    onError: (error) => {
      console.error('Error updating status:', error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  });

  const handleView = (id: string) => navigate(`/record/${id}`);
  
  const handleEdit = async (id: string) => {
    setSelectedRecord({ id });
    setEditDialogOpen(true);
  };

  const handleEditConfirm = async () => {
    try {
      const correctPassword = await getSecret('ADMIN_EDIT_PASSWORD');
      if (editPassword !== correctPassword) {
        toast.error("Mot de passe incorrect");
        return;
      }
      setEditDialogOpen(false);
      setEditPassword("");
      navigate(`/edit/${selectedRecord.id}`);
    } catch (error) {
      console.error('Error checking password:', error);
      toast.error("Erreur lors de la vérification du mot de passe");
    }
  };

  const handlePrint = (record: any) => {
    navigate(`/record/${record.id}`);
    setTimeout(() => window.print(), 500);
  };

  const handleDelete = (id: string) => {
    setSelectedRecord({ id });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedRecord) {
      try {
        const correctPassword = await getSecret('ADMIN_DELETE_PASSWORD');
        if (deletePassword !== correctPassword) {
          toast.error("Mot de passe incorrect");
          return;
        }

        const { error } = await supabase
          .from('medical_records')
          .delete()
          .eq('id', selectedRecord.id);

        if (error) throw error;

        setDeleteDialogOpen(false);
        setDeletePassword("");
        setSelectedRecord(null);
        queryClient.invalidateQueries({ queryKey: ['medical-records'] });
        toast.success("Dossier supprimé avec succès");
      } catch (error) {
        console.error('Error during deletion:', error);
        toast.error("Erreur lors de la suppression du dossier");
      }
    }
  };

  const handleStatusUpdate = async (record: any, newStatus: string) => {
    updateStatusMutation.mutate({ id: record.id, status: newStatus });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <RecordsList
          records={records || []}
          isLoading={isLoading}
          searchQuery={search}
          onSearchChange={setSearch}
          onExportClick={() => setExportDialogOpen(true)}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onView={handleView}
          onEdit={handleEdit}
          onPrint={handlePrint}
          onDelete={handleDelete}
          onStatusClick={handleStatusUpdate}
        />

        {records && (
          <div className="mt-8">
            <DashboardCharts records={records} />
          </div>
        )}

        <RecordManagement
          records={records || []}
          isExportDialogOpen={exportDialogOpen}
          isDeleteDialogOpen={deleteDialogOpen}
          setExportDialogOpen={setExportDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          onDeleteConfirm={handleDeleteConfirm}
        />

        {/* Edit Password Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmation de modification</DialogTitle>
              <DialogDescription>
                Veuillez entrer le mot de passe administrateur pour continuer
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="relative">
                <Input
                  type={showEditPassword ? "text" : "password"}
                  placeholder="Entrez le mot de passe..."
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowEditPassword(!showEditPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showEditPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setEditDialogOpen(false);
                setEditPassword("");
              }}>
                Annuler
              </Button>
              <Button onClick={handleEditConfirm}>Continuer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Password Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmation de suppression</DialogTitle>
              <DialogDescription>
                Veuillez entrer le mot de passe administrateur pour continuer
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="relative">
                <Input
                  type={showDeletePassword ? "text" : "password"}
                  placeholder="Entrez le mot de passe..."
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
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
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setDeleteDialogOpen(false);
                setDeletePassword("");
              }}>
                Annuler
              </Button>
              <Button onClick={handleDeleteConfirm} variant="destructive">
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Index;
