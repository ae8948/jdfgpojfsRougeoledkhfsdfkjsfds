import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!username || !password) {
        toast.error("Veuillez remplir tous les champs");
        return;
      }

      if (username === "CHPASSA" && password === "010203CHP@SSa$") {
        localStorage.setItem("isAuthenticated", "true");
        toast.success("Connexion réussie! Redirection...", {
          duration: 2000,
        });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error("Identifiants incorrects", {
          description: "Veuillez vérifier votre nom d'utilisateur et mot de passe",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Erreur de connexion", {
        description: "Une erreur s'est produite. Veuillez réessayer.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-purple-50 overflow-hidden">
      {/* Animated floating background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-[20%] right-[5%] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[35%] w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Card className="relative w-full max-w-md mx-4 p-8 space-y-8 bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
        <div className="space-y-2 text-center">
          <div className="flex justify-center mb-8">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/4667/4667161.png" 
              alt="Logo" 
              className="w-20 h-20 animate-spin-slow"
            />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
            Système de Surveillance de la Rougeole
          </h1>
          <p className="text-sm text-gray-500">
            Connectez-vous pour accéder au système
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Nom d'utilisateur"
                className="h-12 pl-12 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all"
              />
              <svg 
                className="absolute left-4 top-3.5 h-5 w-5 text-purple-400"
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Mot de passe"
                className="h-12 pl-12 pr-12 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-all"
              />
              <svg 
                className="absolute left-4 top-3.5 h-5 w-5 text-purple-400"
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-purple-400 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white font-medium rounded-lg shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-purple-500/50 hover:scale-[1.02]"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Connexion en cours...
              </div>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>
      </Card>

      <footer className="mt-8 text-sm text-gray-500 text-center w-full">
        <p>Developed by Ayoub Erraki</p>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default Login;