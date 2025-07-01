"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function Profile01() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Supprimer le token
    toast({
      title: "Déconnexion réussie !",
      type: "success"
    });
    router.push("/Connexion"); // Rediriger vers la page de connexion
  };

  return (
    <div className="flex items-center justify-center p-2">
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 w-full p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <LogOut className="h-4 w-4" />
        <span>Déconnexion</span>
      </button>
    </div>
  );
}