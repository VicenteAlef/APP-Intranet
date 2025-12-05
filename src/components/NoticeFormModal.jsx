import { useState } from "react";
import { X, Loader2, Save, Calendar, AlertTriangle } from "lucide-react";
import api from "../services/api";

const NoticeFormModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    mensagem: "",
    tipo: "Geral",
    data_expiracao: "", // Se vazio, backend assume 3 dias
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Remove data vazia para o backend aplicar a lógica de 3 dias
      const dataToSend = { ...formData };
      if (!dataToSend.data_expiracao) delete dataToSend.data_expiracao;

      await api.post("/notices", dataToSend);

      onSuccess(); // Recarrega a lista
      onClose(); // Fecha modal
      setFormData({
        titulo: "",
        mensagem: "",
        tipo: "Geral",
        data_expiracao: "",
      }); // Reseta
    } catch (error) {
      alert("Erro ao criar aviso.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Novo Aviso
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título
            </label>
            <input
              required
              value={formData.titulo}
              onChange={(e) =>
                setFormData({ ...formData, titulo: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-colors"
              placeholder="Ex: Manutenção no Servidor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mensagem
            </label>
            <textarea
              required
              rows={4}
              value={formData.mensagem}
              onChange={(e) =>
                setFormData({ ...formData, mensagem: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-colors resize-none"
              placeholder="Descreva o aviso aqui..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo
              </label>
              <select
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({ ...formData, tipo: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-colors"
              >
                <option value="Geral">Geral (Azul)</option>
                <option value="Importante">Importante (Laranja)</option>
                <option value="Manutencao">Manutenção (Roxo)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expiração
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.data_expiracao}
                  onChange={(e) =>
                    setFormData({ ...formData, data_expiracao: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-colors"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                Vazio = 3 dias automático
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Publicar Aviso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticeFormModal;
