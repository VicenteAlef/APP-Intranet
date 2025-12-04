import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { useContext } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";

// Layouts e Páginas
import Login from "./pages/Login";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import MainLayout from "./layouts/MainLayout";

// Componente PrivateRoute (Mantemos igual)
const PrivateRoute = ({ children }) => {
  const { authenticated, loading } = useContext(AuthContext);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando...
      </div>
    );
  if (!authenticated) return <Navigate to="/" />;
  return children;
};

// Páginas Temporárias (para testar a navegação)
const Dashboard = () => (
  <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard Geral</h1>
);
const UsersList = () => (
  <h1 className="text-2xl font-bold text-gray-800">👥 Gestão de Usuários</h1>
);
const ProfilTeste = () => (
  <h1 className="text-2xl font-bold text-gray-800">👤 Meu Perfil</h1>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Rota Pública */}
            <Route path="/" element={<Login />} />

            {/* Rotas Protegidas com Layout */}
            <Route
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Rota 404 - Redireciona para Dashboard se logado, ou Login se não */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
