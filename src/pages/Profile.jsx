import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";
import {
  User,
  Mail,
  Briefcase,
  Shield,
  Lock,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext); // Precisamos do setUser para atualizar a Navbar

  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Carrega os dados iniciais do contexto
  useEffect(() => {
    if (user) {
      setNome(user.nome);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validação de Senha
    if (senha && senha !== confirmSenha) {
      setMessage({ type: "error", text: "As senhas não coincidem." });
      return;
    }

    if (senha && senha.length < 6) {
      setMessage({
        type: "error",
        text: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    setLoading(true);

    try {
      // Envia apenas o que foi alterado
      const payload = { nome };
      if (senha) payload.senha = senha;

      const response = await api.patch("/users/profile", payload);

      // Atualiza o contexto global com o novo nome (para refletir na Navbar)
      // Mantemos o token e outras infos, só atualizamos o nome
      const updatedUser = { ...user, nome: response.data.user.nome };

      // Atualiza no State do React e no LocalStorage
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage({ type: "success", text: "Perfil atualizado com sucesso!" });

      // Limpa os campos de senha
      setSenha("");
      setConfirmSenha("");
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Erro ao atualizar perfil. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper para cor da Role
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "Suporte":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Meu Perfil
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* COLUNA 1: Cartão de Identidade (Apenas Leitura) */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="inline-block h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-300">
                {user?.nome?.charAt(0).toUpperCase()}
              </span>
            </div>

            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
              {user?.nome}
            </h2>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                user?.role
              )}`}
            >
              {user?.role}
            </span>

            <div className="mt-6 space-y-3 text-left">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Mail className="w-4 h-4 mr-3" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Briefcase className="w-4 h-4 mr-3" />
                <span>{user?.departamento || "Sem Departamento"}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Shield className="w-4 h-4 mr-3" />
                <span>Acesso {user?.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA 2: Formulário de Edição */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" /> Editar Informações
            </h3>

            {message.text && (
              <div
                className={`mb-4 p-3 rounded-md flex items-center text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800"
                    : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="w-4 h-4 mr-2" />
                ) : (
                  <AlertCircle className="w-4 h-4 mr-2" />
                )}
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors dark:text-white"
                />
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 my-4 pt-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Lock className="w-4 h-4 mr-2" /> Alterar Senha
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="Deixe em branco para manter"
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      value={confirmSenha}
                      onChange={(e) => setConfirmSenha(e.target.value)}
                      placeholder="Repita a nova senha"
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
