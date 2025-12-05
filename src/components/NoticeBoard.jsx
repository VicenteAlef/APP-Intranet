import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";
import { Plus, Trash2, Calendar, Clock, Megaphone } from "lucide-react";
import NoticeFormModal from "./NoticeFormModal";

const NoticeBoard = () => {
  const { user } = useContext(AuthContext);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canManage = user?.role === "Admin" || user?.role === "Suporte";

  const fetchNotices = async () => {
    try {
      const response = await api.get("/notices");
      setNotices(response.data);
    } catch (error) {
      console.error("Erro ao carregar avisos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Remover este aviso?")) return;
    try {
      await api.delete(`/notices/${id}`);
      setNotices((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      alert("Erro ao remover aviso.");
    }
  };

  // Cores baseadas no Tipo
  const getTypeStyles = (tipo) => {
    switch (tipo) {
      case "Importante":
        return "border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20";
      case "Manutencao":
        return "border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20";
      default:
        return "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20"; // Geral
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
          <Megaphone className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          Mural de Avisos
        </h2>
        {canManage && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 px-3 py-1.5 rounded-md flex items-center transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" /> Adicionar
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Carregando mural...
        </div>
      ) : notices.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-gray-500">
          Nenhum aviso ativo no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`relative p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md ${getTypeStyles(
                notice.tipo
              )}`}
            >
              {canManage && (
                <button
                  onClick={() => handleDelete(notice.id)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remover aviso"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <div className="mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">
                  {notice.tipo}
                </span>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white leading-tight mt-1">
                  {notice.titulo}
                </h3>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                {notice.mensagem}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center" title="Postado por">
                  {/* Avatar mini */}
                  <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2 font-bold text-[9px]">
                    {notice.autor?.nome?.charAt(0)}
                  </div>
                  {notice.autor?.nome.split(" ")[0]}
                </div>

                <div className="flex items-center" title="Expira em">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(notice.data_expiracao).toLocaleDateString("pt-BR")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <NoticeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchNotices}
      />
    </div>
  );
};

export default NoticeBoard;
