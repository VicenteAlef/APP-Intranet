import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import NoticeBoard from "../components/NoticeBoard";
import { Users, User, ExternalLink, ShieldCheck } from "lucide-react";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "Admin" || user?.role === "Suporte";

  // Hora do dia para saudação
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="space-y-8">
      {/* 1. Seção de Boas Vindas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            {greeting}, {user?.nome.split(" ")[0]}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Bem-vindo à Intranet corporativa. Aqui está o resumo de hoje.
          </p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium flex items-center">
          <ShieldCheck className="w-4 h-4 mr-2" />
          Acesso: {user?.role}
        </div>
      </div>

      {/* 2. Ações Rápidas (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Usuários (Só Admin) */}
        {isAdmin && (
          <Link
            to="/users"
            className="group block p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
          >
            <div className="flex justify-between items-start">
              <div className="bg-white/20 p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <ExternalLink className="w-4 h-4 text-white/70 group-hover:text-white" />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-bold text-white">
                Gerenciar Usuários
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                Adicionar, editar e controlar acessos.
              </p>
            </div>
          </Link>
        )}

        {/* Card Perfil */}
        <Link
          to="/profile"
          className="group block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
        >
          <div className="flex justify-between items-start">
            <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-lg">
              <User className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Meu Perfil
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Alterar senha e dados pessoais.
            </p>
          </div>
        </Link>

        {/* Card Placeholder (Futuro Aniversariantes) */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-center">
          <span className="text-2xl mb-2">🎉</span>
          <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400">
            Aniversariantes
          </h3>
          <p className="text-xs text-gray-400 mt-1">Em breve...</p>
        </div>
      </div>

      {/* 3. Galeria de Avisos */}
      <NoticeBoard />
    </div>
  );
};

export default Dashboard;
