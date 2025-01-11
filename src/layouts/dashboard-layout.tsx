import { BrainCircuit } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export function DashboardLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="w-full border-b bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <nav className="flex h-16 items-center justify-between w-full">
            <Link to="/" className="flex items-center space-x-2">
              <BrainCircuit className="h-6 w-6" />
              <span className="text-lg font-semibold">App trackers</span>
            </Link>
            <Button variant="ghost" onClick={logout}>
              Déconnexion
            </Button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
