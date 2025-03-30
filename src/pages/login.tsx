import { useState } from "react";
import { BrainCircuit } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { AuthError, AuthErrorType } from "@/lib/api";
import { cn } from "@/lib/utils";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    message: string;
    type: "email" | "password" | "generic";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      if (err instanceof AuthError) {
        switch (err.type) {
          case AuthErrorType.INVALID_CREDENTIALS:
            setError({
              message: "Email ou mot de passe incorrect",
              type: "password",
            });
            break;
          case AuthErrorType.USER_NOT_FOUND:
            setError({
              message: "Utilisateur non trouvé",
              type: "email",
            });
            break;
          case AuthErrorType.SERVER_ERROR:
            setError({
              message: "Erreur du serveur, veuillez réessayer plus tard",
              type: "generic",
            });
            break;
          case AuthErrorType.NETWORK_ERROR:
            setError({
              message: "Aucune connexion base de données",
              type: "generic",
            });
            break;
          default:
            setError({
              message: "Échec de la connexion",
              type: "generic",
            });
        }
      } else {
        setError({
          message: "Échec de la connexion",
          type: "generic",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center space-x-2">
          <BrainCircuit className="h-8 w-8" />
          <CardTitle className="text-2xl">App trackers</CardTitle>
        </div>
        <CardDescription className="text-center">
          Connectez-vous à votre compte pour continuer
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error?.type === "generic" && (
          <div className="text-sm text-red-500 mb-4">{error.message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className={cn(
                error?.type === "email" &&
                  "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {error?.type === "email" && (
              <div className="text-sm text-red-500">{error.message}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className={cn(
                error?.type === "password" &&
                  "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {error?.type === "password" && (
              <div className="text-sm text-red-500">{error.message}</div>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Vous n'avez pas de compte ?{" "}
          <Link to="/register" className="text-primary underline">
            S'inscrire
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
