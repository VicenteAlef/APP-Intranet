import { useState, useEffect } from "react";
import { X, Loader2, Save } from "lucide-react";

const UserFormModal = ({ isOpen, onClose, onSave, userToEdit }) => {
  // Estado inicial do formulário
  const initialFormState = {
    nome: "",
    email: "",
    senha: "",
    departamento: "",
    role: "Usuario Comum",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  // Efeito: Quando o modal abre ou o utilizador a editar muda, atualiza o formulário
  useEffect(() => {
    if (userToEdit) {
      // Modo Edição: Preenche com os dados do utilizador
      setFormData({
        ...userToEdit,
        senha: "", // A senha vem vazia por segurança (só preenche se quiser alterar)
      });
    } else {
      // Modo Criação: Reseta o formulário
      setFormData(initialFormState);
    }
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Envia os dados para o componente pai processar
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {userToEdit ? "Editar Utilizador" : "Novo Utilizador"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome Completo
            </label>
            <input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors dark:text-white"
              placeholder="Ex: João Silva"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Corporativo
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors dark:text-white"
              placeholder="joao@empresa.com"
            />
          </div>

          {/* Departamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Departamento
            </label>
            <input
              name="departamento"
              value={formData.departamento}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors dark:text-white"
              placeholder="Ex: TI / RH"
            />
          </div>

          {/* Role (Nível de Acesso) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nível de Acesso
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors dark:text-white"
            >
              <option value="Usuario Comum">Utilizador Comum</option>
              <option value="Suporte">Suporte</option>
              <option value="Admin">Administrador</option>
            </select>
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {userToEdit
                ? "Nova Senha (deixe em branco para manter)"
                : "Senha Inicial"}
            </label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              // Obrigatório apenas na criação
              required={!userToEdit}
              minLength={6}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors dark:text-white"
              placeholder="******"
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {userToEdit ? "Atualizar" : "Criar Utilizador"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
