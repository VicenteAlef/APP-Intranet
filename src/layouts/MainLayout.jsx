import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de Navegação Fixa */}
      <Navbar />

      {/* Conteúdo Principal (Ajustado com padding-top para não ficar baixo da Navbar) */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Aqui as páginas filhas serão renderizadas */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
