import { Card } from "@/components/ui/card";
import { FileText, Database, UserPlus, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAutoLogout } from "@/hooks/use-auto-logout";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  useAutoLogout();

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const { data: records } = useQuery({
    queryKey: ['medical-records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const totalRecords = records?.length || 0;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthRecords = records?.filter(record => {
    const recordDate = new Date(record.created_at);
    return recordDate.getMonth() === currentMonth && 
           recordDate.getFullYear() === currentYear;
  }).length || 0;
  const pendingReview = records?.filter(record => record.result === null || record.result === "").length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <nav className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/4667/4667161.png" 
              alt="Logo" 
              className="h-8 w-8 animate-spin"
              style={{ animationDuration: '3s' }}
            />
            <h1 className="text-2xl font-montserrat font-bold text-primary tracking-tight">
              Système de Surveillance de la Rougeole
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate('/new')}
              className="bg-primary hover:bg-primary/90"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Nouveau Patient
            </Button>
            <Button 
              variant="outline"
              onClick={handleLogout}
              className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 dashboard-stats">
          {/* Total Records Card */}
          <Card className="relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/10 to-transparent"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground/80">Total des enregistrements</h3>
                <Database className="h-6 w-6 text-[#9b87f5] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="text-4xl font-bold text-[#9b87f5]">{totalRecords}</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9b87f5] to-[#9b87f5]/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          </Card>

          {/* This Month Card */}
          <Card className="relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/10 to-transparent"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground/80">Ce mois-ci</h3>
                <FileText className="h-6 w-6 text-[#0EA5E9] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="text-4xl font-bold text-[#0EA5E9]">{thisMonthRecords}</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0EA5E9] to-[#0EA5E9]/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          </Card>

          {/* Pending Review Card */}
          <Card className="relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/10 to-transparent"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground/80">En attente de révision</h3>
                <Database className="h-6 w-6 text-[#F97316] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="text-4xl font-bold text-[#F97316]">{pendingReview}</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F97316] to-[#F97316]/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          </Card>
        </div>
        {children}
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-sm text-muted-foreground bg-background/80 backdrop-blur-sm border-t">
        <div className="container mx-auto">
          <p>Developed by Ayoub Erraki</p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
};

export default DashboardLayout;