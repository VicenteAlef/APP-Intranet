import axios from "axios";

// Cria uma instância do Axios
const api = axios.create({
  // URL da sua API Node.js (ajuste a porta se necessário)
  baseURL: "http://146.235.36.17:3000/api",
});

// Interceptor: Adiciona o Token JWT automaticamente em toda requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Vamos salvar o token aqui no login

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
