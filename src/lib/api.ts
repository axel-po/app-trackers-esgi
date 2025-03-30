const API_URL = "http://localhost:3000";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface User {
  id?: string;
  email?: string;
  user?: {
    email: string;
    id: string;
  };
}

export enum AuthErrorType {
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
  SERVER_ERROR = "SERVER_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
}

export class AuthError extends Error {
  type: AuthErrorType;

  constructor(message: string, type: AuthErrorType) {
    super(message);
    this.type = type;
    this.name = "AuthError";
  }
}

const defaultOptions = {
  credentials: "include" as RequestCredentials,
  headers: {
    "Content-Type": "application/json",
  },
};

export const api = {
  login: async (data: LoginRequest): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        ...defaultOptions,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new AuthError(
            "Email ou mot de passe incorrect",
            AuthErrorType.INVALID_CREDENTIALS
          );
        } else if (response.status === 404) {
          throw new AuthError(
            "Utilisateur non trouvé",
            AuthErrorType.USER_NOT_FOUND
          );
        } else {
          throw new AuthError("Erreur du serveur", AuthErrorType.SERVER_ERROR);
        }
      }

      return await response.json();
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }

      console.error("Erreur lors de la connexion:", error);
      throw new AuthError(
        "Aucune connexion base de données",
        AuthErrorType.NETWORK_ERROR
      );
    }
  },

  register: async (data: RegisterRequest): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/signin`, {
        method: "POST",
        ...defaultOptions,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new AuthError(
            "Cet email est déjà utilisé",
            AuthErrorType.EMAIL_ALREADY_EXISTS
          );
        } else {
          throw new AuthError("Erreur du serveur", AuthErrorType.SERVER_ERROR);
        }
      }

      return await response.json();
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }

      console.error("Erreur lors de l'inscription:", error);
      throw new AuthError(
        "Aucune connexion base de données",
        AuthErrorType.NETWORK_ERROR
      );
    }
  },
};
