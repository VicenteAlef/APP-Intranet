import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { useContext } from "react";
import Login from "./pages/Login";

// Componente para proteger rotas privadas
const PrivateRoute = ({ children }) => {
  const { authenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center p-10">Carregando...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

// Dashboard temporário só para testar o login
const DashboardTemp = () => {
  const { logout, user } = useContext(AuthContext);
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Bem-vindo, {user?.nome}!</h1>
      <p className="mb-4">Você está logado como: {user?.role}</p>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Sair
      </button>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardTemp />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
