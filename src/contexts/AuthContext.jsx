import { createContext, useState, useEffect } from "react";
import api from "../services/api";

// Cria o contexto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ao carregar a aplicação, verifica se tem token salvo
    const recoveredToken = localStorage.getItem("token");
    const recoveredUser = localStorage.getItem("user");

    if (recoveredToken && recoveredUser) {
      setUser(JSON.parse(recoveredUser));
      api.defaults.headers.Authorization = `Bearer ${recoveredToken}`;
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        senha: password, // Note que o backend espera "senha", não "password"
      });

      const { token, user: loggedUser } = response.data;

      // Salva no localStorage para persistir após refresh
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(loggedUser));

      // Configura o token nas requisições futuras do Axios
      api.defaults.headers.Authorization = `Bearer ${token}`;

      setUser(loggedUser);
      return { success: true };
    } catch (error) {
      console.error("Erro no login", error);
      return {
        success: false,
        message:
          error.response?.data?.error || "Erro ao conectar com o servidor.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    api.defaults.headers.Authorization = null;
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ authenticated: !!user, user, setUser, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
