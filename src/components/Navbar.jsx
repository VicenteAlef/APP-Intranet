import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Users,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";

// --- COMPONENTE AUXILIAR (Definido FORA do Navbar) ---
const ThemeToggleBtn = ({ className }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${className}`}
      aria-label="Alternar Tema"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
};

// --- COMPONENTE PRINCIPAL ---
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  // Não precisamos mais do theme/toggleTheme aqui dentro, pois o botão auxiliar já cuida disso
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const canManageUsers = user?.role === "Admin" || user?.role === "Suporte";

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md fixed w-full z-50 top-0 left-0 border-b dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* LADO ESQUERDO */}
          <div className="flex">
            <div
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              <div className="bg-blue-600 p-2 rounded-lg mr-2">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <span className="font-bold text-xl text-gray-800 dark:text-white">
                MinhaEmpresa
              </span>
            </div>

            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/dashboard"
                className="text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>

              {canManageUsers && (
                <Link
                  to="/users"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium transition-colors"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Usuários
                </Link>
              )}
            </div>
          </div>

          {/* LADO DIREITO (Desktop) */}
          <div className="hidden md:ml-6 md:flex md:items-center space-x-4">
            {/* Botão de Tema Desktop */}
            <ThemeToggleBtn />

            <div className="ml-3 relative">
              <div>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="max-w-xs bg-white dark:bg-gray-800 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 p-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-200 font-bold mr-2">
                    {user?.nome?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 font-medium mr-1">
                    {user?.nome?.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {isProfileMenuOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none"
                  onMouseLeave={() => setIsProfileMenuOpen(false)}
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" /> Meu Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Sair
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* BOTÃO MOBILE (Hamburger) */}
          <div className="-mr-2 flex items-center md:hidden space-x-2">
            {/* Botão de Tema Mobile */}
            <ThemeToggleBtn />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="bg-blue-50 dark:bg-gray-700 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300 block pl-3 pr-4 py-2 text-base font-medium flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Dashboard
            </Link>

            {canManageUsers && (
              <Link
                to="/users"
                className="border-l-4 border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 block pl-3 pr-4 py-2 text-base font-medium flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="w-5 h-5 mr-3" />
                Usuários
              </Link>
            )}
          </div>

          <div className="pt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-lg">
                  {user?.nome?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800 dark:text-white">
                  {user?.nome}
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {user?.email}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                to="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-5 h-5 mr-3" /> Meu Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <LogOut className="w-5 h-5 mr-3" /> Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
