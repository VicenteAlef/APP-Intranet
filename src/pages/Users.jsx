import { useState, useEffect } from "react";
import api from "../services/api";
import UserFormModal from "../components/UserFormModal"; // Importamos o Modal
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Lock,
  Unlock,
} from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // --- LEITURA (READ) ---
  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar utilizadores", error);
      alert("Erro ao carregar lista.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- CRIAÇÃO E EDIÇÃO (CREATE / UPDATE) ---
  const handleOpenCreate = () => {
    setEditingUser(null); // Garante que não há utilizador selecionado
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (formData) => {
    try {
      if (editingUser) {
        // ATUALIZAR (PUT)
        // Remove a senha se estiver vazia para não sobrescrever com string vazia
        const dataToSend = { ...formData };
        if (!dataToSend.senha) delete dataToSend.senha;

        await api.put(`/users/${editingUser.id}`, dataToSend);
        alert("Utilizador atualizado com sucesso!");
      } else {
        // CRIAR (POST)
        await api.post("/users", formData);
        alert("Utilizador criado com sucesso!");
      }

      setIsModalOpen(false);
      fetchUsers(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert(error.response?.data?.error || "Erro ao processar a requisição.");
    }
  };

  // --- INATIVAR / ATIVAR (PATCH) ---
  const handleToggleStatus = async (user) => {
    const novoStatus = !user.ativo;
    const acao = novoStatus ? "ativar" : "inativar";

    if (
      !window.confirm(
        `Tem a certeza que deseja ${acao} o utilizador ${user.nome}?`
      )
    )
      return;

    try {
      await api.patch(`/users/${user.id}/status`, { ativo: novoStatus });
      // Atualiza a lista localmente para ser mais rápido (Opcional, mas melhora UX)
      setUsers(
        users.map((u) => (u.id === user.id ? { ...u, ativo: novoStatus } : u))
      );
    } catch (error) {
      alert("Erro ao alterar status.");
    }
  };

  // --- EXCLUSÃO (DELETE) ---
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Tem a certeza que deseja excluir este utilizador permanentemente?"
      )
    )
      return;

    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u.id !== id)); // Remove da lista visualmente
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao excluir utilizador.");
    }
  };

  // Filtro Local
  const filteredUsers = users.filter(
    (user) =>
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.departamento &&
        user.departamento.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Badges (Cores)
  const getRoleBadge = (role) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "Suporte":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusBadge = (ativo) => {
    return ativo
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Gestão de Utilizadores
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gerencie os acessos da plataforma
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" /> Novo Utilizador
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nome, email ou departamento..."
            className="pl-10 w-full sm:w-96 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center text-gray-500 dark:text-gray-400">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Nenhum utilizador encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Utilizador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Departamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`transition-colors ${
                      !user.ativo
                        ? "opacity-60 bg-gray-50 dark:bg-gray-800/50"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                              user.ativo
                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                            }`}
                          >
                            {user.nome.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.nome}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {user.departamento || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                          user.ativo
                        )}`}
                      >
                        {user.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`${
                            user.ativo
                              ? "text-orange-500 hover:text-orange-700"
                              : "text-green-500 hover:text-green-700"
                          } transition-colors`}
                          title={user.ativo ? "Inativar" : "Ativar"}
                        >
                          {user.ativo ? (
                            <Lock className="w-5 h-5" />
                          ) : (
                            <Unlock className="w-5 h-5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Criação/Edição */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        userToEdit={editingUser}
      />
    </div>
  );
};

export default Users;
